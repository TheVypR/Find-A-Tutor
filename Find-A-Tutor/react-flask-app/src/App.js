import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './components/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Calendar from './components/calendar'
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import TutorProfile from "./components/TutorProfile"
import './App.css';
import Calendar from './components/calendar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<SignIn/>}></Route>
          <Route exact path='/myProfile' element={<TutorProfile/>}></Route>
          <Route exact path='/signup' element={<SignUp/>}></Route>
        </Routes>
      </BrowserRouter>
      <Calendar/>
    </div>
  );
}

export default App;
