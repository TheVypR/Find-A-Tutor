import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Modal } from 'react-bootstrap';
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
    const [rating, setRating] = useState(1);
	const [appts, setAppts] = useState([]);
	const [tutor, setTutor] = useState("");
	
	//get history
	useEffect(() => { fetch("/loadAppointment/")
            .then(res => res.json())
            .then(
                result => {
                    setAppts(result['appts']);
                },
                (error) => {
                    console.log(error);
                }
            )
	}, []);
	
	function toggleView() {
		fetch("/toggleView/")
	}
	
	const onRatingChange = (event) => {
		console.log(event.target.value);
		// fetch("/submitRating/", {
			// method: 'POST',
			// headers: {
			// 'Content-Type' : 'application/json'
			// },
			// body:JSON.stringify([{'tutor': appt}])    
		// })
	}
	
	const onRowClick = (event) => {
		console.log(event);
	}
	
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
                                        <TableCell>Student</TableCell>
                                        <TableCell>Class</TableCell>
                                        <TableCell>Date Tutored</TableCell>
                                        <TableCell>Leave A Rating</TableCell>
                                        <TableCell>Report Tutor</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
								  {appts.map((row) => (
                                    <TableRow onClick={onRowClick}>
                                        <TableCell>{row['with']}</TableCell>
                                        <TableCell>{row['class']}</TableCell>
                                        <TableCell>{row['time']}</TableCell>
                                        <TableCell>
                                            <Rating name="simple controlled" value={rating} onChange={onRatingChange}/>
                                        </TableCell>
                                        <TableCell>
                                            <Button type="submit" variant="contained" sx={{mt: 1, mb: 1}}>
                                                Report
                                            </Button>
                                        </TableCell>
                                    </TableRow>
								  ))}
                                </TableBody>
                            </Table>
                        </React.Fragment>
                    </Grid>
                </Container>
                <Button type="submit" variant="contained" sx={{mt: 1, mb: 1}} onClick={() => toggleView()}>
                <Link to="/TutoringHistory">Go to Tutor History</Link>
                </Button>
            </Box>
        </ThemeProvider>
    );
}