import "@ant-design/icons"
import "antd"
import {Wallet } from "./App";



import React from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <Wallet/>
    </React.StrictMode>,
);