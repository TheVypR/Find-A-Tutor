import React, { Component } from "react";
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { BsFillTrashFill } from "react-icons/bs";

import TimePickers from './TimePickers'

const format = 'h:mm a';    //Format for TimePicker

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
    }//constructor

    /**
     * call parent function
     */
    onSubmitClick() {
        this.props.submitTimes();
    }//onSubmitClick

    /**
     * calls aparent function
     * 
     * @param {int} index 
     * @param {string} day 
     */
    removeTimeSlot(index, day) {
        this.props.removeTimeSlot(index, day);
    }//removeTImeSlot

    render() {
        let index = this.props.index;   //given index of the TimeSlot

        return (
            <>
                <Button className="submitTime btn-success" onClick={this.onSubmitClick}>
                    Submit
                </Button>

                <Button className="removeTime" variant="danger" onClick={() => {this.removeTimeSlot(index, this.props.day)}}>
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
    }//constructor

    /**
     * Call parent function
     * 
     * @param {int} time 
     * @param {string} timepicker 
     */
    onChangeTimes(time, timepicker) {
        this.props.timeSlotChange(time, timepicker);
    }//onChangeTimes

    render() {
        const index = this.props.index;                             //index of Timeslot
        const showTimePickers = this.props.showTimePickers[index];  //boolean that determines if Timepickers are shown

        //Display either Timepickers or user selected times 
        if (showTimePickers) {
            return <TimePickers timeSlotChange={(time, timepicker) => {this.onChangeTimes(time, timepicker)}} />
        } else {
            const startTime = this.props.startTime[index].format(format).toString();
            const endTime = this.props.endTime[index].format(format).toString();
            return <p> {startTime} to {endTime} </p>
        }//if

    }//render
}//Times



/** TimeSlot Component
 * 
 * Displays the timepickers and submit and remove buttons for in a given week day
 * 
 */
class TimeSlot extends React.Component {
    render() {
        const day = this.props.day;             //given day the timeslot is in
        const index = this.props.index;         //given index of the timeslot
        const startTime = this.props.startTime; //startTime of timeslot if already submitted
        const endTime = this.props.endTime;     //endtime of timeslot if already submitted

        return (
            <>
                <Times
                    index={index}
                    showTimePickers={this.props.showTimePickers}
                    timeSlotChange={(time, timepicker) => {this.props.timeSlotChange(time, timepicker, index)}}
                    startTime={startTime}
                    endTime={endTime}
                />
                <SubmitRemoveTime submitTimes={() => {this.props.submitTimes(index, day)}}
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