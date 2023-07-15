import React, {createContext} from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    userid: null,
    token: null,
    login: () => {},
    logout: () => {}
});