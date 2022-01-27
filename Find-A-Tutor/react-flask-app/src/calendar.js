import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

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
        initialView="dayGridMonth"
        headerToolbar={{
          center: 'dayGridMonth,timeGridWeek,timeGridDay new',
        }}
        customButtons={{
          new: {
            text: 'create appointment',
            click: () => appointments.push(
              {
                id: 2,
                title: 'test',
                start: '2022-01-27T10:00:00',
                end: '2022-02-27T12:00:00',
            }),
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

export default FullCalendarApp;