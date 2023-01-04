import { Router } from 'express';
import UserRouter from './user.js'
import SchedulesRouter from "./schedules.js"
import CoursesRouter from './course.js'
import Task from './task.js'

const router = Router();
router.use('/schedules', SchedulesRouter);
router.use('/Courses',CoursesRouter);
router.use('/CourseTask', Task);
router.use('/', UserRouter);

export default router;