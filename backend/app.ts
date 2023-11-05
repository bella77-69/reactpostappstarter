import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import {
  findUserById,
  IDecodedUser,
  verifyUser,
  parseToken,
  addPost,
  posts,
  sleep,
} from "./fakedb";

const port = 8085;
const app = express();
app.use(cors());
app.use(express.json());

// TODO: Obviously use a more secure signing key than "secret"
app.post("/api/user/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const user = verifyUser(email, password);
    const token = jwt.sign({ id: user.id, email: user.email }, "secret", {
      expiresIn: "2 days",
    });
    res.json({ result: { user, token } });
  } catch (error) {
    res.status(401).json({ error });
  }
});

app.post("/api/user/validation", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = parseToken(authHeader, res);
    const decodedUser = jwt.verify(token, "secret");
    const user = findUserById((decodedUser as IDecodedUser).id);
    res.json({ result: { user, token } });
  } catch (error) {
    res.status(401).json({ error });
  }
});

app.get("/api/posts", async (req, res) => {
  // Sleep delay goes here
  await sleep(1000);

  res.json(posts);
});

// ⭐️ TODO: Implement this yourself
app.get("/api/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  // The line below should be fixed.
  // res.json(posts[0]);
  const post = posts.find((post) => post.id === id);

  if (!post) {
    res.status(404).json({ error: "Post not found, try again" });
    return;
  }
  // find user email by id
  const userEmail = findUserById(post.userId);
  if (!userEmail) {
    res.status(500).json({ error: "User is not found for this post!!!" });
    return;
  }
  // return post with user email
  res.json({ ...post, email: userEmail });
});
/**
 * Problems with this:
 * (1) Authorization Issues:
 *     What if you make a request to this route WITHOUT a token?
 *     What if you make a request to this route WITH a token but
 *     it's invalid/expired?
 * (2) Server-Side Validation Issues:
 *     What if you make a request to this route with a valid token but
 *     with an empty/incorrect payload (post)
 */

// ⭐️ TODO: add current logged in users id to the post (Token )
app.post("/api/posts", (req, res) => {
  const incomingPost = req.body;
  // Check if the data posted is valid
  if (
    incomingPost.title === "" ||
    incomingPost.category === "" ||
    incomingPost.content === "" ||
    incomingPost.image === "" ||
    incomingPost.userId === undefined
  ) {
    addPost(incomingPost);
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: "Post data incorrect, try again!!" });
  }
});

// put request for EditPostPage
app.put("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const incomingPost = req.body;
  const post = posts.find((post) => post.id === id);

  if (!post) {
    res.status(404).json({ error: "Post not found, try again" });
    return;
  }
  // Check if the data posted is valid
  if (
    incomingPost.title === "" ||
    incomingPost.category === "" ||
    incomingPost.content === "" ||
    incomingPost.image === ""
  ) {
    res.status(400).json({ error: "Post data incorrect, try again!!" });
    return;
  }
  // update post properties that were changed in the request
  if (incomingPost.title) {
    post.title = incomingPost.title;
  }
  if (incomingPost.category) {
    post.category = incomingPost.category;
  }
  if (incomingPost.content) {
    post.content = incomingPost.content;
  }
  if (incomingPost.image) {
    post.image = incomingPost.image;
  }

  res.json({ success: true });
});

app.listen(port, () => console.log("Server is running"));
