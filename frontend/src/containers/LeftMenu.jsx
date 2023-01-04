// router
import { useNavigate } from 'react-router-dom';

// hooks
import { usePlanner } from '../hooks/usePlanner';

// styles
import '../css/LeftMenu.css'

const LeftMenu = () => {
    
    const { setCurrPage, menuUnfold, setMenuUnfold } = usePlanner();

    const navigate = useNavigate();

    return (
        menuUnfold ?
        <div className="menu" >
            <p className="menu-text menu-calender" onClick={() => {
                setCurrPage("CALENDER");
                setMenuUnfold(false);
                navigate('/');
            }}>CALENDER</p>
            <p className="menu-text menu-courses" onClick={() => {
                setCurrPage("COURSES");
                setMenuUnfold(false);
                navigate('/courses');
            }}>COURSES</p>
            <p className="menu-text menu-settings" onClick={() => {
                setCurrPage("SETTINGS");
                setMenuUnfold(false);
                navigate('/setting');
            }}>SETTINGS</p>
        </div> : <></>
    )
}

export default LeftMenu;
