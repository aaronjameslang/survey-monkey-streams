const ResponsesBulkReader = require("../dist/SurveysResponsesBulkReader")
  .default;
const assert = require("assert");
const snapshot = require("snap-shot-it");

const TOKEN = process.env.SURVEY_MONKEY_TOKEN;
assert(TOKEN);

describe("SurveysResponsesBulkReader", () => {
  it("should read responses", done => {
    const reader = new ResponsesBulkReader({
      headers: { authorization: `bearer ${TOKEN}` },
      qs: { per_page: 5 }
    });
    const data = [];
    reader.on("data", d => {
      data.push(d);
    });
    reader.on("progress", progress => {
      data.push({ progress });
    });
    reader.on("end", () => {
      snapshot(data);
      done();
    });
    reader.on("error", done);
  });
  it("should read responses since", done => {
    const reader = new ResponsesBulkReader(
      {
        headers: { authorization: `bearer ${TOKEN}` }
      },
      {
        headers: { authorization: `bearer ${TOKEN}` },
        qs: { start_created_at: "2018-05-31T23:27:00+00:00" }
      }
    );
    const data = [];
    reader.on("data", d => {
      data.push(d);
    });
    reader.on("progress", progress => {
      data.push({ progress });
    });
    reader.on("end", () => {
      snapshot(data);
      done();
    });
    reader.on("error", done);
  });
});
