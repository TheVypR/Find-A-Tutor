import React, { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const axios = require('axios').default;

function loadTimes() {
	axios.get('/getTimes/')
		.then(function (response) {
			//success
			console.log(response);
			return response;
		})
		.catch(function(error) {
			//handle error
			console.log(error);
		});
}

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
  appointments = loadTimes()
  return (
    <div className="App">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

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
        eventClick={(e) => 
          alert('Appointment With: ' + e.event.title)}
      />
    </div>
  );
}

export default FullCalendarApp;
