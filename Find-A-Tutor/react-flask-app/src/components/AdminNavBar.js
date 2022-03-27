import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import * as React from 'react';

export default function AdminNavBar() {
    return (
        <AppBar postion="static" color="primary" elevation={0} sx={{borderTheme: (theme) => `1px solid ${theme.palette.divider}`}}>
            <Toolbar sx={{flexwrap: 'wrap'}}>
                <Typography component="h1" variant="h4" color="inherit" sx={{px: 5, flexGrow: 1, display: 'flex'}}>
                    Admin View
                </Typography>
                <MenuItem component='a' href='./AddGroupTutoring'>
                    <Typography variant="button" align="center" color="inherit" sx={{my: 1, mx: 1}}>Group Tutoring</Typography>
                </MenuItem>
                <MenuItem component='a' href='./Reports'>
                    <Typography variant="button" align="center" color="inherit" sx={{my: 1, mx: 1}}>Reports</Typography>
                </MenuItem>
                <MenuItem component='a' href='./CurrentAndBan'>
                    <Typography variant="button" align="center" color="inherit" sx={{my: 1, mx: 1}}>Tutors and Banned List</Typography>
                </MenuItem>
                <Button href="./" color="inherit" variant="outlined" sx={{my: 1, mx: 5}}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
}