import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import moment from 'moment'
import './App.css';
import TimePicker from 'react-time-picker';
import React, { useState, useEffect, useContext, Component } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import styled from "@emotion/styled"
import './calendar.css'

//mui imports
import Rating from '@mui/material/Rating';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

//import other react components
import ContactMe from './ContactMe';
import ToggleView from './ViewToggle'
import NavBar from './NavBar';
import { AuthContext } from './AuthContext';

export const StyleWrapper = styled.div`
  .fc td {
    background: lightgray;
  }
`

function FullCalendarApp() {
  //calendar filling
  const [times, setTimes] = useState([]);
  const [appts, setAppts] = useState([]);
  const [view, setView] = useState(false);
  
  //handle modals
  const [showTime, setShowTime] = useState(false);
  const [showAppt, setShowAppt] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  
  //appointment creation
  const [tutEmail, setTutEmail] = useState("");
  const [tutName, setTutName] = useState("");
  const [rates, setRates] = useState({})
  const [classCode, setClassCode] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [origStartDate, setOrigStartDate] = useState("");
  const [origEndDate, setOrigEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [title, setTitle] = useState("");
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [rating, setRating] = useState(null);

  //filter
  const [evnts, setEvnts] = useState(times.concat(appts));
  const [filterTimes, setFilterTimes] = useState(true);
  const [filterAppts, setFilterAppts] = useState(true);
  const [filterClass, setFilterClass] = useState("All Classes");
  const [studentClasses, setStudentClasses] = useState();
  
  //set time options
  var options = {
	hour: '2-digit',
	minute: '2-digit',
	hour12: false
  };
  
  //for authentication
  const authContext = useContext(AuthContext);

  //for LinkingPages
  const navigate = useNavigate();
  const nextPage = event => {
    navigate("/myProfile/", {replace: true});
  }
  
  //toggle the modal on/off
  const handleClose = function(){setShowTime(false); setShowAppt(false); setShowEdit(false)};
  const handleShowTime = function (){ setShowTime(true)};
  const handleShowAppt = function (){ setShowAppt(true)};
  const handleShowEdit = function (){ setShowEdit(true)};

  const [checked, setChecked] = React.useState(false);
  const [wrongTimes, setWrongTimes] = useState(false);
  const [wrongClass, setWrongClass] = useState(false);
  
  useEffect (() => {
	if(localStorage.getItem("view") == "tutor"){
		TutLoad();
	} else {
		StuLoad();
	}
  }, []);
  

  
  function TutLoad() {
	//loads in the appts currently created in the DB - IAA
	fetch("/getAppointments/?token=" + localStorage.getItem("token") +"&view=" + localStorage.getItem("view"))
				.then(res => res.json())
				.then(
					result => {
						setAppts(result['appts']);
					},
					// Note: it's important to handle errors here
					// instead of a catch() block so that we don't swallow
					// exceptions from actual bugs in components
					(error) => {
						console.log(error);
					}
				)
  }
  
  function StuLoad() {
	  fetch("/getTimes/?token=" + localStorage.getItem("token"))
				.then(res => res.json())
				.then(
					result => {
						setTimes(result['times']);
					},
					// Note: it's important to handle errors here
					// instead of a catch() block so that we don't swallow
					// exceptions from actual bugs in components.
					(error) => {
						console.log(error);
					}
				)

	fetch("/getStuClasses/?token=" + localStorage.getItem("token"))
				.then(res => res.json())
				.then(
					result => {
						setStudentClasses(result['stu_classes']);
					},
					// Note: it's important to handle errors here
					// instead of a catch() block so that we don't swallow
					// exceptions from actual bugs in components.
					(error) => {
						console.log(error);
					}
				)

	  //loads in the appts currently created in the DB - IAA
	fetch("/getAppointments/?token=" + localStorage.getItem("token") +"&view=" + localStorage.getItem("view"))
				.then(res => res.json())
				.then(
					result => {
						setAppts(result['appts']);
					},
					// Note: it's important to handle errors here
					// instead of a catch() block so that we don't swallow
					// exceptions from actual bugs in components
					(error) => {
						console.log(error);
					}
				)
  }

	const updateEvents = function() {
		let localEvents = [];
		//filter classes
		if (filterClass === "All Classes") {
			if (filterAppts) {
				localEvents = localEvents.concat(appts);
			}
			if (filterTimes) {
				localEvents = localEvents.concat(times);
			}
		} else {		
			if (filterAppts) {
				localEvents = localEvents.concat(appts.filter(appt => appt['class_code'] === filterClass));
			}
			if (filterTimes) {
				localEvents = localEvents.concat(times.filter(time => time['classes'].includes(filterClass, 0)));
			}
		}
		
		setEvnts(localEvents);
  }

	

	//create appointment
	function addEvent() {
		setStartDate(origStartDate);
		setEndDate(origEndDate);
		console.log(origStartDate);
		const myEvent = {
		  token:localStorage.getItem("token"),
		  class_code: classCode,
		  start: startTime,
		  end: endTime,
		  day: moment(origStartDate).format('YYYY-MM-DDTHH:mm:ss'),
		  title: title,
		  tut_email: tutEmail,
		  tut_name:tutName,
		  block_start: moment(origStartDate).format('HH:mm'),
		  block_end: moment(origEndDate).format('HH:mm')
		};
		fetch("/addAppointment/", {
			method: 'POST',
			headers: {
			'Content-Type' : 'application/json'
			},
			body:JSON.stringify([myEvent])
		}).then(document.location.reload())
	}
	
	const handleEventClick = function (e, editting) {
		//reset error msgs
		setWrongClass(false);
		setWrongTimes(false);
		
		//get the tutor's rates
		fetch('/getRates/', {
			method: 'POST',
			headers: {
			'Content-Type' : 'application/json'
			},
			body:JSON.stringify(e.extendedProps.tut_email)
		},).then(
			res => res.json()
		).then(
			result => {
				setRates(result)
			}
		)
		
		//set the tutor info
		setTutEmail(e.extendedProps.tut_email);
		setTutName(e.extendedProps.tut_name);
		setClassCode(e.extendedProps.class_code);
		setTitle(e.title);
		
		//set dates and times (uses e.start and e.end because they are guaranteed to be set)
		setOrigStartDate(e.start);
		setOrigEndDate(e.end);
		setStartTime(e.start.toLocaleString('en-US', options));
		setEndTime(e.end.toLocaleString('en-US', options));
		
		//find which modal to load
		if(editting) {
			handleShowEdit();
		} else {
			if(e.extendedProps['type'] == "appt") {
				console.log("1");
				setBlockStart(e.extendedProps.block_s);
				setBlockEnd(e.extendedProps.block_e);
				handleShowAppt();
			} else if(e.extendedProps['type'] == "time") {
				setBlockStart(e.start.toLocaleString('en-US', options));
				setBlockEnd(e.end.toLocaleString('en-US', options)); 
				setRating(e.extendedProps.rating);
				handleShowTime();			
			} 
		}
	};

	const cancelAppt = function () {
		fetch("/deleteAppointment/", {
			method: 'POST',
			headers: {
			'Content-Type' : 'application/json'
			},
			body:JSON.stringify({
				token:localStorage.getItem("token"),
				tut_email: tutEmail,
				class_code: classCode,
				start: moment(origStartDate).format('YYYY-MM-DDTHH:mm:ss'),
				end: moment(origEndDate).format('YYYY-MM-DDTHH:mm:ss')
			})    
		}).then(document.location.reload())
	}
	
	const editAppt = function () {
		const myEvent = {
		  token:localStorage.getItem("token"),
		  class_code: classCode,
		  start: startTime,
		  end: endTime,
		  day: moment(origStartDate).format('YYYY-MM-DDTHH:mm:ss'),
		  title: title,
		  tut_email: tutEmail,
		  tut_name: tutName,
		  block_start: blockStart,
		  block_end: blockEnd
		};
		fetch("/deleteAppointment/", {
			method: 'POST',
			headers: {
			'Content-Type' : 'application/json'
			},
			body:JSON.stringify({
				token: localStorage.getItem("token"),
				tut_email: tutEmail,
				class_code: classCode,
				start: moment(origStartDate).format('YYYY-MM-DDTHH:mm:ss'),
				end: moment(origEndDate).format('YYYY-MM-DDTHH:mm:ss')
			})
		}).then(
			fetch("/addAppointment/", {
			method: 'POST',
			headers: {
			'Content-Type' : 'application/json'
			},
			body:JSON.stringify([myEvent])  
		}).then(document.location.reload())
		)
	}
	
	function verifyTimes(isNew) {
		console.log(blockStart)
		if (endTime <= startTime || startTime < blockStart || endTime > blockEnd) {
			setWrongTimes(true)
			console.log("Start:" + startTime + ":" + blockStart);
			console.log("End:" + endTime + ":" + blockEnd);
		} else {
			if(isNew){
				addEvent();
			} else {
				editAppt();
			}
		}
	}
	
	function verifyClass(isNew) {
		if(classCode === "NONE" || classCode === "" || classCode === undefined) {
			setWrongClass(true);
		} else {
			verifyTimes(isNew);
		}
	}
	
	const TimeError = () => {
		return (
		<div style={{color : 'red'}}>
			Invalid Times
		</div>)
	}
	
	const ClassError = () => {
		return (
		<div style={{color : 'red'}}>
			You must choose a class
		</div>)
	}
	
	useEffect(() => {
		updateEvents(() => appts);
	}, [times, appts]);
	
//list of appointments to add to calendar
//TODO: dynamically load appointments into list via database
  return authContext.isLoggedIn && (
    <div className="App">
		<NavBar />
		<Modal show={showTime} centered onHide={handleClose}>
		<form>
			<Modal.Header closeButton>
			  <Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{wrongTimes ? <TimeError /> : null}
				{wrongClass ? <ClassError /> : null}
				Make Appointment With: {tutName} <br/>
				Tutor Rating: <Rating value={rating} readOnly/><br/>
				Rate: $<strong>{rates[classCode]}</strong>/hr<br/>
					Choose Class:
					<select onChange={(e) => {setClassCode(e.target.value)}} required>
						<option key="null" value="NONE">NONE</option>
						{(Object.keys(rates)).map((clss) => {
							return <option key={clss} value={clss}>{clss}</option>
						})}
					</select>
					<br/>
					Start Time: 
					<input type="time" id="s_date" step="900" min={blockStart} max={blockEnd} value={startTime} onChange={(e) => {setStartTime(e.target.value)}} required/><br/>
					End Time: 
					<input type="time" id="e_date" step="900" min={blockStart} max={blockEnd} value={endTime} onChange={(e) => {setEndTime(e.target.value)}} required/>
			</Modal.Body>
			
			<Modal.Footer>
			  <Button variant="secondary" onClick={handleClose}>
				Close
			  </Button>
			  <Button variant="primary"
					  onClick= {
						  () => {
							  verifyClass(true);
						  }
					}>
				Make Appointment
			  </Button>
			</Modal.Footer>
		</form>
      </Modal>
	  
	  <Modal show={showAppt} centered onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
			Meeting with: {tutName}<br/>
			For: {classCode}<br/>
			From: {startTime}<br/>
			To: {endTime}
		</Modal.Body>
		
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
		  <Button variant="danger" type="submit" onClick={cancelAppt}>
		    Cancel Appointment
		  </Button>
          <Button variant="primary" onClick={handleShowEdit}>
            Edit Appointment
          </Button>
        </Modal.Footer>
      </Modal>
		
	  <Modal show={showEdit} centered onHide={handleClose}>
		<form>
			<Modal.Header closeButton>
			  <Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{wrongTimes ? <TimeError /> : null}
				{wrongClass ? <ClassError /> : null}
				Edit Appointment With: {tutName}<br/>
					Rate: ${rates[classCode]}/hr<br/>
					Choose Class: 
					<select onChange={(e) => {setClassCode(e.target.value)}} required>
						<option key="null" value="NONE">NONE</option>
						{(Object.keys(rates)).map((clss) => {
							return <option key={clss} value={clss}>{clss}</option>
						})}
					</select>
					<br/>
					Start Time: 
					<input type="time" id="s_date" step="900" min={blockStart} max={blockEnd} value={startTime} onChange={(e) => {setStartTime(e.target.value)}} required/><br/>
					End Time: 
					<input type="time" id="e_date" step="900" min={blockStart} max={blockEnd} value={endTime} onChange={(e) => {setEndTime(e.target.value)}} required/>
			</Modal.Body>
			
			<Modal.Footer>
			  <Button variant="secondary" onClick={handleClose}>
				Cancel
			  </Button>
			  <Button variant="primary"
					  onClick= {
						  () => {
							  verifyClass(false)
						  }
					}>
				Save Changes
			  </Button>
			</Modal.Footer>
		</form>
      </Modal>	
	

		<div className="filter">
		<div className='switchViews'>
			<Button color="blue" type="submit" onClick={() => {ToggleView(localStorage.getItem("view")); document.location.reload()}} >Switch Views</Button>
		</div>
		<Paper
		 variant="outlined"
		 style={{
			padding:8,
			border: "1px solid black"
		}}>	
			<div className="filterHeader">
			<h2>Filter By:</h2>
			</div>
			<div className="class-filter">
			{studentClasses !== undefined ? <select onChange={(e) => {setFilterClass(e.target.value)}}>
					<option key="null" value="All Classes">All Classes</option>
					{studentClasses.map((clss) => {
						return <option key={clss} value={clss}>{clss}</option>
					})}
			</select> : null}
			</div>
			
			<div>
		
          <input
            type = "checkbox"
            id="myApts"
            name="filters"
			value='appt'
			checked={filterAppts}
            onChange={(e) => {setFilterAppts(!filterAppts)}}
          />
          My Appointment<br/>
          <input
            type = "checkbox"
            id="availableApts"
            name="filters"
			value='time'
			checked={filterTimes}
            onChange={(e) => {setFilterTimes(!filterTimes)}}
          />
          Available Times
        </div>

	
		<div>
			<Button onClick={(e) => {updateEvents()}}>Apply Filters</Button>
		</div>
		</Paper>
		<div className="infoChart">
		  <Paper
		  variant="outlined"
		  style={{
			 padding:8,
			 border: "1px solid black"
		  }}>
			<ContactMe />
		  </Paper>
	  </div>
      </div>

	 

	  
      <StyleWrapper>
        <div className="calendar">
        <FullCalendar
		  height={500}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

          //user defaults to week view
          initialView="timeGridWeek"

          /* 
            set up tab bar at top of calendar
            current allignment: switch to month view - switch to week view - 
            switch to day view - add appointment button
          */
          headerToolbar={{
			start: 'prev',
            center: 'today,dayGridMonth,timeGridWeek,timeGridDay',
			end: 'next'

          }}

          //create buttons
          //TODO: decide if any buttons at top of screen are necessary
          customButtons={{
          

          }}//end button setup
		  
          //add appointments to calendar
          events={evnts}

          //formatting of appointments
          eventColor="green"	
          nowIndicator

          //ability to click appointments
          eventClick={function (e) {
						
						handleEventClick(e.event, false)}
					  }
        />
        </div>
      </StyleWrapper>
    </div>
  );
}

export default FullCalendarApp;
