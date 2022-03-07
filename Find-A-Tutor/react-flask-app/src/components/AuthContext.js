import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: null,
    access_token: localStorage.getItem("logIn"),
    login: () => {},
    logout: () => {}
});