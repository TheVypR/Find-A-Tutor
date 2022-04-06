/*https://mui.com/getting-started/templates/*/
import react, { useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

import GroupTutoring from './GroupTutoring'
import './LoginCSS.css'
import AppBar from '@mui/material/AppBar';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Logo from '../../images/logo.png'


const theme = createTheme();

export default function SignIn(props) {
  const nav = useNavigate();
  const [wrongLogin, setWrongLogin] = useState(false);

  //authentication information
  const authContext = useContext(AuthContext);

  const loginHandler = function () {
    authContext.login();
    console.log(authContext);
    nav('/calendar');
  };

  const logoutHandler = function () {
    authContext.logout();
    nav('/');
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const info = [data.get('email'), data.get('password')]
    fetch("/login/", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info)
    }).then(resp => resp.json())
      .then(result => {
        if (result['email'] === info[0]) {
          if (result['isAdmin'] === 1) {
            authContext.login();
            nav('/Reports');
          }
          else {
            if (result['isTutor']) {
              localStorage.setItem("view", true);
            }
            loginHandler();
          }
          localStorage.setItem("token", result['token']);
          localStorage.setItem("view", (result['loginPref'] == 1 ? "tutor" : "student"));
        }
        else {
          setWrongLogin(true)
          logoutHandler();
        }
      })
  };


  const WrongSignIn = () => {
    return (
      <div style={{ color: 'red' }}>
        Incorrect Email or Password
      </div>
    )
  }

  return (
    <>
      <AppBar postion="static" color="primary" sx={{ borderTheme: (theme) => `1px solid ${theme.palette.divider}` }}>
        <div className="d-flex justify-content-around align-items-center">
          <div className="d-flex align-items-center">
            <h1> Welcome to <br /> Find-A-Tutor</h1>
            <img
              src={`${Logo}?w=50&h=50&fit=crop&auto=format`}
              srcSet={`${Logo}?w=50&h=50&fit=crop&auto=format&dpr=2 15x`}
              alt="Find-A-Tutor Logo"
              loading="lazy"
              className='logo'
            />
          </div>
          <div className="d-flex justify-content-center Login">
            {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar> */}
            {wrongLogin ? <WrongSignIn /> : null}
            <div className="d-flex flex-column align-items-center">
              <TextField
                margin="normal"
                size="small"
                required
                style={{ width: '225px', margin: "25px" }}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                variant="filled"
                className='username'
                InputProps={{
                  disableUnderline: true, // <== added this
                }}
              />
              <Button
                type="submit"
                style={{ width: '100px', marginTop: "5px", marginLeft: "5px", marginRight: "5px", display: "inline-block" }}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
            </div>

            <div className="d-flex flex-column">
              <TextField
                margin="normal"
                size="small"
                required
                style={{ width: '225px', margin: "25px" }}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                className="password"
                variant="filled"
                InputProps={{
                  disableUnderline: true, // <== added this
                }}
              />
              <Link to='/signup' variant="body2" style={{ display: "inline-block" }} >
                {"Don't have an account? Sign Up"}
              </Link>
            </div>
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
          </div>
        </div>
      </AppBar>

      <div className="groupTutoring">
        <GroupTutoring />
      </div>
    </>
  );
}
