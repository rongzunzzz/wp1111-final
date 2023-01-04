/* 給首頁（'/', <Planner />）用 */
import { createContext, useContext, useEffect, useState } from "react";

const PlannerContext = createContext({
    repeatTypes: [],

    currPage: "",
    startDate: "",
    endDate: "",
    allSchedules: [],
    menuUnfold: false,
    psOpen: false,

    setCurrPage: () => {},
    setStartDate: () => {},
    setEndDate: () => {},
    setAllSchedules: () => {},
    setMenuUnfold: () => {},
    setPsOpen: () => {},

    addSchedule: () => {},
    deleteSchedule: () => {},
    updateSchedule: () => {},
});

const makeSchedule = (scheduleId, scheduleName, date, startTime, endTime, courseName, taskName) => ({
    scheduleId: scheduleId,
    scheduleName: scheduleName, 
    date: date, 
    startTime: startTime, 
    endTime: endTime, 
    courseName: courseName, 
    taskName: taskName
})

const PlannerProvider = (props) => {

    const repeatTypes = ['no repeat', 'daily', 'weekly']

    const [currPage, setCurrPage] = useState("CALENDER");
    const [startDate, setStartDate] = useState("2023/01/03");
    const [endDate, setEndDate] = useState("2023/01/07");
    const [allSchedules, setAllSchedules] = useState([]); // schedule of this user
    const [menuUnfold, setMenuUnfold] = useState(false); // unfold: menu shown
    const [psOpen, setPsOpen] = useState(false); // ps: Photo Sticker

    const addSchedule = (scheduleId, scheduleName, date, startTime, endTime, courseName, taskName) => {
        const newSchedule = makeSchedule(scheduleId, scheduleName, date, startTime, endTime, courseName, taskName)
        setAllSchedules([...allSchedules, newSchedule]);
    }

    const deleteSchedule = (scheduleId) => {
        const newSchedules = allSchedules.filter(schedule => schedule.scheduleId !== scheduleId)
        setAllSchedules(newSchedules);
    }

    const updateSchedule = (scheduleId, scheduleName, date, startTime, endTime) => {
        const newSchedules = allSchedules.map((schedule) => {
            if (schedule.scheduleId === scheduleId) {
                schedule.scheduleName = scheduleName 
                schedule.date = date
                schedule.startTime = startTime
                schedule.endTime = endTime
                return schedule;
            }
            return schedule;
        })
        setAllSchedules(newSchedules);
    }

    return (
        <PlannerContext.Provider 
            value={{
                repeatTypes,
                currPage, setCurrPage,
                startDate, setStartDate,
                endDate, setEndDate,
                allSchedules, setAllSchedules,
                menuUnfold, setMenuUnfold,
                psOpen, setPsOpen,
                addSchedule, deleteSchedule, updateSchedule,
            }}
            {...props} />
    )
}

const usePlanner = () => useContext(PlannerContext);

export { PlannerProvider, usePlanner};
