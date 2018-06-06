#! /bin/sh
set -eux

rm -rf dist # Clean
prettier '**/*.{js,json,ts}' --write
tslint --project . --fix || true # Ignore errors until tests pass
eslint           . --fix || true # Ignore errors until tests pass
barrelsby --directory src --delete # Generate index.ts
tsc # Compile
nyc --reporter=lcov mocha # Test with coverage
tslint --project . # Lint ts
eslint           . # lint js
typedoc --out ./dist/doc --mode file
cp package.json README.md ./dist/npm/
npm pack ./dist/npm
mv *.tgz ./dist/
