import { Router } from "express";
import mongoose from 'mongoose'
import Task from "../models/Task";
import User from "../models/User"
import Course from "../models/Course";
import { postSchedules as addSchedule } from "./schedules"
import Schedule from "../models/Schedule";
import moment from "moment"
  
const defaultStatus = false;

const db = mongoose.connection;
db.on("error", (err) => console.log(err));



const isLap = (occupiedTimes, date, startTime, length, scheduleSpace) => {
    // console.log(occupiedTimes)
    for (let i = 0; i < occupiedTimes.length; i++) {
        const occupiedTime = occupiedTimes[i];
        if (!moment(occupiedTime.date).isSame(date)) continue;
        //將scheduleSpace的間隔加上去
        const os = startTime - scheduleSpace;
        if (os < 0) os = 0;
        const oe = startTime + length + scheduleSpace;
        if (oe > 24) oe = 24;
        return (occupiedTime.startTime < oe) && (occupiedTime.endTime > os);
    }
    return false;
}
const autoAddSchedule = async(account, scheduleName, courseId, taskId) => {
    const initscheduleLength = 3;//設定初始每次schedule只能有3小時
    const initscheduleSpace = 3;//設定初始每個schedule間的間隔有3小時
    const today_ = new Date();
    let today = moment(today_).format("YYYY/MM/DD");
    today = moment(today).add(1, "days")
    const user = await User.findOne({"account": account});
    const task = await Task.findById(taskId);
    const course = await Course.findById(courseId);
    try {
        const scheduleIds = user.allSchedules;
        var unfinished = task.time; //這個task還有多少時間沒被完成
        console.log("first: "+unfinished)
        var occupiedTimes = [] //紀錄被占用過的時間 
        const dueDate = task.dueDate;
        for (let i = 0; i < scheduleIds.length; i++) {//先將在日期範圍內的schedule取出來
            const schedule = await Schedule.findById(scheduleIds[i]);
            // console.log(schedule)
            if (moment(schedule.date).isBefore(today) || moment(schedule.date).isAfter(dueDate)) {
                continue;
            }
            occupiedTimes.push({
                date: schedule.date,
                startTime: schedule.startTime,
                endTime: schedule.endTime
            })
        }
        // console.log(occupiedTimes)
        var newScheduleList = [];
        //找在現在時間到task結束之前當天全空的最近的早上八點
        for (let d = today; (!moment(d).isAfter(dueDate)) && (unfinished > 0); d = moment(d).add(1, 'days').format("YYYY/MM/DD")) {
            const st = 8; //早上八點
            var length = unfinished; //現在要填入的schedule時長
            if (initscheduleLength < unfinished) length = initscheduleLength;
            var pass = true;
            for (let i = 0; i < occupiedTimes.length; i++) {
                const occupiedTime = occupiedTimes[i];
                pass = !moment(d).isSame(occupiedTime.date);
            }
            if (pass) {
                console.log("pass: "+ pass)
                console.log("d: "+ d)
                const newSchedule = new Schedule({ scheduleName: scheduleName, 
                                                   date: d, 
                                                   startTime: st, 
                                                   endTime: st + length, 
                                                   courseId: courseId,
                                                   taskId: taskId,
                                                   color: course.color, });
                newScheduleList.push(newSchedule);
                occupiedTimes.push({
                    date: d,
                    startTime: st,
                    endTime: st + length
                });
                unfinished -= length;
            }
        }
        for (var scheduleSpace = initscheduleSpace ; (scheduleSpace >= 0) && (unfinished > 0); scheduleSpace--) { //間隔時間遞減
            for (var scheduleLength = initscheduleLength; (scheduleLength > 0) && (unfinished > 0); scheduleLength--) { //每段schedule時間遞減
                //找在現在時間到task結束之前早上八點到晚上十點之間最近的空時間，滿足scheduleSpace
                for (let d = today; (!moment(d).isAfter(dueDate)) && (unfinished > 0); d = moment(d).add(1, 'days').format("YYYY/MM/DD")) {
                    const initSt = 8; //早上八點
                    const et = 20; //晚上十點
                    for (var st = initSt; (st <= et - length) && (unfinished > 0); st++) {
                        var length = unfinished; //現在要填入的schedule時長
                        if (scheduleLength < unfinished) length = scheduleLength;
                        var pass = !isLap(occupiedTimes, d, st, length, scheduleSpace);
                        if (pass) {
                            const newSchedule = new Schedule({ scheduleName: scheduleName, 
                                                                date: d, 
                                                                startTime: st, 
                                                                endTime: st + length, 
                                                                courseId: courseId,
                                                                taskId: taskId,
                                                                color: course.color, });
                            newScheduleList.push(newSchedule);
                            occupiedTimes.push({
                                date: d,
                                startTime: st,
                                endTime: st + length
                            });
                            unfinished -= length;
                            st += length + scheduleSpace - 1;
                        }
                    }

                }
            }
        }
        for (var scheduleSpace = initscheduleSpace ; (scheduleSpace >= 0) && (unfinished > 0); scheduleSpace--) { //間隔時間遞減
            for (var scheduleLength = initscheduleLength; (scheduleLength > 0) && (unfinished > 0); scheduleLength--) { //每段schedule時間遞減
                //找在現在時間到task結束之前最近的空時間，滿足scheduleSpace
                for (let d = today; (!moment(d).isAfter(dueDate)) && (unfinished > 0); d = moment(d).add(1, 'days').format("YYYY/MM/DD")) {
                    const initSt = 0; //早上0點
                    const et = 24; //晚上12點
                    for (var st = initSt; (st <= et - length) && (unfinished > 0); st++) {
                        var length = unfinished; //現在要填入的schedule時長
                        if (scheduleLength < unfinished) length = scheduleLength;
                        var pass = !isLap(occupiedTimes, d, st, length, scheduleSpace);
                        if (pass) {
                            const newSchedule = new Schedule({ scheduleName: scheduleName, 
                                                                date: d, 
                                                                startTime: st, 
                                                                endTime: st + length, 
                                                                courseId: courseId,
                                                                taskId: taskId,
                                                                color: course.color, });
                            newScheduleList.push(newSchedule);
                            occupiedTimes.push({
                                date: d,
                                startTime: st,
                                endTime: st + length
                            });
                            unfinished -= length;
                            st += length + scheduleSpace - 1;
                        }
                    }

                }
            }
        }
        if (unfinished != 0) return false;
        // console.log(newScheduleList)
        for (let i = 0; i < newScheduleList.length; i++) {
            const schedule = newScheduleList[i];
            const newSchedule = new Schedule({  scheduleName: schedule.scheduleName, 
                                                date: schedule.date, 
                                                startTime: schedule.startTime, 
                                                endTime: schedule.endTime, 
                                                courseId: schedule.courseId,
                                                taskId: schedule.taskId,
                                                color: schedule.color, })
            newSchedule.save().then((schedule) => {
                console.log(schedule)
                let allSchedules = user.allSchedules;
                allSchedules.push(schedule._id);
                User.updateOne({"account": account}, {allSchedules}, (err, res) => {
                    if (err) throw err;
                });
            });
            // addSchedule(account, 
            //                   schedule.scheduleName, 
            //                   schedule.date, 
            //                   schedule.startTime, 
            //                   schedule.endTime, 
            //                   "no repeat", 
            //                   schedule.courseId, 
            //                   schedule.taskId);
            // await schedule.save()
        }
        console.log("second: "+unfinished)
        return true;
    } catch (e) {
        console.log(e)
    }
}

const postTask =  async(account, courseId, dueDate, taskName, type, time) => {
    const user = await User.findOne({"account": account});
    const course = await Course.findById(courseId);
    try {
        if (!user) {
            return {
                success: false,
                message: "Task post failed: no such user!",
                taskId: null
            }
        }
        if (!course) {
            return {
                success: false,
                message: "Task post failed: no such course!",
                taskId: null
            }
        }
        //檢查course是不是user的

        const newTask = new Task({ taskName, dueDate, status: defaultStatus, type, time});
        let returnValue = {}
        await newTask.save().then( async (task) => {
            let courseTasks = course.tasks;
            courseTasks.push(task._id);
            await Course.updateOne({"_id": courseId}, {tasks: courseTasks}, (err, res) => {
                console.log(err)
            }).clone();

            returnValue = {
                success: true,
                message: "Task post successfully!",
                taskId: task._id
            }
            const autoReturn = await autoAddSchedule(account, `${taskName}_schedule`, courseId, returnValue.taskId);
            if (!autoReturn) {
                returnValue.message = "Task post successfully! autoAddTask failed";
            }

            
        })
        return returnValue;

    } catch(e) {
        throw new Error("Task post error: " + e)
    }

}
const deleteTask = async(account, taskId) => {
    const user = await User.findOne({"account": account});
    const task = await Task.findById(taskId);
    try {
        if (!user) {
            return {
                success: false,
                message: "Task delete failed: no such user!",
            }
        }
        if (!task) {
            return {
                success: false,
                message: "Task delete failed: no such task!",
            }
        }

        let isTheUsersTask = false;
        var course;
        var courseId;

        for (let i = 0; i < user.allCourses.length; i++) {
            const ci = user.allCourses[i];
            const c = await Course.findById(ci);
            for (let j = 0; j < c.tasks.length; j++) {
                const t = c.tasks[j];
                if (t == taskId) {
                    course = c;
                    courseId = ci;
                    isTheUsersTask = true;
                }
            }
        }
        if (!isTheUsersTask) {
            return {
                success: false,
                message: "Task delete failed: the task is not under the user",
            }
        }
        let courseTasks = course.tasks;
        for (var i = 0; i < course.tasks.length; i++) {
            if (taskId === course.tasks[i].toString()) {
                courseTasks.splice(i, 1);
            }
        }

        Course.updateOne({ "_id": courseId }, {"tasks": courseTasks}, (err, res) => {
            console.log(err)
        });

        Task.deleteOne({ "_id": taskId }, (err, res) => {
            console.log(err)
        });
        
        return {
            success: true,
            message: "Task delete successfully!"
        }
    } catch(e) {
        throw new Error("Task delete error: " + e);
    }
}
const updateStatus = async(account, taskId, status) => {
    const user = await User.findOne({"account": account});
    const task = await Task.findById(taskId);

    try {
        if (!user) {
            return {
                success: false,
                message: "status update failed!: user does not exist",
            }
        }
        if (!task) {
            return {
                success: false,
                message: "status update failed: no such task!",
            }
        }

        let isTheUsersTask = false;

        for (let i = 0; i < user.allCourses.length; i++) {
            const ci = user.allCourses[i];
            const c = await Course.findById(ci);
            for (let j = 0; j < c.tasks.length; j++) {
                const t = c.tasks[j];
                if (t.toString() === taskId) {
                    isTheUsersTask = true;
                }
            }
        }
        if (!isTheUsersTask) {
            return {
                success: false,
                message: "status update failed: the task is not under the user",
            }
        }
        Task.updateOne({ "_id": taskId }, {"status": status}, (err, res) => {
            console.log(err)
        });
        return {
            success: true,
            message: "status update true!",
        }
    } catch (e) {throw new Error("status update error: " + e);}
}

const router = Router();
router.post('/', async(req, res) =>{
    postTask(req.body.account, req.body.courseId, req.body.dueDate, req.body.taskName, req.body.type, req.body.time).then((data) => {
        res.send(data);
    });
});
router.post('/delete', async(req, res) => {
    deleteTask(req.body.account, req.body.taskId).then((data) => {
        res.send(data);
    })
});
router.post('/Status', async(req, res) => {
    updateStatus(req.body.account, req.body.taskId, req.body.status).then((data) => {
        res.send(data);
    })
})
export default router;