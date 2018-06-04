#! /bin/sh
set -eux

rm -rf dist # Clean
tslint --project . --fix || true # Ignore errors until tests pass
eslint           . --fix || true # Ignore errors until tests pass
prettier '**/*.{js,json,ts}' --write
barrelsby --directory src --delete # Generate index.ts
tsc # Compile
mocha # Test
tslint --project . # Lint ts
eslint           . # lint js
typedoc --out ./dist/doc --mode file
cp package.json README.md ./dist/npm/
npm pack ./dist/npm
mv *.tgz ./dist/
