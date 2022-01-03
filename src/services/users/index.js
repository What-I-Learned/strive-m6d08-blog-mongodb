import express from "express";
import UserModel from "../../schemas/user.js";
import passport from "passport";
import { JWTAuthenticate } from "../../auth/tokenBasics.js";
import { adminOnlyMiddleware } from "../../auth/admin.js";
import { userAuthMiddleware } from "../../auth/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.send(newUser);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Get email and password from req.body
    const { email, password } = req.body;
    // 2. Verify credentials
    const user = await UserModel.checkCredentials(email, password);
    if (user) {
      console.log(user);
      // 3. If credentials are ok we are going to generate access token
      const accessToken = await JWTAuthenticate(user);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credtials are wrong"));
    }
  } catch (err) {
    next(err);
  }
});

// receives google login request from our FE and redirect them to google
userRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//receives the response from google
userRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      console.log(req.user);
      res.redirect(`http://localhost:3000?accessToken=${req.user.accessToken}`);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get(
  "/facebookLogin",
  passport.authenticate("facebook", { scope: ["profile", "email"] })
);
userRouter.get(
  "/facebookRedirect",
  passport.authenticate("facebook"),
  async (req, res, next) => {
    try {
      console.log(req.user);
    } catch (err) {
      next(err);
    }
  }
);

userRouter.get("/", userAuthMiddleware, async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (err) {
    next(error);
  }
});

userRouter.get("/me", userAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (err) {
    next(error);
  }
});

userRouter.put("/me", userAuthMiddleware, async (req, res, next) => {
  try {
    const modifiedProfile = await UserModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    );

    res.send(modifiedProfile);
  } catch (err) {
    next(error);
  }
});

userRouter.delete("/me", userAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne();

    res.send("deleted");
  } catch (err) {
    next(error);
  }
});

userRouter.get(
  "/:id",
  userAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const users = await UserModel.findById(req.params.id);
      res.send(users);
    } catch (err) {
      next(error);
    }
  }
);

userRouter.post("/logout", userAuthMiddleware, async (req, res, next) => {
  try {
    req.user.accessToken = null;
    await req.user.save();
    res.send();
  } catch (error) {
    next(err);
  }
});

export default userRouter;
