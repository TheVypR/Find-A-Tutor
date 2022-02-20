import React, { Component } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import TimeSlot from './TimeSlot'

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
                <h6 className="weekdayLabel"> {day} </h6>
                <TimeSlot />
            </>
        );//return
    }//render
}//Weekday

export default Weekday;
