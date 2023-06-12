import armin_token.leo;
import armout_token.leo;

program shadow_swap.aleo {
    mapping reserves_shadow: u8 => u64;
    mapping supply_shadow: u8 => u64;
    mapping liquidity_shadow: address => u64;

    transition mint_lp_shadow(token0: armin_token.leo/ArminToken, token1: armout_token.leo/ArmoutToken) {
        return then finalize(token0.amount, token1.amount);
    }
    finalize mint_lp_shadow(token0: u64, token1: u64) {
        let total_supply: u64 = Mapping::get_or_init(supply_shadow, 0u8, 0u64);

        let reserve0: u64 = Mapping::get_or_init(reserves_shadow, 0u8, 0u64);
        let reserve1: u64 = Mapping::get_or_init(reserves_shadow, 1u8, 0u64);
        
        let liquidity: u64 = 0u64;
        if(total_supply == 0u64) {
            liquidity = token0 * token1;
            // liquidity = liquidity.square_root();
            liquidity = liquidity - 1000u64;
        } else {
            let lp0: u64 = (token0 * total_supply) / reserve0;
            let lp1: u64 = (token1 * total_supply) / reserve1;

            liquidity = math_min(lp0, lp1);
        }

        Mapping::set(reserves_shadow, 0u8, reserve0 + token0);
        Mapping::set(reserves_shadow, 1u8, reserve1 + token1);

        Mapping::set(supply_shadow, 0u8, total_supply + liquidity);

        let current_lp: u64 = Mapping::get_or_init(liquidity_shadow, self.caller, 0u64);
        Mapping::set(liquidity_shadow, self.caller, current_lp + liquidity);
    }
    
    inline math_min(n1: u64, n2: u64) -> u64 {
        return n1 < n2 ? n1 : n2;
    }
}
