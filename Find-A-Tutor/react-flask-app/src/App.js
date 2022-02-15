import React, {useState, useEffect, useContext} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './components/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Calendar from './components/calendar'
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import TutorProfile from "./components/TutorProfile"
import StudentProfile from "./components/StudentProfile"
import { createContext } from 'react';

export default function App() {
  return (
    <ProvideAuth>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<SignIn/>}></Route>
            <Route exact path='/signup' element={<SignUp/>}></Route>
            <Route exact path='/myProfile' element={
              <PrivateRoute>
                <StudentProfile />
              </PrivateRoute>
            } />
            <Route exact path='/calendar' element={
              <PrivateRoute>
                <Calendar/>
              </PrivateRoute>
            }/>
          </Routes>
        </BrowserRouter>
      </div>
    </ProvideAuth>
  );
}

const authContext = createContext();

function useAuth() {
  return useContext(authContext);
}

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  )
}

function useProvideAuth() {
  const [user, setUser] = useState("");

  useEffect(() => {
    fetch("/email/", {
      method: 'GET',
      headers: {
        'Content-Type' : 'application/json'
      },
      })
      .then(res => res.json())
      .then(res => setUser(res))
      .catch(error => console.log("COULD NOT FETCH /EMAIL/"));
  }, []);

  console.log(user);

  return {
    user
  };
}

function PrivateRoute({ children }) {
  let auth = useAuth();

  const [user, setUser] = useState("");

  useEffect(() => {
    fetch("/email/", {
      method: 'GET',
      headers: {
        'Content-Type' : 'application/json'
      },
      })
      .then(res => res.json())
      .then(res => setUser(res))
      .catch(error => console.log("COULD NOT FETCH /EMAIL/"));
  }, []);

  console.log(user);

  return (
    auth.user == "" ? children : <SignIn />
  );
}