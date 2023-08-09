
import { Button } from "antd"
import { LiquidiyTab } from "./Liquidity"
export const EmptyLP = ({ liquidityTabState, setLiquidityTabState }: any) => {
    return (<div> <Button onClick={(event) => {
        event.preventDefault()
        setLiquidityTabState(LiquidiyTab.Supply)


    }}
    >Supply </Button> </div>)
}
