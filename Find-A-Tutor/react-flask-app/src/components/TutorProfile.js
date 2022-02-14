import React, { Component } from "react";
import { DropdownButton, Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { BsFillTrashFill, BsFillPlusCircleFill, BsPatchCheckFill } from "react-icons/bs";

import moment from 'moment';
import Time from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

import "./TutorProfile.css"

const format = 'h:mm a';
const now = moment().hour(0).minute(0);
const buttonSize = 14;
const removeTimeSize = 14;
var paymentType = "Payment Type";

class TutorProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classesList: [{ verified: "", courseCode: "", rate: "" }],
            time: moment,
            sundayTimeSlots: [{ startTime: "", endTime: "" }],
            mondayTimeSlots: [{ startTime: "", endTime: "" }],
            tuesdayTimeSlots: [{ startTime: "", endTime: "" }],
            wednesdayTimeSlots: [{ startTime: "", endTime: "" }],
            thursdayTimeSlots: [{ startTime: "", endTime: "" }],
            fridayTimeSlots: [{ startTime: "", endTime: "" }],
            saturdayTimeSlots: [{ startTime: "", endTime: "" }],

            isLoaded: false,
            items: "",
            isTutorView: true,
            payType: "",
            inputList: "",
            payVal: "",
            loginPref: "",
            rates: "",
            contact: "",
            times: ""
        }

        this.onChange = this.onChange.bind(this);
        this.AddNewClass = this.AddNewClass.bind(this);
        this.RemoveClass = this.RemoveClass.bind(this);
        this.AddTimeSlot = this.AddTimeSlot.bind(this);
        this.RemoveTImeSlot = this.RemoveTimeSlot.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch("/myProfile")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.items
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }


    handleSelect = (value) => {
        this.setState({ payType: value });
        paymentType = value;
        
        var user = document.getElementById("venmoUser");
        if (user.style.display != "none" && paymentType == "Cash") {
            user.style.display = "none";
        } else {
            user.style.display = "block";
        }

    }

    handleChange = (value) => {
        // console.log(value && value.format(format));
        // this.setState({times: (this.state.times.concat([{ start: value.format(format), end: value.format(format) }]))});
        // console.log(times);
    }

    handleSubmit = () => {
        const values = [{
            "payType": this.state.payType,
            "inputList": this.state.inputList,
            "payVal": this.state.payVal,
            "loginPref": this.state.payVal,
            "rates": this.state.payVal,
            "contact": this.state.payVal,
            "times": this.state.times
        }];

        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
    }

    onChange(time) {
        console.log(time && time.format(format));
    }


    AddNewClass() {
        this.setState({
            classesList: [
                ...this.state.classesList,
                { verified: "", courseCode: "", rate: "" }
            ]
        });
    }

    RemoveClass = index => {
        this.state.classesList.splice(index, 1);

        this.setState({
            classesList: this.state.classesList
        })
    }

    AddTimeSlot = day => {
        if (day == "sunday") {
            this.setState({
                sundayTimeSlots: [
                    ...this.state.sundayTimeSlots,
                    { startTime: "", endTime: "" }
                ]
            })
        } else if (day == "monday") {
            this.setState({
                mondayTimeSlots: [
                    ...this.state.mondayTimeSlots,
                    { startTime: "", endTime: "" }
                ]
            })
        } else if (day == "tuesday") {
            this.setState({
                tuesdayTimeSlots: [
                    ...this.state.tuesdayTimeSlots,
                    { startTime: "", endTime: "" }
                ]
            })
        } else if (day == "wednesday") {
            this.setState({
                wednesdayTimeSlots: [
                    ...this.state.wednesdayTimeSlots,
                    { startTime: "", endTime: "" }
                ]
            })
        } else if (day == "thursday") {
            this.setState({
                thursdayTimeSlots: [
                    ...this.state.thursdayTimeSlots,
                    { startTime: "", endTime: "" }
                ]
            })
        } else if (day == "friday") {
            this.setState({
                fridayTimeSlots: [
                    ...this.state.fridayTimeSlots,
                    { startTime: "", endTime: "" }
                ]
            })
        } else if (day == "saturday") {
            this.setState({
                saturdayTimeSlots: [
                    ...this.state.saturdayTimeSlots,
                    { startTime: "", endTime: "" }
                ]
            })
        } else {
            console.log("oops");
        }
    }

    RemoveTimeSlot = (index, day) => {
        if (day == "sunday") {
            this.state.sundayTimeSlots.splice(index, 1);

            this.setState({
                sundayTimeSlots: this.state.sundayTimeSlots
            })
        } else if (day == "monday") {
            this.state.mondayTimeSlots.splice(index, 1);

            this.setState({
                mondayTimeSlots: this.state.mondayTimeSlots
            })
        } else if (day == "tuesday") {
            this.state.tuesdayTimeSlots.splice(index, 1);

            this.setState({
                tuesdayTimeSlots: this.state.tuesdayTimeSlots
            })
        } else if (day == "wednesday") {
            this.state.wednesdayTimeSlots.splice(index, 1);

            this.setState({
                wednesdayTimeSlots: this.state.wednesdayTimeSlots
            })
        } else if (day == "thursday") {
            this.state.thursdayTimeSlots.splice(index, 1);

            this.setState({
                thursdayTimeSlots: this.state.thursdayTimeSlots
            })
        } else if (day == "friday") {
            this.state.fridayTimeSlots.splice(index, 1);

            this.setState({
                fridayTimeSlots: this.state.fridayTimeSlots
            })
        } else if (day == "saturday") {
            this.state.saturdayTimeSlots.splice(index, 1);

            this.setState({
                saturdayTimeSlots: this.state.saturdayTimeSlots
            })
        } else {
            console.log("oops");
        }
    }

    render() {
        return (
            <>
                <p className="text-end pe-2"><i> Logged in as a Tutor </i></p>

                <div className="container-fluid text-center">
                    {/* User Info */}
                    <h1 id="name"> {this.state.items['name']} </h1>
                    <p id="email"> {this.state.items['email']} </p>
                </div>

                {/* Payment Info*/}
                <div id="center" className="d-flex justify-content-around">
                    <fieldset>
                        <div className="p-2">
                            <p id="header"> Payment Info </p>
                            <div className="paymentType">
                                {[DropdownButton].map((DropdownType, idx) => (
                                    <DropdownType
                                        as={ButtonGroup}
                                        key={idx}
                                        id={'dropdown-button-drop-${idx}'}
                                        size="sm"
                                        variant="primary"
                                        title={paymentType}
                                        onSelect={this.handleSelect}
                                    >
                                        <Dropdown.Item eventKey="Venmo">Venmo</Dropdown.Item>
                                        <Dropdown.Item eventKey="Paypal">Paypal</Dropdown.Item>
                                        <Dropdown.Item eventKey="Cash">Cash</Dropdown.Item>
                                    </DropdownType>
                                ))}
                            </div>

                            <input type="text" id="venmoUser" placeholder={paymentType + " Username"} onChange={(e) => this.setState({ payType: e.target.value })} />


                            {/*Login Info*/}
                            <div id="loginInfo" onChange={(e) => this.setState({ loginPrefs: e.target.value })}>
                                <p id="loginPreferences"> Login Preferences </p>
                                <input name="loginPrefs" type="radio" id="studentView" value="StudentView" />
                                <label htmlFor="stuentView"> Student View </label><br />
                                <input name="loginPrefs" type="radio" id="tutorView" value="TutorView" />
                                <label htmlFor="tutorView"> Tutor View </label>
                            </div>
                        </div>
                    </fieldset>


                    {/*Classes*/}
                    <fieldset>
                        <div className="p-2">
                            <p id="header"> Tutoring For </p>
                            <div id="classes">

                                {this.state.classesList.map((thisClass, index) => {
                                    return (
                                        <div className="input-group mb-3">
                                            <BsPatchCheckFill name="verified" id={index} className="verified" size="22" />
                                            <input name="courseCode" id={index} className="courseCode" type="text" placeholder='HUMA 200 A' size="8"></input>
                                            <label id={index} className="rateLabel" htmlFor="rate"> Hourly Rate: $</label>
                                            <input name="rate" type="number" id={index} className="hourlyRate" size="2" />
                                            <div className="input-group-append">
                                                <Button id={index} className="removeClass" variant="danger" onClick={() => this.RemoveClass(index)}>
                                                    <BsFillTrashFill />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                            <Button type="button" id="AddClass" variant="primary" onClick={this.AddNewClass}> Add Class </Button>
                        </div>
                    </fieldset>
                </div>
                {/*Available Times*/}
                <div id="availiableTimesFlex" className="container-fluid pt-5">
                    <div className="row justify-content-start">
                        <div className="col-4">
                            <input type="checkbox" id="contactMe" onChange={(e) => this.setState({ contact: e.target.value })} />
                            <label htmlFor="contactMe"> Contact Me For Avalability </label>
                        </div>
                        <h6 id="header" className="col-4 text-center"> Available Times</h6>
                    </div>
                </div>

                <div id="days" className="d-flex justify-content-center">
                    <div>
                        <text id="day"> Sunday </text> <br />

                        {this.state.sundayTimeSlots.map((thisTime, index) => {
                            return (
                                <>
                                    <div className="d-flex justify-content-center" id="timeSlot">
                                        <label id="startTimeLabel" className="timeLabel"> Start Time </label>
                                        <label id="endTimeLabel" className="timeLabel"> End Time </label><br />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Time
                                            name="startTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="startTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="startTime"
                                        />

                                        <Time
                                            name="endTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="endTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="endTime"
                                        />
                                    </div>

                                    <Button id={index} className="removeTime" variant="danger" onClick={() => this.RemoveTimeSlot(index, "sunday")}>
                                        <BsFillTrashFill size={removeTimeSize} />
                                    </Button> <br />
                                    <hr />
                                </>
                            );
                        })}

                        <Button className="AddTimeSlot" onClick={() => this.AddTimeSlot("sunday")}>
                            <BsFillPlusCircleFill />
                        </Button>
                    </div>

                    <div className="vr"></div>

                    <div>
                        <text id="day"> Monday </text><br />
                        {this.state.mondayTimeSlots.map((thisTime, index) => {
                            return (
                                <>
                                    <div className="d-flex justify-content-center" id="timeSlot">
                                        <label id="startTimeLabel" className="timeLabel"> Start Time </label>
                                        <label id="endTimeLabel" className="timeLabel"> End Time </label><br />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Time
                                            name="startTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="startTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="startTime"
                                        />

                                        <Time
                                            name="endTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="endTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="endTime"
                                        />
                                    </div>

                                    <Button id={index} className="removeTime" variant="danger" onClick={() => this.RemoveTimeSlot(index, "monday")}>
                                        <BsFillTrashFill size={removeTimeSize} />
                                    </Button> <br />
                                    <hr />
                                </>
                            );
                        })}
                        <Button className="AddTimeSlot" onClick={() => this.AddTimeSlot("monday")}>
                            <BsFillPlusCircleFill />
                        </Button>
                    </div>

                    <div className="vr"></div>

                    <div>
                        <text id="day"> Tuesday </text><br />
                        {this.state.tuesdayTimeSlots.map((thisTime, index) => {
                            return (
                                <>
                                    <div className="d-flex justify-content-center" id="timeSlot">
                                        <label id="startTimeLabel" className="timeLabel"> Start Time </label>
                                        <label id="endTimeLabel" className="timeLabel"> End Time </label><br />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Time
                                            name="startTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="startTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="startTime"
                                        />

                                        <Time
                                            name="endTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="endTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="endTime"
                                        />
                                    </div>

                                    <Button id={index} className="removeTime" variant="danger" onClick={() => this.RemoveTimeSlot(index, "tuesday")}>
                                        <BsFillTrashFill size={removeTimeSize} />
                                    </Button> <br />
                                    <hr />
                                </>
                            );
                        })}
                        <Button className="AddTimeSlot" onClick={() => this.AddTimeSlot("tuesday")}>
                            <BsFillPlusCircleFill />
                        </Button>
                    </div>

                    <div className="vr"></div>

                    <div>
                        <text id="day"> Wednesday </text><br />
                        {this.state.wednesdayTimeSlots.map((thisTime, index) => {
                            return (
                                <>
                                    <div className="d-flex justify-content-center" id="timeSlot">
                                        <label id="startTimeLabel" className="timeLabel"> Start Time </label>
                                        <label id="endTimeLabel" className="timeLabel"> End Time </label><br />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Time
                                            name="startTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="startTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="startTime"
                                        />

                                        <Time
                                            name="endTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="endTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="endTime"
                                        />
                                    </div>

                                    <Button id={index} className="removeTime" variant="danger" onClick={() => this.RemoveTimeSlot(index, "wednesday")}>
                                        <BsFillTrashFill size={removeTimeSize} />
                                    </Button> <br />
                                    <hr />
                                </>
                            );
                        })}
                        <Button className="AddTimeSlot" onClick={() => this.AddTimeSlot("wednesday")}>
                            <BsFillPlusCircleFill />
                        </Button>
                    </div>

                    <div className="vr"></div>

                    <div>
                        <text id="day"> Thursday </text><br />
                        {this.state.thursdayTimeSlots.map((thisTime, index) => {
                            return (
                                <>
                                    <div className="d-flex justify-content-center" id="timeSlot">
                                        <label id="startTimeLabel" className="timeLabel"> Start Time </label>
                                        <label id="endTimeLabel" className="timeLabel"> End Time </label><br />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Time
                                            name="startTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="startTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="startTime"
                                        />

                                        <Time
                                            name="endTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="endTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="endTime"
                                        />
                                    </div>

                                    <Button id={index} className="removeTime" variant="danger" onClick={() => this.RemoveTimeSlot(index, "thursday")}>
                                        <BsFillTrashFill size={removeTimeSize} />
                                    </Button> <br />
                                    <hr />
                                </>
                            );
                        })}
                        <Button className="AddTimeSlot" onClick={() => this.AddTimeSlot("thursday")}>
                            <BsFillPlusCircleFill />
                        </Button>
                    </div>

                    <div className="vr"></div>

                    <div>
                        <text id="day"> Friday </text><br />
                        {this.state.fridayTimeSlots.map((thisTime, index) => {
                            return (
                                <>
                                    <div className="d-flex justify-content-center" id="timeSlot">
                                        <label id="startTimeLabel" className="timeLabel"> Start Time </label>
                                        <label id="endTimeLabel" className="timeLabel"> End Time </label><br />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Time
                                            name="startTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="startTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="startTime"
                                        />

                                        <Time
                                            name="endTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="endTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="endTime"
                                        />
                                    </div>

                                    <Button id={index} className="removeTime" variant="danger" onClick={() => this.RemoveTimeSlot(index, "friday")}>
                                        <BsFillTrashFill size={removeTimeSize} />
                                    </Button> <br />
                                    <hr />
                                </>
                            );
                        })}
                        <Button className="AddTimeSlot" onClick={() => this.AddTimeSlot("friday")}>
                            <BsFillPlusCircleFill />
                        </Button>
                    </div>

                    <div className="vr"></div>

                    <div>
                        <text id="day"> Saturday </text><br />
                        {this.state.saturdayTimeSlots.map((thisTime, index) => {
                            return (
                                <>
                                    <div className="d-flex justify-content-center" id="timeSlot">
                                        <label id="startTimeLabel" className="timeLabel"> Start Time </label>
                                        <label id="endTimeLabel" className="timeLabel"> End Time </label><br />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Time
                                            name="startTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="startTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="startTime"
                                        />

                                        <Time
                                            name="endTime"
                                            id={index}
                                            className="timepicker"
                                            showSecond={false}
                                            defaultValue={now}
                                            className="endTime"
                                            onChange={this.onChange}
                                            format={format}
                                            use12Hours
                                            inputReadOnly
                                            minuteStep={30}
                                            name="endTime"
                                        />
                                    </div>

                                    <Button id={index} className="removeTime" variant="danger" onClick={() => this.RemoveTimeSlot(index, "saturday")}>
                                        <BsFillTrashFill size={removeTimeSize} />
                                    </Button> <br />
                                    <hr />
                                </>
                            );
                        })}
                        <Button className="AddTimeSlot" onClick={() => this.AddTimeSlot("saturday")}>
                            <BsFillPlusCircleFill />
                        </Button>
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div id="bottom">
                    <Button type="submit" id="save"
                        onClick={this.handleSubmit}
                    > Save and Close </Button>
                    <Button id="stopTutoring" variant="danger"> Stop Tutoring </Button>
                    <Link to='/calendar'>
                        <Button id="submit"> To Calendar </Button>
                    </Link>
                </div>
            </>
        );
    }
}

export default TutorProfile;
