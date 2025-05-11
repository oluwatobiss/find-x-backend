const cors = require("cors");
const express = require("express");
const imageRouter = require("../routes/image");
const request = require("supertest");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", imageRouter);

test("GET /images get all images' data", (done) => {
  request(app)
    .get("/images/")
    .expect("Content-Type", /json/)
    .expect(function (res) {
      console.log("=== Custom Assertion Function ===");
      console.log(res.body);
      if (!("sample" in res.body[0])) throw new Error("missing sample key");
    })
    .end(function (err, res) {
      if (err) return done(err);
      console.log("=== GET /images Test Passed! ===");
      console.log(res.text);
      return done();
    });
});
