import React, { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const axios = require('axios').default;

function FullCalendarApp() {
  const [times, setTimes] = useState([{}])
  
  useEffect(() => {
		fetch('/getTimes/')
			.then(response => {
				if(response.ok) {
					return response.json()
				}
				throw response;
			})
			.then(data => {
				setTimes(data['times']);
			})
			.catch(error => {
				console.error("Error fetching data:", error);
			})
	}, []);

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
            times.push(
              {
                title: 'test',
                start: '2022-01-27T10:00:00',
                end: '2022-02-27T12:00:00',
            })
            console.log(times)
            },
          },
          profile: {
            text: 'To Profile',

            click: function() {
              window.location.href = '/myProfile'
            }
          },

        }}//end button setup

        //add appointments to calendar
        events={times}

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
