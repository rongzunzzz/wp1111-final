import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const ScheduleSchema = new Schema({
    scheduleName: {type: String, required: [true, 'Due date field is required.']}, //HW1
    date: { type: String, required: [true, 'Due date field is required.'] }, // '2023/01/02'
    startTime: { type: Number, required: [true, 'Start time field is required.'] }, // 9, 24小時制
    endTime: { type: Number, required: [true, 'End time field is required.'] }, // 12, 24小時制
    courseId: { type: mongoose.Types.ObjectId, ref: 'Course' }, // 前端會 render courseName
    taskId: { type: mongoose.Types.ObjectId, ref: 'Task' }, // 前端會 render taskName, and probably dueDate
    color: {type:String}
});
const Schedule = mongoose.model('Schedule', ScheduleSchema);
export default Schedule;