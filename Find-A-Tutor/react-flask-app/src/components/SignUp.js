
const SignUp = () => {
	return (
		<div className="App">
		  <Calendar />
		</div>
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
				})}}>Submit
				</button>
			</form>
		</div>
	  );
}

const ClassAdd = () => {
	const classes = []
	return (
		<div>
			<form>
				<label> Classes </label>
				<input 
					type="text"
					value={classes[0]}
					
				>
			</form>
		</div>
	);
}