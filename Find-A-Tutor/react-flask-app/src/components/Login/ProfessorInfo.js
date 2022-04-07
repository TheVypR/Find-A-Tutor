import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterMoment';
import * as React from 'react';
import { useState, useEffect } from 'react';
import './LoginCSS.css';
import TextField from '@mui/material/TextField';

//making styles and themes
const theme = createTheme();

export default function ProfessorInfo() {

    //list of group tutoring
    const [allGroup, setAllGroup] = useState([]);

    //filter
    const [filter, setFilter] = useState("");

    //Get list of group tutoring sessions
    useEffect(() => {
        fetch("/getProfessors/")
            .then(res => res.json())
            .then(result => {
                setAllGroup(result);
            },
                (error) => {
                    console.log(error);
                })
    }, []);

    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="xl" disableGutters component="main" sx={{ px: 6 }}>
                    <Paper sx={{ p: 2, position: 'relative', backgroundColor: 'white', color: '#fff', mb: 4, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                        <Grid container spacing={2} columns={24}>
                            <Grid item xs={8}> </Grid>
                            <Grid item xs={8}>
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                    Professor Information
                                </Typography>
                            </Grid>
                            <Grid  item xs={8}>
                                <TextField margin="normal" id="search" label="Search Professors" variant='outlined' style={{ width: 350 }} value={filter} onChange={(newValue) => { setFilter(newValue.target.value); }} />
                            </Grid>
                        </Grid>
                        <Table size="large">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Professor Name</strong></TableCell>
                                    <TableCell><strong>Office Hours</strong></TableCell>
                                    <TableCell><strong>Office Location</strong></TableCell>
                                    <TableCell><strong>Professor Email</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allGroup.map((professor) => (
                                    (professor[0].toUpperCase().includes(filter.toUpperCase()) ?
                                        <TableRow key={professor[0]}>
                                            <TableCell>{professor[0]}</TableCell>
                                            <TableCell><a href={'http://localhost:5000/office_hours/?filename='+professor[1]}>{professor[1]}</a></TableCell>
                                            <TableCell>{professor[2]}</TableCell>
                                            <TableCell>{professor[3]}</TableCell>
                                        </TableRow>
                                        : null)
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Container>
            </ThemeProvider>
        </LocalizationProvider>
    );
}