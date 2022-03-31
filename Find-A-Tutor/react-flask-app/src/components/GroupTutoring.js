import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import moment from 'moment'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import './adminView.css';
import {AuthContext} from './AuthContext';
import AdminNavBar from './AdminNavBar';

//npm install @date-io/moment, npm install @date-io/date-fns
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

//making styles and themes
const theme = createTheme();

export default function GroupTutoring() {
    //authentication
	const authContext = useContext(AuthContext);

    //list of group tutoring
    const [allGroup, setAllGroup] = useState([]);

    //Get list of group tutoring sessions
    useEffect(() => { fetch("/GroupTutoring/")
        .then(res => res.json())
        .then(result => {
            setAllGroup(result);
        },
        (error) => {
            console.log(error);
        })
    }, []);

    return authContext.isLoggedIn && (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AdminNavBar />
                <Grid container justifyContent="right" sx={{pt: 11, pr: 6, pb: 3}} />
                <Container maxWidth="xl" disableGutters component="main" sx={{px: 6}}>
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
                            <TableBody>
                                {allGroup.map((session) => (
                                    <TableRow key={session[0]}>
                                        <TableCell>{session[1]}</TableCell>
                                        <TableCell>{session[2]}</TableCell>
                                        <TableCell>{session[3]}</TableCell>
                                        <TableCell>{moment(session[4]).format('MM/DD/YYYY h:mm a')}</TableCell>
                                        <TableCell>{moment(session[5]).format('MM/DD/YYYY h:mm a')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Container>
            </ThemeProvider>
        </LocalizationProvider>
    );
}