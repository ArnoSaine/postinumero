#!/usr/bin/env bash

rm -rf examples/spa

rsync -av --progress examples/ssr/ examples/spa --exclude node_modules --exclude .compiled-lang

cd examples/spa

sed -i '' 's@const loader@const clientLoader@g' app/*.tsx
sed -i '' 's@const loader@const clientLoader@g' app/**/*.tsx
sed -i '' 's@const loader@const clientLoader@g' app/**/**/*.tsx
sed -i '' 's@const loader@const clientLoader@g' app/**/**/*.tsx
sed -i '' 's@{ loader }@{ clientLoader }@g' app/*.tsx
sed -i '' 's@{ loader }@{ clientLoader }@g' app/**/*.tsx
sed -i '' 's@{ loader }@{ clientLoader }@g' app/**/**/*.tsx
sed -i '' 's@<typeof loader>@<typeof clientLoader>@g' app/*.tsx
sed -i '' 's@<typeof loader>@<typeof clientLoader>@g' app/**/*.tsx
sed -i '' 's@<typeof loader>@<typeof clientLoader>@g' app/**/**/*.tsx
sed -i '' 's@/.compiled-lang@/public/.compiled-lang@g' .gitignore
sed -i '' 's@remix-react-intl-example-ssr@remix-react-intl-example-spa@g' package.json
sed -i '' 's@remix-serve ./build/server/index.js@serve build/client/ --single --listen 3000@g' package.json
sed -i '' 's@"react-dom": "^18.2.0"@"react-dom": "^18.2.0",\n    "serve": "^14.2.3"@g' package.json
sed -i '' 's@ssr: true@ssr: false@g' vite.config.ts
