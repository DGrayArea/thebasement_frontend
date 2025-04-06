use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

// Define the program
declare_id!("YourProgramIDHere");

#[program]
pub mod meteora_staking {
    use super::*;

    // Deposit: Splits funds and stakes them in Meteora vaults
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let deposit_fee = (amount * 5) / 1000; // 0.5% fee
        let amount_after_fee = amount - deposit_fee;

        let amounts = [
            (amount_after_fee * 80) / 100, // 80% to 20-bin vault
            (amount_after_fee * 10) / 100, // 10% to 4-bin vault
            (amount_after_fee * 10) / 100, // 10% to 1-bin vault
        ];

        for i in 0..3 {
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    token::Transfer {
                        from: ctx.accounts.user_token_account.to_account_info(),
                        to: ctx.accounts.program_vaults[i].to_account_info(),
                        authority: ctx.accounts.user.to_account_info(),
                    },
                ),
                amounts[i],
            )?;
        }

        // TODO: Stake in Meteora vaults (needs IDL)
        msg!("Deposited {} SOL, split into 80/10/10", amount);
        Ok(())
    }

    // Withdraw: Unstakes and withdraws funds proportionally
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let withdrawal_fee = (amount * 5) / 1000; // 0.5% fee
        let amount_after_fee = amount - withdrawal_fee;

        let amounts = [
            (amount_after_fee * 80) / 100, // 80% from 20-bin vault
            (amount_after_fee * 10) / 100, // 10% from 4-bin vault
            (amount_after_fee * 10) / 100, // 10% from 1-bin vault
        ];

        // TODO: Unstake from Meteora vaults
        
        for i in 0..3 {
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    token::Transfer {
                        from: ctx.accounts.program_vaults[i].to_account_info(),
                        to: ctx.accounts.user_token_account.to_account_info(),
                        authority: ctx.accounts.program_authority.to_account_info(),
                    },
                ),
                amounts[i],
            )?;
        }

        msg!("Withdrawn {} SOL, split proportionally", amount);
        Ok(())
    }

    // Auto-compound: Restakes rewards past threshold
    pub fn auto_compound(ctx: Context<AutoCompound>) -> Result<()> {
        let reward_threshold = 1_000_000; // 1 SOL in lamports

        for i in 0..3 {
            let reward_amount = ctx.accounts.program_vaults[i].amount;
            if reward_amount >= reward_threshold {
                let compound_fee = (reward_amount * 5) / 100; // 5% fee
                let amount_to_stake = reward_amount - compound_fee;

                // TODO: Re-stake rewards in Meteora vaults

                msg!("Auto-compounded {} SOL from bin {}", amount_to_stake, i);
            }
        }
        Ok(())
    }
}

// ======================== CONTEXTS ========================

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub program_vaults: [Account<'info, TokenAccount>; 3],
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub program_vaults: [Account<'info, TokenAccount>; 3],
    pub program_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AutoCompound<'info> {
    #[account(mut)]
    pub program_vaults: [Account<'info, TokenAccount>; 3],
    pub program_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}
