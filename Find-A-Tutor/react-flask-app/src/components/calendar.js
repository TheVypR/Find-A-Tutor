import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import './App.css';
import React, { useState, useEffect, Component } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import styled from "@emotion/styled"
import './calendar.css'


export const StyleWrapper = styled.div`
  .fc td {
    background: white;
  }
`






function FullCalendarApp() {
  const [times, setTimes] = useState([]);
  const [appts, setAppts] = useState([]);
  const [show, setShow] = useState(false);
  const [chosen, setChosen] = useState({});
  
  const [stuEmail, setStuEmail] = useState("");
  const [tutEmail, setTutEmail] = useState("");
  const [classCode, setClassCode] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [title, setTitle] = useState("");
  
  //handle the modal on/off
  const handleClose = () => setShow(false);
  const handleShow = function (){ setShow(true)};
  
  //loads in the times currently available in the DB -IAA
  useEffect(() => { fetch("/getTimes/")
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
  }, []);
  
  //loads in the appts currently created in the DB - IAA
  useEffect(() => { fetch("/getAppointments/")
            .then(res => res.json())
            .then(
                result => {
                    setAppts(result['appts']);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error);
                }
            )
  }, []);


//create appointment
function addEvent(stuEmail, tutEmail, classCode, startTime, endTime, title) {
    const myEvent = {
      stu_email: stuEmail,
      tut_email: tutEmail,
	  class_code: classCode,
      start: startTime,
      end: endTime,
	  title: title
    };
	
	fetch("/addAppointment/", {
		method: 'POST',
		headers: {
		'Content-Type' : 'application/json'
		},
		body:JSON.stringify([myEvent])    
	})
	
	console.log("Add");
  }
  
const handleEventClick = function (e) {
		setChosen(e.extendedProps);
		setTitle(e.title);
		handleShow();
		console.log(e.extendedProps);
	};

//list of appointments to add to calendar
//TODO: dynamically load appointments into list via database
  return (
    <div className="App">
		<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}<br/>{chosen['tut_email']}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
			Meeting with: {chosen['tut_email']}<br/>
			<form>
				Choose Class: 
				<input type="text" class_code="class" placeholder="COMP447" onChange={(e) => {setClassCode(e.target.value)}}/><br/>
				Start Time: 
				<input type="text" s_date="s_date" placeholder="2022-02-13T10:00:00" onChange={(e) => {setStartDate(e.target.value)}}/><br/>
				End Time: 
				<input type="text" e_date="e_date" placeholder="2022-02-13T11:00:00" onChange={(e) => {setEndDate(e.target.value)}}/>
			</form>
		</Modal.Body>
		
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" 
			      onClick= {
				      () => {
					      addEvent(stuEmail, tutEmail, 
							  classCode, startDate, endDate, 
							  title)
				      }
			    }>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
		
      <div className="title">
        <p>
          Find-A-Tutor
        </p>
      </div>
      <div className="filter">
        <p>
          Filter By:
        </p>
        <input type="checkbox" id="myApts" name="My Appointments">
        </input>
        <label htmlFor="myApts">My Appointments</label><br></br>
        <input type="checkbox" id="availableApts" name="My Appointments">
        </input>
        <label htmlFor="availableApts">Available Appointments</label><br></br>
      </div>
      <StyleWrapper>
        <div className="calendar">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

          //user defaults to week view
          initialView="timeGridWeek"

          /* 
            set up tab bar at top of calendar
            current allignment: switch to month view - switch to week view - 
            switch to day view - add appointment button
          */
          headerToolbar={{
            center: 'dayGridMonth,timeGridWeek,timeGridDay,profile',
          }}

          //create buttons
          //TODO: decide if any buttons at top of screen are necessary
          customButtons={{
            profile: {
              text: 'To Profile',

              click: function() {
                window.location.href = '/myProfile'
              }
            },

          }}//end button setup

          //add appointments to calendar
          events={times.concat(appts)}

          //formatting of appointments
          eventColor="green"	
          nowIndicator

          //ability to click dates
          dateClick={(e) => alert(e.dateStr)}

          //ability to click appointments
          eventClick={function (e) {handleEventClick(e.event)}}
        />
        </div>
      </StyleWrapper>
    </div>
  );
}

export default FullCalendarApp;
