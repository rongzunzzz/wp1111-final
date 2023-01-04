// components
import Todo from "./Todo";
import DateDay from "./DateDay";

// styles
import styled from "styled-components";

const Wrapper = styled.div`
    position: relative;
    width: 13%;
    height: 85%;
    top: -4%;
    // background: grey;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    // margin: 1em;
`;

const DayGroup = ({ fullDate, date, day, todos }) => {
    return (
        <Wrapper>
            <DateDay date={date} day={day} />
            <Todo fullDate={fullDate} date={date} todos={todos} />
        </Wrapper>
    )
}

export default DayGroup;
