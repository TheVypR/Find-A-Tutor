import React, { Component } from "react";
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { BsFillTrashFill } from "react-icons/bs";

import TimePickers from './TimePickers'

const format = 'h:mm a';    //Format for TimePicker
//const dateTimeFormat = 'YYYY-MM-DD HH:mm:SS';

/** SubmitRemoveTime Component
 * 
 * Displays the submit and remove buttons for the given timeslot
 * 
 * Submit onClick: check if both times have been changed, send times to database, display times as text
 * Remove onClick: remove given TimeSlot and any associated data.
 * 
 */
class SubmitRemoveTime extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.removeTimeSlot = this.removeTimeSlot.bind(this);
    }

    onSubmitClick() {
        this.props.submitTimes();
    }

    removeTimeSlot(index, day) {
        this.props.removeTimeSlot(index, day);
    }

    render() {
        let index = this.props.index;
        return (
            <>
                <Button className="submitTime btn-success" onClick={this.onSubmitClick}>
                    Submit
                </Button>

                <Button className="removeTime" variant="danger" onClick={() => { this.removeTimeSlot(index, this.props.day) }}>
                    <BsFillTrashFill size="14" />
                </Button> <br />
            </>
        );//return
    }//render
}//SubmitRemoveTime


/** Times Component
 *  Conditional rendering
 *  renders either the timepickers
 *  or the set times by the user on submit
 */
class Times extends React.Component {
    constructor(props) {
        super(props);

        this.onChangeTimes = this.onChangeTimes.bind(this);
    }

    onChangeTimes(time, timepicker) {
        this.props.timeSlotChange(time, timepicker);
    }

    render() {
        const index = this.props.index;
        const showTimePickers = this.props.showTimePickers[index];
        //Display either Timepickers or user selected times 
        if (showTimePickers) {
            return <TimePickers timeSlotChange={(time, timepicker) => { this.onChangeTimes(time, timepicker) }} />
        } else {
            const startTime = this.props.startTime[index].format(format).toString();
            const endTime = this.props.endTime[index].format(format).toString();
            return <p> {startTime} to {endTime} </p>
        }

    }//render
}//Times



/** TimeSlot Component
 * 
 * Displays the timepickers and submit and remove buttons for in a given week day
 * 
 */
class TimeSlot extends React.Component {
    render() {
        const day = this.props.day;
        const index = this.props.index;
        const startTime = this.props.startTime;
        const endTime = this.props.endTime;

        return (
            <>
                <Times
                    index={index}
                    showTimePickers={this.props.showTimePickers}
                    timeSlotChange={(time, timepicker) => { this.props.timeSlotChange(time, timepicker, index) }}
                    startTime={startTime}
                    endTime={endTime}
                />
                <SubmitRemoveTime submitTimes={() => { this.props.submitTimes(index, day) }}
                    removeTimeSlot={this.props.removeTimeSlot}
                    index={index}
                    day={day}
                />
                <hr />
            </>
        );//return
    }//render
}//TimeSlot

export default TimeSlot;