const cors = require("cors");
const express = require("express");
const leaderRouter = require("../routes/leader");
const request = require("supertest");
const app = express();
let leaderId = 0;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/leaders", leaderRouter);

jest.mock("../middlewares/authentication", () => ({
  authenticateUser: (req, res, next) => {
    next();
  },
}));

test("GET /leaders get all leaders' data", (done) => {
  request(app)
    .get("/leaders/")
    .expect("Content-Type", /json/)
    .expect(function (res) {
      console.log("=== Custom Assertion Function ===");
      console.log(res.body[0]);
      if (!("time" in res.body[0])) throw new Error("missing time key");
    })
    .end(function (err, res) {
      if (err) return done(err);
      console.log("=== GET /leaders Test Passed! ===");
      console.log(res.text);
      return done();
    });
});
