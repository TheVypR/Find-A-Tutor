import Table from '@mui/material/Table';
import { Modal } from 'react-bootstrap';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';

const theme = createTheme();
export default function TutoringHistory() {
    const [rating, setRating] = useState(0);
	const [appts, setAppts] = useState([]);
	const [target, setTarget] = useState("");
	const [reason, setReason] = useState("");
	const [report, setReport] = useState("");
	
	//modal handles
	const [showReport, setShowReport] = useState(false);
	
	//modal toggles
	const handleClose = function(){setShowReport(false)};
	const handleShowReport = function (){ setShowReport(true)};
	
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
	
	useEffect(() => {setRating(appts['rating']);}, []);
	
	function toggleView() {
		fetch("/toggleView/")
	};
	
	const onRatingChange = (event) => {
		console.log(event.target.value)
		console.log(target)
		fetch("/submitRating/", {
			method: 'POST',
			headers: {
			'Content-Type' : 'application/json'
			},
			body:JSON.stringify([{'target': target, 'rating': event.target.value}])  
		})
	}
	
	function onRowClick(row) {
		console.log(row);
		setTarget(row['with'])
	}
	
	const handleReport = () => {
		console.log(reason)
		console.log(target)
		console.log(report)
		fetch("/submitReport/", {
			method: 'POST',
			headers: {
			'Content-Type' : 'application/json'
			},
			body:JSON.stringify([{'target': target, 'reason': reason, 'report':report}])  
		})
	}
	
    return (
        <ThemeProvider theme={theme}>
			<NavBar value={"TutoringHistory"} />
			<Container maxWidth="xl" sx={{mt: 12, mb: 12}}>
				<Paper sx={{p: 2, position: 'relative', backgroundColor: 'white', color: '#fff', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
					<Modal show={showReport} onHide={handleClose}>
						<form>
							<Modal.Header closeButton>
							<Modal.Title>Report </Modal.Title>
							</Modal.Header>
							<Modal.Body>
								Reason<b/><br/>
									<input type="radio" id="harass" name="reason" value="Harassment" onChange={(e) => setReason(e.target.value)}/>
									<label htmlFor="harass">Harassment</label><br/>
									<input type="radio" id="spam" name="reason" value="Spam" onChange={(e) => setReason(e.target.value)}/>
									<label htmlFor="spam">Spam</label><br/>
									<input type="radio" id="miss" name="reason" value="Missed Appointment" onChange={(e) => setReason(e.target.value)}/>
									<label htmlFor="miss">Missed Appointment</label><br/>
									<input type="radio" id="other" name="reason" value="Other" onChange={(e) => setReason(e.target.value)}/>
									<label htmlFor="other">Other</label><br/>
								Comment 
								<input type="textarea" id="report" onChange={(e) => setReport(e.target.value)}/><br/>
							</Modal.Body>
							
							<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Cancel
							</Button>
							<Button variant="primary" onClick={() => {handleReport(); handleClose();}}>
								Report
							</Button>
							</Modal.Footer>
						</form>
					</Modal>
					<Container maxWidth='lg' sx={{mt: 6, mb: 6}}>
					<CssBaseline />
						<Grid container spacing={3}>
							<React.Fragment>
								<Typography component="h2" variant="h6" color="primary" gutterBottom>
									Tutoring History
								</Typography>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell>Student</TableCell>
											<TableCell>Class</TableCell>
											<TableCell>Date Tutored</TableCell>
											<TableCell>Rate</TableCell>
											<TableCell>Leave A Review</TableCell>
											<TableCell>Report Tutor</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{appts.map((row) => (
										<TableRow key={row['id']} onClick={() => (onRowClick(row))}>
											<TableCell>{row['with']}</TableCell>
											<TableCell>{row['class']}</TableCell>
											<TableCell>{row['time']}</TableCell>
											<TableCell>$14/hr</TableCell>
											<TableCell>
												<Rating
												name="simple-controlled"
												value={rating}
												onChange={onRatingChange}
												/>
											</TableCell>
											<TableCell>
												<Button type="submit" variant="contained" sx={{mt: 1, mb: 1}} onClick={handleShowReport}>
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
						<Link to="/StudentHistory">Go to Student History</Link>
					</Button>
				</Paper>
			</Container>
        </ThemeProvider>
    );
}