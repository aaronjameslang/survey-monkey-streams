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
      if (typeof error.body === "string") {
        error.body = error.body.substr(0, 100);
      }
      if (error.headers) {
        error.headers.date = "[REDACTED]";
        error.headers["set-cookie"] = error.headers["set-cookie"].map(s =>
          s
            .split(";")
            .map(s => s.split("=")[0] + "=[REDACTED]")
            .join(";")
        );
        error.headers["sm-request-id"] = "[REDACTED]";
      }
      events.push({ error });
      snapshot(events);
      done();
    });
};
