// hooks
import { useUserInfo } from "../../hooks/useUserInfo";

// pages
import Welcome from "./Welcome";
import Planner from "./Planner";

const HomePage = () => {

    const { signedIn } = useUserInfo();
    return (
        <>
            {signedIn? <Planner /> : <Welcome />}
        </>
    )
}

export default HomePage;
