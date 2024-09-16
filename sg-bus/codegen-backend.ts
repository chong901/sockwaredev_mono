import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3000/api/graphql",
  documents: ["src/**/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    "./src/graphql-codegen/backend/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        useIndexSignature: true,
      },
    },
  },
};

export default config;
