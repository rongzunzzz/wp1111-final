// hooks
import { useState } from "react";
import { useCourse } from "../hooks/useCourse";

import { Modal, Form, Input, DatePicker, Select } from "antd";

const AddCourseTaskModal = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();

    const [due, setDue] = useState('');
    const { taskTypeList } = useCourse();

    const typeOptions = taskTypeList.map((t) => ( { value: t, label: t.toUpperCase() } ))
    const timeOptions = Array.from(Array(100).keys()).map((idx) => ({ value: idx + 1, label: idx + 1 }))

    const dateInput = (date, dateString) => {
        // console.log(date, dateString);
        setDue(dateString);
    }

    return (
        <Modal 
            open={open}
            title="Add a task of this course!"
            onText="Add"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields();
                        
                        const { taskName, dueDate, type, time } = values;
                        onCreate(taskName, due, type, time);

                    }).catch((e) => {
                        window.alert(e);
                    })
            }} >

            <Form form={form} layout="vertical" name="form_in_modal" >
                <Form.Item 
                    name="taskName"
                    label="Enter the task name"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter a task name!",
                        },
                    ]} 
                >
                    <Input />
                </Form.Item>
                <Form.Item 
                    name="dueDate"
                    label="Enter the due date"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter the due date!",
                        },
                    ]} 
                >
                    <DatePicker onChange={dateInput} />
                </Form.Item>
                <Form.Item 
                    name="type"
                    label="Enter the type of the task"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter the type of the task!",
                        },
                    ]} 
                >
                    <Select
                        showSearch
                        placeholder="Select type"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={typeOptions}
                    />
                </Form.Item>
                <Form.Item 
                    name="time"
                    label="Enter the expected finished time of the task"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter expected finished time of the task!",
                        },
                    ]} 
                >
                    <Select
                        showSearch
                        placeholder="Select time"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={timeOptions}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddCourseTaskModal;
