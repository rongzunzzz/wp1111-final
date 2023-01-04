import styled from "styled-components";
import { useCalender } from "../hooks/useCalender";
import { useCourse } from '../hooks/useCourse';
import moment from 'moment'
import { useState } from "react";

const Wrapper = styled.div`
    position: relative;
    width: 80%;
    height: 90%;
    top: 3%;
    background: #E9EEF5;
    border-radius: 15px;
    // margin-bottom: -28%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

const Text = styled.p`
    // position: relative;
    // // width: 120px;
    // // height: 24px;
    // left: 16%;
    // top: -2%;
    
    // font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 140%;
    letter-spacing: 0.12em;
    text-transform: uppercase;

    color: #203293;

    // text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const littleText = {
    fontSize :'80%',
    fontWeight: '700',
}

const courseText = {
    fontWeight: '700'
}

const Overview = () => {
    const { currDates, todayDate } = useCalender();
    const { allTasks } = useCourse();

    return (
        <Wrapper>
            <Text>DEADLINES</Text>
            <div style={{width: '85%'}}>
                {allTasks.map((t, i) => {
                    if (moment(t.dueDate).isBetween(todayDate, currDates[6])  || moment(t.dueDate).isSame(todayDate) ) {
                        return (
                            <div key={i} style={{
                                display: 'flex', flexDirection: 'row', 
                                width: '100%', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <p style={{
                                    fontWeight:'700', backgroundColor: '#67ADFF',
                                    padding: '2%', borderRadius: '10%'
                                }}>{t.courseName}</p>
                                <p style={littleText}>{t.taskName}</p>
                                <p style={littleText}>{t.dueDate}</p>
                            </div>  
                        )
                    }
                })}
            </div>    
        </Wrapper>
    )
}

export default Overview;
