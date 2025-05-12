const cors = require("cors");
const express = require("express");
const imageRouter = require("../routes/image");
const request = require("supertest");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", imageRouter);

jest.mock("../middlewares/authentication", () => ({
  authenticateUser: (req, res, next) => {
    next();
  },
}));

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

test("POST /images create new image", (done) => {
  const newImage = {
    imageName: "Behind the Farmer",
    imageUrl:
      "https://www.pinterest.com/pin/hidden-pictures-worksheet--514747432422979388/",
    itemsData: [
      {
        endX: "0.859",
        endY: "0.368",
        startX: "0.841",
        startY: "0.348",
        centerX: "0.85",
        centerY: "0.36",
        itemName: "Black Single Eye Band",
        itemImageUrl: "https://www.pinterest.com/cathygene99/hidden-pictures/",
      },
      {
        endX: "0.338",
        endY: "0.641",
        startX: "0.307",
        startY: "0.608",
        centerX: "0.322",
        centerY: "0.625",
        itemName: "Yellow Hard Hat",
        itemImageUrl: "https://fi.pinterest.com/lenatvist/search-and-find/",
      },
      {
        endX: "0.832",
        endY: "0.812",
        startX: "0.812",
        startY: "0.784",
        centerX: "0.822",
        centerY: "0.798",
        itemName: "Black Shirt",
        itemImageUrl:
          "https://www.pngkey.com/png/detail/4-43045_black-t-shirt-png-transparent-image-black-shirts.png",
      },
    ],
    published: true,
    sample: true,
  };
  request(app)
    .post("/images")
    .send(newImage)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      if (!("imageName" in res.body)) throw new Error("missing imageName key");
      return done();
    })
    .catch((err) => done(err));
});
