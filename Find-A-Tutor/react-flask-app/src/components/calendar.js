import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import './App.css';
import React, { useState, useEffect, Component } from "react";
import TimePicker from 'react-time-picker';
import FullCalendar from '@fullcalendar/react';
//import { formatDate } from '@fullcalendar/core';
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
  //calendar filling
  const [times, setTimes] = useState([]);
  const [appts, setAppts] = useState([]);
  
  //handle modals
  const [showTime, setShowTime] = useState(false);
  const [showAppt, setShowAppt] = useState(false);
  const [chosen, setChosen] = useState({});
  
  //appointment creation
  const [stuEmail, setStuEmail] = useState("");
  const [tutEmail, setTutEmail] = useState("");
  const [classCode, setClassCode] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [origStartDate, setOrigStartDate] = useState("");
  const [origEndDate, setOrigEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [title, setTitle] = useState("");
  
  //toggle the modal on/off
  const handleClose = function(){setShowTime(false); setShowAppt(false)};
  const handleShowTime = function (){ setShowTime(true)};
  const handleShowAppt = function (){ setShowAppt(true)};
  
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
	function addEvent() {
		setStartDate(origStartDate);
		setEndDate(origEndDate);
		const myEvent = {
		  class_code: classCode,
		  start: startDate,
		  end: endDate,
		  day: origStartDate,
		  title: title,
		  tut_email: tutEmail
		};
		console.log(myEvent)
		fetch("/addAppointment/", {
			method: 'POST',
			headers: {
			'Content-Type' : 'application/json'
			},
			body:JSON.stringify([myEvent])    
		})
		
		
	}
	
	function formatDate(date) {
		var d = new Date(date);
		var hh = d.getHours();
		var m = d.getMinutes();
		var s = d.getSeconds();
		var dd = "AM";
		var h = hh;
		if (h >= 12) {
			h = hh - 12;
			dd = "PM";
		}
		if (h == 0) {
			h = 12;
		}
		m = m < 10 ? "0" + m : m;

		s = s < 10 ? "0" + s : s;

		/* if you want 2 digit hours:
		h = h<10?"0"+h:h; */

		var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

		var replacement = h + ":" + m;
		/* if you want to add seconds
		replacement += ":"+s;  */
		replacement += " " + dd;

		return date.replace(pattern, replacement);
	}
	
	const handleEventClick = function (e) {
		setTutEmail(e.extendedProps.tut_email);
		setClassCode(e.extendedProps.class_code);
		setTitle(e.title);
		//set dates and times
		setOrigStartDate(e.start.toString());
		setOrigEndDate(e.end.toString());
		//setStartTime(formatDate(e.start));
		//setEndTime(formatDate(e.end));
		
		var options = {
		  hour: '2-digit',
		  minute: '2-digit',
		  hour12: false
		};
		
		setStartTime(e.start.toLocaleString('en-US', options))
		setEndTime(e.end.toLocaleString('en-US', options))
		
		console.log(endTime)
		console.log(startTime)
		
		//find which modal to load
		if(e.extendedProps['type'] == "appt") {
			setStuEmail(e.extendedProps.stu_email);
			handleShowAppt();
		} else if(e.extendedProps['type'] == "time") {
			handleShowTime();
		}
	};

	const cancelAppt = function () {
		fetch("/deleteAppointment/", {
			method: 'POST',
			headers: {
			'Content-Type' : 'application/json'
			},
			body:JSON.stringify([{
				stu_email: stuEmail,
				tut_email: tutEmail,
				class_code: classCode,
				start: origStartDate,
				end: origEndDate
			}])    
		})
	}
	
	const editAppt = function () {
		fetch("/deleteAppointment/", {
			method: 'POST',
			headers: {
			'Content-Type' : 'application/json'
			},
			body:JSON.stringify([{
				stu_email: stuEmail,
				tut_email: tutEmail,
				class_code: classCode,
				start: origStartDate,
				end: origEndDate
			}])
		}).then(
			fetch("/addAppointment/", {
			method: 'POST',
			headers: {
			'Content-Type' : 'application/json'
			},
			body:JSON.stringify([{
				class_code: classCode,
				start: startDate,
				end: endDate,
				day: origStartDate,
				title: title,
				tut_email: tutEmail
			}])  
		})
		)
	}
//list of appointments to add to calendar
//TODO: dynamically load appointments into list via database
  return (
    <div className="App">
		<Modal show={showTime} onHide={handleClose}>
		<form>
			<Modal.Header closeButton>
			  <Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Make Appointment With: {chosen['tut_email']}<br/>
					Choose Class: 
					<input type="text" class_code="class" placeholder="COMP447" onChange={(e) => {setClassCode(e.target.value)}} required/><br/>
					Start Time: 
					<input type="time" id="s_date" step="900" min={startTime} max={endTime} onChange={(e) => {setStartDate(e.target.value)}} required/><br/>
					End Time: 
					<input type="time" id="e_date" step="900" min={startTime} max={endTime} onChange={(e) => {setEndDate(e.target.value)}} required/>
			</Modal.Body>
			
			<Modal.Footer>
			  <Button variant="secondary" onClick={handleClose}>
				Close
			  </Button>
			  <Button variant="primary"  type="submit"
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
		</form>
      </Modal>
	  
	  <Modal show={showAppt} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
			Meeting with: {tutEmail}<br/>
			For: {classCode}<br/>
			From: {origStartDate}<br/>
			To: {origEndDate}
		</Modal.Body>
		
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
		  <Button variant="danger" onClick={cancelAppt}>
		    Cancel Appointment
		  </Button>
          <Button variant="primary" onClick={editAppt}>
            Edit Appointment
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
