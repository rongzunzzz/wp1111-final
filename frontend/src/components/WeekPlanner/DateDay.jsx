import styled from "styled-components";

const Wrapper = styled.div`
    /* Auto layout */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    padding: 6px 10px;
    gap: 10px;

    width: 60%;
    height: 4vh;
    position: relative;
    top: -1%;
    background: radial-gradient(66.87% 107.14% at 55.96% 50%, #2177F8 0%, rgba(125, 232, 255, 0) 100%);
    border-radius: 40px;

    display: flex;
    flex-direction: row;
    align-items: center;

    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
`;

const DateWrapper = styled.div`
    position: relative;
    // top: -5%;
    left: -5%;
    width: 1.9vw;
    height: 1.9vw;
    border-radius: 50%;
    background: #FFFFFF;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
    display: flex;
    align-items: center;
    justify-items: center;
`;

const StyledDate = styled.p`
    position: relative;
    left: 10%;
    // font-family: 'Days One';
    font-style: normal;
    font-weight: 700;
    font-size: 90%;
    text-align: center;
    letter-spacing: 0.12em;
    text-transform: uppercase;

    color: #006BE8;
`;

const StyledDay = styled.p`
    position: relative;
    width: 54px;
    height: 28px;

    // font-family: 'Bakbak One';
    font-style: normal;
    font-weight: 700;
    font-size: 100%;
    line-height: 28px;
    /* identical to box height */
    display: flex;
    align-items: center;
    letter-spacing: 0.12em;
    text-transform: uppercase;

    color: #FFFFFF;

    mix-blend-mode: normal;
`

const DateDay = ({ date, day }) => {
    return (
        <Wrapper>
            <DateWrapper>
                <StyledDate>{date}</StyledDate>
            </DateWrapper>
            <StyledDay>{day}</StyledDay>
        </Wrapper>
    )
}

export default DateDay;
