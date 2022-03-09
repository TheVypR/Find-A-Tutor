import { DayCellRoot } from "@fullcalendar/react";
import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import { BsFillPlusCircleFill } from "react-icons/bs";
import TimeSlot from './TimeSlot'


const format = 'h:mm a';    //Format for TimePicker

/** AdTimeSlot Component
 * 
 * Displays a button which allows users to add time slots to the given week day
 * 
 */
class AddTimeSlot extends React.Component {
    render() {
        const day = this.props.day;
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
            children: [],
            startTime: [],          //startTime moment of a given timeslot
            endTime: [],            //endTime moment of a given timeslot
            showTimePickers: [],    //boolean show if the TimePickers of a given timeslot should be rendered
        }

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
    }

    /**
     * Updates array of timeslots for the weekday
     * 
     * @param {*} e 
     */
    handleAddTimeSlot = (e) => {
        e.preventDefault();
        //Here i form the object
        const slot = {
            //key:value
        }
        this.setState({ children: [...this.state.children, slot] })

        //update related states
        this.state.startTime.push(null);
        this.state.endTime.push(null);
        this.state.showTimePickers.push(true);
    }

    /**
     * Creates a map of rendered timeslots from children array
     * 
     * @param {*} day: given weekday
     * @returns : map of rendered timeslots
     */
    renderTimeSlot(day) {
        return this.state.children.map(item => {
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
    }

    /**
     * removes timeslot of given index
     * 
     * @param {*} index: index from children to remove from
     * @param {*} day: given week day, only used for debugging
     */
    removeTimeSlot(index, day) {
        //remove timeslot from DOM
        let filteredChildren = this.state.children.filter(child => child !== this.state.children[index]);
        this.setState({ children: filteredChildren });
        console.log("index: " + index + "day: " + day);
        
        //remove related state variables
        //startTime
        let filteredStart = this.state.startTime.filter(child => child!== this.state.startTime[index]);
        this.setState({startTime: filteredStart});
        //endTime
        let filteredEnd = this.state.endTime.filter(child => child!== this.state.endTime[index]);
        this.setState({endTime: filteredEnd});
        //showTimePickers
        let filteredPickers = this.state.showTimePickers.filter(child => child!== this.state.showTimePickers[index]);
        this.setState({showTimePickers: filteredPickers});

        //remove timeslot from db
        this.fetchRemoveTimeSlot(index);
    }

    /**
     * Fetch call to db to remove timeslot
     * 
     * @param {*} index: the index of the given time slot to remove
     */
    fetchRemoveTimeSlot(index) {
        let times = {
			'email': localStorage.getItem("email"),
            "remove": {
                "startTime": this.state.startTime[index].toString(),
                "endTime": this.state.endTime[index].toString(),
            }
        };

        console.log("Post times: " + times['startTime']);

        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(times)
        })//fetch
    }

    /**
     * Updates start and end time states according to the given timepicker
     * 
     * @param {*} time Moment object of the given timepicker
     * @param {*} timepicker String identifying which timepicker was changed
     */
    timeSlotChange(time, timepicker, index) {
        console.log(index);
        //Update TimeSlot according to the changed timepicker
        if (timepicker == 'start') {
            console.log("set");
            this.setStartTime(time, index);
        } else {
            this.setEndTime(time, index);
        }//if

    }//timeSlotChange()

    /**
     *  onClick of submit check that both start and end Times have been selected
     *  then set showTimePickers to false
     *  and call the fetch function
     * 
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
     * @param {} day: string weekday
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
        }
    }


    /**
     * Posts timeslot to backend
     * 
     * @param - prop of the given day of the timeslot
     */
    submitFetch(index, day) {
        let date = this.getISO(day)
        let timeSlot = {
			"email": localStorage.getItem("email"),
            "startTime": this.state.startTime[index].toString(),
            "endTime": this.state.endTime[index].toString(),
            "date": date
        };

        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(timeSlot)
        })//fetch
    }

    /**
     * sets starttime state
     * 
     * @param {*} time: given string from user input
     * @param {*} index: instance of TimeSlot we are at
     */
    setStartTime(time, index) {
        if (this.state.startTime.size - 1 < index) {
            for (let i = 0; i < index; i++) {
                this.state.startTime.push(null);
            }
        }
        let startTimeCopy = this.state.startTime;
        startTimeCopy.splice(index, 1, time);
        console.log(startTimeCopy);

        this.setState({ startTime: startTimeCopy })
    }

    /**
     * sets endtime state
     * 
     * @param {*} time: given string from user input
     * @param {*} index: instance of TimeSlot we are at
     */
    setEndTime(time, index) {
        if (this.state.endTime.size - 1 < index) {
            for (let i = 0; i < index; i++) {
                this.state.endTime.push(null);
            }
        }
        let endTimeCopy = this.state.endTime;
        endTimeCopy.splice(index, 1, time);

        this.setState({ endTime: endTimeCopy })
    }

    /**
     * sets showTimePickers state
     * 
     * @param {*} bool: whether the timepickers are shown or not
     * @param {*} index: instance of TimeSlot we are at
     */
    setShowTimePickers(bool, index) {
        if (this.state.showTimePickers.size - 1 < index) {
            for (let i = 0; i < index; i++) {
                this.state.showTimePickers.push(true);
            }
        }
        let showTimePickersCopy = this.state.showTimePickers;
        showTimePickersCopy[index] = bool

        this.setState({ showTimePickers: showTimePickersCopy })
    }


    render() {
        const day = this.props.day;
        return (
            <>
                <div>
                    <h6 className={day + "Label"}> {day[0].toUpperCase() + day.slice(1)} </h6>
                    {this.renderTimeSlot(day)}
                    <AddTimeSlot handleAddTimeSlot={this.handleAddTimeSlot} />
                </div>
            </>
        );//return
    }//render
}//Weekday

export default Weekday;
