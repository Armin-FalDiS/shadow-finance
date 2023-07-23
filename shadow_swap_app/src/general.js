import __wbg_init, { bhp256 } from "js-snarkvm";
import app from "./app.json";

const programID = app.shadow_swap.id;
const node_url = app.node_url;

await __wbg_init();

export const parseU64Response = (res) =>
    parseInt(res.data.substr(1, res.length - 4));

export const getArmInReserve = async () => {
    return parseU64Response(
        await axios.get(
            `${node_url}/testnet3/program/${programID}/mapping/reserves_shadow/0u8`,
        ),
    );
};

export const getArmOutReserve = async () => {
    return parseU64Response(
        await axios.get(
            `${node_url}/testnet3/program/${programID}/mapping/reserves_shadow/1u8`,
        ),
    );
};

export const getLPTokenBalance = async (address) => {
    const hashed_address = bhp256(address);

    return parseU64Response(
        await axios.get(
            `${node_url}/testnet3/program/${programID}/mapping/lp_tokens_shadow/${hashed_address}`,
        ),
    );
};

export const getLPTokenTotalSupply = async () => {
    return parseU64Response(
        await axios.get(
            `${url}/testnet3/program/${programID}/mapping/supply_shadow/0u8`,
        ),
    );
};
