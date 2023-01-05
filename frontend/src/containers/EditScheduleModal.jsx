// hooks, functions
import { useState } from "react";
import popMessage from "../utils/popMessage";
import { usePlanner } from "../hooks/usePlanner";

// styles
import { Modal, Form, Input, DatePicker, TimePicker, Select } from "antd";

import moment from "moment";

const EditScheduleModal = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();

    const [date, setDate] = useState('');
    const { startDate, endDate } = usePlanner();
    const [validTimeRange, setValidTimeRange] = useState(true);

    const onTimePickerChange = (e) => {
        if (e[0].$H > e[1].$H) {
            setValidTimeRange(false);
            popMessage(false, "End time must be later than start time!")
        } else {
            setValidTimeRange(true);
        }
    }
    
    const dateInput = (d, dateString) => {
        // console.log(d, dateString);
        setDate(dateString);
    }
    const zIn = 20;

    const limitedDate = (current) => {
        return current < moment(startDate, "YYYY-MM-DD") ||  current > moment(endDate, "YYYY-MM-DD").add(1, 'd')
    }

    return (
        <Modal 
            open={open}
            title="Edit the schedule!"
            onText="Add"
            cancelText="Cancel"
            onCancel={onCancel}
            style={{position: "absolute", left: '30vw', top: '5vh'}}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields();
                        
                        const { scheduleName, scheduleDate, timeRange } = values;

                        const startTime = timeRange[0].$H
                        const endTime = timeRange[1].$H

                        onCreate(scheduleName, date, startTime, endTime);

                    }).catch((e) => {
                        window.alert(e);
                    })
            }} 
            zIndex={zIn}
            >

            <Form form={form} layout="vertical" name="form_in_modal" >
                <Form.Item 
                    name="scheduleName"
                    label="Edit the schedule name"
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
                    label="Edit the schedule date"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter the schedule date!",
                        },
                    ]} 
                >
                    <DatePicker onChange={dateInput} disabledDate={limitedDate}/>
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
            </Form>
        </Modal>
    );
}

export default EditScheduleModal;