import createHttpError from "http-errors";
import PostSchema from "../schemas/post.js";

export const isPostOwnerOrAdmin = async (req, res, next) => {
  try {
    const post = await PostSchema.findById(req.params.id);
    if (post) {
      console.log(post.author);
      if (
        post.author.toString() === req.user._id.toString() ||
        req.user.role === "Admin"
      ) {
        next();
      } else {
        next(createHttpError(403));
      }
    } else {
      next(createHttpError(404));
    }
  } catch (err) {
    next(err);
  }
};
