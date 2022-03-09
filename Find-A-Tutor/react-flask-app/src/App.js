import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, Switch } from 'react-router-dom';
import './components/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Calendar from './components/calendar'
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import TutorProfile from "./components/TutorProfile/T_Profile"
import StudentProfile from "./components/StudentProfile"
import { createContext } from 'react';
import TutoringHistory from './components/TutoringHistory';
import StudentHistory from './components/StudentHistory';
import Reports from './components/Reports';
import CurrentAndBan from './components/CurrentAndBan';
import LoadProfile from './components/LoadProfile';
import ContactMe from './components/ContactMe';

import { AuthContext } from './components/AuthContext'

export default function App() {
  const [loggedIn, setLoggedIn] = useState((localStorage.getItem("loggedIn") !== null ? localStorage.getItem("loggedIn") : false));

  //set login and logout; this is where we will set the authentication from the backend
  const login = () => {
	setLoggedIn(true);
	localStorage.setItem("loggedIn", true);
	
  };

  const logout = () => {
	setLoggedIn(false);
	localStorage.setItem("loggedIn", false);
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{isLoggedIn: loggedIn, login: login, logout: logout}}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<SignIn />}></Route>
            <Route path='/signup' element={<SignUp />}></Route>
            <Route path='/myProfile' element={<LoadProfile />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/TutoringHistory' element={<TutoringHistory />} />
            <Route path='/StudentHistory' element={<StudentHistory />} />
            <Route path='/Reports' element={<Reports />} />
            <Route path='/CurrentAndBan' element={<CurrentAndBan />} />
            <Route path='/Contactable' element={<ContactMe />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  )
}

function useProvideAuth() {

}

function PrivateRoute({ children }) {
  // let auth = useAuth();

  // const [user, setUser] = useState("");

  // useEffect(() => {
    // fetch("/email/", {
      // method: 'GET',
      // headers: {
        // 'Content-Type' : 'application/json'
      // },
      // })
      // .then(res => res.json())
      // .then(authTag => setUser(authTag))
      // //.then(console.log(user.authTag))
      // .catch(error => console.log("COULD NOT FETCH /EMAIL/"));
  // }, []);

  // //console.log(user.authTag);

  // return (
    // user.authTag != "USER NOT FOUND" ? children : <SignIn />
  // );
}