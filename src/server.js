import express from "express";
import cors from "cors";
import mongoose from "mongoose";
const server = express();

const { PORT = 5000 } = process.env;

server.use(cors());

server.use(express.json());

// mongoose
//   .connect(process.env.MONGODB, {})
//   .then((result) => {
//     server.listen(PORT);
//     console.log("connected");
//   })
//   .catch((err) => console.log(err));

server.listen(PORT, async () => {
  // connect to mongoose Server
  mongoose.connect(process.env.MONGODB, {});
  console.log(`Server is listening on port ${PORT}`);
});

server.on("error", (error) => {
  console.log("Server is stoppped ", error);
});
