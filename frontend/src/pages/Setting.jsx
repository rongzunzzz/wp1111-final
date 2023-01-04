import { useState } from "react";
// containers, components
import Header from "../containers/Header";

//hooks
import { useUserInfo } from "../hooks/useUserInfo";
import { usePlanner } from "../hooks/usePlanner";
import popMessage from '../utils/popMessage';

//style
import { Avatar, Button, Input, Modal, DatePicker, message } from 'antd';
import { UserOutlined, CalendarOutlined, SettingOutlined } from '@ant-design/icons';
import '../css/Setting.css'
//api
import { editUser } from "../Api/User";

const { RangePicker } = DatePicker;

const Setting = () => {
    const { account, nickName, setNickName,  } = useUserInfo();
    const { startDate, endDate, setStartDate, setEndDate } = usePlanner();

    //edit name
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const showNameModal = () => {
        setIsNameModalOpen(true);
    };

    const handleEditName = async () => {
        const { success, message } = await editUser(account, newName, startDate, endDate);
        if (success) {
            setNickName(newName);
        } 
        popMessage(success, message)
        setIsNameModalOpen(false);
    };
    const handleCancelName = () => {
        setNewName("");
        setIsNameModalOpen(false);
    };
    const nameUpdate = (e) => {
        setNewName(e.target.value);
    }

    //edit date
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [sDate, setSDate] = useState("");
    const [eDate, setEDate] = useState("");
    
    const showDateModal = () => {
        setIsDateModalOpen(true);
    };
    const handleEditDate = async() => {
        const { success, message } = await editUser(account, nickName, sDate, eDate);
        if (success) {
            setStartDate(sDate);
            setEndDate(eDate)
        }
        popMessage(success, message)
        setIsDateModalOpen(false);
    };
    const handleCancelDate = () => {
        setNewName("");
        setIsDateModalOpen(false);
    };
    const dateUpdate = (date, dateString) => {
        setSDate(dateString[0]);
        setEDate(dateString[1]);
    }

    return (
        <div>
            <Header />
            <div className="setting-frame">
                <h1 ><SettingOutlined style={{marginRight: '0.5em'}}/>SETTINGS</h1>
                <div className="info-frame">
                    <div className="front-frame" style={{width: '16%'}}>
                        <Avatar icon={<UserOutlined />}/>
                        <p>{nickName}</p>
                    </div>
                    <Button type="primary" onClick={showNameModal} className="edit-btn">EDIT</Button>
                    <Modal title="NickName" open={isNameModalOpen} onOk={handleEditName} onCancel={handleCancelName} okText="Edit" afterClose={handleCancelName}>
                        <Input placeholder="Enter your new nickname" value={newName} onChange={nameUpdate}/>
                    </Modal>
                </div>
                <div className="info-frame">
                    <div className="front-frame" style={{width: '45%'}}>
                        <CalendarOutlined style={{fontSize: '170%'}}/>
                        <p style={{position: 'relative', right: '5%'}}>{startDate} ~ {endDate}</p>
                    </div>
                    <Button type="primary" onClick={showDateModal} className="edit-btn">EDIT</Button>
                    <Modal title="Planner's Date" open={isDateModalOpen} onOk={handleEditDate} onCancel={handleCancelDate} okText="Edit" afterClose={handleCancelDate}>
                        <p>Edit your planner's date.</p>
                        <RangePicker onChange={dateUpdate}/>
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default Setting;