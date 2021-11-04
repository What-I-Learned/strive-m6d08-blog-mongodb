import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} from "./errorHandlers/errorHandlers.js";
import usersRouter from "./services/users/index.js";
import postRouter from "./services/posts/index.js";

const server = express();

const { PORT = 5000 } = process.env;

server.use(cors());

server.use(express.json());

server.use("/posts", postRouter);
server.use("/users", usersRouter);
// mongoose
//   .connect(process.env.MONGODB, {})
//   .then((result) => {
//     server.listen(PORT);
//     console.log("connected");
//   })
//   .catch((err) => console.log(err));

server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);
server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(genericErrorHandler);

server.listen(PORT, async () => {
  // connect to mongoose Server
  mongoose.connect(process.env.MONGODB, {});
  console.log(`Server is listening on port ${PORT}`);
});

server.on("error", (error) => {
  console.log("Server is stoppped ", error);
});
