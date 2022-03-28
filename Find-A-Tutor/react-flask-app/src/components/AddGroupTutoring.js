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
import { Modal } from 'react-bootstrap';
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

    //list of group tutoring
    const [allGroup, setAllGroup] = useState([]);

    //single group tutoring session
    const [singleGroup, setSingleGroup] = useState([]);

    //handling modal show and close
    const [enableGroup, setEnableGroup] = useState(false);
    const handleClose = function(){setEnableGroup(false);};

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
        event.preventDefault()
        const editedData = new FormData(event.currentTarget);
        console.log(editedData.currentTarget);
        fetch('/EditTutoring/', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body:JSON.stringify(editedData)
        })
    };

    return authContext.isLoggedIn && (
        <ThemeProvider theme={theme}>

            <Modal show={enableGroup} size="lg" aria-labelledby="contained-title-vcenter" centered onHide={handleClose}>
                <Modal.Header closeButton>
                    <Grid container spacing={1}>
                        <Grid item>
                            <Typography component="h1" variant='h6' align="left" color="#1565c0">Edit Group Tutoring Session</Typography>
                        </Grid>
                    </Grid>
                </Modal.Header>
                <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleEditSubmit}>
                    <Modal.Body>
                        <TextField margin="normal" required id="title" label="Title" name="title" autoComplete="title" autoFocus defaultValue={singleGroup[1]} sx={{ mx: 1}} />
                        <TextField margin="normal" required id="location" label="Location" name="location" autoComplete="location" autoFocus defaultValue={singleGroup[2]} sx={{ mx: 1}} />
                        <TextField margin="normal" required id="department" label="Department" name="department" autoComplete="department" autoFocus defaultValue={singleGroup[3]} sx={{ mx: 1}} /> <br/>
                        <TextField margin="normal" required id="start" label="Start Time" name="start" autoComplete="start" autoFocus defaultValue={singleGroup[4]} sx={{ mx: 1}} />
                        <TextField margin="normal" required id="end" label="End Time" name="end" autoComplete="end" autoFocus defaultValue={singleGroup[5]} sx={{ mx: 1}} /> <br/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="contained" type='submit' style={{backgroundColor: "#228b22"}} >
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
                        <TableBody>
                            {allGroup.map((session) => (
                                <TableRow key={session[0]} onClick={() => {setSingleGroup(session); setEnableGroup(true);}} hover>
                                    <TableCell>{session[1]}</TableCell>
                                    <TableCell>{session[2]}</TableCell>
                                    <TableCell>{session[3]}</TableCell>
                                    <TableCell>{session[4]}</TableCell>
                                    <TableCell>{session[5]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}