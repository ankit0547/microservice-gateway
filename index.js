import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import connectdb from "./src/config/dbConfig.js";
// import options from "./src/swagger/options.js";
// import swaggerUi from "swagger-ui-express";
// import { studentRoute } from "./src/routes/index.js";
import dotenv from "dotenv";
import { setupLogging } from "./utils/Logger/Logger.js";
import { ROUTES, setupProxies } from "./src/routes/Routes.js";
// const { setupLogging } from ''

dotenv.config();

console.log(process.env.PORT);

const PORT = process.env.PORT || 5001;

//Connect to Database
// connectdb();

//Setup App
const app = express();

// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(options, { explorer: true })
// );

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

setupLogging(app);
setupProxies(app, ROUTES);

app.listen(PORT, () => console.log(`server is running at ${PORT} port!!`));
