const ResponsesBulkReader = require("../dist/SurveysResponsesBulkReader")
  .default;
const assert = require("assert");
const snapshot = require("snap-shot-it");

const TOKEN = process.env.SURVEY_MONKEY_TOKEN;
assert(TOKEN);

describe("SurveysResponsesBulkReader", () => {
  it("should read responses", done => {
    const reader = new ResponsesBulkReader({
      headers: { authorization: `bearer ${TOKEN}` }
    });
    const data = [];
    reader.on("data", d => {
      data.push(d);
    });
    reader.on("end", () => {
      assert.equal(data.length, 21);
      snapshot(data);
      done();
    });
    reader.on("error", done);
  });
});
