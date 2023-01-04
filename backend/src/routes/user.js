import { Router } from "express";
import mongoose from 'mongoose'
import User from "../models/User";


const defaultNickName = "Bob";
const defaultStartDate = "2022-01-01"
const defaultEndDate = "2022-01-02"
const defaultFirstLogIn = true;
const defaultAllCourses = [];
const defaultShedules = [];

const db = mongoose.connection;
db.on("error", (err) => console.log(err));
const createUser = async (account, password) => {
    const existing = await User.findOne({"account": account}); //是否已經有此 account 存在
    try {
        if (existing) { //如果已經有此 account 存在
            return false;
        } 
        
        const newUser = new User({ nickName: defaultNickName, 
                                   startDate: defaultStartDate, 
                                   endDate: defaultEndDate, 
                                   account, 
                                   password, 
                                   firstLogIn: defaultFirstLogIn, 
                                   allCourses: defaultAllCourses, 
                                   allSchedules: defaultShedules });
        newUser.save();
        return true;
    } catch (e) { throw new Error("User creation error: " + e); }
};
const logIn = async(account, password) => {
    const found = await User.findOne({account: account});
    try {
        if (!found) {
            return {
                success: false,
                message: "Account doesn't exist!",
                firstLogin: defaultFirstLogIn
            }
        }
        if (found.password != password) {
            return {
                success: false,
                message: "Wrong Password!",
                firstLogin: defaultFirstLogIn
            }
        }
        return {
            success: true,
            message: "Log in successfully!",
            firstLogin: found.firstLogIn
        }
    } catch (e) { throw new Error("logIn error: " + e); }
};

const updateUser = async(account, nickName, startDate, endDate) => {
    const found = await User.findOne({account: account});
    try {
        if (!found) {
            return {
                success: false,
                message: "User update failed!"
            }
        }
        User.updateOne({account: account}, 
                       {"nickName": nickName, 
                        "startDate": startDate, 
                        "endDate": endDate, 
                        "firstLogIn": false}, (err, res) => { // 沒有function會錯...?
                            if (err) throw err;
                        });

        return {
            success: true,
            message: "user update successfully!"
        }

    } catch(e) {throw new Error("updateUser error: " + e);}
}
const getUser = async(account) => {
    const found = await User.findOne({account: account});
    try {
        if (!found) {
            return {
                success: false,
                message: "user get failed!",
                userInfo : {
                    nickName: null,
                    startDate: null,
                    endDate: null,
                }
            }
        }
        return {
            success: true,
            message: "user get successfully!",
            userInfo : {
                nickName: found.nickName,
                startDate: found.startDate,
                endDate: found.endDate
            }
        }

    } catch(e) {throw new Error("updateUser error: " + e);}
}


const router = Router();
router.get('/user', (req, res) => {
    getUser(req.query.account).then((data) => {
        res.send(data);
    })
});
router.post("/signUp", async (req, res) => {
    createUser(req.body.account, req.body.password).then((success) => {
        var message;
        if (success) {
            message = "Sign up successfully!";
        } else {
            message = "Sign up failed! Account already exists!";
        }
        res.send({
            success: success,
            message: message
        });
    })
});
router.get("/logIn", async (req, res) => {
    logIn(req.query.account, req.query.password).then((r) => {
        res.send(r);
    })
});
router.post("/user", async (req, res) => {
    updateUser(req.body.account, req.body.nickname, req.body.startDate, req.body.endDate).then((r) => {
        res.send(r);
    })
})

export default router;