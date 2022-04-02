import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import './adminView.css';
import {AuthContext} from './AuthContext';
import AdminNavBar from './NavBar';

//making styles and themes
const theme = createTheme();

export default function ProfessorUpload() {
    //authentication
	const authContext = useContext(AuthContext);

    //Get list of group tutoring sessions
    // useEffect(() => { fetch("/GroupTutoring/")
    //     .then(res => res.json())
    //     .then(result => {
    //         setAllGroup(result);
    //     },
    //     (error) => {
    //         console.log(error);
    //     })
    // }, []);

    return authContext.isLoggedIn && (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdminNavBar />
            <Grid container justifyContent="right" sx={{pt: 11, pr: 6, pb: 3}} />
            <Container maxWidth="xl" disableGutters component="main" sx={{px: 6}}>
                <Paper sx={{p: 2, position: 'relative', backgroundColor: 'white', color: '#fff', mb: 4, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Professor CSV Upload
                    </Typography>
                    <TextField>

                    </TextField>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}