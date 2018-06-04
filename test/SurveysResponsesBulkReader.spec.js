const ResponsesBulkReader = require("../dist/npm/SurveysResponsesBulkReader")
  .default;
const snap = require("./snap-events");

const TOKEN = process.env.SURVEY_MONKEY_TOKEN;

describe("SurveysResponsesBulkReader", () => {
  it("should read responses", done => {
    const reader = new ResponsesBulkReader({
      headers: { authorization: `bearer ${TOKEN}` },
      qs: { per_page: 5 }
    });
    snap(reader, done);
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
    snap(reader, done);
  });
});
