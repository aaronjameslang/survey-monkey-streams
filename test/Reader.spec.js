const Reader = require("../dist").Reader;
const assert = require("assert");
const snapshot = require("snap-shot-it");

const TOKEN = process.env.SURVEY_MONKEY_TOKEN;
assert(TOKEN);

describe("Reader", () => {
  it("should read surveys", done => {
    const reader = new Reader({
      url: "surveys",
      headers: { authorization: `bearer ${TOKEN}` }
    });
    const data = [];
    reader.on("data", d => {
      data.push(d);
    });
    reader.on("end", () => {
      snapshot(data);
      done();
    });
    reader.on("error", done);
  });
  it("should read responses", done => {
    const reader = new Reader({
      url: "surveys/152303468/responses/bulk",
      headers: { authorization: `bearer ${TOKEN}` }
    });
    const data = [];
    reader.on("data", d => {
      data.push(d);
    });
    reader.on("end", () => {
      snapshot(data);
      done();
    });
    reader.on("error", done);
  });
  it("should read multiple pages", done => {
    const reader = new Reader({
      url: "surveys/152299598/responses/bulk",
      headers: { authorization: `bearer ${TOKEN}` },
      qs: { per_page: 10 }
    });
    const data = [];
    reader.on("data", d => {
      data.push(d);
    });
    reader.on("page", ({ page }) => {
      data.push({ page });
    });
    reader.on("end", () => {
      snapshot(data);
      done();
    });
    reader.on("error", done);
  });
  it("should read empty responses", done => {
    const reader = new Reader({
      url: "surveys/152303492/responses/bulk",
      headers: { authorization: `bearer ${TOKEN}` }
    });
    const data = [];
    reader.on("data", d => {
      data.push(d);
    });
    reader.on("end", () => {
      snapshot(data);
      done();
    });
    reader.on("error", done);
  });
});
