import axios from '../api.js'

const editUser = async (account, nickname, startDate, endDate) => {
    const {
        data: {
            success,
            message,
        }
    } = await axios.post('/user', { 
        account,
        nickname, 
        startDate,
        endDate
    }) 
    return { success: success, message: message};
}

const getUserInfo = async (account) => {
    const {
        data: {
            success,
            message,
            userInfo
        }
    } = await axios.get('/user', {
        params: { account }
    })
    return { userSuccess: success, userMessage: message, userInfo: userInfo };
}

export { editUser, getUserInfo }