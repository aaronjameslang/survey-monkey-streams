const SurveysReader = require('../dist').SurveysReader
const assert = require('assert')
const snapshot = require('snap-shot-it')

const TOKEN = process.env.SURVEY_MONKEY_TOKEN
assert(TOKEN)

describe('SurveysReader', function () {
  it('should read surveys', function (done) {
    const reader = new SurveysReader({
      headers: {
        authorization: 'bearer ' + TOKEN
      }
    })
    const data = []
    reader.on('data', function (d) {
      data.push(d)
    })
    reader.on('end', function () {
      assert.equal(data.length, 4)
      snapshot(data)
      done()
    })
    reader.on('error', done)
  })
})
