import * as React from 'react';
import { useState, useContext } from 'react';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const theme = createTheme({
    palette: {
        secondary: {
            main: '#FFFFFF'
        }
    }
});
export default function NavBar() {
    const auth = useContext(AuthContext);
    return auth.isLoggedIn && (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar postion="static" color="primary" sx={{borderTheme: (theme) => `1px solid ${theme.palette.divider}`}}>
                <Toolbar sx={{flexwrap: 'wrap'}}>
                    <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: 'flex'}}>
                        Find-A-Tutor
                    </Typography>
                    
                    <Button href="./myProfile" color="inherit" variant="outlined" sx={{my: 1, mx: 1}}>Become A Tutor</Button>
                    <Toolbar sx={{flexwrap: 'wrap', margin: 'auto', display: 'flex'}}>
                        <MenuItem component='a' href='./Calendar'>
                            <Typography textAlign='center'>Calendar</Typography>
                        </MenuItem>
                        <MenuItem component='a' href='./TutoringHistory'>
                            <Typography textAlign='center'>Tutoring History</Typography>
                        </MenuItem>
                    </Toolbar>
                    <Link to={"/myProfile"}><AccountBoxOutlinedIcon sx={{fontSize: 60}} color='secondary' /></Link>
                    <Button onClick={auth.logout} href='./' color='inherit' variant='outlined' sx={{my:1,mx:1}}>Logout</Button>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}