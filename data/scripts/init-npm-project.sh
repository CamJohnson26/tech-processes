#!/usr/bin/env bash
# init-npm-package-vite.sh
# Usage:
#   PKG_NAME="@yourscope/awesome-lib" \
#   PKG_DESC="Awesome utilities" \
#   PKG_AUTHOR="Your Name <you@example.com>" \
#   REPO_URL="https://github.com/yourname/awesome-lib" \
#   bash init-npm-package-vite.sh
set -euo pipefail

# ---- Inputs (env vars or defaults) ----
PKG_NAME="${PKG_NAME:-my-new-package}"
PKG_DESC="${PKG_DESC:-A modern TypeScript library.}"
PKG_AUTHOR="${PKG_AUTHOR:-Your Name <you@example.com>}"
REPO_URL="${REPO_URL:-}"            # optional, e.g. https://github.com/user/repo
PKG_DIR="${PKG_DIR:-$PKG_NAME}"     # folder name, can differ from package name
NODE_VER="${NODE_VER:-20}"          # write into .nvmrc
INIT_BRANCH="${INIT_BRANCH:-main}"

echo "Creating package in: $PKG_DIR"
mkdir -p "$PKG_DIR"
cd "$PKG_DIR"

# ---- Git & Node version ----
git init -b "$INIT_BRANCH"
echo "$NODE_VER" > .nvmrc
if command -v nvm >/dev/null 2>&1; then
  nvm install >/dev/null
fi

# ---- npm init & package metadata ----
npm init -y >/dev/null

npm pkg set name="$PKG_NAME"
npm pkg set version="0.1.0"
npm pkg set description="$PKG_DESC"
npm pkg set author="$PKG_AUTHOR"
npm pkg set license="MIT"
npm pkg set type="module"
npm pkg set engines.node=">=18"
npm pkg set sideEffects="false"

# Repo info (if provided)
if [ -n "${REPO_URL}" ]; then
  npm pkg set repository.type="git"
  npm pkg set repository.url="git+$REPO_URL"
  npm pkg set bugs.url="${REPO_URL/github.com/issues}"
  npm pkg set homepage="$REPO_URL#readme"
fi

# Entry points & exports (Vite will build these)
npm pkg set main="dist/index.cjs"
npm pkg set module="dist/index.js"
npm pkg set types="dist/index.d.ts"
npm pkg set exports.'types'="./dist/index.d.ts"
npm pkg set exports.'import'="./dist/index.js"
npm pkg set exports.'require'="./dist/index.cjs"
npm pkg set files='["dist"]'

# If scoped package, default to public publishing
if [[ "$PKG_NAME" == @*/* ]]; then
  npm pkg set publishConfig.access="public"
fi

# ---- Dev dependencies ----
npm install -D \
  typescript \
  vite vite-plugin-dts \
  vitest @vitest/coverage-v8 \
  eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import eslint-config-prettier \
  prettier \
  @changesets/cli

# ---- Config files ----

# .npmrc
cat > .npmrc <<'EOF'
save-exact=true
fund=false
engine-strict=true
EOF

# .gitignore
cat > .gitignore <<'EOF'
dist/
coverage/
node_modules/
npm-debug.log*
yarn-*.log*
pnpm-*.log*
.DS_Store
EOF

# tsconfig.json
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": false,
    "outDir": "dist",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "sourceMap": true
  },
  "include": ["src", "test", "vite.config.ts", "vitest.config.ts"]
}
EOF

# vite.config.ts (library build)
cat > vite.config.ts <<'EOF'
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "node:path";

export default defineConfig({
  build: {
    lib: {
      // Your public entry
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Library",
      // Vite will generate dist/index.js (ESM) + dist/index.cjs (CJS) via Rollup options below
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      formats: ["es", "cjs"]
    },
    sourcemap: true,
    rollupOptions: {
      // Treat deps as external so consumers don't get them bundled
      external: [],
      output: {
        exports: "named"
      }
    }
  },
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist",
      tsconfigPath: "tsconfig.json",
      rollupTypes: true
    })
  ]
});
EOF

# Vitest config
cat > vitest.config.ts <<'EOF'
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      reporter: ["text", "lcov"]
    }
  }
});
EOF

# ESLint config
cat > .eslintrc.cjs <<'EOF'
module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  settings: {
    "import/resolver": { typescript: true }
  },
  rules: {
    "import/order": ["warn", { "newlines-between": "always" }]
  },
  ignorePatterns: ["dist", "node_modules"]
};
EOF

# Prettier config
cat > .prettierrc.json <<'EOF'
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100
}
EOF

# EditorConfig
cat > .editorconfig <<'EOF'
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
EOF

# Source & tests
mkdir -p src test
cat > src/index.ts <<'EOF'
/**
 * Your amazing library starts here!
 */

export function greet(name: string): string {
  return `Hello, ${name}!`;
}
EOF

cat > test/index.test.ts <<'EOF'
import { describe, expect, it } from "vitest";
import { greet } from "../src";

describe("greet", () => {
  it("greets by name", () => {
    expect(greet("World")).toBe("Hello, World!");
  });
});
EOF

# README
cat > README.md <<EOF
# ${PKG_NAME}

${PKG_DESC}

## Install

\`\`\`bash
npm install ${PKG_NAME}
\`\`\`

## Usage

\`\`\`ts
import { greet } from "${PKG_NAME}";
console.log(greet("World"));
\`\`\`

## Scripts

- \`npm run build\` — Vite library build (ESM + CJS) + types
- \`npm run dev\` — watch build
- \`npm test\` — run tests
- \`npm run lint\` — ESLint
- \`npm run format\` — Prettier
- \`npm run typecheck\` — TypeScript type check
- \`npm run release\` — version & publish via Changesets

## License

MIT © ${PKG_AUTHOR}
EOF

# LICENSE (MIT)
CURRENT_YEAR="$(date +%Y)"
cat > LICENSE <<EOF
Copyright (c) ${CURRENT_YEAR} ${PKG_AUTHOR}

This code is proprietary and confidential. Unauthorized copying of this file, via any medium, is strictly prohibited.
All rights reserved.
EOF

# ---- npm scripts ----
npm pkg set scripts.build="vite build"
npm pkg set scripts.dev="vite build --watch"
npm pkg set scripts.test="vitest"
npm pkg set scripts.'test:ci'="vitest run --coverage"
npm pkg set scripts.lint="eslint ."
npm pkg set scripts.format="prettier -w ."
npm pkg set scripts.typecheck="tsc -p tsconfig.json --noEmit"
npm pkg set scripts.prepublishOnly="npm run build && npm run test --silent"
npm pkg set scripts.changeset="changeset"
npm pkg set scripts.release="changeset version && npm i && npm run build && npm publish"

# ---- Changesets ----
npx --yes changeset init >/dev/null

# ---- First build & commit ----
npm run build >/dev/null
git add -A
git commit -m "chore: bootstrap package (vite lib mode)" >/dev/null

echo
echo "✅ Package '$PKG_NAME' is ready in '$PKG_DIR' (Vite library mode)."
echo "Next steps:"
echo "  1) cd $PKG_DIR"
echo "  2) npm login            # if not already"
echo "  3) npm run release      # versions + publish via Changesets"
echo
