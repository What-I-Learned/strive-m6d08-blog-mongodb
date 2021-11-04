import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    rate: {
      type: Number,
      min: [1, "Rate must be min 1"],
      max: [5, "Rate can be max 5"],
      default: 5,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Authors",
    },
  },
  { timestamps: true }
);

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    text: { type: String, required: true },
    comments: { default: [], type: [CommentSchema] },
  },
  { timeStamps: true }
);

// PostSchema.pre("save", async function (next) {
//   try {
//     const authorExists = await Authors.findById(this.author._id);
//     if (authorExists) {
//       next();
//     } else {
//       const error = new Error("this author does not exist");
//       error.status = 400;
//       next(error);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

export default model("Post", PostSchema);
