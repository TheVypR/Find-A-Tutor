import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const theme = createTheme();
export default function StudentHistory() {
    const [rating, setRating] = useState(2);

    return (
        <ThemeProvider theme={theme}>
            <Box component="main" sx={{ backgroundColor: 'white', flexgrow: 1, height: '200vh', overflow: 'auto' }}>
                <Container maxWidth = "lg" sx={{mt: 4, mb: 4}}>
                <CssBaseline />
                    <Grid container spacing={3}>
                        <React.Fragment>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Student History
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Previous Tutors</TableCell>
                                        <TableCell>Class</TableCell>
                                        <TableCell>Date Tutored</TableCell>
                                        <TableCell>Leave A Review</TableCell>
                                        <TableCell>Report Tutor</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Some idiot</TableCell>
                                        <TableCell>COMP447</TableCell>
                                        <TableCell>2/27/2021</TableCell>
                                        <TableCell>
                                            <Rating name="simple controlled" value={rating} />
                                        </TableCell>
                                        <TableCell>
                                            <Button type="submit" variant="contained" sx={{mt: 1, mb: 1}}>
                                                Report
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </React.Fragment>
                    </Grid>
                </Container>
                <Button type="submit" variant="contained" sx={{mt: 1, mb: 1}}>
                <Link to="/TutoringHistory">Go to Student History</Link>
                </Button>
            </Box>
        </ThemeProvider>
    );
}