import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useEffect, useState } from "react";
import { getLPTokenBalance } from "../general";
import { EmptyLP } from "./EmptyLP";
import { LPTable } from "./LPTable";
import { Button, Col, Row } from "antd";
import { SupplyLiquidity } from "./SupplyLiquidity";

export const Liquidity = () => {
    const { publicKey } = useWallet();
    const [LPBalance, setLPBalance] = useState<number>(0);
    const [showSupplyLiquidity, setShowSupplyLiquidity] = useState(false);

    const fetchTokenAmounts = async () => {
        if (publicKey) {
            const LPBalance = await getLPTokenBalance(publicKey);
            setLPBalance(LPBalance);
        }
    };

    useEffect(() => {
        fetchTokenAmounts();
    }, []);

    if (showSupplyLiquidity) {
        return <SupplyLiquidity setShowMe={setShowSupplyLiquidity} />;
    } else {
        return (
            <>
                {LPBalance == 0 && <EmptyLP />}
                {LPBalance > 0 && <LPTable />}

                <br />

                <Row>
                    <Col span={24}>
                        <Button
                            size="large"
                            type="primary"
                            shape="round"
                            onClick={() => {
                                setShowSupplyLiquidity(true);
                            }}
                        >
                            Add Liquidity
                        </Button>
                    </Col>
                </Row>
            </>
        );
    }
};
