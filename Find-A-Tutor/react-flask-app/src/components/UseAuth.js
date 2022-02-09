import * as React from 'react';

const authContext = React.createContext();

export default function UseAuth() {
  const [authed, setAuthed] = React.useState("");

  fetch("/email/", {
  method: 'GET',
  headers: {
  'Content-Type' : 'application/json'
  },
  });

  return console.log(authed);
}