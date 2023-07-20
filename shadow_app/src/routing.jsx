import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App.jsx";
import { Account } from "./sections/state/Account";
import { Fee } from "./sections/state/Fee";
import { Tokens } from "./sections/state/Tokens";
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
                element: <Navigate to="/account" replace={false} />,
            },
            {
                path: "/account",
                element: (
                    <>
                        <Account />
                        <br />
                        <Fee />
                        <br />
                        <Tokens />
                    </>
                ),
            },
            {
                path: "/faucet",
                element: (
                    <>
                        <ArmInToken />
                        <br />
                        
                    </>
                ),
            },
            {
                path: "/liquidity",
                element: (
                    <>
                        <InitPool />
                        <br />
                        <ProvideLiquidity />
                        <br />
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
