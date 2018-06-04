# 🐵 survey-monkey-streams

[![Build Status](http://travis-ci.org/aaronjameslang/survey-monkey-streams.svg?branch=master)](//travis-ci.org/aaronjameslang/survey-monkey-streams)
[![Maintainability](http://api.codeclimate.com/v1/badges/8a959084f74b5a86c453/maintainability)](//codeclimate.com/github/aaronjameslang/survey-monkey-streams/maintainability)
[![Known Vulnerabilities](http://snyk.io/test/github/aaronjameslang/survey-monkey-streams/badge.svg)](//snyk.io/test/github/aaronjameslang/survey-monkey-streams)
[![Gitter](http://badges.gitter.im/aaronjameslang/survey-monkey-streams.svg)](//gitter.im/aaronjameslang/survey-monkey-streams)

[![npm version](https://badge.fury.io/js/survey-monkey-streams.svg)](//npmjs.com/package/survey-monkey-streams)
[![node](https://img.shields.io/node/v/survey-monkey-streams.svg)](//travis-ci.org/aaronjameslang/survey-monkey-streams)

Stream the [Survey Monkey API](//developer.surveymonkey.com/api/v3/)

## Why?

  - Paging: We abstract away page handling, allowing you to consume data from beginning to end
  - Backpressure: We won't read faster than you can process the data, keeping memory requirements low

## Usage

```shell
  npm i survey-monkey-streams
```
```js
  import { Reader } from 'survey-monkey-streams';
  const reader = new Reader({
    url: `collectors/${id}/responses`,
    headers: { authorization: `bearer ${token}` }
  })
  reader.on('data', response => {
    console.log(response)
  })
```
```js
  import { SurveysResponsesBulkReader } from 'survey-monkey-streams';
  const reader = new SurveysResponsesBulkReader({
    headers: { authorization: `bearer ${token}` }
  })
  reader.pipe(myDbWriter)
```
Read the [Documentation](//aaronjameslang.com/survey-monkey-streams) for more information (coming soon)
## Links

  - Install from [NPM](//npmjs.com/package/survey-monkey-streams)
  - Read the code on [GitHub](//github.com/aaronjameslang/survey-monkey-streams)
  - Read the [Documentation](//aaronjameslang.com/survey-monkey-streams) (coming soon)
  - Read about the [Node.js Stream API](//nodejs.org/api/stream.html)
  - Read about the [`request`](//npmjs.com/package/request) module
  - Consult the [Survey Monkey API Docs](//developer.surveymonkey.com/api/v3/)

## Contribution

Bug? Feature request? Not sure? [Open an issue!](//github.com/aaronjameslang/survey-monkey-streams/issues/new)

I wrote this to fix a problem I was facing, so it might need stretching to meet your needs. Notably, there is no `Writable` yet.

Pull requests welcome, but please get in touch first. I don't want to waste your time 😁
