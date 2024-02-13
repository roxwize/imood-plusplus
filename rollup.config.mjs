import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import {
  chromeExtension
  // simpleReloader
} from "rollup-plugin-chrome-extension";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/manifest.json",
  output: {
    dir: "dist",
    format: "esm"
  },
  plugins: [
    chromeExtension(),
    // simpleReloader(),
    resolve(),
    commonjs(),
    production && terser()
  ]
};
