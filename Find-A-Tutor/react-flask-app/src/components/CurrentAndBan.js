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

export default function CurrentAndBan() {
	//authentication
	const authContext = useContext(AuthContext);
	
	const [isAdmin, setIsAdmin] = useState(false)
	
    const [allTutors, setAllTutors] = useState([]);
    const [bannedUsers, setBannedUsers] = useState([]);

    //Get current tutors for the CurrentAndBan screen
    useEffect(() => { fetch("/CurrentTutors/")
        .then(res => res.json())
        .then(result => {
            setAllTutors(result);
        },
        (error) => {
            console.log(error);
        })
    }, []);

    //Get list of current banned students
    useEffect(() => { fetch("/BannedStudents/")
        .then(res => res.json())
        .then(result => {
            setBannedUsers(result);
        },
        (error) => {
            console.log(error)
        })
    }, []);

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

    return authContext.isLoggedIn && isAdmin == true && (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdminNavBar />
            <Container maxWidth="sm" disableGutters component="main" sx={{pt: 6}}></Container>
            <Container maxWidth="xl" sx={{mt: 8, mb: 8}}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <Paper sx={{p: 2, position: 'relative', backgroundColor: 'white', color: '#fff', mb: 4, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Current Tutors
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Tutor Name</strong></TableCell>
                                        <TableCell><strong>Contact Info</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allTutors.map((tutor) => (
                                        <TableRow key={tutor[0]}>
                                            <TableCell>{tutor[1]}</TableCell>
                                            <TableCell>{tutor[0]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{p: 2, position: 'relative', backgroundColor: 'white', color: '#fff', mb: 4, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Banned Students and Tutors
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Name</strong></TableCell>
                                        <TableCell><strong>Reason</strong></TableCell>
                                        <TableCell><strong>Email</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bannedUsers.map((student) => (
                                        <TableRow key={student[3]}>
                                            <TableCell>{student[1]}</TableCell>
                                            <TableCell>{student[2]}</TableCell>
                                            <TableCell>{student[0]}</TableCell>
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