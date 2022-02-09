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
import UseAuth from "./components/UseAuth"

function RequireAuth() {
  useEffect(() => {
		fetch('/email')
			.then(response => {
				if(response.ok) {
					return response.json()
				}
				throw response;
			})
			.then(data => {
				setEmail(data['authTag']);
			})
			.catch(error => {
				console.error("Error fetching data:", error);
			})
	}, []);

  const[email, setEmail] = useState('');

  if (email == "") {
    console.log("BOO")
  }
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<SignIn/>}></Route>
          <Route exact path='/myProfile' element={<TutorProfile/> } onEnter={RequireAuth} />
          <Route exact path='/signup' element={<SignUp/>}></Route>
          <Route exact path='/calendar' element={<Calendar/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
