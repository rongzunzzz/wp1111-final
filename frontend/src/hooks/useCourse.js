import { containerClasses } from "@mui/system";
import { createContext, useContext, useEffect, useState } from "react";
import moment from "moment";

const CourseContext = createContext({    
    taskTypeList: [],
    allTasks: [],
    allCourses: [],

    setAllCourses: () => {},

    addCourse: () => {},
    deleteCourse: () => {},

    addCourseTask: () => {},
    deleteCourseTask: () => {}, 
    changeCourseTaskStatus: () => {},
});

const makeCourse = (courseId, courseName, color) => ({
    courseId: courseId, 
    courseName: courseName, 
    color: color,
    tasks: [],
})

const makeTask = (taskId, taskName, dueDate, type, time) => ({
    _id: taskId, 
    taskName: taskName, 
    dueDate: dueDate, 
    status: false, 
    type: type,
    time: time,
})

const CourseProvider = (props) => {

    const taskTypeList = ['exam', 'quiz', 'project', 'hw']

    const [allCourses, setAllCourses] = useState([]); // courses of this user
    const [allTasks, setAllTasks] = useState([]); // tasks

    const addCourse = (courseId, courseName, color) => {
        const newCourse = makeCourse(courseId, courseName, color)
        setAllCourses([...allCourses, newCourse]);
    }

    const deleteCourse = (cName) => {
        let newCourses = allCourses.filter(course => course.courseName !== cName);
        setAllCourses(newCourses);
    }

    const addCourseTask = (taskId, courseName, taskName, dueDate, type, time) => {
        const newAllCourses = allCourses.map((c) => {
            if (c.courseName === courseName) {
                const newTask = makeTask(taskId, taskName, dueDate, type, time)
                c.tasks.push(newTask);
            }
            return c;
        })
        setAllCourses(newAllCourses);
    }

    const editAllTasks = async () => { // return all tasks
        const all = [];
        for(let i = 0; i < allCourses.length; i++) {
            for(let j = 0; j < allCourses[i].tasks.length; j++) {
                const task = {
                    courseName: allCourses[i].courseName,
                    taskName: allCourses[i].tasks[j].taskName, 
                    dueDate: allCourses[i].tasks[j].dueDate, 
                    status: allCourses[i].tasks[j].status, 
                    type: allCourses[i].tasks[j].type,
                    time: allCourses[i].tasks[j].time,
                };
                all.push(task);
            }
        }
        const totalTask = all.sort((a, b) => {
            return moment(a.dueDate).diff(b.dueDate);
        })
        return totalTask;
    }

    const deleteCourseTask = (courseName, taskId) => {
        const newCourses = allCourses.map((c) => {
            if (c.courseName === courseName) {
                const tasks = c.tasks.filter((t) => t._id !== taskId);
                c.tasks = tasks;
                return c;
            }
            return c;
        })
        setAllCourses(newCourses);
    }

    const changeCourseTaskStatus = (courseId, taskId, status) => {
        const newCourses = allCourses.map((c) => {
            if (c.courseId === courseId) {
                const newTasks = c.tasks.map((t) => {
                    if (t._id === taskId) {
                        t.status = status;
                        return t;
                    }
                    return t;
                })
                c.tasks = newTasks;
                return c;
            }
            return c;
        })
        setAllCourses(newCourses);
    }

    useEffect(() => {
        const all = editAllTasks();
        all.then((res) => {
            setAllTasks(res);
        })
    }, [allCourses]);

    return (
        <CourseContext.Provider 
            value={{
                taskTypeList, allTasks,
                allCourses, setAllCourses,
                addCourse, deleteCourse,
                addCourseTask, deleteCourseTask,
                changeCourseTaskStatus,
            }}
            {...props} />
    )
}

const useCourse = () => useContext(CourseContext);

export { CourseProvider, useCourse};
