import { useState, useEffect } from 'react';
import { useContext } from 'react';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Logo from '../images/logo.png';



const theme = createTheme({
    palette: {
        secondary: {
            main: '#FFFFFF'
        }
    }
});

export default function NavBar() {
    const [isTutor, setIsTutor] = useState(false);
    useEffect(() => {
        fetch("/isTutor/?token=" + localStorage.getItem("token")).then(res => res.json()).then(result => { console.log(result); setIsTutor(result) });
    }, []);

    function AddTutor() {
        fetch('/AddTutor/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(localStorage.getItem("token"))
        });
    }
    const auth = useContext(AuthContext);

    let buttons;
    if (!isTutor) {
        buttons = <Button onClick={() => {AddTutor(); localStorage.setItem("view", "tutor");  }} href="./myProfile" color="inherit" variant="outlined" sx={{ my: 1, mx: 1 }}>Become A Tutor</Button>
    } else if (localStorage.getItem("view") === "tutor") {
        buttons = <Button onClick={() => { localStorage.setItem("view", "student") }} color="inherit" variant="outlined" sx={{ my: 1, mx: 1 }}>Switch To Student View</Button>
    } else {
        buttons = <Button onClick={() => localStorage.setItem("view", "tutor")} color="inherit" variant="outlined" sx={{ my: 1, mx: 1 }}>Switch To Tutor View</Button>
    }

    return auth.isLoggedIn && (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar postion="static" color="primary" sx={{ borderTheme: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Toolbar sx={{ flexwrap: 'wrap' }}>
                    <img
                        src={`${Logo}`}
                        width="50"
                        height="40"
                        alt="Find-A-Tutor Logo"
                        loading="lazy"
                        className='logo'
                    />
                    <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: 'flex' }}>
                        Find-A-Tutor
                    </Typography>
                    {buttons}
                    <Toolbar sx={{ flexwrap: 'wrap', margin: 'auto', display: 'flex' }}>
                        <MenuItem component='a' href='./Calendar'>
                            <Typography textAlign='center'>Calendar</Typography>
                        </MenuItem>
                        <MenuItem component='a' href='./GroupTutoring'>
                            <Typography textAlign='center'>Group Tutoring</Typography>
                        </MenuItem>
                        <MenuItem component='a' href='./ProfessorInfo'>
                            <Typography textAlign='center'>Professor Info</Typography>
                        </MenuItem>
                        <MenuItem component='a' href='./ClassInfo'>
                            <Typography textAlign='center'>Class Info</Typography>
                        </MenuItem>
                        <MenuItem component='a' href={(localStorage.getItem("view") == "tutor" ? './TutoringHistory' : './StudentHistory')}>
                            <Typography textAlign='center'>Tutoring History</Typography>
                        </MenuItem>
                    </Toolbar>
                    <Link to={"/myProfile"}><AccountBoxOutlinedIcon sx={{ fontSize: 60 }} color='secondary' /></Link>
                    <Button onClick={auth.logout} href='./' color='inherit' variant='outlined' sx={{ my: 1, mx: 1 }}>Logout</Button>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}