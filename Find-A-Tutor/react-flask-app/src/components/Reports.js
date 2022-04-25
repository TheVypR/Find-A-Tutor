import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import './adminView.css';
import {AuthContext} from './AuthContext';
import AdminNavBar from './AdminNavBar';

const theme = createTheme();
export default function Reports() {
    //List of reported students and tutors from server
    const [reportedTutors, setReportedTutors] = useState([]);
    const [reportedStudents, setReportedStudents] = useState([]);
    const [activeTable, setActiveTable] = useState("");

    //handle modal popups
    const [enableReport, setEnableReport] = useState(false);
    const [banConfirm, setBanConfirm] = useState(false);
    const handleClose = function(){setEnableReport(false); setBanConfirm(false);};
    const handleEnableReport = function(){setEnableReport(true);};
    const handleBanConfirm = function(){setBanConfirm(true);};
    const [tutor, setTutor] = useState([]);

	//authentication
	const authContext = useContext(AuthContext);
	const [isAdmin, setIsAdmin] = useState(false)
	
	
	useEffect(() => { fetch("/isAdmin/?token=" + localStorage.getItem("token"))
        .then(res => res.json())
        .then(result => {
            setIsAdmin(result);
			console.log(isAdmin);
        },
        (error) => {
            console.log(error);
        })
    }, []);

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

    //function to have BanConfirm modal appear and pass info
    function showBan(tutor) {
        handleBanConfirm();
    }

    return authContext.isLoggedIn && isAdmin == true && (
        <ThemeProvider theme={theme}>

            <Modal show={banConfirm} size="md" aria-labelledby="contained-title-vcenter" centered onHide={handleClose}>
                <Modal.Header closeButton>
                    <Grid container spacing={1}>
                        <Grid item>
                            <Typography component="h1" variant='h6' align="left">Are you sure you want to ban {tutor[5]}</Typography>
                        </Grid>
                    </Grid>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="contained" type='submit' style={{backgroundColor: "#dc143c"}} onClick={() => AddToBannedList(tutor)}>
                        Submit
                    </Button>
                    <div></div>
                    <Button variant="contained" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

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
                    <Button variant="contained" type='submit' style={{backgroundColor: "#dc143c"}} onClick={() => showBan(tutor)}>
                        Ban Student
                    </Button>
                    <div></div>
                    <Button variant="contained" onClick={() => RemoveFromReports(tutor)}>
                        Dismiss Report
                    </Button>
                </Modal.Footer>
            </Modal>

            <CssBaseline />
            <AdminNavBar />
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