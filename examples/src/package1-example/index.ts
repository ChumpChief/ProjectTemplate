import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { AppView } from "./view/index.js";

const start = (): void => {
    const appViewDiv = document.createElement("div");
    const reactRoot = createRoot(appViewDiv);
    reactRoot.render(createElement(AppView));

    const div = document.getElementById("content") as HTMLDivElement;
    div.append(appViewDiv);
};

start();
