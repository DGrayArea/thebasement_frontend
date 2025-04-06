use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("YourProgramIDHere");

#[program]
pub mod meteora_staking {
    use super::*;

    // Initialize the pool with admin settings
    pub fn initialize_pool(ctx: Context<InitializePool>) -> Result<()> {
        ctx.accounts.pool.admin = *ctx.accounts.admin.key;
        ctx.accounts.pool.is_active = true;
        ctx.accounts.pool.total_shares = 0;
        ctx.accounts.pool.total_value = 0;
        ctx.accounts.pool.last_compound_time = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount_sol: u64, amount_usdc: u64) -> Result<()> {
        // Check if pool is active
        require!(ctx.accounts.pool.is_active, StakingError::PoolPaused);

        // Check for minimum deposit amounts
        require!(amount_sol > 0 || amount_usdc > 0, StakingError::InvalidAmount);
        
        // Calculate fees (1% per token)
        let deposit_fee_sol = amount_sol.checked_div(100).unwrap_or(0);
        let deposit_fee_usdc = amount_usdc.checked_div(100).unwrap_or(0);
        
        // Calculate amounts after fee
        let amount_after_fee_sol = amount_sol.checked_sub(deposit_fee_sol).ok_or(StakingError::ArithmeticError)?;
        let amount_after_fee_usdc = amount_usdc.checked_sub(deposit_fee_usdc).ok_or(StakingError::ArithmeticError)?;

        // Calculate user share
        let total_value_before = ctx.accounts.pool.total_value;
        let user_share = if total_value_before == 0 {
            amount_after_fee_sol.checked_add(amount_after_fee_usdc).ok_or(StakingError::ArithmeticError)?
        } else {
            ((amount_after_fee_sol as u128).checked_add(amount_after_fee_usdc as u128)
                .and_then(|sum| sum.checked_mul(ctx.accounts.pool.total_shares as u128))
                .and_then(|product| product.checked_div(total_value_before as u128))
                .map(|result| result as u64)
                .ok_or(StakingError::ArithmeticError)?
        };

        // Update state (reentrancy protection by updating state before external calls)
        ctx.accounts.pool.total_shares = ctx.accounts.pool.total_shares.checked_add(user_share).ok_or(StakingError::ArithmeticError)?;
        ctx.accounts.user_stake.shares = ctx.accounts.user_stake.shares.checked_add(user_share).ok_or(StakingError::ArithmeticError)?;
        ctx.accounts.user_stake.last_deposit_time = Clock::get()?.unix_timestamp;
        
        // Transfer tokens (SOL)
        if amount_after_fee_sol > 0 {
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.user_sol_account.to_account_info(),
                        to: ctx.accounts.pool_sol_vault.to_account_info(),
                        authority: ctx.accounts.user.to_account_info(),
                    },
                ),
                amount_after_fee_sol,
            )?;
        }

        // Transfer tokens (USDC)
        if amount_after_fee_usdc > 0 {
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.user_usdc_account.to_account_info(),
                        to: ctx.accounts.pool_usdc_vault.to_account_info(),
                        authority: ctx.accounts.user.to_account_info(),
                    },
                ),
                amount_after_fee_usdc,
            )?;
        }
        
        Ok(())
    }

    pub fn auto_compound(ctx: Context<AutoCompound>) -> Result<()> {
        // Only admin or scheduled calls can trigger compounding
        require!(
            ctx.accounts.pool.admin == *ctx.accounts.caller.key 
            || Clock::get()?.unix_timestamp - ctx.accounts.pool.last_compound_time >= 86400, // 24 hours
            StakingError::Unauthorized
        );

        let reward_sol = ctx.accounts.pool_sol_vault.amount.checked_sub(ctx.accounts.pool.total_value / 2).unwrap_or(0);
        let reward_usdc = ctx.accounts.pool_usdc_vault.amount.checked_sub(ctx.accounts.pool.total_value / 2).unwrap_or(0);
        
        if reward_sol > 0 && reward_usdc > 0 {
            // Take 10% protocol fee
            let protocol_fee_sol = reward_sol.checked_div(10).unwrap_or(0);
            let protocol_fee_usdc = reward_usdc.checked_div(10).unwrap_or(0);
            
            let reinvest_sol = reward_sol.checked_sub(protocol_fee_sol).ok_or(StakingError::ArithmeticError)?;
            let reinvest_usdc = reward_usdc.checked_sub(protocol_fee_usdc).ok_or(StakingError::ArithmeticError)?;
            
            // Update total value with reinvested amount (90% of rewards)
            ctx.accounts.pool.total_value = ctx.accounts.pool.total_value
                .checked_add(reinvest_sol)
                .and_then(|v| v.checked_add(reinvest_usdc))
                .ok_or(StakingError::ArithmeticError)?;
        }
        
        ctx.accounts.pool.last_compound_time = Clock::get()?.unix_timestamp;
        Ok(())
    }
    
    pub fn withdraw(ctx: Context<Withdraw>, shares: u64) -> Result<()> {
        require!(shares > 0, StakingError::InvalidAmount);
        require!(shares <= ctx.accounts.user_stake.shares, StakingError::InsufficientShares);
        
        // Check if emergency mode is active
        let is_emergency_withdrawal = !ctx.accounts.pool.is_active;
        
        // Rate limiting: cooldown period check (24 hours)
        if !is_emergency_withdrawal {
            let current_time = Clock::get()?.unix_timestamp;
            let last_deposit_time = ctx.accounts.user_stake.last_deposit_time;
            require!(
                current_time - last_deposit_time >= 86400,
                StakingError::WithdrawalTooSoon
            );
        }

        // Calculate withdrawal amounts
        let share_ratio = (shares as u128)
            .checked_mul(1_000_000)
            .and_then(|v| v.checked_div(ctx.accounts.pool.total_shares as u128))
            .ok_or(StakingError::ArithmeticError)?;
            
        let sol_withdraw = (ctx.accounts.pool_sol_vault.amount as u128)
            .checked_mul(share_ratio)
            .and_then(|v| v.checked_div(1_000_000))
            .map(|v| v as u64)
            .ok_or(StakingError::ArithmeticError)?;
            
        let usdc_withdraw = (ctx.accounts.pool_usdc_vault.amount as u128)
            .checked_mul(share_ratio)
            .and_then(|v| v.checked_div(1_000_000))
            .map(|v| v as u64)
            .ok_or(StakingError::ArithmeticError)?;

        // In emergency mode, only allow withdrawal of original stake (no rewards)
        let (sol_withdraw, usdc_withdraw) = if is_emergency_withdrawal {
            let original_ratio = (shares as u128)
                .checked_mul(1_000_000)
                .and_then(|v| v.checked_div(ctx.accounts.user_stake.original_shares as u128))
                .ok_or(StakingError::ArithmeticError)?;
                
            let original_sol = (ctx.accounts.user_stake.original_sol as u128)
                .checked_mul(original_ratio)
                .and_then(|v| v.checked_div(1_000_000))
                .map(|v| v as u64)
                .ok_or(StakingError::ArithmeticError)?;
                
            let original_usdc = (ctx.accounts.user_stake.original_usdc as u128)
                .checked_mul(original_ratio)
                .and_then(|v| v.checked_div(1_000_000))
                .map(|v| v as u64)
                .ok_or(StakingError::ArithmeticError)?;
                
            (original_sol.min(sol_withdraw), original_usdc.min(usdc_withdraw))
        } else {
            (sol_withdraw, usdc_withdraw)
        };

        // Apply withdrawal fees (1% per token) unless in emergency mode
        let (sol_after_fee, usdc_after_fee) = if is_emergency_withdrawal {
            (sol_withdraw, usdc_withdraw)
        } else {
            let withdrawal_fee_sol = sol_withdraw.checked_div(100).unwrap_or(0);
            let withdrawal_fee_usdc = usdc_withdraw.checked_div(100).unwrap_or(0);
            (
                sol_withdraw.checked_sub(withdrawal_fee_sol).ok_or(StakingError::ArithmeticError)?,
                usdc_withdraw.checked_sub(withdrawal_fee_usdc).ok_or(StakingError::ArithmeticError)?
            )
        };

        // Update state before external calls (reentrancy protection)
        ctx.accounts.pool.total_shares = ctx.accounts.pool.total_shares.checked_sub(shares).ok_or(StakingError::ArithmeticError)?;
        ctx.accounts.user_stake.shares = ctx.accounts.user_stake.shares.checked_sub(shares).ok_or(StakingError::ArithmeticError)?;

        // Transfer tokens (SOL)
        if sol_after_fee > 0 {
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.pool_sol_vault.to_account_info(),
                        to: ctx.accounts.user_sol_account.to_account_info(),
                        authority: ctx.accounts.pool_authority.to_account_info(),
                    },
                ),
                sol_after_fee,
            )?;
        }

        // Transfer tokens (USDC)
        if usdc_after_fee > 0 {
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.pool_usdc_vault.to_account_info(),
                        to: ctx.accounts.user_usdc_account.to_account_info(),
                        authority: ctx.accounts.pool_authority.to_account_info(),
                    },
                ),
                usdc_after_fee,
            )?;
        }
        
        Ok(())
    }

    // Admin function to toggle emergency mode
    pub fn set_emergency_mode(ctx: Context<AdminAction>, is_active: bool) -> Result<()> {
        ctx.accounts.pool.is_active = !is_active; // Inactive means emergency mode
        Ok(())
    }
}

#[error_code]
pub enum StakingError {
    #[msg("Pool is paused")]
    PoolPaused,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Arithmetic error")]
    ArithmeticError,
    #[msg("Insufficient shares")]
    InsufficientShares,
    #[msg("Withdrawal too soon after deposit")]
    WithdrawalTooSoon,
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(init, payer = admin, space = 8 + Pool::MAX_SIZE)]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_sol_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_usdc_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_sol_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_usdc_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    #[account(mut, has_one = user)]
    pub user_stake: Account<'info, UserStake>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_sol_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_usdc_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_sol_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_usdc_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    #[account(mut, has_one = user)]
    pub user_stake: Account<'info, UserStake>,
    #[account(has_one = pool)]
    pub pool_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AutoCompound<'info> {
    #[account(mut)]
    pub pool_sol_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_usdc_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    pub caller: Signer<'info>,
}

#[derive(Accounts)]
pub struct AdminAction<'info> {
    #[account(mut, has_one = admin)]
    pub pool: Account<'info, Pool>,
    pub admin: Signer<'info>,
}

#[account]
pub struct Pool {
    pub admin: Pubkey,
    pub is_active: bool, // false means emergency mode
    pub total_shares: u64,
    pub total_value: u64,
    pub last_compound_time: i64,
}

impl Pool {
    pub const MAX_SIZE: usize = 32 + 1 + 8 + 8 + 8;
}

#[account]
pub struct UserStake {
    pub user: Pubkey,
    pub shares: u64,
    pub original_shares: u64, // For emergency withdrawals
    pub original_sol: u64,   // Original SOL deposit amount
    pub original_usdc: u64,  // Original USDC deposit amount
    pub last_deposit_time: i64,
}

impl UserStake {
    pub const MAX_SIZE: usize = 32 + 8 + 8 + 8 + 8 + 8;
}