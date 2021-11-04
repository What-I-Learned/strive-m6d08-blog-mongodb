import express from "express";
import PostModel from "../../schemas/post.js";
import { adminOnlyMiddleware } from "../../auth/admin.js";
import { userAuthMiddleware } from "../../auth/authMiddleware.js";
import { isPostOwnerOrAdmin } from "../../auth/postOwner.js";

const postRouter = express.Router();

postRouter.get("/", async (req, res, next) => {
  try {
    const posts = await PostModel.find().populate({
      path: "author",
      select: "name surname",
    });
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

postRouter.get("/:id", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.id);
    res.send(post);
  } catch (error) {
    next(error);
  }
});

postRouter.post("/new", userAuthMiddleware, async (req, res, next) => {
  try {
    req.body.author = req.user;

    const newPost = new PostModel(req.body);
    await newPost.save();
    console.log(newPost);

    res.status(201).send(newPost);
    //
  } catch (error) {
    next(error);
  }
});

postRouter.put(
  "/:id",
  userAuthMiddleware,
  isPostOwnerOrAdmin,
  async (req, res, next) => {
    try {
      console.log("owner found");
      const modifiedPost = await PostModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.send(modifiedPost);
    } catch (error) {
      next(error);
    }
  }
);

postRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default postRouter;
