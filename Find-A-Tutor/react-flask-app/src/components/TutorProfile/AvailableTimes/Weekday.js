import { DayCellRoot } from "@fullcalendar/react";
import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import { BsFillPlusCircleFill, BsFillTrashFill } from "react-icons/bs";
import TimeSlot from './TimeSlot'
import moment from 'moment';


const format = 'h:mm a';    //Format for TimePicker

/** AdTimeSlot Component
 * 
 * Displays a button which allows users to add time slots to the given week day
 * 
 */
class AddTimeSlot extends React.Component {
    render() {
        const day = this.props.day;     //given day
        return (
            <>
                <Button className="AddTimeSlot" onClick={this.props.handleAddTimeSlot}>
                    <BsFillPlusCircleFill />
                </Button>
            </>
        );//return
    }//render
}//AddTimeSlot

/** Weekday Component
 * 
 * Given day of the week and it's TimeSlots.
 * 
 */
class Weekday extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filledOutTimes: [],
            children: [],
            startTime: [],          //startTime moment of a given timeslot
            endTime: [],            //endTime moment of a given timeslot
            showTimePickers: [],    //boolean show if the TimePickers of a given timeslot should be rendered
        }//state

        this.renderTimeSlot = this.renderTimeSlot.bind(this);
        this.handleAddTimeSlot = this.handleAddTimeSlot.bind(this);
        this.removeTimeSlot = this.removeTimeSlot.bind(this);
        this.fetchRemoveTimeSlot = this.fetchRemoveTimeSlot.bind(this);
        this.timeSlotChange = this.timeSlotChange.bind(this);
        this.submitTimes = this.submitTimes.bind(this);
        this.submitFetch = this.submitFetch.bind(this);
        this.setStartTime = this.setStartTime.bind(this);
        this.setEndTime = this.setEndTime.bind(this);
        this.setShowTimePickers = this.setShowTimePickers.bind(this);
        this.getISO = this.getISO.bind(this);
        this.getFilledOutTimes = this.getFilledOutTimes.bind(this);
        this.removeFilledOutTimes = this.removeFilledOutTimes.bind(this);
    }

    /**
     * Updates array of timeslots for the weekday
     * 
     * @param {*} e 
     */
    handleAddTimeSlot = (e) => {
        e.preventDefault();
        const slot = {};
        this.setState({ children: [...this.state.children, slot] })

        //update related states
        this.state.startTime.push(null);
        this.state.endTime.push(null);
        this.state.showTimePickers.push(true);
    }//handleAddTimeSlot

    /**
     * Creates a map of rendered timeslots from children array
     * 
     * @param {string} day: given weekday
     * @returns map of rendered timeslots
     */
    renderTimeSlot(day) {
        return this.state.children.map(item => {
            //Otherwise add a timeslot
            let index = this.state.children.indexOf(item);
            return <TimeSlot day={day}
                index={index}
                removeTimeSlot={this.removeTimeSlot}

                startTime={this.state.startTime}
                endTime={this.state.endTime}
                showTimePickers={this.state.showTimePickers}

                timeSlotChange={this.timeSlotChange}
                submitTimes={this.submitTimes}
            />
        })
    }//renderTimeSlot

    /**
     * removes timeslot of given index
     * 
     * @param {int} index: index from children to remove from
     * @param {string} day: given week day, only used for debugging
     */
    removeTimeSlot(index, day) {
        //remove timeslot from DOM
        let filteredChildren = this.state.children.filter(child => child !== this.state.children[index]);
        this.setState({ children: filteredChildren });

        //remove related state variables
        //startTime
        let filteredStart = this.state.startTime.filter(child => child !== this.state.startTime[index]);
        this.setState({ startTime: filteredStart });
        //endTime
        let filteredEnd = this.state.endTime.filter(child => child !== this.state.endTime[index]);
        this.setState({ endTime: filteredEnd });
        //showTimePickers
        let filteredPickers = this.state.showTimePickers.filter(child => child !== this.state.showTimePickers[index]);
        this.setState({ showTimePickers: filteredPickers });

        //remove timeslot from db
        this.fetchRemoveTimeSlot(index);
    }//renoveTimeSlot

    /**
     * Fetch call to db to remove timeslot
     * 
     * @param {int} index: the index of the given time slot to remove
     */
    fetchRemoveTimeSlot(index) {
        console.log(this.state.startTime[index]);
        //time to remove
        let times = {
            'token': localStorage.getItem("token"),
            "remove": {
                "startTime": this.state.startTime[index].toString(),
                "endTime": this.state.endTime[index].toString(),
                "day": this.getISO(this.props.day)
            }
        };

        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(times)
        })//fetch
    }//fetchRemoveTimeSlot

    /**
     * Updates start and end time states according to the given timepicker
     * 
     * @param {moment} time Moment object of the given timepicker
     * @param {string} timepicker String identifying which timepicker was changed
     */
    timeSlotChange(time, timepicker, index) {
        //Update TimeSlot according to the changed timepicker
        if (timepicker == 'start') {
            this.setStartTime(time, index);
        } else {
            this.setEndTime(time, index);
        }//if
    }//timeSlotChange()

    /**
     * 
     * onClick of submit check that both start and end Times have been selected
     *  then set showTimePickers to false
     *  and call the fetch function
     * 
     * @param {int} index   index of the timeslot
     * @param {string} day  given week day being added to
     */
    submitTimes(index, day) {
        if (this.state.startTime[index] == null || this.state.endTime[index] == null) {
            console.log("Please enter all times");
        } else {
            this.setShowTimePickers(false, index);

            this.submitFetch(index, day);

        }//else
    }//submitTimes

    /**
     * returns numeric value of a weekday
     * 1-monday 7-sunday
     * 
     * @param {string} day: weekday
     * @returns int 1-7, 1 being monday and 7 being sunday
     */
    getISO(day) {
        if (day == 'monday') {
            return 1
        } else if (day == 'tuesday') {
            return 2
        } else if (day == 'wednesday') {
            return 3
        } else if (day == 'thursday') {
            return 4
        } else if (day == 'friday') {
            return 5
        } else if (day == 'saturday') {
            return 6
        } else {
            return 7
        }//if
    }//getISO


    /**
     * post time slot to the backend
     * 
     * @param {int} index   index of the timeslot being added
     * @param {string} day  weekday being added to
     */
    submitFetch(index, day) {
        //convert string day to in 1=monday 7=sunday
        let date = this.getISO(day)
        //setup timeslot dict
        let timeSlot = {
            'submitTimes': true,
            "token": localStorage.getItem("token"),
            "startTime": this.state.startTime[index].day(day).toString(),
            "endTime": this.state.endTime[index].day(day).toString()
        };

        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(timeSlot)
        })//fetch
    }//submitFetch



    /**
     * sets starttime state
     * 
     * @param {string} time: given string from user input
     * @param {int} index: instance of TimeSlot we are at
     */
    setStartTime(time, index) {
        if (this.state.startTime.size - 1 < index) {
            for (let i = 0; i < index; i++) {
                this.state.startTime.push(null);
            }//for
        }//if

        //make a copy of state
        let startTimeCopy = this.state.startTime;
        //update copy
        startTimeCopy.splice(index, 1, time);

        //set state to copy 
        this.setState({ startTime: startTimeCopy })
    }//setStartTime

    /**
     * sets endtime state
     * 
     * @param {string} time: given string from user input
     * @param {int} index: instance of TimeSlot we are at
     */
    setEndTime(time, index) {
        if (this.state.endTime.size - 1 < index) {
            for (let i = 0; i < index; i++) {
                this.state.endTime.push(null);
            }//for
        }//if

        //make a copy of state
        let endTimeCopy = this.state.endTime;
        //update copy
        endTimeCopy.splice(index, 1, time);

        //set state to copy
        this.setState({ endTime: endTimeCopy })
    }//setEndTime

    /**
     * sets showTimePickers state
     * 
     * @param {boolean} bool: whether the timepickers are shown or not
     * @param {int} index: instance of TimeSlot we are at
     */
    setShowTimePickers(bool, index) {
        if (this.state.showTimePickers.size - 1 < index) {
            for (let i = 0; i < index; i++) {
                this.state.showTimePickers.push(true);
            }//for
        }//if

        //make a copy of state
        let showTimePickersCopy = this.state.showTimePickers;
        //update copy
        showTimePickersCopy[index] = bool

        //set state to copy
        this.setState({ showTimePickers: showTimePickersCopy })
    }//setShowTimePickers

    /**
     * 
     * get available times stored in db
     * 
     * @param {array} times array of timeslots
     * @param {string} day given day
     * @returns array of timeslots to be rendered
     */
    getFilledOutTimes(times, day) {
        let toReturn = []   //array of timeslots to be rendered

        //format day
        day = day[0].toUpperCase() + day.slice(1)
        times[day].forEach(slot => toReturn.push({"render": null, "shouldRender": true}));
        //Go through given times
        for (let slot in times[day]) {
            //if there is a time filled out for that day display it
            if (slot.length > 0) {
                let startTime = times[day][slot]['startTime'];
                let endTime = times[day][slot]['endTime'];
                toReturn[slot]['render'] =  toReturn[slot]['shouldReturn'] ? 
                    <>
                        <p> {startTime} to {endTime} </p>
                        <Button className="removeTime" variant="danger" onClick={() => this.removeFilledOutTimes(slot, startTime, endTime, day)}>
                            <BsFillTrashFill size="14" />
                        </Button> <br />
                        <hr />
                    </>:
                    <></>
            }
        }
        console.log(toReturn)
        this.setState({filledOutTimes: [...this.state.filledOutTimes, toReturn]})
    }

    removeFilledOutTimes(slot, startTime, endTime, day) {
        let filledOutTimes = this.state.filledOutTimes;
        filledOutTimes[slot] = false;
        this.setState({filledOutTimes: filledOutTimes})
        let times = {
            'token': localStorage.getItem("token"),
            "remove": {
                "startTime": moment(startTime, 'hh:mm :a').toString(),
                "endTime": moment(endTime, 'hh:mm :a').toString(),
                "day": this.getISO(day)
            }
        };

        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(times)
        })//fetch
    }//removePreFilledTime

    componentDidMount() {
       // this.getFilledOutTimes(this.props.times, this.props.day)
    }

    render() {
        const day = this.props.day;

        let filledOutTimes = this.state.filledOutTimes;

        return (
            <>
                <div className="day">
                    <h6 className={day + "Label"}> {day[0].toUpperCase() + day.slice(1)} </h6>
                    <hr classname="hr" />
                    {filledOutTimes.map(time => time['render'])}
                    {this.renderTimeSlot(day)}
                    <AddTimeSlot handleAddTimeSlot={this.handleAddTimeSlot} />
                </div>
            </>
        );//return
    }//render
}//Weekday

export default Weekday;