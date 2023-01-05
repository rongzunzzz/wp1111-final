// hooks, functions
import { useState } from 'react';
import { usePlanner } from '../hooks/usePlanner';
import { useUserInfo } from '../hooks/useUserInfo';
import { useCourse } from '../hooks/useCourse';
import popMessage from '../utils/popMessage';

// comtainers, components
import AddCourseTaskModal from "../containers/AddCourseTaskModal";

// styles
import '../css/Course.css'
import styled from "styled-components";
import { Card, Popconfirm, Checkbox } from "antd";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

//api
import axios from '../api';
import { getAllSchedules } from '../Api/Schedule';


const cardWrapper = {
    width: '30vw',
    height: '25vw',
    margin: '1em',
    overflow: 'auto',
}

const TaskText = styled.div`
    font-style: normal;
    font-weight: 700;
    font-size: 100%;
    text-align: left;
    letter-spacing: 0.05em;
    // text-transform: uppercase;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: #203293;
`;

const courseBtnStyle = {
    color: 'white',
    fontStyle: 'normal',
    fontSize: '140%',
    fontWeight: '800',
    marginLeft: '10px'
}

const taskBtnStyle = {
    color: '#7CD0FF',
    fontStyle: 'normal',
    fontSize: '120%',
    fontWeight: '800',
    marginLeft: '10px'
}

const tabStyle = {
    fontFamily: 'Noto Serif',
    color: '#FFFFFF',
}

const CourseBlock = ({ courseId, courseName, color, tasks }) => {
    const [addCourseTaskModalOpen, setAddCourseTaskModalOpen] = useState(false);
    
    const { account } = useUserInfo();
    const { setAllSchedules } = usePlanner();
    const { taskTypeList, 
            addCourseTask, 
            deleteCourse, deleteCourseTask,
            changeCourseTaskStatus } = useCourse();

    const tabList = taskTypeList.map((t) => ({
        key: t, tab: t.toUpperCase(),
    }))    


    const handleStatus = async (e, taskId) => {
        const status = e.target.checked;
        const {
            data: { success, message }
        } = await axios.post('/courseTask/Status', {
            account,
            taskId,
            status,
        })
        if (success) {
            changeCourseTaskStatus(courseId, taskId, status);
        }
        popMessage(success, message)
    }

    const handleDeleteTask = async (taskId) => {
        const {
            data: { success, message }
        } = await axios.post('/CourseTask/delete', { 
            account,
            taskId,  
        }) 
        if (success) {
            deleteCourseTask(courseName, taskId);
        }
        popMessage(success, message);
    }

    const handleDeleteCourse = async () => {
        const {
            data: { success, message }
        } = await axios.post('/Courses/delete', { 
            account,
            courseId,
        }) 
        if (success) {
            deleteCourse(courseName);
        }
        popMessage(success, message);
    }

    const cancelDelete = () => {
        return;
    }

    // 把每個 tab 的內容存在前端，return 時 map 出來
    const contentList = {};
    for (let i = 0; i < tabList.length; i++) {
        const tasksInTab = []
        for (let j = 0; j < tasks.length; j++) {
            if (tasks[j].type === tabList[i].key) {
                tasksInTab.push(tasks[j])
            }
        }

        contentList[tabList[i].key] = <div>
            {tasksInTab.map((t) => {
                return <TaskText key={`${tabList[i].key}-${t.taskName}`}  >
                    <Checkbox checked={t.status} onChange={(e) => {
                        handleStatus(e, t._id);
                    }} ></Checkbox>
                    <span style={{lineHeight: '0.1px',display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                        <p style={{textTransform: 'uppercase'}}>{t.taskName}</p>
                        <p style={{color: 'grey', fontSize:'70%'}}>{t.dueDate}</p>
                    </span>
                    <span style={{color: '#4589ff', width: '30%'}}>{t.status? 'COMPLETED' : 'NOT COMPLETED'}</span>
                    <button value={t._id} onClick={() => {
                        handleDeleteTask(t._id)
                    }} style={{backgroundColor: 'Transparent', border: 'none'}}><DeleteOutlined style={taskBtnStyle} /></button>
                </TaskText>
            })}
        </div>
    }

    const headStyle = {
        background: color,
        fontFamily: 'Noto Serif',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '120%',
        textAlign: 'center',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: '#FFFFFF'
    }

    const handleAddCourseTask = () => {
        setAddCourseTaskModalOpen(true);
    }

    const onTabChange = (key) => {
        setActiveTabKey(key);
    };

    

    const [activeTabKey, setActiveTabKey] = useState(tabList[0].key);

    return (
        <>
        <Card title={courseName} 
              headStyle={headStyle} 
              style={cardWrapper} 
              hoverable='true' 
            //   onClick={}
              tabList={tabList}
              //tabBarStyle={tabStyle}
              extra={<><PlusOutlined  onClick={handleAddCourseTask} style={courseBtnStyle} />
                       <Popconfirm 
                            title="Delete the course"
                            description="Are you sure to delete this course?"
                            onConfirm={handleDeleteCourse} 
                            onCancel={cancelDelete}
                            okText="Yes"
                            cancelText="No"
                        ><DeleteOutlined style={courseBtnStyle} /></Popconfirm>
                        </>}
              activeTabKey={activeTabKey}
              onTabChange={(key) => {
                  onTabChange(key);
              }}>
            {contentList[activeTabKey]}
        </Card>
        <AddCourseTaskModal
            open={addCourseTaskModalOpen}
            onCreate={ async (taskName, dueDate, type, time) => { 
                const {
                    data: {
                        success,
                        message,
                        taskId,
                    }
                } = await axios.post('/CourseTask', { // status: default false
                    account, 
                    courseId,
                    dueDate,
                    taskName,
                    type,
                    time,
                }) 

                if (success) {
                    const { getSuccess, message, schedules } = await getAllSchedules(account);
                    if (getSuccess) { // no need to pop message here
                        setAllSchedules(schedules);
                    }
                    addCourseTask(taskId, courseName, taskName, dueDate, type, time);

                    setAddCourseTaskModalOpen(false);
                }
                popMessage(success, message);
            }}
            onCancel={() => {
                setAddCourseTaskModalOpen(false);
            }} >
        </AddCourseTaskModal>
        </>
    )
}

export default CourseBlock;
