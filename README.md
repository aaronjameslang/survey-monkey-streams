# 🐵 survey-monkey-streams

[![Build Status](https://travis-ci.org/aaronjameslang/survey-monkey-streams.svg?branch=master)](https://travis-ci.org/aaronjameslang/survey-monkey-streams)
[![Maintainability](https://api.codeclimate.com/v1/badges/8a959084f74b5a86c453/maintainability)](https://codeclimate.com/github/aaronjameslang/survey-monkey-streams/maintainability)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](aaronjameslang/survey-monkey-streams)

Stream the [Survey Monkey API](//developer.surveymonkey.com/api/v3/)

## Why?

  - Paging: We abstract away page handling, allowing you to consume data from beginning to end
  - Backpressure: We won't read faster than you can process the data, keeping memory requirements low


## Contribution

Bug? Feature request? Not sure? [Open an issue!](//github.com/aaronjameslang/survey-monkey-streams/issues/new)

I wrote this to fix a problem I was facing, so it might need stretching to meet your needs. Notably, there is no `Writable` yet.

Pull requests welcome, but please get in touch first. I don't want to waste your time 😁
