import HtmlWebpackPlugin from "html-webpack-plugin";
// import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// const require = createRequire(import.meta.url);

export default {
    devtool: "source-map",
    entry: {
        "index": {
            import: "./src/index.tsx",
        },
        "package1-example": {
            filename: "package1-example/[name].bundle.js",
            import: "./src/package1-example/index.ts",
        },
        "package2-example": {
            filename: "package2-example/[name].bundle.js",
            import: "./src/package2-example/index.ts",
        },
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            projectReferences: true,
                        },
                    },
                ],
            },
        ],
    },
    output: {
        filename: "[name].bundle.js",
        path: resolve(__dirname, "webpacked"),
        library: "[name]",
        libraryTarget: "umd",
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ["index"],
            template: "./src/index.html",
        }),
        new HtmlWebpackPlugin({
            chunks: ["package1-example"],
            filename: "package1-example/index.html",
            template: "./src/package1-example/index.html",
        }),
        new HtmlWebpackPlugin({
            chunks: ["package2-example"],
            filename: "package2-example/index.html",
            template: "./src/package2-example/index.html",
        }),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        extensionAlias: {
            ".js": [".ts", ".tsx", ".js"],
            ".mjs": [".mts", ".mtsx", ".mjs"],
        },
        // fallback: { "events": require.resolve("events/") }
    },
};
