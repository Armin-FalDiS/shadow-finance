import { Button, Col,Row, Table } from "antd";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import {
    WalletAdapterNetwork,
    WalletNotConnectedError,
    Transaction,
} from "@demox-labs/aleo-wallet-adapter-base";
import { useEffect, useState } from "react";

import app from "../app.json";
import { LiquidiyTab } from "./Liquidity";
import {
    getArmInReserve,
    getArmOutReserve,
    getLPTokenBalance,
    getLPTokenTotalSupply,
} from "../general";
const { Column} = Table;
export const UserState = ({ setLiquidityTabState }: any) => {
    const { wallet, publicKey, requestTransaction } = useWallet();
    const [_, setTransactionId] = useState<string>();
    const [LPBalance, setLPBalance] = useState<number>(0);
    const [totalLPSupply, settotalLPSupply] = useState<number>(0);
    const [LPShare, setLPShare] = useState<number>(0);
    const SetTokenAmounts = async () => {
        if (publicKey) {
            const LPBalance = await getLPTokenBalance(publicKey);
            setLPBalance(LPBalance);
            const totalLPSupply = await getLPTokenTotalSupply();
            settotalLPSupply(totalLPSupply);
            const lpShare = LPBalance / totalLPSupply;
            setLPShare(lpShare);
        }
    };
    useEffect(() => {
        const getData = async () => {
            await SetTokenAmounts();
        };
        getData();
    }, []);

    const data = [
        {
            key: "1",
            title: "ArmInToken/ArmOutToken",
            LP: LPBalance || 0,
            PoolShare: ((LPShare*100).toFixed(2)+ " %")  || 0,
        },
    ];
    const getTokenAmounts = async () => {
        const armInReserve = await getArmInReserve();
        const armOutReserve = await getArmOutReserve();
        let armInShare = Math.floor(LPShare / armInReserve);
        let armOutShare = Math.floor(LPShare / armOutReserve);
        return [armInShare, armOutShare];
    };

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
        console.log(parsedInputs);

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
        <div>
            <Row>
                <Col>
                    <Table pagination={false} dataSource={data}>
                        <Column title="title" dataIndex="title" key="title" />
                        <Column title="LP" dataIndex="LP" key="LP" />
                        <Column
                            title="PoolShare"
                            dataIndex="PoolShare"
                            key="PoolShare"
                        ></Column>
                        <Column
                            render={() => {
                                return (
                                    <Button
                                        onClick={async (event) => {
                                            event.preventDefault();
                                            await handleRemove(event);
                                        }}
                                    >
                                        Remove{" "}
                                    </Button>
                                );
                            }}
                        ></Column>

                        <Button></Button>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    {" "}
                    <Button
                        onClick={(event) => {
                            event.preventDefault;
                            setLiquidityTabState(LiquidiyTab.Supply);
                        }}
                    >
                        Add Liquidity
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button
                        onClick={(event) => {
                            event.preventDefault();
                            setLiquidityTabState(LiquidiyTab.Empty);
                        }}
                    >
                        {" "}
                        EmptyLP{" "}
                    </Button>
                </Col>
            </Row>
        </div>
    );
};
