import mongoose from "mongoose";
const { Model, Schema } = mongoose;

// defines structure of the document
const bookSchema = newSchema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true }
);

// surround document and allows to communicate. it is imported in the router
const Book = mongoose.model("Book", bookSchema); // bounded to books/ if collection is not there it is automatically created
module.export = Book;
