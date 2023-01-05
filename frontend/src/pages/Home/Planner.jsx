// hooks, functions
import { useState, useEffect } from "react";
import { useUserInfo } from "../../hooks/useUserInfo";
import { usePlanner } from "../../hooks/usePlanner";
import { useCalender } from "../../hooks/useCalender";
import popMessage from "../../utils/popMessage";

// components
import Header from "../../containers/Header";
import Overview from "../../components/Overview";
import WeekPlanner from "../../components/WeekPlanner/WeekPlanner";
import AddScheduleModal from "../../containers/AddScheduleModal";

// styles
import '../../css/Planner.css';
import Button from '@mui/material/Button';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';

// api
import axios from '../../api'
import { getAllSchedules } from "../../Api/Schedule";

const btnStyle = {
    borderRadius: '15px', 
    background: '#80B2FF', 
    boxShadow: '2px 5px 6px rgba(0, 0, 0, 0.2)',
    fontFamily: 'Bowlby One',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '25px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#FFFFFF',
}

const LastNextWeekStyle = {
    fontSize: '1.5vw',
    color: '#2031938c', 
    marginLeft: '1vw',
    cursor: 'pointer', 
    textDecoration: 'underline',
}

const Planner = () => {

    const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false);
    const [daysForward, setDaysForward] = useState(0); // +7 each time

    const { account } = useUserInfo();
    const { allSchedules, setAllSchedules, addSchedule } = usePlanner();
    const { currYear, setCurrYear,
            currMonth, setCurrMonth,
            setCurrDates,
            numberToMonth, getCurrWeekDays } = useCalender();

    const handleAdd = () => {
        setAddScheduleModalOpen(true);
    }

    const handleLastWeek = () => {
        getAllSchedules(account);
        setDaysForward(curr => curr - 7);
    }

    const handleNextWeek = () => {
        getAllSchedules(account);
        setDaysForward(curr => curr + 7);
    }

    useEffect(() => {
        const newCurrDates = getCurrWeekDays(daysForward);
        /* 處理月份 */
        // 回到去年
        if (newCurrDates.includes(`${currYear-1}/12/31`) ||
            newCurrDates.includes(`${currYear}/01/01`)) { 
            setCurrYear(curr => curr - 1);
            setCurrMonth(12);
        } 

        // 跨到明年
        else if (newCurrDates.includes(`${currYear+1}/01/01`) ||
                 newCurrDates.includes(`${currYear}/12/31`)) { 
            setCurrYear(curr => curr + 1);
            setCurrMonth(1);
        } 

        // 回到上月
        else if (newCurrDates.includes(`${currYear}/0${currMonth-1}/31`) || 
                 newCurrDates.includes(`${currYear}/${currMonth-1}/31`) || 
                 newCurrDates.includes(`${currYear}/0${currMonth-1}/30`) || 
                 newCurrDates.includes(`${currYear}/${currMonth-1}/30`) || 
                 newCurrDates.includes(`${currYear}/0${currMonth-1}/29`) || 
                 newCurrDates.includes(`${currYear}/${currMonth-1}/29`) || 
                 newCurrDates.includes(`${currYear}/0${currMonth-1}/28`) || 
                 newCurrDates.includes(`${currYear}/${currMonth-1}/28`)) { 
            setCurrMonth(curr => curr - 1);
        } 

        // 跨到下月
        else if (newCurrDates.includes(`${currYear}/0${currMonth+1}/01`) || 
                 newCurrDates.includes(`${currYear}/${currMonth+1}/01`)) { 
            setCurrMonth(curr => curr + 1);
        } 
        /* 處理月份 */

        
        setCurrDates(newCurrDates);
    }, [daysForward])

    return (
        <div>
            <Header />
            <div className="planner-frame">
                <div className="month-title">
                    <div style={{ position: 'relative', left: '16%'}}>
                        <span style={LastNextWeekStyle} onClick={handleLastWeek}>LAST WEEK</span>
                        <span style={LastNextWeekStyle} onClick={handleNextWeek}>NEXT WEEK</span>
                        {/* <CaretLeftOutlined  style={{color: '#2031938c', cursor: 'pointer'}}
                                            onClick={handleLastWeek} />
                        <CaretRightOutlined  style={{color: '#2031938c', cursor: 'pointer'}}
                                            onClick={handleNextWeek} /> */}
                    </div>
                    <div style={{position: 'relative', left: '63vw', width: '6vw'}}>
                        <span className="month-title-month">{currYear}</span>
                        <span className="month-title-month">{numberToMonth(currMonth)}</span>
                    </div>
                </div>
                <div className="add-btn-frame">
                    <Button variant="contained" 
                            size="large"
                            onClick={handleAdd} style={btnStyle}>ADD</Button>
                    <Overview />
                </div>
                <WeekPlanner schedules={allSchedules} />
            </div>
            <AddScheduleModal
                open={addScheduleModalOpen}
                onCreate={ async (scheduleName, date, startTime, endTime, course_task, isRepeat) => { 
                    const ct = course_task.split('-')
                    let courseId = ct[0]
                    if (courseId === "非課程") courseId = null;
                    let taskId = ct[1] // 如果在選的時候只選 course 層，taskName === undefined
                    if (taskId === undefined) taskId = null;

                    const {
                        data: {
                            success,
                            message, 
                        }
                    } = await axios.post('/schedules', { 
                        account,
                        scheduleName,
                        date,
                        startTime, 
                        endTime,
                        isRepeat,
                        courseId,
                        taskId,
                    }) 

                    if (success) {
                        const { getSuccess, message, schedules } = await getAllSchedules(account);
                        if (getSuccess) { // no need to pop message here
                            setAllSchedules(schedules);
                        }
                        setAddScheduleModalOpen(false);
                    }
                    popMessage(success, message);
                }}
                onCancel={() => {
                    setAddScheduleModalOpen(false);
                }} >
            </AddScheduleModal>
        </div>
    )
}

export default Planner;
