import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {AuthContext} from './AuthContext';
import React, { useState, useEffect, useContext } from 'react';

//making styles and themes
const theme = createTheme();

function ContactMe() {
    //authentication
	const authContext = useContext(AuthContext);

    const [contactTutors, setContactTutors] = useState([]);

    //Get current tutors for the CurrentAndBan screen
    useEffect(() => { fetch("/Contactable/")
        .then(res => res.json())
        .then(result => {
            setContactTutors(result);
        },
        (error) => {
            console.log(error);
        })
    }, []);

    console.log(contactTutors);

    return authContext.isLoggedIn && (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
                    {contactTutors.map((tutor) => (
                        <TableRow>
                            <TableCell>{tutor[1]}</TableCell>
                            <TableCell>{tutor[0]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ThemeProvider>
    );
	
	
}
export default ContactMe;