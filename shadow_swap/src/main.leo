import armin_token_v0r1.leo;
import armout_token_v0r1.leo;

program shadow_swap_v0r1.aleo {    
    mapping reserves_shadow: u8 => u64;
    // Only holds total supply since mapping is the only option
    mapping supply_shadow: u8 => u64;
    // LP token balances
    mapping lp_tokens_shadow: field => u64;

    // For when the total supply of LP tokens are 0
    transition mint_lp_init_shadow(receiver: address, token0: armin_token_v0r1.leo/ArminToken, amount0: u64, token1: armout_token_v0r1.leo/ArmoutToken, amount1: u64) -> (armin_token_v0r1.leo/ArminToken, armout_token_v0r1.leo/ArmoutToken) {
        let remaining0: ArminToken = armin_token_v0r1.leo/transfer_armin_to_program(token0, amount0);
        let remaining1: ArmoutToken = armout_token_v0r1.leo/transfer_armout_to_program(token1, amount1);

        let initial_lp: u64 = square_root(amount0 * amount1) - 1000u64;

        return (remaining0, remaining1) then finalize(BHP256::hash_to_field(receiver), amount0, amount1, initial_lp);
    }
    finalize mint_lp_init_shadow(receiver: field, token0: u64, token1: u64, initial_lp: u64) {
        let total_supply: u64 = Mapping::get_or_use(supply_shadow, 0u8, 0u64);

        assert_eq(total_supply, 0u64);

        Mapping::set(reserves_shadow, 0u8, token0);
        Mapping::set(reserves_shadow, 1u8, token1);

        Mapping::set(supply_shadow, 0u8, initial_lp);

        Mapping::set(lp_tokens_shadow, receiver, initial_lp);
    }

    transition mint_lp_shadow(receiver: address, token0: armin_token_v0r1.leo/ArminToken, amount0: u64, token1: armout_token_v0r1.leo/ArmoutToken, amount1: u64) -> (armin_token_v0r1.leo/ArminToken, armout_token_v0r1.leo/ArmoutToken) {
        let remaining0: ArminToken = armin_token_v0r1.leo/transfer_armin_to_program(token0, amount0);
        let remaining1: ArmoutToken = armout_token_v0r1.leo/transfer_armout_to_program(token1, amount1);

        return (remaining0, remaining1) then finalize(BHP256::hash_to_field(receiver), amount0, amount1);
    }
    finalize mint_lp_shadow(receiver: field, token0: u64, token1: u64) {
        let total_supply: u64 = Mapping::get(supply_shadow, 0u8);

        assert_neq(total_supply, 0u64);

        let reserve0: u64 = Mapping::get(reserves_shadow, 0u8);
        let reserve1: u64 = Mapping::get(reserves_shadow, 1u8);
        
        let lp0: u64 = (token0 * total_supply) / reserve0;
        let lp1: u64 = (token1 * total_supply) / reserve1;

        let lp: u64 = math_min(lp0, lp1);

        Mapping::set(reserves_shadow, 0u8, reserve0 + token0);
        Mapping::set(reserves_shadow, 1u8, reserve1 + token1);

        Mapping::set(supply_shadow, 0u8, total_supply + lp);

        let lp_last: u64 = Mapping::get_or_use(lp_tokens_shadow, receiver, 0u64);
        Mapping::set(lp_tokens_shadow, receiver, lp_last + lp);
    }
    
    inline math_min(n1: u64, n2: u64) -> u64 {
        return n1 < n2 ? n1 : n2;
    }

    function square_root(x: u64) -> u64 {
        let z: u64 = (x + 1u64) / 2u64;
        let y: u64 = x;

        for i: u8 in 0u8..42u8 {
            if(z >= y) {
                return y;
            }

            y = z;
            z = (x / z + z) / 2u64;
        }

        return 0u64;
    }

    transition burn_lp_shadow(receiver: address, amount0: u64, amount1: u64) -> (armin_token_v0r1.leo/ArminToken, armout_token_v0r1.leo/ArmoutToken) {
        assert_neq(amount0, 0u64);
        assert_neq(amount1, 0u64);

        let token0: ArminToken = armin_token_v0r1.leo/transfer_armin_from_program(receiver, amount0);
        let token1: ArmoutToken = armout_token_v0r1.leo/transfer_armout_from_program(receiver, amount1);

        return then finalize(BHP256::hash_to_field(receiver), amount0, amount1);
    }
    finalize burn_lp_shadow(receiver: field, amount0: u64, amount1: u64) {
        let total_supply: u64 = Mapping::get(supply_shadow, 0u8);
        assert_neq(total_supply, 0u64);

        let lp: u64 = Mapping::get(lp_tokens_shadow, receiver);
        assert_neq(lp, 0u64);

        let reserve0: u64 = Mapping::get(reserves_shadow, 0u8);
        let reserve1: u64 = Mapping::get(reserves_shadow, 1u8);

        assert(amount0 <= (lp * reserve0) / total_supply);
        assert(amount1 <= (lp * reserve1) / total_supply);

        Mapping::set(reserves_shadow, 0u8, reserve0 - amount0);
        Mapping::set(reserves_shadow, 1u8, reserve1 - amount1);

        Mapping::set(supply_shadow, 0u8, total_supply - lp);

        Mapping::remove(lp_tokens_shadow, receiver);
    }

    transition swap_to_0_shadow(receiver: address, token1In: armout_token_v0r1.leo/ArmoutToken, amount1In: u64, amount0Out: u64) -> (armin_token_v0r1.leo/ArminToken, armout_token_v0r1.leo/ArmoutToken) {
        assert_neq(amount0Out, 0u64);
        assert_neq(amount1In, 0u64);
        
        let token0: ArminToken = armin_token_v0r1.leo/transfer_armin_from_program(receiver, amount0Out);
        let token1: ArmoutToken = armout_token_v0r1.leo/transfer_armout_to_program(token1In, amount1In);

        return (token0, token1) then finalize(amount1In, amount0Out);
    }
    finalize swap_to_0_shadow(amount1In: u64, amount0Out: u64) {
        let reserve0: u64 = Mapping::get(reserves_shadow, 0u8);
        let reserve1: u64 = Mapping::get(reserves_shadow, 1u8);

        let new_reserve0: u64 = reserve0 - amount0Out;
        let new_reserve1: u64 = reserve1 + amount1In;

        assert(new_reserve0 * new_reserve1 >= reserve0 * reserve1);

        Mapping::set(reserves_shadow, 0u8, new_reserve0);
        Mapping::set(reserves_shadow, 1u8, new_reserve1);
    }

    transition swap_to_1_shadow(receiver: address, token0In: armin_token_v0r1.leo/ArminToken, amount0In: u64, amount1Out: u64) -> (armin_token_v0r1.leo/ArminToken, armout_token_v0r1.leo/ArmoutToken) {
        assert_neq(amount0In, 0u64);
        assert_neq(amount1Out, 0u64);
        
        let token0: ArminToken = armin_token_v0r1.leo/transfer_armin_to_program(token0In, amount0In);
        let token1: ArmoutToken = armout_token_v0r1.leo/transfer_armout_from_program(receiver, amount1Out);

        return (token0, token1) then finalize(amount0In, amount1Out);
    }
    finalize swap_to_1_shadow(amount0In: u64, amount1Out: u64) {
        let reserve0: u64 = Mapping::get(reserves_shadow, 0u8);
        let reserve1: u64 = Mapping::get(reserves_shadow, 1u8);

        let new_reserve0: u64 = reserve0 + amount0In;
        let new_reserve1: u64 = reserve1 - amount1Out;

        assert(new_reserve0 * new_reserve1 >= reserve0 * reserve1);

        Mapping::set(reserves_shadow, 0u8, new_reserve0);
        Mapping::set(reserves_shadow, 1u8, new_reserve1);
    }
}
