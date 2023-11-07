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
require("dotenv").config();

const port = 8085;
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/user/login", (req, res) => {
  try {
    //get email and password from request body
    const { email, password } = req.body;
    //verify user
    const user = verifyUser(email, password);
    //get secret key from .env file
    const secretKey = process.env.SECRET_KEY;
    //create token using secret key
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secretKey as string,
      {
        expiresIn: "2 days",
      }
    );
    //send token and user data as response
    res.json({ result: { user, token } });
    //error handling
  } catch (error) {
    res.status(401).json({ error });
  }
});

app.post("/api/user/validation", (req, res) => {
  try {
    //get token from request header
    const authHeader = req.headers.authorization;
    //parse token
    const token = parseToken(authHeader, res);
    //get secret key from .env file
    const secretKey = process.env.SECRET_KEY;
    //decode token 
    const decodedUser = jwt.verify(token, secretKey as string);
    //find user by id
    const user = findUserById((decodedUser as IDecodedUser).id);
    //send user data as response
    res.json({ result: { user, token } });
    //error handling
  } catch (error) {
    res.status(401).json({ error });
  }
});

app.get("/api/posts", async (req, res) => {
  // Sleep delay 
  await sleep(1500);
  res.json(posts);
});


app.get("/api/posts/:id", async (req, res) => {
  //get the id from request params
  const id = parseInt(req.params.id, 10);
  //find post by id
  const post = posts.find((post) => post.id === id);
  //error handling
  if (!post) {
    res.status(404).json({ error: "Post not found, try again" });
    return;
  }
  // find user email by their userId
  const userEmail = findUserById(post.userId);
  //error handling
  if (!userEmail) {
    res.status(500).json({ error: "User is not found for this post!!!" });
    return;
  }
  // return post data with user email
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

// post request for CreatePostPage
app.post("/api/posts", (req, res) => {
  try {
    //get token from request header
    const authHeader = req.headers.authorization;
    //parse token
    const token = parseToken(authHeader, res);
    //get secret key from .env file
    const secretKey = process.env.SECRET_KEY;
    //verify token
    const decodedUser = jwt.verify(token, secretKey as string);
    //get userId from decoded token
    const userId = (decodedUser as IDecodedUser).id;
    //get post data from request body
    const incomingPost = req.body;

    // Check if the data is valid
    if (
      incomingPost.title &&
      incomingPost.category &&
      incomingPost.image &&
      incomingPost.content
    ) {
      //create new post
      const newPost = { ...incomingPost, userId };
      // add new post pass the userId to the post
      addPost(newPost, userId); 
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: "Post data incorrect, try again!!" });
    }
    //error handling
  } catch (error) {
    res.status(401).json({ error: "You are unauthorized!" });
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
    !incomingPost.title ||
    !incomingPost.category ||
    !incomingPost.content ||
    !incomingPost.image
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
