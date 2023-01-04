import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    nickName: { type: String}, //default: Bob
    // '2023/01/01' or '2023-01-01'
    startDate: { type: String}, //default: 2023-01-01
    endDate: { type: String}, //default: 2023-01-02
    
    account: { type: String, required: [true, 'Account is required.'] },
    password: { type: String, required: [true, 'Password is required.'] },
    firstLogIn: { type: Boolean }, // default: true
    
    allCourses: [ { type: mongoose.Types.ObjectId, ref: 'Course' } ],
    
    allSchedules: [ { type: mongoose.Types.ObjectId, ref: 'Schedule' } ],
});
const User = mongoose.model('User', UserSchema);
export default User;