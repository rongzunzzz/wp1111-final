// hooks, functions
import { useState } from "react";
import { useUserInfo } from "../hooks/useUserInfo";
import { useCourse } from "../hooks/useCourse";
import popMessage from "../utils/popMessage";

// containers, components
import Header from "../containers/Header";
import CourseBlock from "../components/CourseBlock";
import AddCourseModal from "../components/AddCourseModal";

// styles
import styled from "styled-components";
import { PlusCircleTwoTone } from '@ant-design/icons';

// api
import axios from "../api";


const CoursesWrapper = styled.div`
    position: absolute;
    width: 99vw;
    height: 90vh;
    top: 8vh;
    margin: 0.5em;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;

    overflow: auto;
`;

const AddButtonWrapper = styled.div`
    width: 40px;
    height: 40px;

    position: fixed;
    left: 20px;
    bottom: 20px;

    background: #D9D9D9;
    opacity: 0.8;

    border-radius: 50%;
    // cursor: pointer;
`;

const CoursesPage = () => {

    const { account } = useUserInfo();
    const { allCourses, addCourse } = useCourse();

    const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);

    const handleAddCourse = () => {
        setAddCourseModalOpen(true);
    }

    return (
        <div style={{overflow: 'hidden'}}>
            <Header />
            <CoursesWrapper>
                {allCourses.map((c, i) => {
                    return <CourseBlock key={i} 
                                        courseId={c.courseId}
                                        courseName={c.courseName}
                                        color={c.color} 
                                        tasks={c.tasks} />
                })}
            </CoursesWrapper>
            <AddButtonWrapper>
                <PlusCircleTwoTone style={{ fontSize: '40px' }} onClick={handleAddCourse}/>
            </AddButtonWrapper>
            <AddCourseModal
                open={addCourseModalOpen}
                onCreate={ async (courseName, color) => { 
                    const {
                        data: {
                            success,
                            message,
                            courseId,
                        }
                    } = await axios.post('/Courses', { 
                        account,
                        courseName,
                        color: color,
                    }) 
                    if (success) {
                        addCourse(courseId, courseName, color);
                        setAddCourseModalOpen(false);
                    }
                    popMessage(success, message);
                }}
                onCancel={() => {
                    setAddCourseModalOpen(false);
                }} >
            </AddCourseModal>
        </div>
    )
}

export default CoursesPage;
