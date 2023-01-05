// hooks
import { useState } from "react";
import { useCourse } from "../hooks/useCourse";
import { usePlanner } from "../hooks/usePlanner";

// styles
import { Modal, Form, Input, DatePicker, TimePicker, Select, TreeSelect } from "antd";
import popMessage from "../utils/popMessage";
import moment from "moment";

const AddScheduleModal = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();

    const [date, setDate] = useState('');
    const [validTimeRange, setValidTimeRange] = useState(true);
    const [treeValue, setTreeValue] = useState();

    const { repeatTypes, startDate, endDate } = usePlanner();
    const { allCourses } = useCourse();

    const rTypes = []
    for (let i = 0; i <= repeatTypes.length; i++) { rTypes.push({ value: repeatTypes[i], label: repeatTypes[i] }) }

    const courseTasks = allCourses.map((c) => {
        return {
            title: c.courseName,
            value: c.courseId,
            children: c.tasks.map((t) => {
                return { title: `${c.courseName}-${t.taskName}`, value: `${c.courseId}-${t._id}` }
            })
        }
    })
    courseTasks.unshift({ title:"非課程", value:"非課程" })

    const onTimePickerChange = (e) => {
        if (e[0].$H > e[1].$H) {
            setValidTimeRange(false);
            popMessage(false, "End time must be later than start time!")
        } else {
            setValidTimeRange(true);
        }
    }

    const onTreeChange = (newValue) => {
        setTreeValue(newValue);
    }
    
    const dateInput = (d, dateString) => {
        // console.log(d, dateString);
        setDate(dateString);
    }

    const limitedDate = (current) => {
        return current < moment(startDate, "YYYY-MM-DD") ||  current > moment(endDate, "YYYY-MM-DD").add(1, 'd')
    }

    return (
        <Modal 
            open={open}
            title="Add a schedule to your calender!"
            onText="Add"
            cancelText="Cancel"
            onCancel={onCancel}
            style={{position: "absolute", left: '30vw', top: '5vh'}}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields();
                        
                        const { scheduleName, scheduleDate,
                                timeRange,
                                course_task, isRepeat } = values;
                        // course_task is `courseId-taskId`

                        const startTime = timeRange[0].$H
                        const endTime = timeRange[1].$H

                        onCreate(scheduleName, date, 
                                 startTime, endTime, 
                                 course_task, isRepeat);

                    }).catch((e) => {
                        window.alert(e);
                    })
            }} >

            <Form form={form} layout="vertical" name="form_in_modal" >
                <Form.Item 
                    name="scheduleName"
                    label="Enter the schedule name"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter a schedule name!",
                        },
                    ]} 
                >
                    <Input />
                </Form.Item>
                <Form.Item 
                    name="scheduleDate"
                    label="Enter the schedule date"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter the schedule date!",
                        },
                    ]} 
                >
                    <DatePicker onChange={dateInput} disabledDate={limitedDate} />
                </Form.Item>
                <Form.Item 
                    name="timeRange"
                    label="Enter the time range of the schedule"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter the time range of the schedule!",
                        },
                    ]} 
                >
                    <TimePicker.RangePicker format={"HH"} 
                                            status={validTimeRange? 'validating':'error'}
                                            onChange={onTimePickerChange} />
                </Form.Item>
                <Form.Item 
                    name="course_task"
                    label="Select a course and a task"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter a course and a task!",
                        },
                    ]} 
                >
                    <TreeSelect
                        style={{
                            width: '100%',
                        }}
                        value={treeValue}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto',
                        }}
                        treeData={courseTasks}
                        placeholder="Select course and task"
                        treeDefaultExpandAll
                        onChange={onTreeChange}
                        />
                </Form.Item>
                <Form.Item 
                    name="isRepeat"
                    label="Enter the repeat type the schedule"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter the repeat type of the schedule!",
                        },
                    ]} 
                >
                    <Select
                        showSearch
                        placeholder="Select repeat type"
                        optionFilterProp="children"
                        options={rTypes}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddScheduleModal;
