import { Router } from "express";
import mongoose from 'mongoose'
import Schedule from "../models/Schedule";
import Course from "../models/Course";
import User from "../models/User";
import Task from "../models/Task";


const db = mongoose.connection;
db.on("error", (err) => console.log(err));

const postCourse = async (account, courseName, color) => {
    const user = await User.findOne({"account": account});
    try {
        if (!user) {
            return {
                success: false,
                message: "Courses post failed!",
                courseId: null
            }
        }
        const newCourse = new Course({"courseName": courseName, "tasks": [], "color": color});
        let returnValue = {}
        await newCourse.save().then( (course) => {
            let allCourses = user.allCourses;
            allCourses.push(course._id);
            User.updateOne({"account": account}, {"allCourses": allCourses}, (err, res) => {
                console.log(err)
            }); 
            
            returnValue = {
                success: true,
                message: "Courses post successfully!",
                courseId: course._id
            }
        })
        return returnValue;
        
    } catch(e) {
        throw new Error("Course post error: " + e)
    }
}

const getCourse = async(account) => {
    const user = await User.findOne({"account": account});
    try {
        let courses = [];
        if (!user) {
            return {
                success: false,
                message: "Courses get failed!",
                courses: courses
            }
        }

        for (let i = 0; i < user.allCourses.length; i++) { // forEach is trash
            const courseId = user.allCourses[i];
            const course = await Course.findById(courseId).populate('tasks');
            const course_ = {
                "courseId": course._id, courseName: course.courseName, "tasks": course.tasks, "color": course.color
            }
            courses.push(course_);
        }

        return {
            success: true,
            message: "Courses get successfully!",
            courses: courses
        }
    } catch(e) {
        throw new Error("Course get error: " + e)
    }
}
const deleteCourse = async(account, courseId) => {
    const user = await User.findOne({"account": account});
    try {
        if (!user) {
            return {
                success: false,
                message: "Courses delete failed!: user does not exist",
            }
        }
        let exist = false;
        user.allCourses.forEach(c => {
            if (c.toString() === courseId) {
                exist = true;
            }
        })
        if (!exist) {
            return {
                success: false,
                message: "Courses delete failed!: course is not under user",
            }
        }

        const course = await Course.findById(courseId);
        try {
            if (!course) {
                return {
                    success: false,
                    message: "Courses delete failed!: course does not exist",
                }
            } else {
                // delete all tasks under the course
                for (let i = 0; i < course.tasks.length; i++) {
                    const taskId = course.tasks[i];
                    Task.deleteOne({"_id": taskId}, (err, res) => console.log(err));
                }
                Course.deleteOne({"_id": courseId}, (err, res) => console.log(err));

                let allCourses = user.allCourses;
                for (var i = 0; i < allCourses.length; i++) {
                    if (allCourses[i].toString() === courseId) {
                        allCourses.splice(i, 1);
                    }
                }
                User.updateOne({"account": account}, {"allCourses": allCourses}, (err, res) => console.log(err));
            }
            return {
                success: true,
                message: "Courses delete successfully!"
            }
        } catch(e) { throw new Error("Course delete error: " + e)
    }
    } catch(e) {
        throw new Error("Course delete error: " + e)
    }

}



const router = Router();
router.post('/', async(req, res) => {
    postCourse(req.body.account, req.body.courseName, req.body.color).then((data) => {
        res.send(data);
    })
})
router.get('/', async(req, res) => {
    getCourse(req.query.account).then((data) => {
        res.send(data);
    })
});
router.post('/delete', async(req, res) => {
    deleteCourse(req.body.account, req.body.courseId).then((data) => {
        res.send(data);
    })
})


export default router;