import { Button, Col, Row, Table } from "antd";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import {
    WalletAdapterNetwork,
    WalletNotConnectedError,
    Transaction,
} from "@demox-labs/aleo-wallet-adapter-base";
import { useEffect, useState } from "react";
import { getLPTokenTotalSupply } from "../general";

import app from "../app.json";
import {
    getArmInReserve,
    getArmOutReserve,
    getLPTokenBalance,
} from "../general";
const { Column } = Table;

export const LPTable = () => {
    const { wallet, publicKey, requestTransaction } = useWallet();
    const [LPBalance, setLPBalance] = useState<number>(0);

    const [LPShare, setLPShare] = useState<number>(0);

    const fetchTokenAmounts = async () => {
        if (publicKey) {
            const LPBalance = await getLPTokenBalance(publicKey);
            setLPBalance(LPBalance);
            const totalLPSupply = await getLPTokenTotalSupply();
            const lpShare = LPBalance / totalLPSupply;
            setLPShare(lpShare);
        }
    };

    useEffect(() => {
        fetchTokenAmounts();
    }, []);

    const getTokenAmounts = async () => {
        const armInReserve = await getArmInReserve();
        const armOutReserve = await getArmOutReserve();
        const armInShare = Math.floor(LPShare / armInReserve);
        const armOutShare = Math.floor(LPShare / armOutReserve);
        return [armInShare, armOutShare];
    };

    const handleRemove = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (wallet == null || !publicKey || requestTransaction == null) {
            throw new WalletNotConnectedError();
        }
        let inputsArray: any[] = [];

        const tryParseJSON = (input: string) => {
            try {
                return JSON.parse(input);
            } catch (error) {
                return input;
            }
        };

        const [armInTokenAmount, armOutTokenAmount] = await getTokenAmounts();

        inputsArray = [
            publicKey,
            armInTokenAmount + "u64",
            armOutTokenAmount + "u64",
        ];

        const parsedInputs = inputsArray.map((input) => tryParseJSON(input));
        console.log(parsedInputs);

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.Testnet,
            app.shadow_swap.id,
            app.shadow_swap.burn_function,
            parsedInputs,
            app.shadow_swap.burn_fee
        );
      await requestTransaction(aleoTransaction);


    };

    const data = [
        {
            key: "0",
            pairName: "ArmIn / ArmOut",
            stats: (
                <>
                    <label>LP: {LPBalance + " " || "?? "}</label>
                    <label>
                        Pool Share:
                        {(LPShare ? (LPShare * 100).toFixed(2) : "??") + "%"}
                    </label>
                </>
            ),
            removeButton: (
                <Button
                    style={{ width: "100%" }}
                    onClick={async (event) => {
                        event.preventDefault();
                        await handleRemove(event);
                    }}
                >
                    Remove
                </Button>
            ),
        },
    ];

    return (
        <Row>
            <Col span={24}>
                <Table showHeader={false} pagination={false} dataSource={data}>
                    <Column
                        title="Pair Name"
                        dataIndex="pairName"
                        key="pairName"
                        colSpan={8}
                    />
                    <Column
                        title="Stats"
                        dataIndex="stats"
                        key="stats"
                        colSpan={8}
                    />
                    <Column
                        title="Removal"
                        dataIndex="removeButton"
                        key="removeButton"
                        colSpan={8}
                    />
                </Table>
            </Col>
        </Row>
    );
};
