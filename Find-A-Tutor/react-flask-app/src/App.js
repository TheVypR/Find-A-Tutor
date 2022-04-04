import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, Switch } from 'react-router-dom';
import './components/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Calendar from './components/calendar'
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import { createContext } from 'react';
import TutoringHistory from './components/TutoringHistory';
import StudentHistory from './components/StudentHistory';
import Reports from './components/Reports';
import CurrentAndBan from './components/CurrentAndBan';
import LoadProfile from './components/LoadProfile';
import AddGroupTutoring from './components/AddGroupTutoring';
import GroupTutoring from './components/GroupTutoring';
import FileUpload from './components/FileUpload';
import { AuthContext } from './components/AuthContext';
import ProfessorUpload from './components/ProfessorUpload';
import ClassUpload from './components/ClassUpload';

export default function App() {
	
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token") !== null ? true : false);

  //doesn't work with cors and without cors doesn't like the JSON
  useEffect(() => {
	 if (localStorage.getItem("token") !== null) {
		fetch("/authCheck/?token=" + localStorage.getItem("token"), {method: 'GET'})
			.then(res => res.json())
			.then(result => {setLoggedIn(result['loggedIn'])})
      
	 } else {
		setLoggedIn(false);
	 }
  }, [])

  //set login and logout; this is where we will set the authentication from the backend
  //changes the user to be logged in
  const login = () => {
	setLoggedIn(true);
  };
  
  //changes the user to be logged out
  const logout = () => {
	setLoggedIn(false);
	localStorage.setItem("token", "");
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
            <Route path='/GroupTutoring' element={<GroupTutoring />} />
            <Route path='/TutoringHistory' element={<TutoringHistory />} />
            <Route path='/StudentHistory' element={<StudentHistory />} />
            <Route path='/Reports' element={<Reports />} />
            <Route path='/CurrentAndBan' element={<CurrentAndBan />} />
            <Route path='/AddGroupTutoring' element={<AddGroupTutoring />} />
			      <Route path='/FileUpload' element={<FileUpload />} />
            <Route path='/ProfessorUpload' element={<ProfessorUpload />} />
            <Route path='/ClassAndSyllabi' element={<ClassUpload />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  )
}