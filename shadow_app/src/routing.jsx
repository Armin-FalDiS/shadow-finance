import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App.jsx";
import { Faucet } from './tabs/shadow/Faucet.jsx';
import { InitPool } from './tabs/shadow/InitPool.jsx';
import { ProvideLiquidity } from './tabs/shadow/ProvideLiquidity.jsx';
import { Swap } from './tabs/shadow/Swap.jsx';

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
                        <Faucet />
                    </>
                ),
            },
            {
                path: "/init-pool",
                element: (
                    <>
                        <InitPool />
                    </>
                ),
            },
            {
                path: "/liquidity",
                element: (
                    <>
                        <ProvideLiquidity />
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
