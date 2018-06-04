const SurveysReader = require("../dist/npm").SurveysReader;
const snap = require("./snap-events");

const TOKEN = process.env.SURVEY_MONKEY_TOKEN;

describe("SurveysReader", () => {
  it("should read surveys", done => {
    const reader = new SurveysReader({
      headers: { authorization: `bearer ${TOKEN}` }
    });
    snap(reader, done);
  });
});
