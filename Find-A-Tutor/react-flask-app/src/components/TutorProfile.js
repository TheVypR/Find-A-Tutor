import React, { Component } from "react";
import { DropdownButton, Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { BsFillTrashFill, BsFillPlusCircleFill, BsPatchCheckFill } from "react-icons/bs";

import moment from 'moment';
import Time from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

import "./TutorProfile.css"

import axios from 'axios';
import { Link } from 'react-router-dom';


const format = 'h:mm a';
const now = moment().hour(0).minute(0);
const buttonSize = 14;
const removeTimeSize = 14;

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
            isTutorView: false,
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
    }

    componentDidMount() {
        fetch('/myProfile')
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    console.log(error);
                }

                this.setState({
                    isLoaded: true,
                    items: data.total
                });
            })
            .catch(error => {
                console.error('There was an error', error)
            })
    }


    handleSelect = (value) => {
        this.setState({ payType: value });
    }

    handleChange = (value) => {
        console.log(value && value.format(format));
        setTimes(times.concat([{ start: value.format(format), end: value.format(format) }]));
        console.log(times);
    }

    handleSubmit = event => {
        async () => {
            const values = [{
                "payType": this.state.payType,
                "inputList": this.state.inputList,
                "payVal": this.state.payVal,
                "loginPref": this.state.payVal,
                "rates": this.state.payVal,
                "contact": this.state.payVal,
                "times": this.state.times
            }];

            const response = await fetch("/myProfile/", {
            method: "POST",
            headers: {
            'Content-Type' : 'application/json'
            },
            body: JSON.stringify(values)
        })}

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
                                        id={`dropdown-button-drop-${idx}`}
                                        size="sm"
                                        variant="primary"
                                        title="Payment Type"
                                        onSelect={this.handleSelect}
                                    >
                                        <Dropdown.Item eventKey="1">Venmo</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">Cash</Dropdown.Item>
                                        <Dropdown.Divider />
                                    </DropdownType>
                                ))}
                            </div>

                            <input type="text" id="venmoUser" placeholder="Venmo Username" onChange={(e) => this.setState({ payType: e.target.value })} />


                            {/*Login Info*/}
                            <div id="loginInfo" onChange={(e) => this.setState({ loginPrefs: e.target.value })}>
                                <p id="loginPreferences"> Login Preferences </p>
                                <input type="radio" id="studentView" value="StudentView" />
                                <label htmlFor="stuentView"> Student View </label><br />
                                <input type="radio" id="tutorView" value="TutorView" />
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

                <div id="days" className="d-flex justify-content-around pt-3">
                    <div>
                        <p id="day"> Sunday </p>

                        {this.state.sundayTimeSlots.map((thisTime, index) => {
                            return (
                                <div>
                                    <label className="timeLabel"> Start Time </label><br />
                                    <Time
                                        style={{ width: "50%" }}
                                        name="startTime"
                                        id={index}
                                        className="timepicker"
                                        showSecond={false}
                                        defaultValue={now}
                                        className="xxx"
                                        onChange={this.onChange}
                                        format={format}
                                        use12Hours
                                        inputReadOnly
                                        minuteStep={30}
                                        name="startTime"
                                    /> <br />

                                    <div className="d-flex justify-content-center">
                                        <div className="align-self-end flex-grow-1">
                                            <label id={index} className="timeLabel"> End Time </label><br />
                                        </div>

                                        <Button id={index} className="removeTime" variant="danger" onClick={() => this.RemoveTimeSlot(index, "sunday")}>
                                            <BsFillTrashFill size={removeTimeSize} />
                                        </Button> <br />
                                    </div>

                                    <Time
                                        style={{ width: "50%" }}
                                        name="endTime"
                                        id={index}
                                        className="timepicker"
                                        showSecond={false}
                                        defaultValue={now}
                                        className="xxx"
                                        onChange={this.onChange}
                                        format={format}
                                        use12Hours
                                        inputReadOnly
                                        minuteStep={30}
                                        name="endTime"
                                    />
                                    <hr />
                                </div>
                            );
                        })}

                        <Button className="AddTimeSlot" onClick={() => this.AddTimeSlot("sunday")}>
                            <BsFillPlusCircleFill />
                        </Button>
                    </div>

                    <div>
                        <p id="day"> Monday </p>
                        {this.state.mondayTimeSlots.map((thisTime, index) => {
                            return (
                                <>
                                    <div className="d-flex justify-content-center" id="timeSlot">
                                        <label id="startTimeLabel" className="timeLabel"> Start Time </label>
                                        <label id="endTimeLabel" className="timeLabel"> End Time </label><br />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Time
                                            style={{ width: "33%" }}
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
                                            style={{ width: "33%" }}
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

                    <div>
                        <p id="day"> Tuesday </p>
                        <Time
                            id="timepicker"
                            showSecond={false}
                            defaultValue={now}
                            className="xxx"
                            onChange={this.onChange}
                            format={format}
                            use12Hours
                            inputReadOnly
                        />
                        <Button id="removeTime" variant="danger">
                            <BsFillTrashFill size={removeTimeSize
                            } />
                        </Button>
                        <Button id="addHour">
                            <BsFillPlusCircleFill />
                        </Button>
                    </div>

                    <div>
                        <p id="day"> Wednesday </p>
                        <Time
                            id="timepicker"
                            showSecond={false}
                            defaultValue={now}
                            className="xxx"
                            onChange={this.onChange}
                            format={format}
                            use12Hours
                            inputReadOnly
                        />
                        <Button id="removeTime" variant="danger">
                            <BsFillTrashFill size={removeTimeSize
                            } />
                        </Button>
                        <Button id="addHour">
                            <BsFillPlusCircleFill />
                        </Button>
                    </div>

                    <div>
                        <p id="day"> Thursday </p>
                        <Time
                            id="timepicker"
                            showSecond={false}
                            defaultValue={now}
                            className="xxx"
                            onChange={this.onChange}
                            format={format}
                            use12Hours
                            inputReadOnly
                        />
                        <Button id="removeTime" variant="danger">
                            <BsFillTrashFill size={removeTimeSize
                            } />
                        </Button>
                        <Button id="addHour">
                            <BsFillPlusCircleFill />
                        </Button>
                    </div>

                    <div>
                        <p id="day"> Friday </p>
                        <Time
                            id="timepicker"
                            showSecond={false}
                            defaultValue={now}
                            className="xxx"
                            onChange={this.onChange}
                            format={format}
                            use12Hours
                            inputReadOnly
                        />
                        <Button id="removeTime" variant="danger">
                            <BsFillTrashFill size={removeTimeSize
                            } />
                        </Button>
                        <Button id="addHour">
                            <BsFillPlusCircleFill />
                        </Button>
                    </div>

                    <div>
                        <p id="day"> Saturday </p>
                        <Time
                            id="timepicker"
                            showSecond={false}
                            defaultValue={now}
                            className="xxx"
                            onChange={this.onChange}
                            format={format}
                            use12Hours
                            inputReadOnly
                        />
                        <Button id="removeTime" variant="danger">
                            <BsFillTrashFill size={removeTimeSize
                            } />
                        </Button>
                        <Button id="addHour">
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
