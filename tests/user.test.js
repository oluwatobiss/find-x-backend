const cors = require("cors");
const express = require("express");
const userRouter = require("../routes/user");
const leaderRouter = require("../routes/leader");
const request = require("supertest");
const app = express();
let userId = 0;
let leaderId = 0;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouter);
app.use("/leaders", leaderRouter);

// Bypass the middleware authentication by replacing the middleware's actual implementation with an explicit module factory function like so: jest.mock(actualMiddleware, moduleFactoryToReplaceTheActualMiddleware)
// Doc: https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options
jest.mock("../middlewares/authentication", () => ({
  authenticateUser: (req, res, next) => {
    // req.user = { id: 0, username: "test", status: "GAMER", iat: 1746798124 }; --> Only required if the next middleware needs any of req.user's properties. Otherwise, it's optional to use.
    next();
  },
}));

test("GET /users get all users' data", (done) => {
  request(app)
    .get("/users/?status=ADMIN")
    .expect("Content-Type", /json/)
    .expect(function (res) {
      if (!("lastName" in res.body[0])) throw new Error("missing lastName key");
    })
    .end(function (err, res) {
      if (err) return done(err);
      return done();
    });
});

test("POST /users create new user account", (done) => {
  const newUser = {
    firstName: "Test",
    lastName: "Test",
    username: "test",
    email: "test@test.com",
    password: "test",
  };
  request(app)
    .post("/users")
    .send(newUser)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      if (!("username" in res.body)) throw new Error("missing username key");
    })
    .then((res) => {
      const expectedBody = { id: res.body.id, username: "test" };
      expect(res.body).toEqual(expectedBody);
      userId = res.body.id;
      done();
    })
    .catch((err) => done(err));
});

test("PUT /users/:id update specified user account", (done) => {
  request(app)
    .put(`/users/${userId}`)
    .send({
      firstName: "Testing",
      lastName: "Update",
      username: "test",
      email: "test@test.com",
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      if (res.body.firstName !== "Testing")
        throw new Error("mismatch firstName value");
    })
    .end(function (err, res) {
      if (err) return done(err);
      return done();
    });
});

test("GET /leaders get all leaders' data", (done) => {
  request(app)
    .get("/leaders/")
    .expect("Content-Type", /json/)
    .expect(function (res) {
      if (!("time" in res.body[0])) throw new Error("missing time key");
    })
    .end(function (err, res) {
      if (err) return done(err);
      return done();
    });
});

test("POST /leaders create new leader", (done) => {
  const newLeader = { playerId: "test", hours: 0, minutes: 1, seconds: 23 };
  request(app)
    .post("/leaders")
    .send(newLeader)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      if (!("timeSort" in res.body)) throw new Error("missing timeSort key");
    })
    .then((res) => {
      const expectedBody = {
        id: res.body.id,
        date: res.body.date,
        playerId: "test",
        time: "00:01:23",
        timeSort: 123,
      };
      expect(res.body).toEqual(expectedBody);
      leaderId = res.body.id;
      done();
    })
    .catch((err) => done(err));
});

test("DELETE /users/:id delete specified user account", (done) => {
  request(app)
    .delete(`/users/${userId}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      if (res.body.lastName !== "Update")
        throw new Error("mismatch lastName value");
    })
    .end(function (err, res) {
      if (err) return done(err);
      return done();
    });
});
