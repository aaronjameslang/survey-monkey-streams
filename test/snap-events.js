const snapshot = require("snap-shot-it");

module.exports = (reader, done) => {
  const events = [];
  reader
    .on("data", data => {
      events.push(data);
    })
    .on("page", ({ page }, type) => {
      events.push({ page, type });
    })
    .on("progress", progress => {
      events.push({ progress });
    })
    .on("end", () => {
      snapshot(events);
      done();
    })
    .on("error", error => {
      events.push({ error });
      snapshot(events);
      done();
    });
};
