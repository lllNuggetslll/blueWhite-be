import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import db from "./db/db.js";
import routes from "./routes/routes.js";
import controllers from "./controllers/controllers.js";

export const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = 3001;

export default db
  .then(db => {
    const dbControllers = controllers(db);
    const router = routes(dbControllers);

    app.use(router);
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("hi");
    });
  });
