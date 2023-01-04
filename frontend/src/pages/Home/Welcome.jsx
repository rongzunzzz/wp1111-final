import { useNavigate } from 'react-router-dom';
import '../../css/Welcome.css'

const Welcome = () => {
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate('/login');
    }
    const navigateToSignUp = () => {
        navigate('/signup');
    }

    return (
        <div className='background'>
            <h1 id='title'>Plan Your Week</h1>
            <h2 id='slogan'>寒冷的冬天，拯救你的期末...</h2>
            <div onClick={navigateToLogin} className='log-sign-btn' id='wel-login'><p>Log In</p></div>
            <div onClick={navigateToSignUp} className='log-sign-btn' id='wel-signup'><p>Sign Up</p></div>
            <div className='wel-photo-frame'>
                <img src={require('../../pictures/Welcome.png')} alt='photo1' id='pic'/>
            </div>
        </div>
    )
}

export default Welcome;
