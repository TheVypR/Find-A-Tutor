import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider, createStyles, makeStyles } from '@mui/material/styles';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import './adminView.css';

const theme = createTheme();

export default function Reports() {
    const [reportedTutors, setReportedTutors] = useState([]);
    const [reportedStudents, setReportedStudents] = useState([]);

    //handle modal popups
    const [enableReport, setEnableReport] = useState(false);
    const handleClose = function(){setEnableReport(false);};
    const handleEnableReport = function(){setEnableReport(true);};
    const [tutor, setTutor] = useState([]);

    //Get reported tutors for the Reports screen
    useEffect(() => { fetch("/ReportedTutors/")
        .then(res => res.json())
        .then(result => {
            setReportedTutors(result);
        },
        (error) => {
            console.log(error);
        })
    }, []);

    //Get reported students for the Reports screen
    useEffect(() => { fetch("/ReportedStudents/")
        .then(res => res.json())
        .then(result => {
            setReportedStudents(result);
        },
        (error) => {
            console.log(error);
        })
    }, []);

    function showReport(tutor) {
        setTutor(tutor);
        handleEnableReport();
    }

    return (
        <ThemeProvider theme={theme}>

            <Modal show={enableReport} size="lg" aria-labelledby="contained-title-vcenter" centered onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Report on <strong>{tutor[0]}</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>Reported By: </strong> {tutor[1]} <br/>
                    <strong>Reason: </strong> {tutor[2]} <br/>
                    <strong>Report Comment: </strong> {tutor[3]} <br/>   
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Ban Student
                </Button>
                <Button variant="primary" onClick= {handleClose}>
                    Dismiss Report
                </Button>
                </Modal.Footer>
            </Modal>

            <CssBaseline />
            <AppBar postion="static" color="primary" elevation={0} sx={{borderTheme: (theme) => `1px solid ${theme.palette.divider}`}}>
                <Toolbar sx={{flexwrap: 'wrap'}}>
                    <Typography component="h1" variant="h4" color="inherit" sx={{px: 5, flexGrow: 1, display: 'flex'}}>
                        Admin View
                    </Typography>
                    <Link variant="button" color="inherit" href="./Reports" sx={{my: 1, mx: 5}}>Reports</Link>
                    <Link variant="button" color="inherit" href="./CurrentAndBan" sx={{my: 1, mx: 5}}>Current Tutors</Link>
                    <Button href="./" color="inherit" variant="outlined" sx={{my: 1, mx: 5}}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm" disableGutters component="main" sx={{pt: 6}}></Container>
            <Container maxWidth="xl" sx={{mt: 8, mb: 8}}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <Paper sx={{p: 2, position: 'relative', backgroundColor: 'white', color: '#fff', mb: 4, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Reported Tutors
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Tutor Name</strong></TableCell>
                                        <TableCell><strong>Reported By</strong></TableCell>
                                        <TableCell><strong>Reason</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reportedTutors.map((tutor) => (
                                        <TableRow key={tutor[4]} onClick={() => showReport(tutor)} hover>
                                            <TableCell>{tutor[0]}</TableCell>
                                            <TableCell>{tutor[1]}</TableCell>
                                            <TableCell>{tutor[2]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{p: 2, position: 'relative', backgroundColor: 'white', color: '#fff', mb: 4, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Reported Students
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Student Name</strong></TableCell>
                                        <TableCell><strong>Reported By</strong></TableCell>
                                        <TableCell><strong>Reason</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reportedStudents.map((tutor) => (
                                        <TableRow key={tutor[4]} onClick={() => showReport(tutor)} hover>
                                            <TableCell>{tutor[0]}</TableCell>
                                            <TableCell>{tutor[1]}</TableCell>
                                            <TableCell>{tutor[2]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}