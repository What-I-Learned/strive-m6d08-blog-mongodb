import express from "express";
import createHttpError from "http-errors";
import CommentModel from "../../models/comment.js";

const commentsRouter = express.Router();
