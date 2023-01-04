import { useNavigate } from 'react-router-dom';
// hooks
import { useState } from 'react'
import { usePlanner } from '../hooks/usePlanner'
import { useUserInfo } from '../hooks/useUserInfo'

// components
import LeftMenu from './LeftMenu'

// styles
import '../css/Header.css'
import { Button, Avatar, Popover } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { height } from '@mui/system';

const iconStyle = {
    color: 'white', 
    fontSize: '5vh'
}

const btnStyle = {
    position: 'relative',
    left: '21vw',
    borderRadius: '10px', 
    background: '#80B2FF', 
    fontFamily: 'Bowlby One',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '80%',
    letterSpacing: '0.12em',
    color: '#FFFFFF',
}
    

const Header = () => {
    const { nickName, setSignedIn } = useUserInfo();
    const { currPage, menuUnfold, setMenuUnfold, setPsOpen } = usePlanner();
    const navigate = useNavigate();
    const navigateToWelcome = () => {
        navigate('/');
    }

    const handleLeftMenu = () => {
        setMenuUnfold(curr => !curr);
    }

    const navigateToSetting = () => {
        navigate('/setting');
    }

    const handlePhotoSticker = () => {
        setPsOpen(curr => !curr);
    }

    const handleLogOut = () => {
        setSignedIn(curr => !curr);
        navigateToWelcome();
    }

    const userContent = (
        <div style={{width: '200px', height: '200px', color: '#1F3CA3'}}>
            <p style={{fontSize: '20px'}}>Name: {nickName}</p>
            <SettingOutlined id='go-setting' onClick={navigateToSetting}/>
        </div>
    )

    return (
        <div className="header-wrapper">
            <div className='left-menu-btn'>
                <div onClick={handleLeftMenu}>
                    {menuUnfold ? <MenuUnfoldOutlined style={iconStyle}/> : <MenuFoldOutlined style={iconStyle}/>}
                </div>    
            </div>
            <LeftMenu />
            <h1 className='title'>{currPage}</h1>
            <Button style={btnStyle} onClick={handleLogOut}>Log Out</Button>
            <Popover content={userContent} trigger="click" placement="bottomRight">
                <Avatar className='photo-sticker' onClick={handlePhotoSticker} icon={<UserOutlined style={{fontSize: '3vh'}}/>}/>
            </Popover>
            {/* <div className='photo-sticker' onClick={handlePhotoSticker}>
                
            </div> */}
        </div>
    )
}

export default Header;
