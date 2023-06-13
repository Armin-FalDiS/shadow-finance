import armin_token.leo;
import armout_token.leo;

program shadow_swap.aleo {    
    mapping reserves_shadow: u8 => u64;
    // Only holds total supply since mapping is the only option
    mapping supply_shadow: u8 => u64;
    // LP token balances
    mapping lp_tokens_shadow: address => u64;

    transition mint_lp_shadow(token0: armin_token.leo/ArminToken, amount0: u64, token1: armout_token.leo/ArmoutToken, amount1: u64) -> (armin_token.leo/ArminToken, armout_token.leo/ArmoutToken) {
        let remaining0: ArminToken = armin_token.leo/transfer_armin_to_program(token0, amount0);
        let remaining1: ArmoutToken = armout_token.leo/transfer_armout_to_program(token1, amount1);

        return (remaining0, remaining1) then finalize(amount0, amount1);
    }
    finalize mint_lp_shadow(token0: u64, token1: u64) {
        let total_supply: u64 = Mapping::get_or_init(supply_shadow, 0u8, 0u64);

        let reserve0: u64 = Mapping::get_or_init(reserves_shadow, 0u8, 0u64);
        let reserve1: u64 = Mapping::get_or_init(reserves_shadow, 1u8, 0u64);
        
        let liquidity: u64 = 0u64;
        if(total_supply == 0u64) {
            liquidity = token0 * token1;
            //liquidity = liquidity.square_root();
            liquidity = liquidity - 1000u64;
        } else {
            let lp0: u64 = (token0 * total_supply) / reserve0;
            let lp1: u64 = (token1 * total_supply) / reserve1;

            liquidity = math_min(lp0, lp1);
        }

        Mapping::set(reserves_shadow, 0u8, reserve0 + token0);
        Mapping::set(reserves_shadow, 1u8, reserve1 + token1);

        Mapping::set(supply_shadow, 0u8, total_supply + liquidity);

        let liquidity_last: u64 = Mapping::get_or_init(lp_tokens_shadow, self.caller, 0u64);
        Mapping::set(lp_tokens_shadow, self.caller, liquidity_last + liquidity);
    }
    
    inline math_min(n1: u64, n2: u64) -> u64 {
        return n1 < n2 ? n1 : n2;
    }

    transition burn_lp_shadow(receiver: address, amount0: u64, amount1: u64) -> (armin_token.leo/ArminToken, armout_token.leo/ArmoutToken) {
        let token0: ArminToken = armin_token.leo/transfer_armin_from_program(receiver, amount0);
        let token1: ArmoutToken = armout_token.leo/transfer_armout_from_program(receiver, amount1);

        return then finalize(receiver, amount0, amount1);
    }
    finalize burn_lp_shadow(receiver: address, amount0: u64, amount1: u64) {
        assert_neq(amount0, 0u64);
        assert_neq(amount1, 0u64);

        let total_supply: u64 = Mapping::get_or_init(supply_shadow, 0u8, 0u64);
        assert_neq(total_supply, 0u64);

        let lp: u64 = Mapping::get_or_init(lp_tokens_shadow, receiver, 0u64);
        assert_neq(lp, 0u64);

        let reserve0: u64 = Mapping::get_or_init(reserves_shadow, 0u8, 0u64);
        assert_neq(reserve0, 0u64);

        let reserve1: u64 = Mapping::get_or_init(reserves_shadow, 1u8, 0u64);
        assert_neq(reserve1, 0u64);

        // Improve gas usage by separating repeated calculation
        let lp2total: u64 = (lp * lp) / total_supply;

        // Calculate lp tokens based on amounts given
        let lp0: u64 = (reserve0 / amount0) * lp2total;
        let lp1: u64 = (reserve1 / amount1) * lp2total;

        // Equality of the calculated values means they are equal to lp
        assert_eq(lp0, lp1);

        Mapping::set(reserves_shadow, 0u8, reserve0 - amount0);
        Mapping::set(reserves_shadow, 1u8, reserve1 - amount1);

        Mapping::set(supply_shadow, 0u8, total_supply - lp);

        Mapping::set(lp_tokens_shadow, receiver, 0u64);
    }

    transition swap_to_0_shadow(receiver: address, token1In: armout_token.leo/ArmoutToken, amount1In: u64, amount0Out: u64) -> (armin_token.leo/ArminToken, armout_token.leo/ArmoutToken) {
        assert_neq(amount0Out, 0u64);
        assert_neq(amount1In, 0u64);
        
        let token0: ArminToken = armin_token.leo/transfer_armin_from_program(receiver, amount0Out);
        let token1: ArmoutToken = armout_token.leo/transfer_armout_to_program(token1In, amount1In);

        return (token0, token1) then finalize(amount1In, amount0Out);
    }
    finalize swap_to_0_shadow(amount1In: u64, amount0Out: u64) {
        let reserve0: u64 = Mapping::get_or_init(reserves_shadow, 0u8, 0u64);
        let reserve1: u64 = Mapping::get_or_init(reserves_shadow, 1u8, 0u64);

        let new_reserve0: u64 = reserve0 - amount0Out;
        let new_reserve1: u64 = reserve1 + amount1In;

        assert(new_reserve0 * new_reserve1 >= reserve0 * reserve1);

        Mapping::set(reserves_shadow, 0u8, new_reserve0);
        Mapping::set(reserves_shadow, 1u8, new_reserve1);
    }

    transition swap_to_1_shadow(receiver: address, token0In: armin_token.leo/ArminToken, amount0In: u64, amount1Out: u64) -> (armin_token.leo/ArminToken, armout_token.leo/ArmoutToken) {
        assert_neq(amount0In, 0u64);
        assert_neq(amount1Out, 0u64);
        
        let token0: ArminToken = armin_token.leo/transfer_armin_to_program(token0In, amount0In);
        let token1: ArmoutToken = armout_token.leo/transfer_armout_from_program(receiver, amount1Out);

        return (token0, token1) then finalize(amount0In, amount1Out);
    }
    finalize swap_to_1_shadow(amount0In: u64, amount1Out: u64) {
        let reserve0: u64 = Mapping::get_or_init(reserves_shadow, 0u8, 0u64);
        let reserve1: u64 = Mapping::get_or_init(reserves_shadow, 1u8, 0u64);

        let new_reserve0: u64 = reserve0 + amount0In;
        let new_reserve1: u64 = reserve1 - amount1Out;

        assert(new_reserve0 * new_reserve1 >= reserve0 * reserve1);

        Mapping::set(reserves_shadow, 0u8, new_reserve0);
        Mapping::set(reserves_shadow, 1u8, new_reserve1);
    }
}
