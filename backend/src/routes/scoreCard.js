import { Router } from "express";
import mongoose from 'mongoose'
import ScoreCard from "../models/ScoreCard";
  

const db = mongoose.connection;
db.on("error", (err) => console.log(err));
const saveScoreCard = async (name, subject, score) => {
    const existing = await ScoreCard.findOne({"name": name, "subject": subject});
    try {
        if (existing) {
            ScoreCard.updateOne({"name": name, "subject": subject}, {"score": score});
            console.log("ScoreCard updated", score);
            return true;
        } 
        const newScoreCard = new ScoreCard({ name, subject, score });
        console.log("Created ScoreCard", newScoreCard);
        newScoreCard.save();
        return false;
    } catch (e) { throw new Error("ScoreCard creation error: " + e); }
};
const deleteDB = async() => {
    try {
        await ScoreCard.deleteMany({});
        console.log("Database deleted");
    } catch (e) { throw new Error("Database deletion failed"); }
};
const queryDB = async(type, str) => {
    try {
        var found;
        if (type == "name") {
            found = await ScoreCard.findOne({name: str});
        } else if (type == "subject") {
            found = await ScoreCard.findOne({subject: str});
        }
        return found;
    } catch (e) { throw new Error("ScoreCard creation error: " + e); }

};

const router = Router();
router.get('/', (req, res) => {
    res.send('Hello, World!');
});
router.delete("/cards", (req, res) =>
{
    deleteDB();
    res.send({message:"Database cleared"});
});
router.post("/card", async (req, res) => {
    saveScoreCard(req.body.name, req.body.subject, req.body.score).then((existing) => {
        if (existing) res.send({message:`Updating (${req.body.name}, ${req.body.subject}, ${req.body.score})`});
        else res.send({message:`"Adding (${req.body.name}, ${req.body.subject}, ${req.body.score})`});
    })
});
router.get("/cards", async (req, res) => {
    if (req.query.queryString == "") {
        console.log("no string");
        return;
    };
    queryDB(req.query.type, req.query.queryString).then((found) => {
        console.log(found);
        if (!found) {
            res.send({messages: false, message: `${req.query.type} (${req.query.queryString}) not found!`});
        } else {
            res.send({messages: [`Found card with ${req.query.type}: (${found.name}, ${found.subject}, ${found.score})`], message: ""});
        }
    })
}); //need to be done
export default router;