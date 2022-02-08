import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import React, { Component } from "react";


const appointments = [
  {
    id: 1,
    title: 'Isaac Apel',
    tutorName: 'Isaac Apel',
    studentName: 'Aaron Sickafuse',
    start: '2022-01-30T10:00:00',
    end: '2022-01-30T12:00:00',
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
        eventClick={(e) => console.log(e.event.id)}
      />
    </div>
  );
}

export default FullCalendarApp
