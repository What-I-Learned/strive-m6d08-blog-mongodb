import express from "express";
import createHttpError from "http-errors";
import CommentModel from "../../schemas/comment.js";

const commentsRouter = express.Router();
