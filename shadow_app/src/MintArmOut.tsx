import { useState, useEffect } from "react";
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

export const MintArmOut = () => {
    const { wallet, publicKey, transactionStatus, requestTransaction } =
        useWallet();

    const [programId] = useState(app.armout_token.id);
    const [functionName] = useState(app.armout_token.mint_function);
    const [fee] = useState(app.armout_token.mint_fee);
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
        event.preventDefault();

        if (wallet == null || !publicKey || requestTransaction == null) {
            throw new WalletNotConnectedError();
        }

        const inputsArray = [publicKey, "100000u64"];
        console.log(inputsArray);
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
                ArmOut Token
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
