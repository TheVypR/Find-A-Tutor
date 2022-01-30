import React, {useState, useEffect} from 'react';
import './components/App.css';

import Calendar from './components/calendar'
import TutorProfile from "./components/TutorProfile"

function App() {
  const  [name, setName] = useState("")
  const  [email, setEmail] = useState("")
//  useEffect(()=> {
//  fetch('/signup/', {'method':'POST'}).then(
//      response => response.json()
//    ).then(data => setContent(data))
//  }, []);
  return (
    <div className="App">
      <TutorProfile />
    </div>
  );
}

export default App;
