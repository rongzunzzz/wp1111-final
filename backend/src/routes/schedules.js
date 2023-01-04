import { Router } from "express";
import moment from 'moment'
import mongoose from 'mongoose'
import Schedule from "../models/Schedule";
import User from "../models/User";
import Course from "../models/Course";
import Task from "../models/Task";

const defaultCourseName = "非課程";
const defaultTaskName = "not task";
const defaultColor = "#e6f7ff"


const db = mongoose.connection;
db.on("error", (err) => console.log(err));
const getSchedules = async(account) => {
    let schedules = [];
    const user = await User.findOne({"account": account});
    try {
        if (!user) {
            return {
                success: false,
                message: "schedules get failed!",
                schedules: schedules
            }
        }

        for (let i = 0; i < user.allSchedules.length; i++) {
            const scheduleId = user.allSchedules[i];
            const schedule = await Schedule.findById(scheduleId);
            const course = await Course.findById(schedule.courseId);
            var courseName;
            if (!course) {
                courseName = defaultCourseName;
            } else {
                courseName = course.courseName;
            }
            const task = await Task.findById(schedule.taskId);
            var taskName;
            if (!task) {
                taskName = defaultTaskName;
            } else {
                taskName = task.taskName;
            }

            schedules.push({
                scheduleId: scheduleId,
                scheduleName: schedule.scheduleName,
                date: schedule.date,
                courseName: courseName,
                taskName: taskName,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                color: schedule.color
            });
        }

        return {                
            success: true,
            message: "schedules get successfully!",
            schedules: schedules
        }
    } catch(e) {
        throw new Error("User creation error: " + e);
    }
}

const postSchedules = async(account, scheduleName, date, startTime, endTime, isRepeat, courseId, taskId) => {
    let returnValue = {}
    const user = await User.findOne({"account": account});
    const course = await Course.findById(courseId);
    const task = await Task.findById(taskId);
    try {
        if (!user) {
            return {
                success: false,
                message: "schedules post failed: no such user!",
            }
        }
        if (courseId) {
            if (!course) {
                return {
                    success: false,
                    message: "schedules post failed: no such course!",
                }
            }
            var cpos = -1;
            for (let i = 0; i < user.allCourses.length; i++) { 
                if (user.allCourses[i].toString() === courseId) {
                    cpos = i;
                    break;
                }
            }
            if (cpos === -1) {
                return {
                    success: false,
                    message: "schedules post failed: no such course under user!",
                }
            }
        }
        if (taskId) {
            if (!task) {
                return {
                    success: false,
                    message: "schedules post failed: no such task!",
                }
            }
            var tpos = -1;
            for (let i = 0; i < course.tasks.length; i++) {
                if (course.tasks[i].toString() === taskId) {
                    tpos = i;
                    break;
                }
            }
            if (tpos === -1) {
                return {
                    success: false,
                    message: "schedules post failed: no such task under course!",
                }
            }
        }
        var color;
        if (course) {
            color = course.color;
        } else color = defaultColor;
        const startDate = user.startDate;
        const endDate = user.endDate;
        if (!((moment(date).isBetween(startDate, endDate)) || (moment(date).isSame(startDate)) || (moment(date).isSame(endDate)))) {
            return {
                success: false,
                message: `schedules post failed: date is not within user's startDate ${user.startDate} and endDate${user.endDate}!`,
            }
        }        

        if (isRepeat === "no repeat") {
            const newSchedule = new Schedule({scheduleName, date, startTime, endTime, courseId, taskId, color});
            await newSchedule.save().then((schedule) => {
                let allSchedules = user.allSchedules;
                allSchedules.push(schedule._id);
                User.updateOne({"account": account}, {allSchedules}, (err, res) => {
                    if (err) throw err;
                });
            });
            returnValue = {                
                success: true,
                message: "schedules post successfully!",
            }
            return returnValue;
        } else if (isRepeat === "daily") {
            let newSchedules = [];
            for (var d = moment(date).format("YYYY/MM/DD"); 
                 ((moment(d).isBetween(startDate, endDate)) || (moment(d).isSame(startDate)) || (moment(d).isSame(endDate)));
                 d = moment(d).add(1, 'days').format("YYYY/MM/DD")) {
                const newSchedule = new Schedule({scheduleName, "date": d, startTime, endTime, courseId, taskId, color});
                newSchedules.push(newSchedule);
            }
            for (let i = 0; i < newSchedules.length; i++) {
                await newSchedules[i].save().then((schedule) => {
                    let allSchedules = user.allSchedules;
                    allSchedules.push(schedule._id);
                    User.updateOne({"account": account}, {allSchedules}, (err, res) => {
                        if (err) throw err;
                    });
                });
            } 
            returnValue = {                
                success: true,
                message: "schedules post successfully!",
            }
            return returnValue;
        } else if (isRepeat === "weekly") {
            let newSchedules = [];
            for (var d = moment(date).format("YYYY/MM/DD"); 
                 ((moment(d).isBetween(startDate, endDate)) || (moment(d).isSame(startDate)) || (moment(d).isSame(endDate)));
                 d = moment(d).add(7, 'days').format("YYYY/MM/DD")) {
                const newSchedule = new Schedule({scheduleName, "date": d, startTime, endTime, courseId, taskId, color});
                newSchedules.push(newSchedule);
            }
            for (let i = 0; i < newSchedules.length; i++) {
                await newSchedules[i].save().then((schedule) => {
                    let allSchedules = user.allSchedules;
                    allSchedules.push(schedule._id);
                    User.updateOne({"account": account}, {allSchedules}, (err, res) => {
                        if (err) throw err;
                    });
                });
            } 
            returnValue = {                
                success: true,
                message: "schedules post successfully!",
            }
            return returnValue;
        } else {
            returnValue = {
                success: false,
                message: "schedules post successfully!",
            }
        }
    } catch(e) {
        throw new Error("Post schedule error: " + e);
    }

}
const deleteSchedule = async(account, scheduleId) => {
    const user = await User.findOne({"account": account});
    const schedule = await Schedule.findById(scheduleId);
    try {
        if (!user) {
            return {
                success: false,
                message: "schedules delete failed: no such user!",
            }
        }
        if (!schedule) {
            return {
                success: false,
                message: "schedules delete failed: no such schedule!",
            }
        }
        let pos = -1;
        for (let i = 0; i < user.allSchedules.length; i++) {
            const s = user.allSchedules[i];
            if (s.toString() === scheduleId) {
                pos = i;
                break;
            }
        }
        if (pos === -1) {
            return {
                success: false,
                message: "schedules delete failed: schedule is not under the user!",
            }
        }
        let allSchedules = user.allSchedules;
        allSchedules.splice(pos, 1);
        User.updateOne({"account": account}, {"allSchedules": allSchedules},(err, res) => {
            console.log(err)
        });
        Schedule.deleteOne({"_id": scheduleId},(err, res) => {
            console.log(err)
        });
        return {
            success: true,
            message: "schedules delete successfully!",
        }
    } catch (e) {throw new Error("Delete schedule error: " + e);}
}
const updateSchedule = async(account, scheduleId, scheduleName, date, startTime, endTime) => {
    const user = await User.findOne({"account": account});
    const schedule = await Schedule.findById(scheduleId);
    try {
        if (!user) {
            return {
                success: false,
                message: "schedule update failed: no such user!",
            }
        }
        if (!schedule) {
            return {
                success: false,
                message: "schedule update failed: no such schedule!",
            }
        }
        let spos = -1;
        for (let i = 0; i < user.allSchedules.length; i++) {
            const s = user.allSchedules[i];
            if (s.toString() === scheduleId) spos = i;
        }
        if (spos === -1) {
            return {
                success: false,
                message: "schedule update failed: schedule not under the user"
            }
        }
        Schedule.updateOne({"_id": scheduleId}, {"scheduleName": scheduleName, "date": date, 
                                                "startTime": startTime, "endTime": endTime, }, (err, res) => {
            console.log(err)
        })
        return {
            success: true,
            message: "schedule update successfully!"
        }
    } catch(e) {throw new Error("update schedule error: " + e);}
}

const router = Router();
router.get('/', async(req, res) => {
    getSchedules(req.query.account).then((data) => {
        res.send(data);
    })
});
router.post('/', async(req,res) => {
    const account_ = req.body.account;
    const scheduleName_ = req.body.scheduleName;
    const date_ = req.body.date;
    const startTime_ = req.body.startTime;
    const endTime_ = req.body.endTime;
    const isRepeat_ = req.body.isRepeat;
    const courseId_ = req.body.courseId;
    const taskId_ = req.body.taskId;

    postSchedules(account_, scheduleName_, date_, 
                  startTime_, endTime_, isRepeat_,
                  courseId_, taskId_).then((data) => {
        res.send(data);
    })
})
router.post('/delete', async(req, res) => {
    deleteSchedule(req.body.account, req.body.scheduleId).then((data) => {
        res.send(data);
    })
})
router.post('/update', async(req, res) => {
    const body = req.body;
    updateSchedule(body.account, body.scheduleId, body.scheduleName, 
                   body.date, body.startTime, body.endTime, ).then((data) => {
        res.send(data);
    })
})

export default router;