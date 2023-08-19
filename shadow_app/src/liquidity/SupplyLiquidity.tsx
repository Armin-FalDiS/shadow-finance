import React, { useEffect, useState } from "react";
import { Button, Cascader, InputNumber, Form, Col, Row } from "antd";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { getArmInReserve, getArmOutReserve } from "../general";

import app from "../app.json";
import {
    WalletAdapterNetwork,
    WalletNotConnectedError,
    Transaction,
} from "@demox-labs/aleo-wallet-adapter-base";

interface Token {
    value: string;
    label: string;
}

export const SupplyLiquidity = ({ setShowMe }: any) => {
    const { wallet, publicKey, requestRecords, requestTransaction } =
        useWallet();

    const [programId] = useState(app.shadow_swap.id);
    const [functionName] = useState(app.shadow_swap.provide_function);
    const [fee] = useState(app.shadow_swap.provide_fee);
    const [upperToken, setUpperToken] = useState<any>();
    const [lowerToken, setLowerToken] = useState<any>();
    const [upperTokenAmount, setUpperTokenAmount] = useState(0);
    const [lowerTokenAmount, setLowerTokenAmount] = useState(0);
    const [upperBalance, setUpperBalance] = useState(0);
    const [lowerSpendable, setLowerSpendable] = useState(0);
    const [upperSpendable, setUpperSpendable] = useState(0);
    const [lowerBalanace, setLowerBalance] = useState(0);
    const [armInReserve, setArmInReserve] = useState(0);
    const [armOutReserve, setArmOutReserve] = useState(0);
    const [ratio, setRatio] = useState(0);
    const [LPBalance, setLPBalance] = useState<number>(0);
    const [totalLPSupply, setTotalLPSupply] = useState<number>(0);
    const [LPShare, setLPShare] = useState<number>(0);
    const [transactionId, setTransactionId] = useState<string>();

    const tokens: Token[] = [
        {
            value: "ArmIn Token",
            label: "ArmIn Token",
        },
        {
            value: "ArmOut Token",
            label: "ArmOut Token",
        },
    ];

    const fetchTokenAmounts = async () => {
        if (publicKey) {
            // const LPBalance = await getLPTokenBalance(publicKey);
            // setLPBalance(LPBalance);
            // const totalLPSupply = await getLPTokenTotalSupply();
            // settotalLPSupply(totalLPSupply);
            // const lpShare = LPBalance / totalLPSupply;
            // setLPShare(lpShare);
            const armInReserve = await getArmInReserve();
            setArmInReserve(armInReserve);
            const armOutReserve = await getArmOutReserve();
            setArmOutReserve(armOutReserve);
            setRatio(armInReserve / armOutReserve);
        }
    };

    useEffect(() => {
        fetchTokenAmounts();
    }, []);

    enum Tokens {
        ArmInToken = "ArmIn Token",
        ArmOutToken = "ArmOut Token",
    }

    const updateUpperBalance = async () => {
        let program = "";

        upperToken == "ArmIn Token"
            ? (program = app.armin_token.id)
            : (program = app.armout_token.id);

        if (!publicKey) throw new WalletNotConnectedError();
        if (requestRecords != null) {
            let records = await requestRecords(program);
            records = records.filter((record) => {
                return record.spent === false;
            });
            const amounts = records.map((record) => {
                return parseInt(
                    record.data.amount.substr(0, record.data.amount.length - 11)
                );
            });
            let sum = 0;
            amounts.forEach((num) => {
                sum += num;
            });
            setUpperBalance(sum);
            setUpperSpendable(Math.max(...amounts));
        }
    };

    const updateLowerBalance = async () => {
        let program = "";

        lowerToken == "ArmIn Token"
            ? (program = app.armin_token.id)
            : (program = app.armout_token.id);

        if (!publicKey) throw new WalletNotConnectedError();

        if (requestRecords != null) {
            let records = await requestRecords(program);
            records = records.filter((record) => {
                return record.spent === false;
            });
            const amounts = records.map((record) => {
                return parseInt(
                    record.data.amount.substr(0, record.data.amount.length - 11)
                );
            });
            let sum = 0;
            amounts.forEach((num) => {
                sum += num;
            });
            setLowerBalance(sum);
            setLowerSpendable(Math.max(...amounts));
        }
    };

    const onChangeUpper = (value: any) => {
        if (value != null) setUpperToken(value);
    };

    const onChangeUpperAmount = (value: number | null) => {
        if (value != null) setUpperTokenAmount(value);
        if (upperToken === Tokens.ArmInToken) {
            setLowerTokenAmount(upperTokenAmount * (1 / ratio));
        } else {
            setLowerTokenAmount(upperTokenAmount * ratio);
        }
    };

    const onChangeLowerAmount = (value: number | null) => {
        if (value != null) setLowerTokenAmount(value);
        if (lowerToken === Tokens.ArmInToken) {
            setUpperTokenAmount(lowerTokenAmount * (1 / ratio));
        } else {
            setUpperTokenAmount(lowerTokenAmount * ratio);
        }
    };

    const onChangeLower = (value: any) => {
        setLowerToken(value);
    };

    const tryParseJSON = (input: string) => {
        try {
            return JSON.parse(input);
        } catch (error) {
            return input;
        }
    };

    const getIndexOfHighestRecord = (records: any[]) => {
        const amounts = records.map((record) => {
            return parseInt(
                record.data.amount.substr(0, record.data.amount.length - 11)
            );
        });
        return amounts.indexOf(Math.max.apply(Math, amounts));
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (wallet == null || !publicKey || requestTransaction == null) {
            throw new WalletNotConnectedError();
        }
        let inputsArray: any[] = [];
        if (requestRecords != null) {
            let armInRecords = await requestRecords(app.armin_token.id);
            let armOutRecords = await requestRecords(app.armout_token.id);
            armInRecords = armInRecords.filter((record) => {
                return record.spent === false;
            });
            armOutRecords = armOutRecords.filter((record) => {
                return record.spent === false;
            });
            const arminSpendableIndex = getIndexOfHighestRecord(armInRecords);
            const armOutSpendableIndex = getIndexOfHighestRecord(armOutRecords);
            if (upperToken === Tokens.ArmInToken) {
                inputsArray = [
                    publicKey,
                    armInRecords[arminSpendableIndex],
                    upperTokenAmount + "u64",
                    armOutRecords[armOutSpendableIndex],
                    lowerTokenAmount,
                ];
            } else if (upperToken === Tokens.ArmOutToken) {
                inputsArray = [
                    publicKey,
                    armInRecords[arminSpendableIndex],
                    lowerTokenAmount + "u64",
                    armOutRecords[armOutSpendableIndex],
                    upperTokenAmount,
                ];
            }

            const parsedInputs = inputsArray.map((input) =>
                tryParseJSON(input)
            );

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
        }
    };

    return (
        <>
            <Row>
                <Col>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        onClick={() => setShowMe(false)}
                    >
                        <path
                            d="M25.3337 16H6.66699"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M16.0003 25.3334L6.66699 16.0001L16.0003 6.66675"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Col>
            </Row>
            <Form className="token-box-container">
                <Row>
                    <Col span={24}>
                        <InputNumber
                            bordered={false}
                            size="large"
                            onChange={onChangeUpperAmount}
                            value={upperTokenAmount}
                            addonBefore={
                                <Cascader
                                    options={tokens}
                                    placeholder={"Select a token"}
                                    onChange={(value) => {
                                        onChangeUpper(value);
                                    }}
                                    value={upperToken}
                                />
                            }
                        />
                    </Col>
                </Row>
                <br />

                <Form hidden={!upperToken}>
                    <Row>
                        <Col span={6} className="label-key">
                            <label>Total Balance</label>
                        </Col>
                        <Col span={6} className="label-value">
                            <label>{upperBalance}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6} className="label-key">
                            <label>Spendable Balance</label>
                        </Col>
                        <Col span={6} className="label-value">
                            <label>{upperSpendable}</label>
                        </Col>
                    </Row>

                    <br />

                    <Row>
                        <Col span={12} style={{ textAlign: "center" }}>
                            <Button
                                onClick={async () => {
                                    await updateUpperBalance();
                                }}
                            >
                                Update Balance
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Form>
            <br />
            <Form className="token-box-container">
                <Row>
                    <Col span={24}>
                        <InputNumber
                            onChange={onChangeLowerAmount}
                            value={lowerTokenAmount}
                            bordered={false}
                            size="large"
                            addonBefore={
                                <Cascader
                                    options={tokens}
                                    placeholder={"Select a token"}
                                    onChange={(value) => {
                                        onChangeLower(value);
                                    }}
                                    value={lowerToken}
                                />
                            }
                        />
                    </Col>
                </Row>

                <Form hidden={!lowerToken}>
                    <Row>
                        <Col span={6} className="label-key">
                            <label>Total Balance</label>
                        </Col>
                        <Col span={6} className="label-value">
                            <label>{lowerBalanace}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6} className="label-key">
                            <label>Spendable Balance</label>
                        </Col>
                        <Col span={6} className="label-value">
                            <label>{lowerSpendable}</label>
                        </Col>
                    </Row>

                    <br />

                    <Row>
                        <Col span={12} style={{ textAlign: "center" }}>
                            <Button
                                onClick={async () => {
                                    await updateLowerBalance();
                                }}
                            >
                                Update Balance
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Form>
            <br />
            <Row>
                <Col span={12} className="label-key">
                    <label>Transaction Fee</label>
                </Col>
                <Col span={12} className="label-value">
                    <label>2 credits</label>
                </Col>
            </Row>
            <Row>
                <Col span={12} className="label-key">
                    <label>Share of Pool: </label>
                </Col>
                <Col span={12} className="label-value">
                    <label>
                        {((upperTokenAmount * lowerTokenAmount) /
                            armInReserve) *
                            armOutReserve || 0}
                        %
                    </label>
                </Col>
            </Row>

            <br />

            <Row>
                <Col span={24}>
                    <Button
                        size="large"
                        type="primary"
                        shape="round"
                        disabled={
                            !publicKey ||
                            !functionName ||
                            !fee ||
                            !lowerToken ||
                            !upperToken ||
                            upperToken == lowerToken ||
                            !upperTokenAmount ||
                            !lowerTokenAmount
                        }
                        onClick={handleSubmit}
                    >
                        Supply
                    </Button>
                </Col>
            </Row>
        </>
    );
};
