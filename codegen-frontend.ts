import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3000/api/graphql",
  documents: ["src/**/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    "./src/graphql-codegen/frontend/": {
      preset: "client",
    },
  },
};

export default config;
