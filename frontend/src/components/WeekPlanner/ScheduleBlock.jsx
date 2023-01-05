import { useState } from "react";
// hooks
import { useUserInfo } from "../../hooks/useUserInfo";
import { usePlanner } from "../../hooks/usePlanner";

// styles
import styled from "styled-components";
import { Popover, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

//components
import EditScheduleModal from "../../containers/EditScheduleModal";
// api
import axios from "../../api";
import popMessage from "../../utils/popMessage";

const ScheduleWrapper = styled.div`
    width: 100%;
    background: #67ADFF;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const scheduleNameText = {
    fontSize: '100%',
    fontWeight: '600',
    color: '#020079',
    wordBreak: 'normal',
    wordWrap: 'break-word',
}

const popBtn = {
    display: 'flex',
    width: '20%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    left: '80%'
}

const ScheduleBlock = ({ scheduleId, scheduleName, date, startTime, endTime, courseName, taskName, color }) => {

    const { account } = useUserInfo();
    const { deleteSchedule, updateSchedule } = usePlanner();
    const [editScheduleModalOpen, setEditScheduleModalOpen] = useState(false);

    const handleEdit = () => {
        setEditScheduleModalOpen(true)
    }
    
    const handleDeleteSchedule = async () => {
        const {
            data: { success, message }
        } = await axios.post('/schedules/delete', {
            account,
            scheduleId,
        })
        if (success) {
            deleteSchedule(scheduleId);
        }
        popMessage(success, message)
    }

    const handleUpdateSchedule = async (scheduleName, date, startTime, endTime) => {
        
        const {
            data: { success, message }
        } = await axios.post('/schedules/update', {
            account,
            scheduleId,
            scheduleName,
            date,
            startTime,
            endTime,
        }) 
        if (success) {
            updateSchedule(scheduleId, scheduleName, date, startTime, endTime);
            setEditScheduleModalOpen(false);
        }
        popMessage(success, message);
    }
    
    const content = () => {
        return (
            <>
                <div>
                    <p>{`Start from: ${startTime}:00`}</p>
                    <p>{`End by: ${endTime}:00`}</p>
                    <p>{`Course name: ${courseName}`}</p>
                    <p>{`Task name: ${taskName === undefined? 'Not a task!' : taskName}`}</p>
                </div>
                <div style={popBtn}>
                    <EditOutlined onClick={handleEdit}/>
                    <Popconfirm
                        title="Delete the schedule"
                        description="Are you sure to delete this schedule?"
                        onConfirm={handleDeleteSchedule}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No"
                        zIndex={0}
                    ><DeleteOutlined /></Popconfirm>
                </div>
            </>
            
        )
    }
    
    const scheduleLength = (endTime - startTime) / 24 * 100 - 0.5;
    const scheduleHeight = (startTime) / 24 * 100;

    return (
        <>
            <Popover content={content} title={`${scheduleName}`}>
                <ScheduleWrapper style={{
                    position: 'absolute', height: `${scheduleLength}%`, top: `${scheduleHeight}%`, background: color,
                }}>
                    <div style={scheduleNameText}>{scheduleLength > 4 ? scheduleName: "..."}</div>
                </ScheduleWrapper>
            </Popover>
            <EditScheduleModal
                open={editScheduleModalOpen}
                onCreate={ async (scheduleName, date, startTime, endTime) => { 
                    handleUpdateSchedule(scheduleName, date, startTime, endTime);
                }}
                onCancel={() => {
                    setEditScheduleModalOpen(false);
                }}
            />
        </>
        
    )
}

export default ScheduleBlock;