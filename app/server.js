import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import session from "express-session";

import db from "./db/db.js";
import routes from "./routes/routes.js";
import controllers from "./controllers/controllers.js";
import passport from "./auth/passport.js";

export const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "lemon",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

const PORT = 3001;

export default db
  .then(db => {
    passport(db);
    const dbControllers = controllers(db);
    const router = routes(dbControllers);

    app.use(router);
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("hi");
    });
  });
