import { DayCellRoot } from "@fullcalendar/react";
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
            children: [<TimeSlot day={this.props.day} />]
        }

        this.renderTimeSlot = this.renderTimeSlot.bind(this);
        this.handleAddTimeSlot = this.handleAddTimeSlot.bind(this);
        this.removeTimeSlot = this.removeTimeSlot.bind(this);
    }

    handleAddTimeSlot=(e)=>{
        e.preventDefault();
            //Here i form the object
            const slot = {
            //key:value
            }
       this.setState({children: [...this.state.children, slot]})
    }

    renderTimeSlot(day) {
        return this.state.children.map(item => {
            return <TimeSlot day={day} 
                            index={this.state.children.indexOf(item)} 
                            removeTimeSlot={this.removeTimeSlot}
                    />
        })
    }

    removeTimeSlot(index,day) {
        this.state.children.splice(index, 1);
        console.log("Removed: " + index + " " + day);
        this.forceUpdate();
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
