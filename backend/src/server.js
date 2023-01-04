import express from 'express';
import bodyParser from 'body-parser';
import db from "./db"
import routes from "./routes/index"
import cors from "cors"


const app = express();
app.use(cors())
db.connect();
const port = process.env.PORT || 4000;
app.use(bodyParser.json());
app.use("/", routes);
app.listen(port, () =>
     console.log(`Example app listening on port ${port}!`),
);








