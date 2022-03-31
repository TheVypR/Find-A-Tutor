import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import moment from 'moment'
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal } from 'react-bootstrap';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import './adminView.css';
import {AuthContext} from './AuthContext';
import AdminNavBar from './AdminNavBar';

//npm install @date-io/moment, npm install @date-io/date-fns
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

//making styles and themes
const theme = createTheme();

export default function AddGroupTutoring() {
    //authentication
	const authContext = useContext(AuthContext);

    //list of group tutoring
    const [allGroup, setAllGroup] = useState([]);

    //single group tutoring session
    const [singleGroup, setSingleGroup] = useState([]);

    //handling modal show and close
    const [enableGroup, setEnableGroup] = useState(false);
    const handleClose = function(){setEnableGroup(false);};

    //boolean for isNew
    const [isNew, setIsNew] = useState(false);

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

    //post changed items on edit
    const handleEditSubmit = (event) => {
        event.preventDefault();
        const editedData = new FormData(event.currentTarget);
        const data = [singleGroup[0], editedData.get('title'), editedData.get('location'), editedData.get('department'), singleGroup[4], singleGroup[5], isNew]
        fetch('/EditTutoring/', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body:JSON.stringify(data)
        })
        .then(window.location.reload())
    };

    //changing start and end times
    const handleStartTimeChange = (newValue) => {
        const theItem = singleGroup.slice(0, 4);
        const endTime = singleGroup.slice(5);
		
		//change time format
		var changedVal = moment(newValue).format('YYYY-MM-DDTHH:mm:ss');
		
        theItem.push(changedVal);
        theItem.push(endTime);
        setSingleGroup(theItem);
    };
    const handleEndTimeChange = (newValue) => {
        const theItem = singleGroup.slice(0, 5);
		var changedVal = moment(newValue).format('YYYY-MM-DDTHH:mm:ss');

        theItem.push(changedVal);
        setSingleGroup(theItem);
    };

    //new button clicked
    const handleDelete = (event) => {
        fetch('/DeleteGroup/', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body:JSON.stringify(event)
        })
        .then(window.location.reload())
    };

    return authContext.isLoggedIn && (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <ThemeProvider theme={theme}>

                <Modal show={enableGroup} size="lg" aria-labelledby="contained-title-vcenter" centered onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Grid container spacing={1}>
                            <Grid item>
                                <Typography component="h1" variant='h6' align="left" color="#1565c0">{(isNew ? "New " : "Edit ")}Group Tutoring Session</Typography>
                            </Grid>
                        </Grid>
                    </Modal.Header>
                    <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleEditSubmit}>
                        <Modal.Body>
                            <TextField margin="normal" required id="title" label="Title" name="title" autoComplete="title" autoFocus defaultValue={singleGroup[1]} sx={{ mx: 1}} />
                            <TextField margin="normal" required id="location" label="Location" name="location" autoComplete="location" autoFocus defaultValue={singleGroup[2]} sx={{ mx: 1}} />
                            <TextField margin="normal" required id="department" label="Department" name="department" autoComplete="department" autoFocus defaultValue={singleGroup[3]} sx={{ mx: 1}} /> <br/>
                            <DateTimePicker label="Start Time" value={singleGroup[4]} onChange={handleStartTimeChange} renderInput={(params) => <TextField {...params} sx={{mx:1}} /> } />
                            <DateTimePicker label="End Time" value={singleGroup[5]} onChange={handleEndTimeChange} renderInput={(params) => <TextField {...params} sx={{mx:1}} /> } />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="contained" type='submit' style={{backgroundColor: "#3d8c40"}} >
                                Submit
                            </Button>
                            <div></div>
                            <Button variant="contained" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Box>
                </Modal>

                <CssBaseline />
                <AdminNavBar />
                <Grid container justifyContent="right" sx={{pt: 11, pr: 6, pb: 3}}>
                    <Button variant="contained" onClick={() => {setIsNew(true); setEnableGroup(true);}} style={{backgroundColor: "#1565c0"}}>Create New</Button>
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
                                    <TableCell><strong>Delete Entry</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allGroup.map((session) => (
                                    <TableRow key={session[0]} onClick={() => {setSingleGroup(session); setIsNew(false); setEnableGroup(true);}} hover>
                                        <TableCell>{session[1]}</TableCell>
                                        <TableCell>{session[2]}</TableCell>
                                        <TableCell>{session[3]}</TableCell>
                                        <TableCell>{moment(session[4]).format('MM/DD/YYYY h:mm a')}</TableCell>
                                        <TableCell>{moment(session[5]).format('MM/DD/YYYY h:mm a')}</TableCell>
                                        <TableCell><Button onClick={(e) => { e.stopPropagation(); handleDelete(session);}}><DeleteIcon sx={{color: '#ca2029'}} /></Button></TableCell>
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