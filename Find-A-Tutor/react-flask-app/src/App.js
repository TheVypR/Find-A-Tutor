import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './components/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Calendar from './components/calendar'
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import TutorProfile from "./components/TutorProfile"
import TutoringHistory from './components/TutoringHistory';
import StudentHistory from './components/StudentHistory';
import Reports from './components/Reports';
import CurrentAndBan from './components/CurrentAndBan';

import { AuthContext } from './components/AuthContext'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  //set login and logout; this is where we will set the authentication from the backend
  const login = () => {
    setLoggedIn(true);
  };

  const logout = () => {
    setLoggedIn(false);
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{isLoggedIn: loggedIn, login: login, logout: logout}}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<SignIn />}></Route>
            <Route path='/signup' element={<SignUp />}></Route>
            <Route path='/myProfile' element={<TutorProfile />} />
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