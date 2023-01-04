// hooks, functions
import { useEffect, useState } from 'react';
import { useUserInfo } from '../hooks/useUserInfo';
import { usePlanner } from '../hooks/usePlanner';
import { useCourse } from '../hooks/useCourse';
import popMessage from '../utils/popMessage';
import { getUserInfo, editUser } from '../Api/User';

// routes
import { useNavigate } from 'react-router-dom';

// comtainers, components
import FirstLoginModal from '../components/FirstLoginModal';

// styles
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, UnlockOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import '../css/LogSign.css'

// api
import axios from '../api';


const Login = () => {

    const [logInAccount, setLogInAccount] = useState("");
    const [logInPassword, setLogInPassword] = useState("");
    const [firstLoginModalOpen, setFirstLoginModalOpen] = useState(false);

    const { account, setAccount, 
            password, setPassword, 
            setSignedIn, setNickName } = useUserInfo();
    const { setStartDate, setEndDate, 
            allSchedules, setAllSchedules } = usePlanner();
    const { allCourses, setAllCourses } = useCourse();

    const navigate = useNavigate();

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

        if (success) {
            setAllSchedules(schedules);
        }

        popMessage(success, message);
    }

    const getAllCourses = async (account) => {
        const {
            data: {
                success,
                message,
                courses,
            }
        } = await axios.get('/Courses', {
            params:{ account }
        })

        if (success) {
            setAllCourses(courses);
        }
        popMessage(success, message);
    }

    const handleLogin = async () => {
        // 判斷帳號存不存在，不存在就跳出警告（有可能只是打錯字，所以不要直接跳到註冊頁）
        const {
            data: {
                success, // true or false
                message,
                firstLogin
            } 
        } = await axios.get('/logIn', {
            params: {
                account: logInAccount,
                password: logInPassword,
            }
        })

        if (success) {
            // 驗證成功便把剛輸入的帳密在前端存好
            setAccount(logInAccount);
            setPassword(logInPassword);

            if (firstLogin) { // 初次登入，彈出填資料訊息視窗
                setFirstLoginModalOpen(true); 
            } else {
                getAllSchedules(logInAccount);
                getAllCourses(logInAccount);

                const { userSuccess, userMessage, userInfo } = await getUserInfo(logInAccount);
                if (userSuccess) {
                    setNickName(userInfo.nickName);
                    setStartDate(userInfo.startDate);
                    setEndDate(userInfo.endDate); // no popMessage needed
                }

                setSignedIn(true);
                navigate('/');
                popMessage(success, message);
            }
        } else {
            popMessage(success, message);
        }
    }

    const handleAccountChange = (e) => {
        setLogInAccount(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setLogInPassword(e.target.value)        
    }

    const navigateToSignUp = () => {
        navigate('/signup');
    }

    return (
        <div className='background'>
            <div className='pack'>
                <h1 className='LStitle'>Log In</h1>
                <Input size='large' 
                       placeholder="輸入帳號" 
                       prefix={<UserOutlined />} 
                       className='input'
                       onChange={handleAccountChange} />
                <Input.Password size='large' 
                                placeholder="輸入密碼" 
                                prefix={<UnlockOutlined />} 
                                className='input'
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                onChange={handlePasswordChange} />
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly', alignContent:'center'}}>
                    <Button onClick={navigateToSignUp} className='jumpTo'>註冊</Button>
                    <Button onClick={() => {
                        if (logInAccount && logInPassword) handleLogin()
                    }} className='enterBtn'>登入</Button>
                </div>
                <FirstLoginModal
                    open={firstLoginModalOpen}
                    onCreate={ async (nickname, startDate, endDate) => { 
                        const { success, message } = await editUser(account, nickname, startDate, endDate);
                        // const {
                        //     data: {
                        //         success,
                        //         message,
                        //     }
                        // } = await axios.post('/user', { 
                        //     account,
                        //     nickname, 
                        //     startDate,
                        //     endDate
                        // }) 

                        if (success) {
                            setNickName(nickname);
                            setStartDate(startDate);
                            setEndDate(endDate);
                            setFirstLoginModalOpen(false);
                            setSignedIn(true);
                            navigate('/');
                            popMessage(success, message);
                        } else {
                            popMessage(success, message);
                        }

                        
                    }}
                    onCancel={() => {
                        setFirstLoginModalOpen(false);
                    }} >
                </FirstLoginModal>
            </div>
        </div>
    )
}

export default Login;
