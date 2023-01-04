import { Modal, Form, Input, Select } from "antd";
import ColorList from "../utils/ColorList";

const AddCourseModal = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();

    const colorList = ColorList.map((c) => ( { 
        value: c, 
        label: <div style={{ display: 'flex' }}>
            <span style={{ background: c, width: 18, height: 18, marginRight: 5 }}></span>
            <span>{`${c}`}</span>
        </div>
            
    }))

    return (
        <Modal 
            open={open}
            title="Add a course to your course list!"
            onText="Add"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields();
                        
                        const { courseName, color } = values;
                        onCreate(courseName, color);

                    }).catch((e) => {
                        window.alert(e);
                    })
            }} >

            <Form form={form} layout="vertical" name="form_in_modal" >
                <Form.Item 
                    name="courseName"
                    label="Enter the course name"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please enter a course name!",
                        },
                    ]} 
                >
                    <Input />
                </Form.Item>
                <Form.Item 
                    name="color"
                    label="Select the block color!"
                    rules={[
                        {
                            required: true,
                            message: "Error: Please select a color!",
                        },
                    ]} 
                >
                    <Select
                        showSearch
                        placeholder="Select color"
                        optionFilterProp="children"
                        options={colorList}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddCourseModal;
