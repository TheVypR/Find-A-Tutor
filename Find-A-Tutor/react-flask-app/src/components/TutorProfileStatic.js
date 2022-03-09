import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import './TutorProfile.css';
import TutorProfile from './TutorProfile/T_Profile'

/**
 * Render a timeslot with given times
 */
class TimeSlot extends React.Component {
    render() {
        let startTime = this.props.startTime
        let endTime = this.props.endTime
        return (
            <>
                {/* TimeSlot Labels */}
                <div className="d-flex justify-content-center" id="timeSlot">
                    <label id="startTimeLabel" className="timeLabel"> Start Time </label>
                    <label id="endTimeLabel" className="timeLabel"> End Time </label><br />
                </div>
                {/* TimeSlots */}
                <div className="d-flex justify-content-center" id="sundayTimeSlot">
                    <p> {startTime} to {endTime} </p>
                </div>
                <hr />
            </>
        );//return
    }//render
}//TimeSlot

/**
 * Renders all of the TimeSlots for a weekday
 */
class Weekday extends React.Component {
    render() {
        let day = this.props.day;
        let times = this.props.times;

        let timeSlotList = [];
        times.forEach((slot) => {
            timeSlotList.push(<TimeSlot startTime={slot['startTime']}
                endTime={slot['endTime']} />);
        });
        return (
            <>
                <div>
                    <h6 className={day + "Label"}> {day[0].toUpperCase() + day.slice(1)} </h6>
                    {timeSlotList}
                </div>
            </>
        );//return
    }//render
}//Weekday

/**
 * Renders each weekday
 */
class Week extends React.Component {
    render() {
        let times = this.props.times;
        return (
            <>
                <div className="d-flex justify-content-center">
                    <div className="vr"></div>
                    <Weekday times={times['Sunday']} day={['sunday']} />
                    <div className="vr"></div>
                    <Weekday times={times['Monday']} day={['monday']} />
                    <div className="vr"></div>
                    <Weekday times={times['Tuesday']} day={['tuesday']} />
                    <div className="vr"></div>
                    <Weekday times={times['Wednesday']} day={['wednesday']} />
                    <div className="vr"></div>
                    <Weekday times={times['Thursday']} day={['thursday']} />
                    <div className="vr"></div>
                    <Weekday times={times['Friday']} day={['friday']} />
                    <div className="vr"></div>
                    <Weekday times={times['Saturday']} day={['saturday']} />
                    <div className="vr"></div>
                </div>
            </>
        );//return
    }//render
}//Week

/**
 * Renders the payment info and login prefs
 */
class PayAndLoginPrefs extends React.Component {
    constructor(props) {
        super(props);

        this.getLoginPref = this.getLoginPref.bind(this);
    }

    getLoginPref(loginPref) {
        if (loginPref == 0) {//Student
            return 'Studnet View';
        } else {
            return 'Tutor View';
        }
    }

    render() {
        let items = this.props.items;
        return (
            <>
                <fieldset>
                    <div className="p-2">
                        <p id="header"> Payment Info </p>
                        <p> Payment Type: {items['pay_type']}</p>
                        <p> Username: {items['pay_info']} </p>
                        <p id="loginPreferences"> Login Preference: </p>
                        <p> {this.getLoginPref(items['login_pref'])} </p>
                    </div>
                </fieldset>
            </>
        );//return
    }//render
}//PayAndLoginPrefs

/**
 * Renders the classes the tutor tutors for
 */
class TutorsFor extends React.Component {
    render() {
        let classes = this.props.classes;
        let classesList = [];
        classes.forEach(aClass => {
            classesList.push(<>
                <div className='d-flex '>
                    <p className='courseCodeStatic'> {aClass[0]} </p>
                    <p className='hourlyRateStatic'> Hourly Rate: ${aClass[1]} </p>
                </div>
            </>)
        })

        return (
            <>
                <fieldset>
                    <div className="p-2">
                        <p id="header"> Tutoring For </p>
                        <div id="classes">
                            {classesList}
                        </div>
                    </div>
                </fieldset>
            </>
        );//return
    }//render
}//TutorsFor

/**
 * Renders the static version of the profile screen which the user can then choose to edit
 */
class TutorProfileStatic extends React.Component {
    render() {
        let items = this.props.items;
        return (
            <>
                <div id="center" className="d-flex justify-content-around">
                    <PayAndLoginPrefs items={items} />
                    <TutorsFor classes={items['classes']} />
                </div>
                <Week times={items['times']} />

                <div id="bottom">
                    <Button variant="success" id="save" onClick={this.props.edit}> Edit </Button>
                    <Button id="stopTutoring" variant="danger"> Stop Tutoring </Button>
                </div>
            </>
        );//return
    }//render
}//TutorProfileStatic

export default TutorProfileStatic;