import terser from "@rollup/plugin-terser";
import { babel } from "@rollup/plugin-babel";
import cleaner from "rollup-plugin-cleaner";
import { dts } from "rollup-plugin-dts";
import size from "rollup-plugin-size";
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import path from "path";

/**
 * @type {import('rollup').RollupOptions}
 */
const core_config = [
  {
    input: `packages/core/src/main.ts`,
    plugins: [
      cleaner({ targets: ["packages/core/dist"] }),
      typescript({
        tsconfig: "./tsconfig.json",
        include: ["packages/core/src/*"],
        declaration: false,
        module: "ESNext",
      }),
      babel({
        babelHelpers: "bundled",
      }),
      terser(),
      size(),
    ],
    output: [
      {
        file: `packages/core/dist/event-emitter.js`,
        format: "es",
      },
      {
        file: `packages/core/dist/event-emitter.cjs`,
        format: "cjs",
      },
    ],
  },
  {
    input: `packages/core/src/main.ts`,
    plugins: [dts(), size()],
    output: [
      {
        file: `packages/core/dist/event-emitter.d.ts`,
        format: "es",
      },
    ],
  },
];

export default core_config;
