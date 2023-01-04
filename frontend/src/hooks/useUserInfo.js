import { createContext, useContext, useEffect, useState } from "react";

const UserInfoContext = createContext({
    account: "",
    password: "",
    signedIn: false,
    nickName: "",

    setAccount: () => {},
    setPassword: () => {},
    setSignedIn: () => {},
    setNickName: () => {},

});

const UserInfoProvider = (props) => {
    
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [signedIn, setSignedIn] = useState(false);
    const [nickName, setNickName] = useState("HELLO");

    return (
        <UserInfoContext.Provider 
            value={{
                account, setAccount,
                password, setPassword,
                signedIn, setSignedIn,
                nickName, setNickName,
            }}
            {...props} />
    )
}

const useUserInfo = () => useContext(UserInfoContext);

export { UserInfoProvider, useUserInfo};
