import { Button } from "antd";
import { LiquidiyTab } from "./Liquidity";
export const EmptyLP = ({ setLiquidityTabState }: any) => {
    return (
        <div>
            <Button
                onClick={(event) => {
                    event.preventDefault();
                    setLiquidityTabState(LiquidiyTab.Supply);
                }}
            >
                Add Liquidity
            </Button>
        </div>
    );
};
 