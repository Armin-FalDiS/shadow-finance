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
    const [ratio, setRatio] = useState<number | string>(0);


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
            const armInReserve = await getArmInReserve();
            setArmInReserve(armInReserve);
            const armOutReserve = await getArmOutReserve();
            setArmOutReserve(armOutReserve);
        }
    };
    const setExchangeRate = () => {
        if (
            upperToken?.[0] === Tokens.ArmInToken &&
            lowerToken?.[0] === Tokens.ArmOutToken
        ) {
            setRatio(armInReserve / armOutReserve);
        } else if (
            upperToken?.[0] === Tokens.ArmOutToken &&
            lowerToken?.[0] === Tokens.ArmInToken
        ) {
            setRatio(armOutReserve / armInReserve);
        } else if (upperToken?.[0] || lowerToken?.[0]) {
            setRatio("?");
        }
    };


    useEffect(() => {
        setExchangeRate();
        fetchTokenAmounts();
    },[upperToken, lowerToken]);

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
        setUpperBalance(0);
        setUpperSpendable(0);
        setUpperTokenAmount(0);
    };

    const onChangeUpperAmount = (value: number | null) => {
        if (value != null) {
            setUpperTokenAmount(value);
            if (
                lowerToken?.[0] === Tokens.ArmInToken &&
                upperToken?.[0] === Tokens.ArmOutToken
            ) {
                setLowerTokenAmount(value * (armOutReserve / armInReserve));
            } else if (
                lowerToken?.[0] === Tokens.ArmOutToken &&
                upperToken?.[0] === Tokens.ArmInToken
            ) {
                setLowerTokenAmount(value * (armInReserve / armOutReserve));
            }
        }
    };

    const onChangeLowerAmount = (value: number | null) => {
        if (value != null) {
            setLowerTokenAmount(value);
            if (
                lowerToken?.[0] === Tokens.ArmInToken &&
                upperToken?.[0] === Tokens.ArmOutToken
            ) {
                setUpperTokenAmount(value * (armOutReserve / armInReserve));
            } else if (
                lowerToken?.[0] === Tokens.ArmOutToken &&
                upperToken?.[0] === Tokens.ArmInToken
            ) {
                setUpperTokenAmount(value * (armInReserve / armOutReserve));
            }
        }
    };

    const onChangeLower = (value: any) => {
        setLowerToken(value);
        setLowerBalance(0);
        setLowerSpendable(0);
        setLowerTokenAmount(0);
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
            if (
                upperToken[0] === Tokens.ArmInToken &&
                lowerToken[0] === Tokens.ArmOutToken
            ) {
                inputsArray = [
                    publicKey,
                    armInRecords[arminSpendableIndex],
                    upperTokenAmount.toFixed() + "u64",
                    armOutRecords[armOutSpendableIndex],
                    lowerTokenAmount.toFixed() + "u64",
                ];
            } else if (
                upperToken[0] === Tokens.ArmOutToken &&
                lowerToken[0] === Tokens.ArmInToken
            ) {
                inputsArray = [
                    publicKey,
                    armInRecords[arminSpendableIndex],
                    lowerTokenAmount.toFixed() + "u64",
                    armOutRecords[armOutSpendableIndex],
                    upperTokenAmount.toFixed() + "u64",
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

           await requestTransaction(aleoTransaction);

 
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
                            ((armInReserve * armOutReserve) +
                            (upperTokenAmount * lowerTokenAmount))*100).toFixed(2) + " %" || 0}
                        
                    </label>
                </Col>
            </Row>
            <Row>

                <Col span={12} className="label-key">
                    <label>Exhange Rate</label>
                </Col>
                <Col span={12} className="label-value">
                    <label>{ratio?.toString()?.substring(0, 4) || 0}</label>
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
