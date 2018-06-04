const ResponsesBulkReader = require("../dist/SurveysResponsesBulkReader")
  .default;
const assert = require("assert");
const snapshot = require("snap-shot-it");

const TOKEN = process.env.SURVEY_MONKEY_TOKEN;
assert(TOKEN);

describe("SurveysResponsesBulkReader", function() {
  it("should read responses", function(done) {
    const reader = new ResponsesBulkReader({
      headers: {
        authorization: "bearer " + TOKEN
      }
    });
    const data = [];
    reader.on("data", function(d) {
      data.push(d);
    });
    reader.on("end", function() {
      assert.equal(data.length, 21);
      snapshot(data);
      done();
    });
    reader.on("error", done);
  });
});
