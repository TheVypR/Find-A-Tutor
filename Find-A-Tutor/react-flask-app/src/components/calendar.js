import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import './App.css';
import TimePicker from 'react-time-picker';
import React, { useState, useEffect, useContext, Component } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import styled from "@emotion/styled"
import './calendar.css'
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
  
  //handle modals
  const [showTime, setShowTime] = useState(false);
  const [showAppt, setShowAppt] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
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
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");

  //for authentication
  const authContext = useContext(AuthContext);
  
  //toggle the modal on/off
  const handleClose = function(){setShowTime(false); setShowAppt(false); setShowEdit(false)};
  const handleShowTime = function (){ setShowTime(true)};
  const handleShowAppt = function (){ setShowAppt(true)};
  const handleShowEdit = function (){ setShowEdit(true)};


  const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
      setChecked(!checked);
      if(!checked){
        alert("Im now checked");
        //filter appointments to users' appointments
        filterMyAps();
      }else{
        alert("I am now not checked");
        //query all
        fetch("/getAppointments/")
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
      }
      
    }

    const filterMyAps = () => {
      fetch("/filter")
      .then(res => res.json())
      .then(
        result => {
          setAppts(result['myApts']);
        },
        (error) => {
          console.log(error);
      }
      )
    }
  
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
                // exceptions from actual bugs in components
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
		  start: startTime,
		  end: endTime,
		  day: origStartDate,
		  title: title,
		  tut_email: tutEmail,
		  block_start: origStartDate,
		  block_end: origEndDate
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
	
	const handleEventClick = function (e, editting) {
		setTutEmail(e.extendedProps.tut_email);
		setClassCode(e.extendedProps.class_code);
		setTitle(e.title);
		var options = {
		  hour: '2-digit',
		  minute: '2-digit',
		  hour12: false
		};
		
		//set dates and times
		setOrigStartDate(e.start.toString());
		setOrigEndDate(e.end.toString());
		setStartTime(e.start.toLocaleString('en-US', options))
		setEndTime(e.end.toLocaleString('en-US', options))
		
		//find which modal to load
		if(editting) {
			handleShowEdit();
		} else {
			if(e.extendedProps['type'] == "appt") {
				setStuEmail(e.extendedProps.stu_email);
				setBlockStart(e.extendedProps.block_s)
				setBlockEnd(e.extendedProps.block_e)	
				handleShowAppt();
			} else if(e.extendedProps['type'] == "time") {
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
		const myEvent = {
		  class_code: classCode,
		  start: startDate,
		  end: endDate,
		  day: origStartDate,
		  title: title,
		  tut_email: tutEmail,
		  block_start: blockStart,
		  block_end: blockEnd
		};
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
			body:JSON.stringify([myEvent])  
		})
		)
	}
//list of appointments to add to calendar
//TODO: dynamically load appointments into list via database
  return authContext.isLoggedIn && (
    <div className="App">
		<Modal show={showTime} onHide={handleClose}>
		<form>
			<Modal.Header closeButton>
			  <Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Make Appointment With: {tutEmail}<br/>
					Choose Class: 
					<input type="text" class_code="class" placeholder="COMP447" onChange={(e) => {setClassCode(e.target.value)}} required/><br/>
					Start Time: 
					<input type="time" id="s_date" step="900" min={startTime} max={endTime} value={startTime} onChange={(e) => {setStartTime(e.target.value)}} required/><br/>
					End Time: 
					<input type="time" id="e_date" step="900" min={startTime} max={endTime} value={endTime} onChange={(e) => {setEndTime(e.target.value)}} required/>
			</Modal.Body>
			
			<Modal.Footer>
			  <Button variant="secondary" onClick={handleClose}>
				Close
			  </Button>
			  <Button variant="primary"  type="submit"
					  onClick= {
						  () => {
							  addEvent()
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
          <Button variant="primary" onClick={handleShowEdit}>
            Edit Appointment
          </Button>
        </Modal.Footer>
      </Modal>
		
	  <Modal show={showEdit} onHide={handleClose}>
		<form>
			<Modal.Header closeButton>
			  <Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Edit Appointment With: {tutEmail}<br/>
					Choose Class: 
					<input type="text" class_code="class" placeholder="COMP447A" onChange={(e) => {setClassCode(e.target.value)}} required/><br/>
					Start Time: 
					<input type="time" id="s_date" step="900" min={blockStart} max={blockEnd} value={startDate} onChange={(e) => {setStartDate(e.target.value)}} required/><br/>
					End Time: 
					<input type="time" id="e_date" step="900" min={blockStart} max={blockEnd} value={endDate} onChange={(e) => {setEndDate(e.target.value)}} required/>
			</Modal.Body>
			
			<Modal.Footer>
			  <Button variant="secondary" onClick={handleClose}>
				Close
			  </Button>
			  <Button variant="primary"  type="submit"
					  onClick= {
						  () => {
							  editAppt()
						  }
					}>
				Save Changes
			  </Button>
			</Modal.Footer>
		</form>
      </Modal>	
	<div className="title">
      <div className="titleText">
        <p>
          Find-A-Tutor
        </p>
      </div>
	  </div>
    
      <div className="filter">
        <div className="filterHeader">
          <h2>Filter By:</h2>
        </div>
        <div>
          <input
            type = "checkbox"
            id="myApts"
            name="filterMyApts"
            checked={checked}
            onChange={handleChange}
          />
            My Appointments
        </div>
        {/* <div>
          <input
            type = "checkbox"
            id="availableApts"
            name="filterAvailApts"
            checked={checked}
            onChange={handleChange}
          />
          Available Appointments
        </div> */}
      </div>
          
      {/* <div class="filter">
        <p>
          Filter By:
        </p>
        <div>
        <label for="myApts">
          <input type="checkbox" id="myApts" name="My Appointments" value="yes"></input> My Appointments
        </label>
        <script>
          const cb = document.querySelector('#myApts');
          alert("hi");
        </script>
        </div>
        <input type="checkbox" id="availableApts" name="My Appointments">
        </input>
        <label for="availableApts">Available Appointments</label><br></br>
      </div> */}
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
          eventClick={function (e) {handleEventClick(e.event, false)}}
        />
        </div>
      </StyleWrapper>
    </div>
  );
}

export default FullCalendarApp;
