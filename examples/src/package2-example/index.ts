import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { AppView } from "./view/index.js";

const appRootDiv = document.createElement("div");
appRootDiv.classList.add("app-root");
const reactRoot = createRoot(appRootDiv);
reactRoot.render(createElement(AppView));

document.body.append(appRootDiv);
