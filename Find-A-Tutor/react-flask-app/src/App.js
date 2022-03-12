//FIND-A-TUTOR ~ Core Frontend ~
import React, { useState, useEffect, useContext } from 'react';					//used for authentication
import { BrowserRouter, Routes, Route, Link, Switch } from 'react-router-dom';	//used for authentication
import './components/App.css';													//used for styling
import 'bootstrap/dist/css/bootstrap.min.css';									//used for styling
import Calendar from './components/calendar'									//calendar screen
import SignIn from "./components/SignIn"										//SignIn screen
import SignUp from "./components/SignUp"										//SignUp screen
import TutorProfile from "./components/TutorProfile/T_Profile"					//TutorProfile screen
import StudentProfile from "./components/StudentProfile"						//StudentProfile screen
import TutoringHistory from './components/TutoringHistory';						//TutorHistory screen
import StudentHistory from './components/StudentHistory';						//StudentHistory screen
import Reports from './components/Reports';										//Admin reports screen
import CurrentAndBan from './components/CurrentAndBan';							//Admin banning screen
import LoadProfile from './components/LoadProfile';								//LoadProfile route
import { AuthContext } from './components/AuthContext'							//used for authentication

//the core function
//calls all other pages and manages authentication
export default function App() {
  //check if user is logged in
  const [loggedIn, setLoggedIn] = useState((localStorage.getItem("loggedIn") !== null ? localStorage.getItem("loggedIn") : false));

  //set login and logout; this is where we will set the authentication from the backend
  //changes the user to be logged in
  const login = () => {
	localStorage.setItem("loggedIn", true);
  setLoggedIn(localStorage.getItem("loggedIn"));	
  };
  
  //changes the user to be logged out
  const logout = () => {
	setLoggedIn(false);
	localStorage.setItem("loggedIn", false);
  localStorage.setItem("email", "");
  };

  //renders the correct screen based on navs in other .js files
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