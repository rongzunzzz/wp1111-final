import axios from '../api.js'

const getAllSchedules = async (account) => {
    const {
        data: {
            success,
            message,
            schedules,
        } 
    } = await axios.get('/schedules', {
        params:{ account }
    })
    return { getSuccess: success, message: message, schedules: schedules }
}

export { getAllSchedules };