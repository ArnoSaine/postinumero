#!/usr/bin/env bash

rm -rf examples/spa

rsync -av --progress examples/ssr/ examples/spa --exclude node_modules

cd examples/spa

sed -i '' 's|Action|ClientAction|g' app/*.tsx
sed -i '' 's|action|clientAction|g' app/*.tsx

sed -i '' 's|ssr|spa|g' package.json
sed -i '' 's|"start": "react-router-serve ./build/server/index.js"|"preview": "vite preview"|g' package.json
sed -i '' 's|ssr: true|ssr: false|g' react-router.config.ts
