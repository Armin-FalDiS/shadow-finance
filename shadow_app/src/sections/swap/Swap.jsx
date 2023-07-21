import { useState, useEffect, useContext } from "react";
import {
    Button,
    Card,
    Col,
    Form,
    Row,
    Result,
    Space,
    InputNumber,
    Radio,
} from "antd";
import { SwapLeftOutlined, SwapRightOutlined } from "@ant-design/icons";
import axios from "axios";
import init from "@aleohq/wasm";
import { AppContext } from "../../App";
import { shadow_swap, node_url } from "../../app.json";

await init();

export const Swap = () => {
    let {
        account,
        fee,
        setFee,
        armInToken,
        setArmInToken,
        armOutToken,
        setArmOutToken,
    } = useContext(AppContext);
    const program = shadow_swap.program;
    const swapToArmInFunction = shadow_swap.swap_to_0_function;
    const swapToArmInFeeAmount = shadow_swap.swap_to_0_fee;
    const swapToArmOutFunction = shadow_swap.swap_to_1_function;
    const swapToArmOutFeeAmount = shadow_swap.swap_to_1_fee;

    const [programResponse, setProgramResponse] = useState(null);
    const [executionError, setExecutionError] = useState(null);
    const [transactionID, setTransactionID] = useState(null);
    const [worker, setWorker] = useState(null);

    const [swapDirection, setSwapDirection] = useState("armin_to_armout");
    const [armInAmount, setArmInAmount] = useState(null);
    const [armOutAmount, setArmOutAmount] = useState(null);

    function spawnWorker() {
        let worker = new Worker(
            new URL("../../workers/worker.js", import.meta.url),
            { type: "module" },
        );
        worker.addEventListener("message", (ev) => {
            if (ev.data.type == "OFFLINE_EXECUTION_COMPLETED") {
                setTransactionID(null);
                setExecutionError(null);
                setProgramResponse(ev.data.outputs);
            } else if (ev.data.type == "EXECUTION_TRANSACTION_COMPLETED") {
                let [transaction, url] = ev.data.executeTransaction;
                axios
                    .post(
                        url + "/testnet3/transaction/broadcast",
                        transaction,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        },
                    )
                    .then((res) => {
                        setProgramResponse(null);
                        setExecutionError(null);
                        setTransactionID(res.data);

                        axios
                            .get(`${url}/testnet3/transaction/${transactionID}`)
                            .then((response) => {
                                const tx = response.data;

                                const encyptedFeeRecord =
                                    tx.fee.transition.outputs[0].value;
                                setFee(
                                    account.to_view_key.decrypt(
                                        encyptedFeeRecord,
                                    ),
                                );

                                const encryptedArmInRecord =
                                    tx.execution.transitions[0].outputs[0]
                                        .value;

                                setArmInToken(
                                    account.to_view_key.decrypt(
                                        encryptedArmInRecord,
                                    ),
                                );
                            });
                    });
            } else if (ev.data.type == "ERROR") {
                setProgramResponse(null);
                setTransactionID(null);
                setExecutionError(ev.data.errorMessage);
            }
        });
        return worker;
    }

    useEffect(() => {
        if (worker === null) {
            const spawnedWorker = spawnWorker();
            setWorker(spawnedWorker);
            return () => {
                spawnedWorker.terminate();
            };
        }
    }, []);

    function postMessagePromise(worker, message) {
        return new Promise((resolve, reject) => {
            worker.onmessage = (event) => {
                resolve(event.data);
            };
            worker.onerror = (error) => {
                setExecutionError(error);
                setProgramResponse(null);
                setTransactionID(null);
                reject(error);
            };
            worker.postMessage(message);
        });
    }

    /**
     * Calculates the amount of recieved tokens
     */
    const calculateOutput = async () => {
        let armInReserve = (
            await axios.get(
                `${url}/testnet3/program/${shadow_swap.id}/mapping/reserves_shadow/0u8`,
            )
        ).data;
        let armOutReserve = (
            await axios.get(
                `${url}/testnet3/program/${shadow_swap.id}/mapping/reserves_shadow/1u8`,
            )
        ).data;

        armInReserve = parseInt(
            armInReserve.substr(0, armInReserve.length - 3),
        );
        armOutReserve = parseInt(
            armOutReserve.substr(0, armOutReserve.length - 3),
        );

        if (swapDirection == "armin_to_armout") {
            setArmOutAmount(
                (armOutReserve * armInAmount) / (armInReserve - armInAmount),
            );
        } else {
            setArmInAmount(
                (armInReserve * armOutAmount) / (armOutReserve + armOutAmount),
            );
        }
    };

    const transactionIDString = () =>
        transactionID !== null ? transactionID : "";
    const executionErrorString = () =>
        executionError !== null ? executionError : "";
    const outputString = () =>
        programResponse !== null ? programResponse.toString() : "";

    const execute = async () => {
        setProgramResponse(null);
        setTransactionID(null);
        setExecutionError(null);

        await calculateOutput();

        let functionInputs = [
            account.to_address().to_string(),
        ];

        let functionID = swapToArmInFunction;
        let feeAmount = swapToArmInFeeAmount;

        if (swapDirection == "armin_to_armout") {
            functionID = swapToArmOutFunction;
            feeAmount = swapToArmOutFeeAmount;
            functionInputs.push([armInToken, armInAmount, armOutAmount]);
        } else {
            functionInputs.push([armOutToken, armOutAmount, armInAmount]);
        }

        await postMessagePromise(worker, {
            type: "ALEO_EXECUTE_PROGRAM_ON_CHAIN",
            remoteProgram: program,
            aleoFunction: functionID,
            inputs: functionInputs,
            privateKey: account.to_string(),
            fee: feeAmount,
            feeRecord: fee,
            url: node_url,
        });
    };

    const onSwapDirectionChange = (event) => {
        setSwapDirection(event.target.value);
        if (event.target.value == "armin_to_armout") {
            setArmOutAmount(null);
        } else {
            setArmInAmount(null);
        }
    };

    const layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
        margin: "50px",
    };

    return (
        <Card
            title="Swap ArmIn or ArmOut!"
            style={{ width: "100%", borderRadius: "20px" }}
            bordered={false}
        >
            <Form {...layout}>
                <Row justify="center">
                    <Col justify="center">
                        <Space>
                            <Radio.Group
                                size="large"
                                value={swapDirection}
                                onChange={onSwapDirectionChange}
                            >
                                <Radio.Button value="armin_to_armout">
                                    ArmIn ➠ ArmOut
                                </Radio.Button>
                                <Radio.Button value="armout_to_armin">
                                    ArmIn ⇚ ArmOut
                                </Radio.Button>
                            </Radio.Group>
                        </Space>
                    </Col>
                </Row>
                <br />
                <br />
                <Row justify="center">
                    <Col style={{ marginRight: "10px" }}>
                        <Space>
                            <InputNumber
                                size="large"
                                min={1}
                                max={100000}
                                disabled={swapDirection != "armin_to_armout"}
                                value={armInAmount}
                                onChange={setArmInAmount}
                            />
                        </Space>
                    </Col>
                    <Col style={{ marginLeft: "10px" }}>
                        <Space>
                            <InputNumber
                                size="large"
                                min={1}
                                max={100000}
                                disabled={swapDirection != "armout_to_armin"}
                                value={armOutAmount}
                                onChange={setArmOutAmount}
                            />
                        </Space>
                    </Col>
                </Row>
                <br />
                <br />
                <Row justify="center">
                    <Col justify="center">
                        <Space>
                            <Button
                                type="primary"
                                shape="round"
                                icon={
                                    swapDirection == "armin_to_armout" ? (
                                        <SwapRightOutlined />
                                    ) : (
                                        <SwapLeftOutlined />
                                    )
                                }
                                size="large"
                                onClick={execute}
                            >
                                Swap
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
            <Row
                justify="center"
                gutter={[16, 32]}
                style={{ marginTop: "48px" }}
            >
                {/* {loading && <Spin tip="Executing..." size="large" />} */}
                {transactionID !== null && (
                    <Result
                        status="success"
                        title="On Chain Execution Successful!"
                        subTitle={"Transaction ID: " + transactionIDString()}
                    />
                )}
                {programResponse !== null && (
                    <Result
                        status="success"
                        title="Execution Successful!"
                        subTitle={"Outputs: " + outputString()}
                    />
                )}
                {executionError !== null && (
                    <Result
                        status="error"
                        title="Function Execution Error"
                        subTitle={"Error: " + executionErrorString()}
                    />
                )}
            </Row>
        </Card>
    );
};
