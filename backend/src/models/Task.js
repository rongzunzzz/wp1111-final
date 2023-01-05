import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const TaskSchema = new Schema({
    taskName: { type: String, required: [true, 'Task name field is required.'] }, // 'quiz 3'
    dueDate: { type: String, required: [true, 'Due date field is required.'] }, // '2023/01/02'
    status: { type: Boolean, required: [true, 'Status field is required.'] }, // true: 'completed', false: 'not completed'(default)
    type: { type: String, required: [true, 'Type field is required.'] }, // 'exam', 'project', 'quiz', 'hw'
    time: {type: Number, required: [true, 'Time field is required.']}
});
const Task = mongoose.model('Task', TaskSchema);
export default Task;