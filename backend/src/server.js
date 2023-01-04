import express from 'express';
import bodyParser from 'body-parser';
import db from "./db"
import routes from "./routes/index"
import cors from "cors"
import path from 'path';


const app = express();

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV !== "production") {
    app.use(cors());    
}
app.use(bodyParser.json());

// define routes
app.use("/", routes);

if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "../frontend", "build")));
    app.get("/*", function (req, res) {
        res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
    });
}

// connect DB
db.connect();

// listen
app.listen(port, () =>
     console.log(`Listening on port ${port}!`),
);







