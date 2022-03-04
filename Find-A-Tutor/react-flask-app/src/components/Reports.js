import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import MenuItem from '@mui/material/MenuItem'
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import './adminView.css';

const theme = createTheme();
export default function Reports() {
    //List of reported students and tutors from server
    const [reportedTutors, setReportedTutors] = useState([]);
    const [reportedStudents, setReportedStudents] = useState([]);
    const [activeTable, setActiveTable] = useState("");

    //handle modal popups
    const [enableReport, setEnableReport] = useState(false);
    const handleClose = function(){setEnableReport(false);};
    const handleEnableReport = function(){setEnableReport(true);};
    const [tutor, setTutor] = useState([]);

    //get data from server
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const responseTutors = await fetch("/ReportedTutors/")
    //         const responseStudents = await fetch("/ReportedStudents/")
    //         const postTutors = await responseTutors.json();
    //         const postStudents = await responseStudents.json();
    //         setReportedTutors(postTutors);
    //         setReportedStudents(postStudents);
    //     }
    //     fetchData();
    // }, []);

    //get data from server
    useEffect(() => {
        fetch("/ReportedTutors/")
            .then(res => res.json())
            .then(result => {
                setReportedTutors(result);
            },
        (error) => {
            console.log(error)
        })
    }, []);

    useEffect(() => {
        fetch("/ReportedStudents/")
            .then(res => res.json())
            .then(result => {
                setReportedStudents(result);
            },
        (error) => {
            console.log(error)
        })
    }, []);

    //Post whether reported tutor is banned or the report is dismissed
    function AddToBannedList(tutor) {
        const tutorToBan = {
            stu_email: tutor[0],
            reason: tutor[2],
            table: activeTable,
            id: tutor[4],
        };
        fetch('/AddStudentToBan/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tutorToBan)
        });
        handleClose();
        removeStudent(tutor);
        removeTutor(tutor);
    }

    //Post to remove user from reported students or tutors list
    function RemoveFromReports(tutor) {
        const tutorToRemove = {
            stu_email: tutor[0],
            reason: tutor[2],
            table: activeTable,
            id: tutor[4],
        };
        console.log(tutor);
        fetch('/DimissReport/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tutorToRemove)
        });
        handleClose();
        removeStudent(tutor);
        removeTutor(tutor);
    }

    //remove functions to remove people from showing up on screen
    function removeStudent(tutor) {
        const arrayCopy = reportedStudents.filter((report) => report[4] !== tutor[4]);
        setReportedStudents(arrayCopy);
    }
    function removeTutor(tutor) {
        const arrayCopy = reportedTutors.filter((report) => report[4] !== tutor[4]);
        setReportedTutors(arrayCopy);
    }

    //function to have the modal appear and disappear and pass in info
    function showReport(tutor, str) {
        setTutor(tutor);
        setActiveTable(str);
        handleEnableReport();
    }

    return (
        <ThemeProvider theme={theme}>

            <Modal show={enableReport} size="lg" aria-labelledby="contained-title-vcenter" centered onHide={handleClose}>
                <Modal.Header closeButton>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6}>
                            <Typography component="h1" variant='h4' color="#dc143c" align="left">{tutor[5]}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <Typography component="h1" variant='overline' color="inherit" align="right" sx={{pt: .5, pr: 1, fontSize: 14}}><strong>Email:</strong> {tutor[0]}</Typography>
                        </Grid>
                    </Grid>
                </Modal.Header>
                <Modal.Body>
                    <strong>Reported By: </strong> {tutor[6]} <br/>
                    <strong>Email:</strong> {tutor[1]} <br/>
                    <br/>
                    <strong>Reason: </strong> {tutor[2]} <br/>
                    <strong>Report Comment: </strong> <br/> {tutor[3]} <br/>   
                </Modal.Body>
                <Modal.Footer>
                <Button variant="contained" type='submit' style={{backgroundColor: "#dc143c"}} onClick={() => AddToBannedList(tutor)}>
                    Ban Student
                </Button>
                <div></div>
                <Button variant="contained" onClick={() => RemoveFromReports(tutor)}>
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
                    <MenuItem component='a' href='./Reports'>
                        <Typography variant="button" align="center" color="inherit" sx={{my: 1, mx: 1}}>Reports</Typography>
                    </MenuItem>
                    <MenuItem component='a' href='./CurrentAndBan'>
                        <Typography variant="button" align="center" color="inherit" sx={{my: 1, mx: 1}}>Tutors and Banned List</Typography>
                    </MenuItem>
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
                                        <TableRow key={tutor[4]} onClick={() => showReport(tutor, "tutors")} hover>
                                            <TableCell>{tutor[5]}</TableCell>
                                            <TableCell>{tutor[6]}</TableCell>
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
                                        <TableRow key={tutor[4]} onClick={() => showReport(tutor, "students")} hover>
                                            <TableCell>{tutor[5]}</TableCell>
                                            <TableCell>{tutor[6]}</TableCell>
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