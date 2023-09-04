import React, { useState, useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Button, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
    Transaction,
    WalletAdapterNetwork,
    WalletNotConnectedError,
} from "@demox-labs/aleo-wallet-adapter-base";
import app from "../app.json";

function tryParseJSON(input: string) {
    try {
        return JSON.parse(input);
    } catch (error) {
        return input;
    }
}

export const MintArmIn = () => {
    const { wallet, publicKey, requestTransaction, transactionStatus } =
        useWallet();

    const [programId] = useState(app.armin_token.id);
    const [functionName] = useState(app.armin_token.mint_function);

    const [fee] = useState(app.armin_token.mint_fee);
    const [transactionId, setTransactionId] = useState<string>();
    const [status, setStatus] = useState<string>();

    useEffect(() => {
        let intervalId: any;

        if (transactionId != undefined) {
            intervalId = setInterval(() => {
                transactionId && getTransactionStatus(transactionId);
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [transactionId]);

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        if (wallet == null || !publicKey || requestTransaction == null) {
            throw new WalletNotConnectedError();
        }

        event.preventDefault();

        const inputsArray = [publicKey, "100000u64"];
        const parsedInputs = inputsArray.map((input) => tryParseJSON(input));

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.Testnet,
            programId,
            functionName,
            parsedInputs,
            fee
        );

        const txId = await requestTransaction(aleoTransaction);

        setTransactionId(txId);
    };

    const getTransactionStatus = async (txId: string) => {
        if (transactionStatus == null) {
            throw new WalletNotConnectedError();
        }

        setStatus(await transactionStatus(txId));
    };

    return (
        <Form className="mint-box" disabled={!publicKey}>
            <Button
                icon={<PlusCircleOutlined />}
                type="link"
                shape="round"
                size="large"
                onClick={handleSubmit}
                style={{ color: "white" }}
            >
                ArmIn Token
            </Button>

            {transactionId && (
                <div>
                    <div style={{ color: "white" }}>{`Transaction status: ${
                        status ?? "Error"
                    }`}</div>
                </div>
            )}
        </Form>
    );
};
