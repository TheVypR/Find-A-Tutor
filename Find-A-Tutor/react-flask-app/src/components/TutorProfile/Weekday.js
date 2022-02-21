import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import { BsFillPlusCircleFill } from "react-icons/bs";
import TimeSlot from './TimeSlot'


/** AdTimeSlot Component
 * 
 * Displays a button which allows users to add time slots to the given week day
 * 
 */
class AddTimeSlot extends React.Component {
    render() {
        return (
            <>
                <Button className="AddTimeSlot">
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
    render() {
        const day = this.props.day;
        return (
            <>
                <div>
                    <h6 className="weekdayLabel"> {day[0].toUpperCase() + day.slice(1)} </h6>
                    <TimeSlot />
                    <AddTimeSlot />
                </div>
            </>
        );//return
    }//render
}//Weekday

export default Weekday;
