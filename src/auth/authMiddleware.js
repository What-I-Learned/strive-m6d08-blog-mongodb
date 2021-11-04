import createHttpError from "http-errors";
import { verifyJWT } from "../auth/tokenBasics.js";
import UserModel from "../schemas/user.js";

export const userAuthMiddleware = async (req, res, next) => {
  // 1. Check if Authorization header is received, if it is not --> trigger an error (401)
  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "Please provide your credentials in Authorization header"
      )
    );
    // 2. If we have received the Authorization header we will need to extract the credentials from it (which is base64 encoded, therefore we should translate it obtaining normal text)
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");

      // 3. Verify the token, if everything goes fine we are getting back the _id of the logged in user, otherwise an error will be thrown by jwt libr
      const decodedToken = await verifyJWT(token);

      console.log("DECODED TOKEN ", decodedToken);

      // 4. Find the user in db and attach him/her to the request object
      const user = await UserModel.findById(decodedToken._id);

      console.log("this is coming from middleware" + user);

      if (user) {
        // 4. If the credentials were ok we can proceed to what is next (another middleware, route handler)
        req.user = user; // we are attaching to the request the user document
        next();
      } else {
        // credentials problems --> user was null
        next(createHttpError(404, "use is not found"));
      }
    } catch (err) {
      next(createHttpError(401, "token not valid"));
    }
  }
};
