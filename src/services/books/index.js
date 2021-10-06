import express from "express";
import createHttpError from "http-errors";
import BookModel from "../../models/book.js";
import q2m from "query-to-mongo";

const booksRouter = express.Router();

booksRouter.post("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const total = await BookModel.countDocuments(mongoQuery.criteria);
    const newBook = new BookModel(req.body); // here happens validation of the req.body, if it is not ok Mongoose will throw a "ValidationError"
    const { _id } = await newBook.save(); // this is where the interaction with the db/collection happens

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

booksRouter.get("/", async (req, res, next) => {
  try {
    const books = await BookModel.find({ category: req.query.category })
      .limit(10)
      .skip(50)
      .sort({ price: 1 }); // order doesn't matter but mongo applies SORT and then SKIP

    res.send(books);
  } catch (error) {
    next(error);
  }
});

booksRouter.get("/:bookId", async (req, res, next) => {
  try {
    const bookId = req.params.bookId;

    const book = await BookModel.findById(bookId); // similar to findOne, but findOne expects to receive a query as parameter

    if (book) {
      res.send(book);
    } else {
      next(createHttpError(404, `User with id ${bookId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

booksRouter.put("/:bookId", async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    const modifiedBook = await BookModel.findByIdAndUpdate(bookId, req.body, {
      new: true, // returns the modified user
    });

    if (modifiedBook) {
      res.send(modifiedBook);
    } else {
      next(createHttpError(404, `User with id ${bookId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

booksRouter.delete("/:bookId", async (req, res, next) => {
  try {
    const bookId = req.params.bookId;

    const deleteBook = await BookModel.findByIdAndDelete(bookId);

    if (deleteBook) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default booksRouter;
