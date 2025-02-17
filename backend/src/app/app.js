import { ResHandler } from "../utils/custom-response/response-handler.js";
import router from "../routes/index.js";
import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false,
  })
);

app.get("/", (req, res) => {
  return res.json("Your blogpost project is working");
});

app.use("/v1/api", router);
app.use(ResHandler);

export { app };
