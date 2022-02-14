import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import './App.css';
import React, { useState, useEffect, Component } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

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

function FullCalendarApp() {
  const [times, setTimes] = useState([]);
  const [appts, setAppts] = useState([]);
  const [show, setShow] = useState(false);
  
  //handle the modal on/off
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
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

//list of appointments to add to calendar
//TODO: dynamically load appointments into list via database
  return (
    <div className="App">
		<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Select Time and Class For Appointment</Modal.Body>
        <Modal.Footer>
		  //close button
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
		  //save changes button
          <Button variant="primary" onClick={addEvent("apelia18@gcc.edu", "sickafuseaj18@gcc.edu", 
						"COMP447A", "2022-02-12T10:00:00", "2022-02-12T11:00:00", 
		  "Test Appointment")}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
	  
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        eventColor="green"
        nowIndicator
        dateClick={(e) => console.log(e.dateStr)}

        //user defaults to week view
        initialView="timeGridWeek"

        /* 
          set up tab bar at top of calendar
          current allignment: switch to month view - switch to week view - 
          switch to day view - add appointment button
        */
        

        //create buttons
        //TODO: decide if any buttons at top of screen are necessary
        customButtons={{
          // addAppointment: {
            // //set text for button
            // text: 'create appointment',

            // //define function for on click
            // click: addEvent("apelia18@gcc.edu", "sickafuseaj18@gcc.edu", 
						// "COMP447A", "2022-02-12T10:00:00", "2022-02-12T11:00:00", 
						// "Test Appointment")
          // },
          profile: {
            text: 'To Profile',

            click: function() {
              window.location.href = '/myProfile'
            }
          },

        }}//end button setup
		
		headerToolbar={{
          center: 'dayGridMonth,timeGridWeek,timeGridDay,profile',
        }}
		
        //add appointments to calendar
        events={times.concat(appts)}

        //formatting of appointments
        eventColor="green"
        nowIndicator

        //ability to click dates
        dateClick={(e) => alert(e.dateStr)}

        //ability to click appointments
        //TODO: add ability to open up more information about appointment via click
        //TODO: add ability to sign up for appointment via click/on loaded modal
        eventClick={handleShow}
        // eventClick={(e) => 
          // alert('Appointment With: ' + e.event.title)}
      />
    </div>
  );
}

export default FullCalendarApp;
