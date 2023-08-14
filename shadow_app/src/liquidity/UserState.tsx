import { Button, Col, List, Row, Skeleton } from "antd";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import {
    WalletAdapterNetwork,
    WalletNotConnectedError,
    Transaction,
} from "@demox-labs/aleo-wallet-adapter-base";
import { useState } from "react";

import app from "../app.json";
import { LiquidiyTab } from "./Liquidity";
export const UserState = ({ setLiquidityTabState }: any) => {
    const getTokenAmounts = async () => {
        return [1000, 1000];
    };
    const data = [
        {
            title: 'ArmInToken/ArmOutToken',
        }
    ];

    const { wallet, publicKey, requestTransaction } = useWallet();
    const [_, setTransactionId] = useState<string>();
    const handleRemove = async (event: React.MouseEvent<HTMLElement>) => {
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
        const txId = await requestTransaction(aleoTransaction);

        setTransactionId(txId);
    };
    return (
        <div style={{
            height: 400,
            overflow: 'auto',
            padding: '0 16px',
            border: '1px solid rgba(140, 140, 140, 0.35)',
        }}>
            <Row>
                <Col>

                    <List size="large">
                        <List.Item >

                            <List.Item.Meta
                                title={<a>{data[0].title}</a>}
                            />
                            <div><Button
                                onClick={async (event) => {
                                    event.preventDefault();
                                    await handleRemove(event)
                                }}
                            >
                                Remove{" "}
                            </Button></div>
                        </List.Item>

                    </List>




                </Col>
            </Row>
            <Row>
                <Col> <Button
                    onClick={(event) => {
                        event.preventDefault
                        setLiquidityTabState(LiquidiyTab.Supply)
                    }}>Add Liquidity</Button></Col></Row></div>


    );
};
