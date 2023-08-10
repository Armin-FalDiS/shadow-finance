import { Button } from "antd"
import { LiquidiyTab } from "./Liquidity"
export const UserState = ({ setLiquidityTabState }: any) => {
    return <div>User state is here <Button onClick={(event) => {
        event.preventDefault()
        setLiquidityTabState(LiquidiyTab.Supply)


    }}
    >Add more</Button>
     <Button onClick={(event) => {
        event.preventDefault()
        setLiquidityTabState(LiquidiyTab.Burn)


    }}
    >Remove </Button></div>


}