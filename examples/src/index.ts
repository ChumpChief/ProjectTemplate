import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { ExampleListView } from "./exampleListView.js";

const appRootDiv = document.createElement("div");
appRootDiv.classList.add("app-root");
const reactRoot = createRoot(appRootDiv);
reactRoot.render(createElement(ExampleListView));

document.body.append(appRootDiv);
