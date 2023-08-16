import "@ant-design/icons";
import "antd";
import { App } from "./App";
import React from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");

if (container != null) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}