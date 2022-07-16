const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors())

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", (req, res) => {
  const postId = randomBytes(4).toString("hex");
  console.log(postId);

  const { title } = req.body;

  posts[postId] = { postId, title };

  res.status(201).send(posts[postId]);
});

app.listen(4000, () => {
  console.log("listening to port 4000");
});
