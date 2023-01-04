// hooks
import { usePlanner } from '../../hooks/usePlanner';
import { useCalender } from '../../hooks/useCalender';

// components
import DayGroup from './DayGroup';

// styles
import styled from 'styled-components';

const Wrapper = styled.div`
    position: relative;
    width: 84vw;
    height: 85vh;
    left: 15vw;
    top: -78vh;

    background: #ECEDF7;
    border-radius: 15px;

    display: flex;
    justify-content: space-evenly;
    align-items: center;
`;

const WeekPlanner = ({ schedules }) => {

    // 有時間的話把 schedules 拆成 important 跟 todo 傳進 <DayGroup>

    const { currDates, numberToDay } = useCalender();

    const weekDays = currDates.map((d, i) => {
        // the "date" of the month, two digits(03, 12, etc.)
        return { fullDate: currDates[i], date: d.slice(-2), day: numberToDay(i+1) }
    })
    

    return (
        <Wrapper>
            {weekDays.map((d, i) => {
                return <DayGroup key={i} 
                                 fullDate={d.fullDate}
                                 date={d.date}
                                 day={d.day}
                                 todos={schedules}
                                 /> 
            })}
        </Wrapper>
    )
}

export default WeekPlanner;
