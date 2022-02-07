import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


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
  return (
    <div className="App">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

        //user defaults to week view
        initialView="dayGridMonth"

        /* set up tab bar at top of calendar
          current allignment: switch to month view - switch to week view - 
          switch to day view - add appointment button
        */
        headerToolbar={{
          center: 'dayGridMonth,timeGridWeek,timeGridDay new, profile',
        }}

        //create buttons
        //TODO: decide if any buttons at top of screen are necessary
        customButtons={{
          new: {

            //set text for button
            text: 'create appointment',

            //define function for on click
            click: () => appointments.push(
              {
                id: 2,
                title: 'test',
                start: '2022-01-27T10:00:00',
                end: '2022-02-27T12:00:00',
            }),

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
        dateClick={(e) => console.log(e.dateStr)}

        //ability to click appointments
        //TODO: add ability to open up more information about appointment via click
        //TODO: add ability to sign up for appointment via click/on loaded modal
        eventClick={(e) => console.log(e.event.id)}
      />
    </div>
  );
}

export default FullCalendarApp;