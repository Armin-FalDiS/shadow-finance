program armout_token.aleo {
    mapping supply_armout: u8 => u64;
    mapping programs_armout: field => u64;

    record ArmoutToken {
        owner: address,
        amount: u64,
    }

    transition mint_armout(owner: address, amount: u64) -> ArmoutToken {
        assert(amount <= 100000u64);

        return ArmoutToken {
            owner,
            amount,
        } then finalize(amount);
    }
    finalize mint_armout(amount: u64) {
        let total_supply_armout: u64 = Mapping::get_or_use(supply_armout, 0u8, 0u64);
        let current_supply_armout: u64 = total_supply_armout + amount;

        assert(current_supply_armout <= 100000000000u64);

        Mapping::set(supply_armout, 0u8, current_supply_armout);
    }

    transition transfer_armout(token: ArmoutToken, receiver: address, amount: u64) -> (ArmoutToken, ArmoutToken) {
        let difference: u64 = token.amount - amount;

        let remaining: ArmoutToken = ArmoutToken {
            owner: token.owner,
            amount: difference,
        };

        let transferred: ArmoutToken = ArmoutToken {
            owner: receiver,
            amount,
        };

        return (remaining, transferred);
    }

    transition transfer_armout_to_program(token: ArmoutToken, amount: u64) -> ArmoutToken {
        let difference: u64 = token.amount - amount;

        let remaining: ArmoutToken = ArmoutToken {
            owner: token.owner,
            amount: difference,
        };
        
        return remaining then finalize(amount);
    }
    finalize transfer_armout_to_program(amount: u64) {
        // Hard-coded 0u8 is to be replaced by self.parent proposed by ARC-0030 
        let program_id: field = BHP256::hash_to_field(0u8);

        let program_balance: u64 = Mapping::get_or_use(programs_armout, program_id, 0u64);
        Mapping::set(programs_armout, program_id, program_balance + amount);
    }

    transition transfer_armout_from_program(receiver: address, amount: u64) -> ArmoutToken {
        let deposit: ArmoutToken = ArmoutToken {
            owner: receiver,
            amount,
        };

        return deposit then finalize(amount);
    }
    finalize transfer_armout_from_program(amount: u64) {
        // Hard-coded 0u8 is to be replaced by self.parent proposed by ARC-0030 
        let program_id: field = BHP256::hash_to_field(0u8);

        let program_balance: u64 = Mapping::get_or_use(programs_armout, program_id, 0u64);
        Mapping::set(programs_armout, program_id, program_balance - amount);
    }
}