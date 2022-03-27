import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import './adminView.css';
import {AuthContext} from './AuthContext';
import AdminNavBar from './AdminNavBar';

//making styles and themes
const theme = createTheme();

export default function AddGroupTutoring() {
    //authentication
	const authContext = useContext(AuthContext);

    return authContext.isLoggedIn && (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdminNavBar />
            <Container maxWidth="sm" disableGutters component="main" sx={{pt: 6}}></Container>
            <Container maxWidth="xl" disableGutters component="main" sx={{pt: 6}}>
                <Paper sx={{p: 2, position: 'relative', backgroundColor: 'white', color: '#fff', mb: 4, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Group Tutoring
                    </Typography>
                    <Table size="large">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Title</strong></TableCell>
                                <TableCell><strong>Location</strong></TableCell>
                                <TableCell><strong>Department</strong></TableCell>
                                <TableCell><strong>Start Time</strong></TableCell>
                                <TableCell><strong>End Time</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        
                    </Table>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}