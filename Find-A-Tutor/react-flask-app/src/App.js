import React, {useState, useEffect} from 'react';
import './App.css';
import Calendar from './calendar';

function App() {
  const  [initialData, setInitialData] = useState([{}])
  
  useEffect(()=> {
    fetch('/myProfile/').then(
      response => response.json()
    ).then(data => setInitialData(data))
  }, []);
  return (
    <div className="App">
      <Calendar/>
    </div>
  );
}

export default App;
