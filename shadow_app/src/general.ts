import __wbg_init, { bhp256 } from "js-snarkvm";
import app from "../app.json";
import axios from "axios";

const programID = app.shadow_swap.id;
const nodeUrl = app.node_url;

let isWasmLoaded: boolean = false;

__wbg_init().then(() => (isWasmLoaded = true));

export const parseU64Response = (res: any) =>
    parseInt(res.data.substr(0, res.data.length - 3));

export const getArmInReserve = async () => {
    try {
        return parseU64Response(
            await axios.get(
                `${nodeUrl}/testnet3/program/${programID}/mapping/reserves_shadow/0u8`
            )
        );
    } catch (error) {
        console.log(error);
        return 0;
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
        return 0;
    }
};

export const getLPTokenBalance = async (address: string) => {
    let tries = 100;

    while (tries-- && !isWasmLoaded) {
        console.log("Waiting for WASM to load...");
        await new Promise((r) => setTimeout(r, 200));
    }

    const hashedAddress = bhp256(address);

    try {
        return parseU64Response(
            await axios.get(
                `${nodeUrl}/testnet3/program/${programID}/mapping/lp_tokens_shadow/${hashedAddress}`
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
        return 0;
    }
};
