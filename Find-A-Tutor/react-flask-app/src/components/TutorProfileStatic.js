import React, { Component } from "react";
import { Button, Modal } from 'react-bootstrap';
import './TutorProfile.css';
import TutorProfile from './TutorProfile/T_Profile'
import VerifiedIcon from '@mui/icons-material/Verified';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

/**
 * Render a timeslot with given times
 */
class TimeSlot extends React.Component {
    render() {
        let startTime = this.props.startTime;   //given startTime for the timeslot
        let endTime = this.props.endTime;       //given endTIme for the timeslot
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
                <hr className="hr" />
            </>
        );//return
    }//render
}//TimeSlot

/**
 * Renders all of the TimeSlots for a weekday
 */
class Weekday extends React.Component {
    render() {
        let day = this.props.day;       //given day of the week
        let times = this.props.times;   //given list of timeslots for the day
        let timeSlotList = [];          //list of timeSlots to be rendered

        //put timeslots in list
        times.forEach((slot) => {
            timeSlotList.push(<TimeSlot startTime={slot['startTime']}
                endTime={slot['endTime']} />);
        });

        return (
            <>
                <div>
                    <h6 className="day" id={day + "Label"}> {day[0].toUpperCase() + day.slice(1)} </h6>
                    <hr className="hr" />
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
        let times = this.props.times;   //given list of available times
        return (
            <>
                <div className="d-flex justify-content-center availableTimes">
                    <Weekday times={times['Sunday']} day={'sunday'} />
                    <div className="vr"></div>
                    <Weekday times={times['Monday']} day={'monday'} />
                    <div className="vr"></div>
                    <Weekday times={times['Tuesday']} day={'tuesday'} />
                    <div className="vr"></div>
                    <Weekday times={times['Wednesday']} day={'wednesday'} />
                    <div className="vr"></div>
                    <Weekday times={times['Thursday']} day={'thursday'} />
                    <div className="vr"></div>
                    <Weekday times={times['Friday']} day={'friday'} />
                    <div className="vr"></div>
                    <Weekday times={times['Saturday']} day={'saturday'} />
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
    }//constructor

    /**
     * convert login pref to string to be rendered
     * 
     * @param {int} loginPref 0 = student view, 1 = tutor view
     * @returns string to be rendered
     */
    getLoginPref(loginPref) {
        if (loginPref == 0) {//Student
            return <p> Student View </p>;
        } else {
            return <p> Tutor View </p>;
        }
    }

    render() {
        let items = this.props.items;
        var pay_info = items['pay_info']
        if (pay_info === "") {
            pay_info = "None"
        }
        var pay_info_conditional = <p> Username: {pay_info} </p>
        if (items['pay_type'] === "Cash") {
            pay_info_conditional = <></>
        }
        return (
            <>
                <div className="p-2" id="fieldset">
                    <p id="header"> Payment Info </p>
                    <p> Payment Type {items['pay_type']}</p>
                    {pay_info_conditional}
                    <p id="loginPreferences"> Login Preference </p>
                    {this.getLoginPref(items['login_pref'])}
                </div>
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
        for (let aClass in classes) {
            classesList.push(<>
                <div className='d-flex '>
                    <p> {(aClass[2] ? <VerifiedIcon /> : null)} </p>
                    <p> {classes[aClass]['class_code']} </p>
                    <p className='hourlyRate'> Hourly Rate: ${classes[aClass]['rate']} </p>
                </div>
            </>)
        }

        return (
            <>
                <div className="p-2" id="fieldset">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Verified</strong></TableCell>
                                <TableCell><strong>Class Code</strong></TableCell>
                                <TableCell><strong>Rate</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {classes.map((item) => (
                                <TableRow key={item['class_code']} hover>
                                    <TableCell>{(item["verification"] === 5 ? <VerifiedIcon sx={{ color: 'red' }} /> : (item["verification"] === 1 ? <VerifiedIcon sx={{ color: 'green' }} /> : <Button onClick={() => { this.requestVerify(item[0]) }}>Request</Button>))}</TableCell>
                                    <TableCell>{item['class_code']} </TableCell>
                                    <TableCell>${item['rate']} </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </>
        );//return
    }//render
}//TutorsFor

/**
 * Renders the static version of the profile screen which the user can then choose to edit
 */
class TutorProfileStatic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appts: [],
            showModal: false,
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleStopTutoring = this.handleStopTutoring.bind(this);
    }

    // made so you can stop being a tutor
    handleStopTutoring() {
        //check for appointments
        fetch("/getAppointments/?token=" + localStorage.getItem("token") + "&view=" + localStorage.getItem("view"))
            .then(res => res.json())
            .then(
                result => {
                    this.setState({ appts: result['appts'] });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components
                (error) => {
                    console.log(error);
                }
            ).then(() => {
                if (this.state.appts.length === 0) {
                    //post email to remove tutor
                    let token = localStorage.getItem("token")
                    //Fetch
                    const response = fetch("/removeTutor/", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(token)
                    })//fetch
                    window.location.href = "./calendar";
                }
                else {
                    this.setState({ showModal: true });
                }
            })
    }

    handleClose() {
        this.setState({ showModal: false })
    }

    render() {
        let items = this.props.items;

        return (
            <>

                <Modal show={this.state.showModal} centered onHide={this.handleClose}>
                    <form>
                        <Modal.Header>
                            <Modal.Title>Cancel All Appointments before stopping tutoring</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>

                <p className="text-end pe-2"><i> Logged in as a Tutor </i></p>
                <div className="container-fluid text-center">
                    {/* User Info */}
                    <h1 id="name"> {items['name']} </h1>
                    <p id="email"> {items['email']} </p>
                </div>
                <div id="center" className="d-flex justify-content-around">
                    <PayAndLoginPrefs items={items} />
                    <Week times={items['times']} />
                    <TutorsFor classes={items['tutorsFor']} />
                </div>

                <div id="bottom">
                    <Button variant="success" id="save" onClick={this.props.edit}> Edit </Button>
                    <Button id="stopTutoring" variant="danger" onClick={this.handleStopTutoring}> Stop Tutoring </Button>
                </div>
            </>
        );//return
    }//render
}//TutorProfileStatic

export default TutorProfileStatic;