import { useState, useEffect, useContext } from "react";
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Result,
    Spin,
    Switch,
    Space,
} from "antd";
import { FormGenerator } from "../../components/InputForm";
import axios from "axios";
import init, * as aleo from "@aleohq/wasm";
import { AppContext } from "../../App";
import { ArmOutToken } from "../faucet/ArmOutToken";



await init();

export const ProvideLiquidity = () => {
    const [executionFeeRecord, setExecutionFeeRecord] = useState(null);
    const [executeUrl, setExecuteUrl] = useState("https://vm.aleo.org/api");
    const [functionID, setFunctionID] = useState(null);
    const [executionFee, setExecutionFee] = useState("1");
    const [inputs, setInputs] = useState(null);
    const [feeLoading, setFeeLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [program, setProgram] = useState(null);
    const [programResponse, setProgramResponse] = useState(null);
    const [executionError, setExecutionError] = useState(null);
    const [programID, setProgramID] = useState(null);
    const [status, setStatus] = useState("");
    const [transactionID, setTransactionID] = useState(null);
    const [worker, setWorker] = useState(null);
    const [executeOnline, setExecuteOnline] = useState(true);
    const [programInputs, setProgramInputs] = useState(null);
    const [tip, setTip] = useState("Executing Program...");
    let { account } = useContext(AppContext)
    const [arminAmount,setArminAmount] = useState("")
    const [armoutAmount,setArmoutAmount] = useState("")
    const privateKey = () =>
        account !== null ? account.to_string() : "";
    const address = () =>
        account !== null ? account.to_address().to_string() : "";
    const program_string = "program armin_token.aleo;\n\nrecord ArminToken:\n    owner as address.private;\n    amount as u64.private;\n\nmapping supply_armin:\n    key left as u8.public;\n    value right as u64.public;\n\nmapping programs_armin:\n    key left as field.public;\n    value right as u64.public;\n\nfunction mint_armin:\n    input r0 as address.private;\n    input r1 as u64.private;\n    lte r1 100000u64 into r2;\n    assert.eq r2 true ;\n    cast r0 r1 into r3 as ArminToken.record;\n    output r3 as ArminToken.record;\n   finalize r1;\n\nfinalize mint_armin:\n    input r0 as u64.public;\n    get.or_use supply_armin[0u8] 0u64 into r1;\n    add r1 r0 into r2;\n    lte r2 100000000000u64 into r3;\n    assert.eq r3 true ;\n    set r2 into supply_armin[0u8];\n\nfunction transfer_armin:\n    input r0 as ArminToken.record;\n    input r1 as address.private;\n    input r2 as u64.private;\n    sub r0.amount r2 into r3;\n    cast r0.owner r3 into r4 as ArminToken.record;\n    cast r1 r2 into r5 as ArminToken.record;\n    output r4 as ArminToken.record;\n    output r5 as ArminToken.record;\n\nfunction transfer_armin_to_program:\n    input r0 as ArminToken.record;\n    input r1 as u64.private;\n    sub r0.amount r1 into r2;\n    cast r0.owner r2 into r3 as ArminToken.record;\n    output r3 as ArminToken.record;\n   finalize r1;\n\nfinalize transfer_armin_to_program:\n    input r0 as u64.public;\n    hash.bhp256 0u8 into r1 as field;\n    get.or_use programs_armin[r1] 0u64 into r2;\n    add r2 r0 into r3;\n    set r3 into programs_armin[r1];\n\nfunction transfer_armin_from_program:\n    input r0 as address.private;\n    input r1 as u64.private;\n    cast r0 r1 into r2 as ArminToken.record;\n    output r2 as ArminToken.record;\n   finalize r1;\n\nfinalize transfer_armin_from_program:\n    input r0 as u64.public;\n    hash.bhp256 0u8 into r1 as field;\n    get.or_use programs_armin[r1] 0u64 into r2;\n    sub r2 r0 into r3;\n    set r3 into programs_armin[r1];\n"

    const getProgramInputs = () => {

        const programManifest = [];
        if (program) {
            try {
                const aleoProgram = aleo.Program.fromString(program);
                const functions = aleoProgram.getFunctions();
                for (let i = 0; i < functions.length; i++) {
                    const functionManifest = { functionID: functions[i] };
                    try {
                        const functionInputs = aleoProgram.getFunctionInputs(
                            functions[i],
                        );
                        functionManifest["inputs"] = functionInputs;
                        programManifest.push(functionManifest);
                    } catch (e) {
                        console.error(e);
                    }
                }
                setProgramInputs(programManifest);
                return programManifest;
            } catch (e) {
                console.error(e);
            }
        }
    };

    function spawnWorker() {
        let worker = new Worker(
            new URL("../../workers/worker.js", import.meta.url),
            { type: "module" },
        );
        worker.addEventListener("message", (ev) => {
            if (ev.data.type == "EXECUTION_TRANSACTION_COMPLETED") {
                let [transaction, url] = ev.data.executeTransaction;
                console.log(transaction)
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
                    .then((response) => {
                        setFeeLoading(false);
                        setLoading(false);
                        setProgramResponse(null);
                        setExecutionError(null);
                        setTip("Executing Program...");
                        setTransactionID(response.data);
                    });
            } else if (ev.data.type == "EXECUTION_FEE_ESTIMATION_COMPLETED") {
                let fee = ev.data.executionFee;
                setFeeLoading(false);
                setLoading(false);
                setProgramResponse(null);
                setExecutionError(null);
                setTransactionID(null);
                setTip("Executing Program...");
                setExecutionFee(fee.toString());
            } else if (ev.data.type == "ERROR") {
                setFeeLoading(false);
                setLoading(false);
                setProgramResponse(null);
                setTransactionID(null);
                setTip("Executing Program...");
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
                setFeeLoading(false);
                setLoading(false);
                setProgramResponse(null);
                setTransactionID(null);
                setTip("Executing Program...");
                reject(error);
            };
            worker.postMessage(message);
        });
    }

    const execute = async () => {
        setLoading(true);
        setTip("Executing Program...");
        setProgramResponse(null);
        setTransactionID(null);
        setExecutionError(null);

        const feeAmount = parseFloat(feeString());


        let functionInputs = [];
        try {
            if (inputs) {
                functionInputs = [address(), "Armin_token",arminAmount,"armout",armoutAmount]
            }
        } catch (e) {
            setExecutionError("Inputs are not valid");
            setFeeLoading(false);
            setLoading(false);
            setTip("Executing Program...");
            return;
        }

        if (executeOnline) {
            await postMessagePromise(worker, {
                type: "ALEO_EXECUTE_PROGRAM_ON_CHAIN",
                remoteProgram: program_string,
                aleoFunction: "mint_lp_init_shadow",
                inputs: functionInputs,
                privateKey: privateKey(),
                fee: 1,
                feeRecord: "{  owner: aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px.private,  microcredits: 93750000000000u64.private,  _nonce: 4584221379804783317330395146930760519734799446305091160163494666308250813255group.public}",
                url: "http://localhost:3030",
            });
        }
    };




    const getRatio = ()=>{
        // this function needs to be updated and used  to set the token ratios automaticlly
    }


    const onArminChange = (event)=>{
        if (event.target.value !== null) {
            setArminAmount(event.target.value);
        }
    }
    const onArmoutChange = (event)=>{
        setArmoutAmount(event.target.value)
    }



    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
    const inputsString = () => (inputs !== null ? inputs : "");

    const programString = () => (program !== null ? program : "");
    const programIDString = () => (programID !== null ? programID : "");
    const feeRecordString = () =>
        executionFeeRecord !== null ? executionFeeRecord : "";
    const transactionIDString = () =>
        transactionID !== null ? transactionID : "";
    const executionErrorString = () =>
        executionError !== null ? executionError : "";
    const outputString = () =>
        programResponse !== null ? programResponse.toString() : "";
    const feeString = () => (executionFee !== null ? executionFee : "");
    const peerUrl = () => (executeUrl !== null ? executeUrl : "");

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
                                label="Armin amount"
                                colon={false}
                                validateStatus={status}
                            >
                                <Input.TextArea
                                    name="Armin amount"
                                    size="large"
                                    placeholder={0}
                                    allowClear
                                    onChange={onArminChange}
                                    value={arminAmount}
                                    style={{ borderRadius: "20px" }}
                                />
                            </Form.Item>
                            <Divider />
                            <Form.Item
                                label="Armout amount"
                                colon={false}
                                validateStatus={status}
                            >
                                <Input.TextArea
                                    name="Armout amount"
                                    size="large"
                                    placeholder={0}
                                    onChange={onArmoutChange}
                                    value={armoutAmount}
                                    style={{ borderRadius: "20px" }}
                                />
                            </Form.Item>
                            <Button
                                type="primary"
                                shape="round"
                                size="middle"
                                onClick={execute}
                            >
                                ProvideLiquidity
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
                {(loading === true || feeLoading == true) && (
                    <Spin tip={tip} size="large" />
                )}
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
