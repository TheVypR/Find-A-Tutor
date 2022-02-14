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
import './components/App.css';
import { createContext } from 'react';

export default function App() {
  return (
    <ProvideAuth>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<SignIn/>}></Route>
            <Route exact path='/myProfile' element={
              <PrivateRoute>
                <TutorProfile />
              </PrivateRoute>
            } />
            <Route exact path='/signup' element={<SignUp/>}></Route>
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

const authenticate = {
  isAuth: false,
  signin(cb) {
    authenticate.isAuth = true;
    setTimeout(cb, 100);
  },
  signout(cb) {
    authenticate.isAuth = false;
    setTimeout(cb, 100);
  }
};

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
  const [user, setUser] = useState(null);

  

  const signin = cb =>{
    return authenticate.signin(() => {
      setUser("Good");
      cb();
    });
  };

  const signout = cb =>{
    return authenticate.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout
  };
}

function PrivateRoute({ children }) {
  let auth = useAuth();
  return (
    auth.user == null ? children : <SignIn />
  );
}