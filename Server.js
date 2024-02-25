import express from "express";
import { APP_PORT, DB_URL } from "./config";
const app = express();
import routes from "./Routs";
import errorHandler from "./Middlewer/errorHandling";
import mongoose from "mongoose";
import welcome from "./Routs/WelcomeRout";
app.use(express.json());
import cors from 'cors';

// Database connection
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB connected...");
});

app.use(express.urlencoded({ extended: false }));
app.use(routes);
app.use(welcome);
app.use(errorHandler);
app.use(cors());
app.listen(APP_PORT, () =>
  console.log(`Server listening on Port...${APP_PORT}.`)
);
