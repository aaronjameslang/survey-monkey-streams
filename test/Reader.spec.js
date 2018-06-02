const Reader = require('../dist').Reader
const snapshot = require('snap-shot-it')

const TOKEN = process.env.SURVEY_MONKEY_TOKEN
assert(TOKEN)

describe('Reader', function () {
  it('should read surveys', function (done) {
    const reader = new Reader({
      url: 'surveys',
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
  it('should read responses', function (done) {
    const reader = new Reader({
      url: 'surveys/152303468/responses/bulk',
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
  it('should read multiple pages', function (done) {
    const reader = new Reader({
      url: 'surveys/152299598/responses/bulk',
      headers: {
        authorization: 'bearer ' + TOKEN
      },
      qs: {
        per_page: 10
      }
    })
    const data = []
    reader.on('data', function (d) {
      assert.equal(typeof reader.page, 'number')
      if (!data[reader.page]) {
        data[reader.page] = []
      }
      data[reader.page].push(d)
    })
    reader.on('end', function () {
      snapshot(data)
      done()
    })
    reader.on('error', done)
  })
  it('should read empty responses', function (done) {
    const reader = new Reader({
      url: 'surveys/152303492/responses/bulk',
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
