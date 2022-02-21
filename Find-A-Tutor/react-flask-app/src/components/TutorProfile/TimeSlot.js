import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import { BsFillTrashFill } from "react-icons/bs";

import TimePickers from './TimePickers'

/** SubmitRemoveTime Component
 * 
 * Displays the submit and remove buttons for the given timeslot
 * 
 */
class SubmitRemoveTime extends React.Component {
    render() {
        return (
            <>
                <Button className="submitTime btn-success">
                    Submit
                </Button>

                <Button className="removeTime" variant="danger">
                    <BsFillTrashFill size="14" />
                </Button> <br />
            </>
        );//return
    }//render
}//SubmitRemoveTime



/** TimeSlot Component
 * 
 * Displays the timepickers and submit and remove buttons for in a given week day
 * 
 */
class TimeSlot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: null,
            endTime: null
        }//state

        this.timeSlotChange = this.timeSlotChange.bind(this);
    }//constructor

    /**
     * Updates start and end time states according to the given timepicker
     * 
     * @param {*} time Moment object of the given timepicker
     * @param {*} timepicker String identifying which timepicker was changed
     */
    timeSlotChange = (time, timepicker) => {

        //Update TimeSlot according to the changed timepicker
        if (timepicker == 'start') {
            this.setState({ startTime: time }, () => { console.log(this.state.startTime) });
        } else {
            this.setState({ endTime: time }, () => { console.log(this.state.endTime) })
        }//if

    }//timeSlotChange()

    render() {
        return (
            <>
                <TimePickers timeSlotChange={this.timeSlotChange} />
                <SubmitRemoveTime />
                <hr />
            </>
        );//return
    }//render
}//TimeSlot

export default TimeSlot;