import mongoose from "mongoose";
const { Schema, model } = mongoose;

// defines structure of the document
const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: Date,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true }
);

// surround document and allows to communicate. it is imported in the router
// const Book = mongoose.model("Book", bookSchema); // bounded to books/ if collection is not there it is automatically created
// module.exports = Book;
export default model("Book", bookSchema);
