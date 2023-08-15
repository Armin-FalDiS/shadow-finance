import __wbg_init, { bhp256 } from "js-snarkvm";
import app from "./app.json";
import axios from "axios";

const programID = app.shadow_swap.id;
const nodeUrl = app.node_url;

await __wbg_init();

export const parseU64Response = (res: any) =>
    parseInt(res.data.substr(1, res.length - 4));

export const getArmInReserve = async () => {
    try {
        return parseU64Response(
            await axios.get(
                `${nodeUrl}/testnet3/program/${programID}/mapping/reserves_shadow/0u8`
            )
        );
        
    } catch (error) {
        return 0
    }

};

export const getArmOutReserve = async () => {
    try {
        return parseU64Response(
            await axios.get(
                `${nodeUrl}/testnet3/program/${programID}/mapping/reserves_shadow/1u8`
            )
        );
        
    } catch (error) {
        return 0
    }

};

export const getLPTokenBalance = async (address: string) => {
    const hashed_address = bhp256(address);
    try {
        return parseU64Response(
            await axios.get(
                `${nodeUrl}/testnet3/program/${programID}/mapping/lp_tokens_shadow/${hashed_address}`
            )
        );
    } catch (error) {
        return 0;
    }
};

export const getLPTokenTotalSupply = async () => {
    try {
        return parseU64Response(
            await axios.get(
                `${nodeUrl}/testnet3/program/${programID}/mapping/supply_shadow/0u8`
            )
        );
        
    } catch (error) {
        return 0
    }

};
