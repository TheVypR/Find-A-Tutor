import * as React from 'react';
import { Link } from 'react-router-dom';

const authContext = React.createContext();

function UseAuthenticate() {
  const [authed, setAuthed] = React.useState("");

  fetch("/email/", {
  method: 'GET',
  headers: {
    'Content-Type' : 'application/json'
  },
  })
  .then(res => res.json())
  .then(res => setAuthed(res))
  .catch(error => console.log("COULD NOT FETCH /EMAIL/"));

  console.log(authed + " AUTHED IS NULL");
  return authed;
}

export default function PrivateRoute ({ children }) {
  return UseAuthenticate == null ? children : <Link to='/'></Link>;
}

