import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App.jsx";
import { ArmInToken } from "./sections/faucet/ArmInToken.jsx";
import { ArmOutToken } from "./sections/faucet/ArmOutToken.jsx";
import { InitPool } from "./sections/liquidity/InitPool.jsx";
import { ProvideLiquidity } from "./sections/liquidity/ProvideLiquidity.jsx";
import { BurnLiquidity } from "./sections/liquidity/BurnLiquidity.jsx";
import { Swap } from "./sections/swap/Swap.jsx";

export const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                path: "/",
                element: <Navigate to="/faucet" replace={false} />,
            },
            {
                path: "/faucet",
                element: (
                    <>
                        <ArmInToken />
                        <ArmOutToken />
                    </>
                ),
            },
            {
                path: "/liquidity",
                element: (
                    <>
                        <InitPool />
                        <ProvideLiquidity />
                        <BurnLiquidity />
                    </>
                ),
            },
            {
                path: "/swap",
                element: (
                    <>
                        <Swap />
                    </>
                ),
            },
        ],
    },
]);
