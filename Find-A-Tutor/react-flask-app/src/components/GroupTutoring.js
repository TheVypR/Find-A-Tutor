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
import NavBar from './NavBar';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';

//making styles and themes
const theme = createTheme();

export default function GroupTutoring() {
    //authentication
	const authContext = useContext(AuthContext);

    //list of group tutoring
    const [allGroup, setAllGroup] = useState([]);
	
	//filter
	const [filter, setFilter] = useState("");

    const filtering = (value) => {
        if (value.nativeEvent.data === null) {
            setFilter(filter.slice(0, filter.length-1));
        }
        else {
            setFilter(filter + value.nativeEvent.data);
        }
    };

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
                <NavBar />
                <Grid container justifyContent="right" sx={{pt: 11, pr: 6, pb: 3, pl: 6}}>
                    <TextField margin="normal" id="search" label="Search Department" variant='outlined' style={{width: 400}} value={filter} onChange={(newValue) => filtering(newValue)}/>
                </Grid>
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
									(session[3].includes(filter.toUpperCase()) ?
                                    <TableRow key={session[0]}>
                                        <TableCell>{session[1]}</TableCell>
                                        <TableCell>{session[2]}</TableCell>
                                        <TableCell>{session[3]}</TableCell>
                                        <TableCell>{moment(session[4]).format('MM/DD/YYYY h:mm a')}</TableCell>
                                        <TableCell>{moment(session[5]).format('MM/DD/YYYY h:mm a')}</TableCell>
                                    </TableRow>
									: null )
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Container>
            </ThemeProvider>
        </LocalizationProvider>
    );
}