import { createRoot } from "react-dom/client";

import { ExampleListView } from "./exampleListView.js";

const contentDiv = document.querySelector("#content");
if (contentDiv === null) {
    throw new Error("Could not find #content div");
}
const root = createRoot(contentDiv);
root.render(<ExampleListView />);
