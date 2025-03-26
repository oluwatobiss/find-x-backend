require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) =>
  res.send(`
    <main style="text-align:center;padding:30px 10vw;">
      <h1>Welcome to the Find X Rest API server!</h1>
      <p>Find X provides RESTful APIs for photo tagging games.</p>
      <h2>What Is a Photo Tagging Game?</h2>
      <p>A photo tagging game (<a href="https://en.wikipedia.org/wiki/Where%27s_Wally%3F">Where's Wally?</a>) presents users with a busy and crowded illustration that contains many different people, objects, or places. The user's task is to find a particular character that is hidden somewhere in the illustration.</p>
      <h2>Find X Showcase</h2>
      <p>These are some of the sites currently using the Find X API:</p>
      <ul style="list-style:none;padding:0;">
        <li style="margin-bottom:10px;"><a href=${process.env.FindX_URI}>Find X Game</a></li>
      </ul>
    </main>
  `)
);

app.listen(port, () =>
  console.log(`Server listening for requests at port: ${port}!`)
);
