import React, { useState, useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

import { Button } from "antd";
import { SketchOutlined } from "@ant-design/icons";
import {
    Transaction,
    WalletAdapterNetwork,
    WalletNotConnectedError,
} from "@demox-labs/aleo-wallet-adapter-base";
import app from "./app.json";

function tryParseJSON(input: string) {
    try {
        return JSON.parse(input);
    } catch (error) {
        return input;
    }
}

export const Init = () => {
    const {
        wallet,
        publicKey,
        requestTransaction,
        transactionStatus,
        requestRecords,
    } = useWallet();

    const [programId] = useState(app.shadow_swap.id);
    const [functionName] = useState(app.shadow_swap.init_function);

    const [fee] = useState(app.shadow_swap.init_fee);
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
    const getIndexOfHighestRecord = (records: any[]) => {
        const amounts = records.map((record) => {
            return parseInt(
                record.data.amount.substr(0, record.data.amount.length - 11)
            );
        });
        return amounts.indexOf(Math.max.apply(Math, amounts));
    };
    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        if (!wallet || !publicKey || !requestTransaction) {
            throw new WalletNotConnectedError();
        }
        const programs = ["armin_token.aleo", "armout_token.aleo"];
        event.preventDefault();
        if (requestRecords) {
            const armInRecords = await requestRecords(programs[0]);
            const armOutRecords = await requestRecords(programs[1]);
            const arminSpendableIndex = getIndexOfHighestRecord(armInRecords);
            const armOutSpendableIndex = getIndexOfHighestRecord(armOutRecords);
            const inputsArray = [
                publicKey,
                armInRecords[arminSpendableIndex],
                "1000u64",
                armOutRecords[armOutSpendableIndex],
                "2000u64",
            ];

            const parsedInputs = inputsArray.map((input) =>
                tryParseJSON(input)
            );
            console.log(parsedInputs);
            const aleoTransaction = Transaction.createTransaction(
                publicKey,
                WalletAdapterNetwork.Testnet,
                programId,
                functionName,
                parsedInputs,
                fee
            );
            console.log(aleoTransaction);
            const txId = await requestTransaction(aleoTransaction);
            setTransactionId(txId);
        }
    };

    const getTransactionStatus = async (txId: string) => {
        if (!transactionStatus) {
            throw new WalletNotConnectedError();
        }

        setStatus(await transactionStatus(txId));
    };

    return (
        <div>
            <div>
                <Button
                    icon={<SketchOutlined />}
                    type="primary"
                    shape="round"
                    size="large"
                    disabled={
                        !publicKey ||
                        !programId ||
                        !functionName ||
                        fee === undefined
                    }
                    onClick={handleSubmit}
                >
                    {!publicKey ? "Connect Your Wallet" : "Init pool"}
                </Button>

                {transactionId && (
                    <div>
                        <div>{`Transaction status: ${status}`}</div>
                    </div>
                )}
            </div>
        </div>
    );
};
