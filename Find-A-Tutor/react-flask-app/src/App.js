import React, {useState, useEffect} from 'react';
import './components/App.css';

import Calendar from './components/calendar'
import TutorProfile from "./components/TutorProfile"

function App() {
  const  [name, setName] = useState("")
  const  [email, setEmail] = useState("")
  useEffect(()=> {
  fetch('/myProfile/', {'method':'GET'}).then(
      response => response.json()
    ).then(data => setName(data))
  }, []);
  return (
    <div className="App">
		<TutorProfile />
    </div>
  );
}

export default App;
