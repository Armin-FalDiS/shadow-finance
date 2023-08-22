program armin_token_v0r1.aleo {
    mapping supply_armin: u8 => u64;
    mapping programs_armin: field => u64;

    record ArminToken {
        owner: address,
        amount: u64,
    }

    transition mint_armin(owner: address, amount: u64) -> ArminToken {
        assert(amount <= 100000u64);

        return ArminToken {
            owner,
            amount,
        } then finalize(amount);
    }
    finalize mint_armin(amount: u64) {
        let total_supply_armin: u64 = Mapping::get_or_use(supply_armin, 0u8, 0u64);
        let current_supply_armin: u64 = total_supply_armin + amount;

        assert(current_supply_armin <= 100000000000u64);

        Mapping::set(supply_armin, 0u8, current_supply_armin);
    }

    transition transfer_armin(token: ArminToken, receiver: address, amount: u64) -> (ArminToken, ArminToken) {
        let difference: u64 = token.amount - amount;

        let remaining: ArminToken = ArminToken {
            owner: token.owner,
            amount: difference,
        };

        let transferred: ArminToken = ArminToken {
            owner: receiver,
            amount,
        };

        return (remaining, transferred);
    }

    transition transfer_armin_to_program(token: ArminToken, amount: u64) -> ArminToken {
        let difference: u64 = token.amount - amount;

        let remaining: ArminToken = ArminToken {
            owner: token.owner,
            amount: difference,
        };
        
        return remaining then finalize(amount);
    }
    finalize transfer_armin_to_program(amount: u64) {
        // Hard-coded 0u8 is to be replaced by self.parent proposed by ARC-0030 
        let program_id: field = BHP256::hash_to_field(0u8);

        let program_balance: u64 = Mapping::get_or_use(programs_armin, program_id, 0u64);
        Mapping::set(programs_armin, program_id, program_balance + amount);
    }

    transition transfer_armin_from_program(receiver: address, amount: u64) -> ArminToken {
        let deposit: ArminToken = ArminToken {
            owner: receiver,
            amount,
        };

        return deposit then finalize(amount);
    }
    finalize transfer_armin_from_program(amount: u64) {
        // Hard-coded 0u8 is to be replaced by self.parent proposed by ARC-0030 
        let program_id: field = BHP256::hash_to_field(0u8);

        let program_balance: u64 = Mapping::get_or_use(programs_armin, program_id, 0u64);
        Mapping::set(programs_armin, program_id, program_balance - amount);
    }
}