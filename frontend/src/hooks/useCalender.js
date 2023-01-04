/* 專門給主頁中間那塊秀日期還有行事曆的 */
import { createContext, useContext, useEffect, useState } from "react";

const CalenderContext = createContext({
    currYear: 2023,
    currMonth: "",
    currDates: [],
    todayDate: "",

    setCurrYear: () => {},
    setCurrMonth: () => {},
    setCurrDates: () => {},

    numberToDay: () => {},
    numberToMonth: () => {},
    getCurrWeekDays: () => {},

});

const monthToNumber = (monthString) => {
    switch (monthString) {
        case 'Jan': return '01'; 
        case 'Feb': return '02'; 
        case 'Mar': return '03'; 
        case 'Apr': return '04'; 
        case 'May': return '05'; 
        case 'Jun': return '06'; 
        case 'Jul': return '07'; 
        case 'Aug': return '08'; 
        case 'Sep': return '09'; 
        case 'Oct': return '10';
        case 'Nov': return '11';
        case 'Dec': return '12'; 
        default: break;
    }
}

const CalenderProvider = (props) => {
    
    const [currYear, setCurrYear] = useState(2023); // the year shown
    const [currMonth, setCurrMonth] = useState(1); // the month shown
    
    const getCurrWeekDays = (n = 0) => {
        const TWD = Array.from(Array(7).keys()).map((idx) => {
            const d = new Date(); 
            const d_ = new Date(d.setDate(d.getDate() - d.getDay() + idx + n + 1)).toDateString();
            let year = d_.substring(11,15)
            let month = monthToNumber(d_.substring(4,7))
            let date = d_.substring(8,10)
            let dateString = `${year}/${month}/${date}`
            return dateString; 
        });
        return TWD
    }

    const getToday = () => {
        const d = new Date().toDateString();
        
        let year = d.substring(11,15)
        let month = monthToNumber(d.substring(4,7))
        let date = d.substring(8,10)
        let dateString = `${year}/${month}/${date}`
        
        return dateString
    }

    const thisWeekDays = getCurrWeekDays() 
    const [currDates, setCurrDates] = useState(thisWeekDays); // e.g., '2023/01/02','2023/01/03', ..., '2023/01/08'

    const today = getToday();
    const [todayDate, setTodayDate] = useState(today);

    const numberToDay = (num) => { 
        switch (num) {
            case 1: return "MON"; break; // 星期「ㄧ」
            case 2: return "TUE"; break;
            case 3: return "WED"; break;
            case 4: return "THU"; break;
            case 5: return "FRI"; break;
            case 6: return "SAT"; break;
            case 7: return "SUN"; break;
            default: break;
        }
    }

    const numberToMonth = (num) => {
        switch (num) {
            case 1: return "JANUARY"; break;
            case 2: return "FEBRUARY"; break;
            case 3: return "MARCH"; break;
            case 4: return "APRIL"; break;
            case 5: return "MAY"; break;
            case 6: return "JUNE"; break;
            case 7: return "JULY"; break;
            case 8: return "AUGUST"; break;
            case 9: return "SEPTEMBER"; break;
            case 10: return "OCTOBER"; break;
            case 11: return "NOVEMBER"; break;
            case 12: return "DECEMBER"; break;
            default: break;
        }
    }

    return (
        <CalenderContext.Provider 
            value={{
                currYear, setCurrYear,
                currMonth, setCurrMonth,
                currDates, setCurrDates,
                numberToDay, numberToMonth, 
                getCurrWeekDays, 
                todayDate,
            }}
            {...props} />
    )
}

const useCalender = () => useContext(CalenderContext);

export { CalenderProvider, useCalender};
