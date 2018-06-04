const ResponsesBulkReader = require("../dist/npm/ResponsesBulkReader").default;
const snap = require("./snap-events");

const TOKEN = process.env.SURVEY_MONKEY_TOKEN;

describe("ResponsesBulkReader", () => {
  it("should read responses", done => {
    const reader = new ResponsesBulkReader(152299598, {
      headers: { authorization: `bearer ${TOKEN}` }
    });
    snap(reader, done);
  });
});
