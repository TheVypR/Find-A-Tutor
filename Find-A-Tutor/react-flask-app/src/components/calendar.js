
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import React, { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import React, { Component } from "react";


//list of appointments to add to calendar
//TODO: dynamically load appointments into list via database
const appointments = [
  {
    title: 'Isaac Apel',
    start: '2022-02-10T16:00:00',
    end: '2022-02-10T18:00:00',
  },
];

function FullCalendarApp() {
  function updateEvent() {

  }
  function addEvent(id, tutorName, studentName, startTime, endTime) {
    var myEvent = {
      id: id,
      tutorName : tutorName,
      studentName : studentName,
      start : startTime,
      end : endTime
    };
    appointments.push(myEvent)
  }


//list of appointments to add to calendar
//TODO: dynamically load appointments into list via database
const appointments = [
  {
    id: 1,
    title: 'tutoring session 1',
    start: '2022-01-25T10:00:00',
    end: '2022-01-25T12:00:00',
  }
];

function FullCalendarApp() {
  const [info, setInfo] = useState({})
  
  return (
    <div className="App">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          center: 'dayGridMonth,timeGridWeek,timeGridDay, addAppointmentButton, editAppointmentButton',
        }}
        customButtons={{
          addAppointmentButton: {
            text: 'Add New Appointment',
            click: () => console.log('new event'),
              //addEvent('2', 'Nathan Beam', 'Tim Warner', '2022-02-02T10:00:00', '2022-02-02T12:00:00');
            },
          
          editAppointmentButton: {
            text: 'Edit Appointment',
            click: () => console.log('edit event'),
            //updateEvent();
          },
        
        }}
        events={appointments}
        eventColor="green"
        nowIndicator
        dateClick={(e) => console.log(e.dateStr)}

        //user defaults to week view
        initialView="dayGridMonth"

        /* 
          set up tab bar at top of calendar
          current allignment: switch to month view - switch to week view - 
          switch to day view - add appointment button
        */
        headerToolbar={{
          center: 'dayGridMonth,timeGridWeek,timeGridDay, new, profile',
        }}

        //create buttons
        //TODO: decide if any buttons at top of screen are necessary
        customButtons={{
          new: {

            //set text for button
            text: 'create appointment',

            //define function for on click
            click: () => {
            appointments.push(
              {
                title: 'test',
                start: '2022-01-27T10:00:00',
                end: '2022-02-27T12:00:00',
            })
            fetch("/addAppointment/", {
						method: "POST",
						headers: {
						'Content-Type' : 'application/json'
						},
						body: JSON.stringify(appointments)
					  })},

          },
          profile: {
            text: 'To Profile',

            click: function() {
              window.location.href = '/myProfile'
            }
          },

        }}//end button setup

        //add appointments to calendar
        events={appointments}

        //formatting of appointments
        eventColor="green"
        nowIndicator

        //ability to click dates
        dateClick={(e) => alert(e.dateStr)}

        //ability to click appointments
        //TODO: add ability to open up more information about appointment via click
        //TODO: add ability to sign up for appointment via click/on loaded modal
        eventClick={(e) => console.log(e.event.id)}
        eventClick={(e) => 
          alert('Appointment With: ' + e.event.title)}
      />
    </div>
  );
}}

export default FullCalendarApp;