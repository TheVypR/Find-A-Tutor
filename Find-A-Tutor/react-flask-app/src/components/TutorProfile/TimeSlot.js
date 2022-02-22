import React, { Component } from "react";
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { BsFillTrashFill } from "react-icons/bs";

import TimePickers from './TimePickers'

const format = 'h:mm a';    //Format for TimePicker
const dateTimeFormat = 'YYYY-MM-DD HH:mm:SS';

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
    }

    onSubmitClick() {
        this.props.submitTimes();
    }

    render() {
        return (
            <>
                <Button className="submitTime btn-success" onClick={this.onSubmitClick}>
                    Submit
                </Button>

                <Button className="removeTime" variant="danger">
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
        const showTimePickers = this.props.showTimePickers;

        //Display either Timepickers or user selected times
        if (showTimePickers) {
            return <TimePickers timeSlotChange={this.onChangeTimes} />
        } else {
            const startTime = this.props.startTime.format(format).toString();
            const endTime = this.props.endTime.format(format).toString();
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
    constructor(props) {
        super(props);
        this.state = {
            startTime: "",        //startTime moment inputed by user
            endTime: "",          //endTime moment inputed by user
            showTimePickers: true //boolean show if the TimePickers should be rendered
        }//state

        this.timeSlotChange = this.timeSlotChange.bind(this);
        this.submitTimes = this.submitTimes.bind(this);
        this.handleFetch = this.handleFetch.bind(this);
    }//constructor

    /**
     * Updates start and end time states according to the given timepicker
     * 
     * @param {*} time Moment object of the given timepicker
     * @param {*} timepicker String identifying which timepicker was changed
     */
    timeSlotChange(time, timepicker) {
        //Update TimeSlot according to the changed timepicker
        if (timepicker == 'start') {
            this.setState({ startTime: time }, () => { console.log(this.state.startTime) });
        } else {
            this.setState({ endTime: time }, () => { console.log(this.state.endTime) });
        }//if

    }//timeSlotChange()

    /**
     *  onClick of submit check that both start and end Times have been selected
     *  then set showTimePickers to false
     *  and call the fetch function
     * 
     */
    submitTimes() {
        if (this.state.startTime == "" || this.state.endTime == "") {
            console.log("Please enter all times");
        } else {
            this.setState({ showTimePickers: false });

            this.handleFetch();

        }//else
    }//submitTimes


    /**
     * Posts timeslot to backend
     * 
     * @param - prop of the given day of the timeslot
     */
    handleFetch() {
        let timeSlot = {
                "startTime": this.state.startTime.format(dateTimeFormat).toString(),
                "endTime": this.state.endTime.format(dateTimeFormat).toString(),
        };

        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(timeSlot)
        })//fetch
    }

    render() {
        //var timePickers = this.state.showTimePickers ? <TimePickers timeSlotChange={this.timeSlotChange} /> : <p> {this.state.startTime} to {this.state.endTime} </p>
        const day = this.props.day;
        return (
            <>
                <Times
                    showTimePickers={this.state.showTimePickers}
                    timeSlotChange={this.timeSlotChange}
                    startTime={this.state.startTime}
                    endTime={this.state.endTime}
                />
                <SubmitRemoveTime submitTimes={this.submitTimes} />
                <hr />
            </>
        );//return
    }//render
}//TimeSlot

export default TimeSlot;