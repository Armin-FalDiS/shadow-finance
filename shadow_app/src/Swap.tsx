import React, { useEffect, useState } from "react";
import { Button, Cascader, InputNumber, Form, Row, Col } from "antd";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import app from "./app.json";
import {
    WalletAdapterNetwork,
    WalletNotConnectedError,
    Transaction,
} from "@demox-labs/aleo-wallet-adapter-base";
import { getArmInReserve, getArmOutReserve } from "./general";

interface Option {
    value: string;
    label: string;
}

const Swap = () => {
    const { wallet, publicKey, requestRecords, requestTransaction } =
        useWallet();

    const options: Option[] = [
        {
            value: "ArmIn Token",
            label: "ArmIn Token",
        },
        {
            value: "ArmOut Token",
            label: "ArmOut Token",
        },
    ];
    enum Tokens {
        ArmInToken = "ArmIn Token",
        ArmOutToken = "ArmOut Token",
    }

    const [programId] = useState(app.shadow_swap.id);
    const [functionName, setFunctionName] = useState(
        app.shadow_swap.swap_to_0_function
    );
    const [fee] = useState(app.shadow_swap.swap_to_0_fee);
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
    const [_, setTransactionId] = useState<string>();
    useEffect(() => {
        const setData = async () => {
            const armInReserve = await getArmInReserve();
            const armOutReserve = await getArmOutReserve();
            setArmInReserve(armInReserve);
            setArmOutReserve(armOutReserve);
        };
        setData();
    }, []);

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
            setLowerTokenAmount(
                (armOutReserve * upperTokenAmount) /
                (armInReserve - upperTokenAmount)
            );
        } else {
            setLowerTokenAmount(
                (armInReserve * upperTokenAmount) /
                (armOutReserve + upperTokenAmount)
            );
        }
    };
    const onChangeLowerAmount = (value: number | null) => {
        if (value != null) setLowerTokenAmount(value);
        if (lowerToken === Tokens.ArmInToken) {
            setUpperTokenAmount(
                (armOutReserve * lowerTokenAmount) /
                (armInReserve - lowerTokenAmount)
            );
        } else {
            setUpperTokenAmount(
                (armInReserve * lowerTokenAmount) /
                (armOutReserve + lowerTokenAmount)
            );
        }
    };
    const onChangeLower = (value: any) => {
        setLowerToken(value);
    };
    function tryParseJSON(input: string) {
        try {
            return JSON.parse(input);
        } catch (error) {
            return input;
        }
    }
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

            if (upperToken == Tokens.ArmInToken) {
                setFunctionName(app.shadow_swap.swap_to_1_function);
                inputsArray = [
                    publicKey,
                    armInRecords[arminSpendableIndex],
                    upperTokenAmount + "u64",
                    lowerTokenAmount + "u64",
                ];
            } else if (upperToken == Tokens.ArmInToken) {
                setFunctionName(app.shadow_swap.swap_to_0_function);
                inputsArray = [
                    publicKey,
                    armOutRecords[armOutSpendableIndex],
                    upperTokenAmount + "u64",
                    lowerTokenAmount + "u64",
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
        <Form>
            <Form className="token-box-container">
                <Row>
                    <Col span={24}>
                        <InputNumber
                            size="large"
                            onChange={onChangeUpperAmount}
                            value={upperTokenAmount}
                            min={0}
                            max={upperSpendable}
                            bordered={false}
                            addonBefore={
                                <Cascader
                                    options={options}
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
                        <Col span={12} style={{ textAlign: 'center' }}>
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
                            size="large"
                            onChange={onChangeLowerAmount}
                            value={lowerTokenAmount}
                            min={0}
                            max={lowerSpendable}
                            bordered={false}
                            addonBefore={
                                <Cascader
                                    options={options}
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

                <br />

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
                        <Col span={12} style={{ textAlign: 'center' }}>
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
                    <label>Slippage</label>
                </Col>
                <Col span={12} className="label-value">
                    <label>1.5%</label>
                </Col>
            </Row>
            <Row>
                <Col span={12} className="label-key">
                    <label>Exhange Rate</label>
                </Col>
                <Col span={12} className="label-value">
                    <label>{armInReserve / armOutReserve}</label>
                </Col>
            </Row>

            <br />

            <Row>
                <Col span={24}>
                    <Button
                        size="large"
                        type="primary"
                        shape="round"
                        style={{ width: "100%" }}
                        onClick={handleSubmit}
                        disabled={!upperToken || !lowerToken || (upperToken == lowerToken) || !upperTokenAmount || !lowerTokenAmount}
                    >
                        Swap
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default Swap;
