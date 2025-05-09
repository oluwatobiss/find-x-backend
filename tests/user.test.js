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

test("GET /users serve json response", (done) => {
  request(app)
    .get("/users")
    .expect("Content-Type", /json/)
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

// test("PUT /users/:id update specified user account", (done) => {
//   request(app)
//     .put(`/users/${userId}`)
//     .send({
//       firstName: "Testing",
//       lastName: "Update",
//     })
//     .expect("Content-Type", /json/)
//     .expect(200)
//     .expect((res) => {
//       console.log("=== Custom Assertion Function ===");
//       console.log(res.body.id);
//       if (res.body.firstName !== "Teting")
//         throw new Error("mismatch firstName value");
//     })
//     .end(function (err, res) {
//       if (err) return done(err);
//       console.log("=== PUT /users/:id Test Passed! ===");
//       console.log(res.text);
//       return done();
//     });
// });

// test("GET /users serves json", (done) => {
//   request(app)
//     .get("/users")
//     .expect("Content-Type", /json/)
//     .expect(function (res) {
//       console.log("=== Custom Assertion Function ===");
//       console.log(res);

//       if (!("firstName" in res.text)) throw new Error("missing firstName key");
//     })
//     .expect(200)
//     .end(function (err, res) {
//       if (err) return done(err);
//       console.log("=== Test Passed! ===");
//       console.log(res.text);
//       return done();
//     });
// });
