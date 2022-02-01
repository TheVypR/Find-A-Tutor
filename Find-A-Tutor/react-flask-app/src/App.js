import React, {useState, useEffect} from 'react';
import './components/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Calendar from './components/calendar'
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import TutorProfile from "./components/TutorProfile"

function App() {
  return (
    <div className="App">
		<TutorProfile />
    </div>
  );
}

export default App;
