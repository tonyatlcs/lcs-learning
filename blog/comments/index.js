const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

// A GET request for retrieving comments
// Retrieves all comments associated with the given comment Id.

/**
 * req (request object): GET request to server to get a comment associated to a Post ID
 * res (result object): Server sends back the requested comment by Post ID.
 */
app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// A POST request for making comments
// This creates a comment associated with the given post Id

/**
 * req (request object): POST request to send a comment from front-end to the server
 * res (result object): sends the user generated comment to the server.
 */
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({
    id: commentId,
    content,
  });

  commentsByPostId[req.params.id] = comments;
  
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id
    }
  })

  res.status(201).send(comments);
});

app.post('/events', (req, res) => {
  console.log('received event', req.body.type);

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on port 4001");
});
