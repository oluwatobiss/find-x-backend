const cors = require("cors");
const express = require("express");
const userRouter = require("../routes/user");
const request = require("supertest");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouter);

let userId = 0;

// Bypass the middleware authentication by replacing the middleware's actual implementation with an explicit module factory function like so: jest.mock(actualMiddleware, moduleFactoryToReplaceTheActualMiddleware)
// Doc: https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options
jest.mock("../middlewares/authentication", () => ({
  authenticateUser: (req, res, next) => {
    // req.user = { id: 0, username: "test", status: "GAMER", iat: 1746798124 }; --> Only required if the next middleware needs any of req.user's properties. Otherwise, it's optional to use.
    next();
  },
}));

test("GET /users serve json response", (done) => {
  request(app)
    .get("/users/?status=ADMIN")
    .expect("Content-Type", /json/)
    .expect(function (res) {
      console.log("=== Custom Assertion Function ===");
      console.log(res.body);
      if (!("lastName" in res.body[0])) throw new Error("missing lastName key");
    })
    .end(function (err, res) {
      if (err) return done(err);
      console.log("=== GET /users Test Passed! ===");
      console.log(res.text);
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
      console.log("=== Custom Assertion Function ===");
      console.log(res.body.id);
      if (!("username" in res.body)) throw new Error("missing username key");
    })
    .then((res) => {
      console.log("=== then() Promise ===");
      const expectedBody = { id: res.body.id, username: "test" };
      console.log(res.body);
      expect(res.body).toEqual(expectedBody);
      console.log("=== POST /users Test Passed! ===");
      userId = res.body.id;
      console.log(res.text);
      console.log(res.body.id);
      console.log(userId);
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
      console.log("=== Custom Assertion Function ===");
      console.log(res.body.id);
      if (res.body.firstName !== "Testing")
        throw new Error("mismatch firstName value");
    })
    .end(function (err, res) {
      if (err) return done(err);
      console.log("=== PUT /users/:id Test Passed! ===");
      console.log(res.text);
      return done();
    });
});
