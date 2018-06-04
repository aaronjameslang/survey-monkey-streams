const Reader = require("../dist").Reader;
const snap = require("./snap-events");

const TOKEN = process.env.SURVEY_MONKEY_TOKEN;

describe("Reader", () => {
  it("should read surveys", done => {
    const reader = new Reader({
      url: "surveys",
      headers: { authorization: `bearer ${TOKEN}` }
    });
    snap(reader, done);
  });
  it("should read responses", done => {
    const reader = new Reader({
      url: "surveys/152303468/responses/bulk",
      headers: { authorization: `bearer ${TOKEN}` }
    });
    snap(reader, done);
  });
  it("should read multiple pages", done => {
    const reader = new Reader({
      url: "surveys/152299598/responses/bulk",
      headers: { authorization: `bearer ${TOKEN}` },
      qs: { per_page: 10 }
    });
    snap(reader, done);
  });
  it("should read empty responses", done => {
    const reader = new Reader({
      url: "surveys/152303492/responses/bulk",
      headers: { authorization: `bearer ${TOKEN}` }
    });
    snap(reader, done);
  });
});
