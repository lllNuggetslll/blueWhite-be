import passport from "passport";
import LocalStrategy from "passport-local";

import { validatePassword } from "./auth.js";

export default db =>
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      (email, password, done) => {
        const user = db
          .get("users")
          .find({ email })
          .value();

        if (!user)
          return done(null, false, { error: "This User doesn't Exist" });

        const { salt, password: hashedPassword } = user;

        if (!validatePassword(password, salt, hashedPassword))
          return done(null, false, { error: "Incorrect password" });

        return done(null, user);
      }
    )
  );
