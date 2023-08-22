import { Button, Col, Row } from "antd";

export const TokenBalanceBox = ({ token, total, spendable, updateBalance }: any) => {
    return (
        <div hidden={!token}>
            <Row>
                <Col span={6} className="label-key">
                    <label>Total Balance</label>
                </Col>
                <Col span={6} className="label-value">
                    <label>{total}</label>
                </Col>
            </Row>
            <Row>
                <Col span={6} className="label-key">
                    <label>Spendable Balance</label>
                </Col>
                <Col span={6} className="label-value">
                    <label>{spendable}</label>
                </Col>
            </Row>

            <br />

            <Row>
                <Col span={12} style={{ textAlign: "center" }}>
                    <Button
                        onClick={async () => {
                            await updateBalance();
                        }}
                    >
                        Update Balance
                    </Button>
                </Col>
            </Row>
        </div>
    );
}