import { useState, useEffect, useContext } from "react";
import { Button, Card, Col, Form, Row, Result, Space, Input, Divider, InputNumber,Slider } from "antd";
import axios from "axios";
import init, * as aleo from "@aleohq/wasm";
import { AppContext } from "../../App";
import { armin_token, armout_token, node_url, shadow_swap } from "../../app.json";
import __wbg_init, { bhp256 } from 'js-snarkvm'


     

await __wbg_init()
await init();

export const RemoveLiquidity = () => {
    let { account, fee, setFee, setArmInToken, setArmOutToken,armInToken,armOutToken } = useContext(AppContext);
    const program = shadow_swap.program
    const functionID = shadow_swap.burn_function
    const feeAmount = shadow_swap.burn_fee
    const [armInAmount, setArmInAmount] = useState(0)
    const [armOutAmount, setArmOutAmount] = useState(0)
    const [sliderValue,setSliderValue]= useState(50)
    const [sliderinputValue,setSliderinputValue] = useState(50)



    const [programResponse, setProgramResponse] = useState(null);
    const [executionError, setExecutionError] = useState(null);
    const [transactionID, setTransactionID] = useState(null);
    const [worker, setWorker] = useState(null);

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
                                const encryptedArmOutRecord =
                                    tx.execution.transitions[0].outputs[1]
                                        .value;

                                setArmInToken(
                                    account.to_view_key.decrypt(
                                        encryptedArmInRecord,
                                    ),
                                );
                                setArmOutToken(account.to_view_key.decrypt(encryptedArmOutRecord))
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


    const onSliderChange = (value)=> {
        setSliderValue(value)
        setSliderinputValue(value)
    }
    const onSliderInputChange = (value )=> {
        setSliderinputValue(value)
        setSliderValue(value)
    }
    const  getAmountsFromRatio = () =>{
        const getratio = async() =>{
            let  address = account.to_view_key.to_string()
            let field = bhp256(address)
            let lp_balance = await axios.get(url+"/testnet3/program/shadow_swap.aleo/mapping/reserves_shadow/"+field)
            let total_lp_supply =await axios.get(url+"/testnet3/program/shadow_swap.aleo/mapping/supply_shadow/0u8")
            let lp_share = lp_balance / total_lp_supply
            let ArmInReserve= await axios.get(url+"/testnet3/program/shadow_swap.aleo/mapping/reserves_shadow/0u8") 
            let ArmOutReserve =await axios.get(url+"/testnet3/program/shadow_swap.aleo/mapping/reserves_shadow/1u8") 
            let  ArmInShare = lp_share *  ArmInReserve 
            let ArmOutShare = lp_share * ArmOutReserve
            return [ArmInShare,ArmOutShare]
      
          }

    }

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
    const getratio = () =>{
        pass
    }

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
        [amount1,amount2] =getAmountsFromRatio(sliderValue)


        let functionInputs = [
            account.to_address().to_string(),
            amount1,
            amount2
 
        ];

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

    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

    return (
        <Card
            title={"Provide Liquidity"}
            style={{ width: "100%", borderRadius: "20px" }}
            bordered={false}
        >

            <Form {...layout}>
                <Row justify="center">
                    <Col justify="center">
                        <Space>
                            <Form.Item
                                label="Removal percentage"
                                colon={false}
                                validateStatus={status}
                            >
                                <Slider
                                    name="Removal percentage"
                                    size="large"


                                    onChange={onSliderChange}
                                    value={sliderValue}
                                    style={{ borderRadius: "20px" }}
                                />
                            </Form.Item>
                            <Divider />
                            <Form.Item
                                label="ArmOut amount"
                                colon={false}
                                validateStatus={status}
                            >

                                <InputNumber
                                    name="Slider input"
                                    size="large"
                                    placeholder={0}
                                    onChange={onSliderInputChange}
                                    value={sliderinputValue}
                                    style={{ borderRadius: "20px" }}
                                />
                            </Form.Item>
                            <Button
                                type="primary"
                                shape="round"
                                size="middle"
                                onClick={execute}
                            >
                                Remove Liquidity
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
                {/* {(loading === true || feeLoading == true) && (
                    <Spin tip={tip} size="large" />
                )} */}
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
