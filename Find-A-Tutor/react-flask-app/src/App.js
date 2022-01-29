import React, {useState, useEffect} from 'react';
import './components/App.css';

import Calendar from './components/calendar'

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
		<form>
			<label htmlFor="name" className="form-label">Name</label>
			<input 
			type="text"
			className="form-control" 
			placeholder ="Enter name"
			value={name}
			onChange={(e)=>setName(e.target.value)}
			required
			/>
			<label htmlFor="email" className="form-label">Email</label>
			<input 
			type="text"
			className="form-control" 
			placeholder ="Enter email"
			value={email}
			onChange={(e)=>setEmail(e.target.value)}
			required
			/>
			<button 
			type="submit" 
			value="todo"
			onClick={async () => {
			const todo = { name, email };
			const response = await fetch("/signup/", {
			method: "POST",
			headers: {
			'Content-Type' : 'application/json'
			},
			body: JSON.stringify(todo)
			})}}>Next
			</button>
		</form>
	</div>
  );
}

export default App;
