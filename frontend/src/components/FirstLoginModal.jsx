// hooks
import { useState } from "react";

import { Modal, Form, Input, DatePicker, Select } from "antd";

const FirstLoginModal = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();

    const [sDate, setSDate] = useState("");
    const [eDate, setEDate] = useState("");

    const startDateInput = (date, dateString) => {
        setSDate(dateString)
    }

    const endDateInput = (date, dateString) => {
        setEDate(dateString)
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
                        
                        const { nickname, startDate, endDate } = values;
                        onCreate(nickname, sDate, eDate);

                    }).catch((e) => {
                        window.alert(e);
                    })
            }} >

            <Form form={form} layout="vertical" name="form_in_modal" >
                <Form.Item 
                    name="nickname"
                    label="Determine your nickname"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter a nickname!",
                        },
                    ]} 
                >
                    <Input />
                </Form.Item>
                <Form.Item 
                    name="startDate"
                    label="Enter the start date of your schedule"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter the start date!",
                        },
                    ]} 
                >
                    <DatePicker onChange={startDateInput} />
                </Form.Item>
                <Form.Item 
                    name="endDate"
                    label="Enter the end date of your schedule"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter the end date!",
                        },
                    ]} 
                >
                    <DatePicker onChange={endDateInput} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default FirstLoginModal;
