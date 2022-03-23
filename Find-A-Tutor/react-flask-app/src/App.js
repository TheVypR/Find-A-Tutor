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

import { AuthContext } from './components/AuthContext'

export default function App() {
	
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token") !== null ? true : false);

  //doesn't work with cors and without cors doesn't like the JSON
  useEffect(() => {
	 if (localStorage.getItem("token") !== null) {
		fetch("/authCheck/?token=" + localStorage.getItem("token"), {method: 'GET'})
			.then(res => res.json())
			.then(result => {console.log(result); setLoggedIn(result['loggedIn'])})
	 } else {
		setLoggedIn(false);
	 }
  }, [])
  
  

  //set login and logout; this is where we will set the authentication from the backend
  const login = () => {
	setLoggedIn(true);
  };

  const logout = () => {
	setLoggedIn(false);
	localStorage.setItem("token", "");
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
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  )
}