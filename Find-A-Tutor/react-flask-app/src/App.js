import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
  const  [initialData, setInitialData] = useState([{}])
  
  useEffect(()=> {
    fetch('/myProfile/').then(
      response => response.json()
    ).then(data => setInitialData(data))
  }, []);
  return (
    <div className="App">
      <h1>Yay</h1>
    </div>
  );
}

export default App;
