#!/usr/bin/env bash

rm -rf src/.client

rsync -av --progress src/.server/ src/.client

cd src/.client

sed -i '' 's|@remix-run/node|@remix-run/react|g' **/*
sed -i '' 's|Action|ClientAction|g' **/*
sed -i '' 's|Loader|ClientLoader|g' **/*
sed -i '' 's|action|clientAction|g' **/*
sed -i '' 's|loader|clientLoader|g' **/*
sed -i '' 's|server|client|g' **/*
sed -i '' 's|session|localStorage|g' **/*
sed -i '' 's|localStorage: () => |localStorage: () =>\n    |g' **/*
sed -i '' 's|{ ClientActionFunctionArgs, ClientLoaderFunctionArgs }|{\n  ClientActionFunctionArgs,\n  ClientLoaderFunctionArgs,\n}|g' **/*

cd ../..

rm -rf examples/spa

rsync -av --progress examples/ssr/ examples/spa --exclude node_modules --exclude .compiled-lang

cd examples/spa

sed -i '' 's|Loader|ClientLoader|g' app/**/**/*.tsx
sed -i '' 's|action|clientAction|g' app/*.tsx
sed -i '' 's|loader|clientLoader|g' app/*.tsx
sed -i '' 's|loader|clientLoader|g' app/**/*.tsx
sed -i '' 's|loader|clientLoader|g' app/**/**/*.tsx
 
sed -i '' 's|import { ClientLoaderFunctionArgs } from "@remix-run/node";||g' app/**/**/*.tsx
sed -i '' 's|{ Outlet }|{ ClientLoaderFunctionArgs, Outlet }|g' app/routes/other/route.tsx
sed -i '' 's|/.compiled-lang|/public/.compiled-lang|g' .gitignore
sed -i '' 's|remix-react-intl-example-ssr|remix-react-intl-example-spa|g' package.json
sed -i '' 's|remix-serve ./build/server/index.js|serve build/client/ --single --listen 3000|g' package.json
sed -i '' 's|"react-dom": "^18.2.0"|"react-dom": "^18.2.0",\n    "serve": "^14.2.3"|g' package.json
sed -i '' 's|ssr: true|ssr: false|g' vite.config.ts
