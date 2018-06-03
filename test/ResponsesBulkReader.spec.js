const ResponsesBulkReader = require('../dist/ResponsesBulkReader').default
const assert = require('assert')
const snapshot = require('snap-shot-it')

const TOKEN = process.env.SURVEY_MONKEY_TOKEN
assert(TOKEN)

describe('ResponsesBulkReader', function () {
  it('should read responses', function (done) {
    const reader = new ResponsesBulkReader(152299598, {
      headers: {
        authorization: 'bearer ' + TOKEN
      }
    })
    const data = []
    reader.on('data', function (d) {
      data.push(d)
    })
    reader.on('end', function () {
      snapshot(data)
      done()
    })
    reader.on('error', done)
  })
})
