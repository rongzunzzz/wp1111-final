// hooks, functions
import { useState } from 'react';
import { useUserInfo } from '../hooks/useUserInfo';
import popMessage from '../utils/popMessage';

// routes
import { useNavigate } from 'react-router-dom';

// styles
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, UnlockOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import '../css/LogSign.css'

// api
import axios from '../api';

const SignUp = () => {

    const [signUpAccount, setSignUpAccount] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const { setAccount, setPassword } = useUserInfo();
    
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate('/login');
    }

    const handleAccountChange = (e) => {
        setSignUpAccount(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setSignUpPassword(e.target.value)        
    }

    const handleSignUp = async () => {

        // 輸入帳號密碼，確定存到 DB（或firebase），跳出成功訊息，再跳回 login
        const {
            data: { success, message }
        } = await axios.post('/signUp', {
            account: signUpAccount,
            password: signUpPassword,
        })

        if (success) {
            setAccount(signUpAccount);
            setPassword(signUpPassword);
        }
        
        popMessage(success, message);

        navigate('/login');
    }

    return (
        <div className='background'>
            <div className='pack'>
                <h1 className='LStitle'>Sign Up</h1>
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
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>
                    <Button onClick={navigateToLogin} className='jumpTo'>去登入</Button>
                    <Button onClick={() => {
                        if (signUpAccount && signUpPassword) handleSignUp()
                    }} className='enterBtn'>註冊</Button>
                </div>
            </div>
        </div>
    )
}

export default SignUp;
