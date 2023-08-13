import { Button } from "antd";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import {
    WalletAdapterNetwork,
    WalletNotConnectedError,
    Transaction,
} from "@demox-labs/aleo-wallet-adapter-base";
import { useState } from "react";
import { LiquidiyTab } from "./Liquidity";
import app from "../app.json";
export const Remove = ({ setLiquidityTabState }: any) => {
    const getTokenAmounts = async () => {
        return [1000, 1000];
    };

    const { wallet, publicKey, requestTransaction } = useWallet();
    const [_, setTransactionId] = useState<string>();
    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (wallet == null || !publicKey || requestTransaction == null) {
            throw new WalletNotConnectedError();
        }
        let inputsArray: any[] = [];
        function tryParseJSON(input: string) {
            try {
                return JSON.parse(input);
            } catch (error) {
                return input;
            }
        }

        const [armInTokenAmount, armOutTokenAmount] = await getTokenAmounts();

        inputsArray = [
            publicKey,
            armInTokenAmount + "u64",
            armOutTokenAmount + "u64",
        ];

        const parsedInputs = inputsArray.map((input) => tryParseJSON(input));

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.Testnet,
            app.shadow_swap.id,
            app.shadow_swap.burn_function,
            parsedInputs,
            app.shadow_swap.burn_fee
        );
        console.log(parsedInputs);
        console.log(aleoTransaction);

        const txId = await requestTransaction(aleoTransaction);

        setTransactionId(txId);
    };
    return (
        <div>
            <Button
                onClick={(event) => {
                    event.preventDefault();
                    setLiquidityTabState(LiquidiyTab.UserState);
                }}
            >
                Back
            </Button>
            <div>
                <Button onClick={handleSubmit}>Remove</Button>
            </div>
        </div>
    );
};
