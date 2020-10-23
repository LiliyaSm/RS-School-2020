const path = require("path");
const miniCss = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const PATHS = {};

module.exports = {
    mode: "development",
    entry: ["./src/index.js", "./src/scss/style.scss"],
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.(s*)css$/,
                use: [miniCss.loader, "css-loader", "sass-loader"],
            },
            // {
            //     test: /\.html$/i,
            //     use: {
            //         loader: "html-loader",
            //     },
            //     // option: {
            //     //     name: "[name].[ext]",
            //     // },
            // },
            {
                test: /\.(png|svg|jpe?g|gif|ttf)$/,
                use: {
                    loader: "file-loader",
                },
                // option: {
                //     name: "[name].[ext]",
                // },
            },
        ],
    },
    plugins: [
        new miniCss({
            filename: "style.css",
        }),
        new HtmlWebpackPlugin({
            hash: false,
            // favicon: "./src/imgfavicon.ico",
            template: "./src/index.html",
            // filename: "./src/index.html",
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "./src/assets/images", to: "assets/images" },
                { from: "./src/assets/owfont-master/css/owfont-regular.min.css", to: "assets/css/owfont-regular.min.css"},
                { from: "./src/assets/owfont-master/fonts", to: "assets/fonts"}
        ],
        }),
    ],
};
