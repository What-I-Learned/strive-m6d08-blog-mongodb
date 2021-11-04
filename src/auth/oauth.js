import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import UserModel from "../schemas/user.js";
import { JWTAuthenticate } from "./tokenBasics.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3030/users/googleRedirect",
  },
  async (accessToken, googleProfile, passportNext) => {
    try {
      // callback function executed when google gives us a response

      // profile information from google
      console.log(googleProfile);

      // 1. check if user is already in our database
      const user = await UserModel.findOne({ googleId: googleProfile.id });

      if (user) {
        // 2. if user is already there then create a token for him
        const token = await JWTAuthenticate(user);
        passportNext(null, { token });
      } else {
        // add user to our db and create tokens for him with google account
        const newUser = {
          name: googleProfile.name.givenName,
          surname: googleProfile.name.familyName,
          email: googleProfile.emails[0].value,
          googleId: googleProfile.id,
        };

        const createdUser = new UserModel(newUser);
        const savedUser = await createdUser.save();

        const token = await JWTAuthenticate(savedUser);
      }
    } catch (err) {
      passportNext(err);
    }
  }
);

passport.serializeUser(function (data, passportNext) {
  passportNext(null, data); // MANDATORY, otherwise you will receive the "Failed to serialize user into session" error
});

export default googleStrategy;
