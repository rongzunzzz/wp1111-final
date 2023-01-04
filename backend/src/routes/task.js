import { Router } from "express";
import mongoose from 'mongoose'
import Task from "../models/Task";
import User from "../models/User"
import Course from "../models/Course";
  
const defaultStatus = false;

const db = mongoose.connection;
db.on("error", (err) => console.log(err));

const postTask =  async(account, courseId, dueDate, taskName, type) => {
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

        const newTask = new Task({ taskName, dueDate, status: defaultStatus, type });
        let returnValue = {}
        await newTask.save().then((task) => {
            let courseTasks = course.tasks;
            courseTasks.push(task._id);
            Course.updateOne({"_id": courseId}, {tasks: courseTasks}, (err, res) => {
                console.log(err)
            });

            returnValue = {
                success: true,
                message: "Task post successfully!",
                taskId: task._id
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
    postTask(req.body.account, req.body.courseId, req.body.dueDate, req.body.taskName, req.body.type).then((data) => {
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