// hooks
import { usePlanner } from "../../hooks/usePlanner";
import { useCalender } from "../../hooks/useCalender";

// components
import ScheduleBlock from "./ScheduleBlock";

// styles
import styled from "styled-components";

// date means
import moment from "moment";

const Wrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 10%;

    background: #FFFFFF;
    border-radius: 12px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

`;

const Todo = ({ fullDate, date, todos }) => {

    const { currDates } = useCalender();
    const { startDate, endDate } = usePlanner();

    const isInScheduleRange = (startDate, endDate, sDate) => {
        return (moment(sDate).isBetween(startDate, endDate) ||
                moment(sDate).isSame(startDate ||
                moment(sDate).isSame(endDate))) 
    }

    return (
        <Wrapper style={{
            background: isInScheduleRange(startDate, endDate, fullDate)? '#FFFFFF' : '#d4d5d9',
        }} >
            <div style={{width: '90%', height: '95%', position:'absolute'}}>
                {todos.map((t, i) => {
                    if (currDates.includes(t.date.replaceAll('-' , '/')) && date === t.date.slice(-2)) {
                        return <ScheduleBlock 
                                key={i} 
                                scheduleId={t.scheduleId}
                                scheduleName={t.scheduleName}
                                date={t.date} 
                                startTime={t.startTime} 
                                endTime={t.endTime} 
                                courseName={t.courseName} 
                                taskName={t.taskName}
                                color={t.color} />
                    }
                })}
            </div>
        </Wrapper>
    )
}

export default Todo;
