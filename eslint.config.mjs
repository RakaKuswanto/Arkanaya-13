import { config as remotionConfig } from "@remotion/eslint-config-flat";

export default [
  {
    ignores: ["node_modules/**", "out/**", ".remotion/**"],
  },
  ...remotionConfig.map((entry) => ({
    ...entry,
    files: ["src/**/*.ts", "src/**/*.tsx"],
  })),
  {
    files: [
      "src/schema/**/*.ts",
      "src/episodes/**/*.ts",
      "src/presets/**/*.ts",
      "src/theme/**/*.ts",
    ],
    rules: {
      "@remotion/non-pure-animation": "off",
    },
  },
];
