
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://www.cyberedge.jp:8443/graphql',
  // documents: "./graphql/schema.graphql",
  // documents: "./app/**/*.tsx",
  generates: {
    // graphql: {
    //   preset: "client",
    //   plugins: ["typescript"]
    // },
    // "./graphql.schema.json": {
    "./lib/": {
      preset: "client",
      plugins: [
        "typescript",
        "typescript-operations"
      ]
    }
  }
};

export default config;
