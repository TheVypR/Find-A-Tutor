import React, {useState, useEffect} from 'react';
import './components/App.css';

import Calendar from './components/calendar'
import TutorProfile from "./components/TutorProfile"

function App() {
  const  [initialData, setInitialData] = useState([{}])
  
  useEffect(()=> {
    fetch('/myProfile/').then(
      response => response.json()
    ).then(data => setInitialData(data))
  }, []);
  return (
    <div className="App">
      <TutorProfile />
    </div>
  );
}

export default App;
