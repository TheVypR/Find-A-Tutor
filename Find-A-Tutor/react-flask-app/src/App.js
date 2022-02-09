import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './components/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Calendar from './components/calendar'
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import TutorProfile from "./components/TutorProfile"
import './components/App.css';
import PrivateRoute from "./components/UseAuth"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<SignIn/>}></Route>
          <Route exact path='/myProfile' element={
            <PrivateRoute>
              <TutorProfile />
            </PrivateRoute>
          } />
          <Route exact path='/signup' element={<SignUp/>}></Route>
          <Route exact path='/calendar' element={
            <PrivateRoute>
              <Calendar/>
            </PrivateRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;