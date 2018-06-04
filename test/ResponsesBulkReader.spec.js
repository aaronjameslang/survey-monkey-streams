const ResponsesBulkReader = require("../dist/ResponsesBulkReader").default;
const assert = require("assert");
const snapshot = require("snap-shot-it");

const TOKEN = process.env.SURVEY_MONKEY_TOKEN;
assert(TOKEN);

describe("ResponsesBulkReader", () => {
  it("should read responses", done => {
    const reader = new ResponsesBulkReader(152299598, {
      headers: { authorization: `bearer ${TOKEN}` }
    });
    const data = [];
    reader.on("data", d => {
      data.push(d);
    });
    reader.on("end", () => {
      assert.equal(data.length, 16);
      snapshot(data);
      done();
    });
    reader.on("error", done);
  });
});
