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
