const SurveysReader = require("../dist").SurveysReader;
const assert = require("assert");
const snapshot = require("snap-shot-it");

const TOKEN = process.env.SURVEY_MONKEY_TOKEN;
assert(TOKEN);

describe("SurveysReader", () => {
  it("should read surveys", done => {
    const reader = new SurveysReader({
      headers: { authorization: `bearer ${TOKEN}` }
    });
    const data = [];
    reader.on("data", d => {
      data.push(d);
    });
    reader.on("end", () => {
      assert.equal(data.length, 4);
      snapshot(data);
      done();
    });
    reader.on("error", done);
  });
});
