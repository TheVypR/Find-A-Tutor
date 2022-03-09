import * as React from 'react';
import { useState } from 'react';
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

const theme = createTheme({
    palette: {
        secondary: {
            main: '#FFFFFF'
        }
    }
});
export default function NavBar() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar postion="static" color="primary" sx={{borderTheme: (theme) => `1px solid ${theme.palette.divider}`}}>
                <Container maxWidth="xl">
                    <Toolbar disableGutter sx={{flexwrap: 'wrap'}}>
                        <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: {xs:'none', md:'flex'}}}>
                            Find-A-Tutor
                        </Typography>
                        
                        <Button href="./myProfile" color="inherit" variant="outlined" style={{position: "flex-start"}} sx={{my: 1, mx: 1}}>Become A Tutor</Button>
                        <MenuItem component='a' href='./Calendar'>
                            <Typography textAlign='center'>Calendar</Typography>
                        </MenuItem>
                        <MenuItem component='a' href='./TutoringHistory'>
                            <Typography textAlign='center'>Tutoring History</Typography>
                        </MenuItem>
                        <Link to={"/myProfile"}><AccountBoxOutlinedIcon sx={{fontSize: 70}} color='secondary' /></Link>
                        <Button href='./' color='inherit' variant='outlined' sx={{my:1,mx:1}}>Logout</Button>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    );
}