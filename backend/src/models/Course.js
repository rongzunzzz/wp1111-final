import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
    courseName: { type: String, required: [true, 'Course name field is required.'] },
    tasks: [ { type: mongoose.Types.ObjectId, ref: 'Task' } ],
    color: {type: String}
});
const Course = mongoose.model('Course', CourseSchema);
export default Course;