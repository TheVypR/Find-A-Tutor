import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const theme = createTheme();
export default function AdminView() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Typography component="h1" variant="h4" color="primary" gutterBottom>
                Admin View
            </Typography>
            <Container maxWidth="lg" sx={{mt: 8, mb:8}}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <Paper sx={{p: 2, position: 'relative', backgroundColor: 'white', color: '#fff', mb: 4, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Reported Tutors
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tutor Name</TableCell>
                                        <TableCell>Date Reported</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Isaac Apel</TableCell>
                                        <TableCell>2/28/2022</TableCell>
                                    </TableRow>
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
                                        <TableCell>Tutor Name</TableCell>
                                        <TableCell>Date Reported</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Isaac Apel</TableCell>
                                        <TableCell>2/28/2022</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Isaac Apel</TableCell>
                                        <TableCell>2/28/2022</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Isaac Apel</TableCell>
                                        <TableCell>2/28/2022</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}