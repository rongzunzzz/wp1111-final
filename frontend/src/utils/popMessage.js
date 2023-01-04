import { message } from "antd";

const popMessage = (success, msg) => {
    const content = {
        content: msg, duration: 1.5
    }
    if (success) {
        message.success(content);
    } else {
        message.error(content);
    }
}

export default popMessage;
