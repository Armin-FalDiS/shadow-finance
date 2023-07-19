import { Card, Divider, Form, Input } from "antd";
import { CopyButton } from "../../components/CopyButton";
import { useAleoWASM } from "../../aleo-wasm-hook";
import { useContext } from "react";
import { AppContext } from "../../App";

export const Fee = () => {
    const { fee, setFee } = useContext(AppContext);
    const aleo = useAleoWASM();
    
    const onChange = (event) => {
        setFee(null);
        try {
            setFee(aleo.PrivateKey.from_string(event.target.value));
        } catch (error) {
            console.error(error);
        }
    };

    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
    if (aleo !== null) {
        return (
            <Card
                title="Fee"
                style={{ width: "100%", borderRadius: "20px" }}
                bordered={false}
            >
                <Form {...layout}>
                    <Form.Item label="Fee Record (Decrypted)" colon={false}>
                        <Input
                            name="privateKey"
                            size="large"
                            placeholder="Private Key"
                            allowClear
                            onChange={onChange}
                            style={{ borderRadius: "20px" }}
                        />
                    </Form.Item>
                </Form>
            </Card>
        );
    } else {
        return (
            <h3>
                <center>Loading...</center>
            </h3>
        );
    }
};
