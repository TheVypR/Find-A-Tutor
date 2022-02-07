import React, { useState, useEffect } from "react";
import { DropdownButton, Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { BsFillTrashFill, BsFillPlusCircleFill, BsPatchCheckFill } from "react-icons/bs";

import moment from 'moment';
import Time from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

import "./TutorProfile.css"

const format = 'h:mm a';
const now = moment().hour(0).minute(0);
const buttonSize = 14;

class TutorProfile extends React.Component {

    // const [isTutorView, setTutorView] = useState(false)
	// const [info, setInfo] = useState({})
	// const [payType, setPayType] = useState("")
	// const [inputList, setInputList] = React.useState([]);
	// const [payVal, setPayVal] = useState("")
	// const [loginPref, setLoginPref] = useState(false)
	// const [rates, setRates] = useState([{}])
	// const [contact, setContact] = useState(false)
	// const [times, setTimes] = useState([])

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

            isTutorView: false,
            info: "",
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
        
        this.userEffect = this.useEffect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect = (value) =>{
		setPayType(value);
	}

    handleChange = (value) => {
        console.log(value && value.format(format));
		setTimes(times.concat([{start:value.format(format), end:value.format(format)}]));
		console.log(times);
    }

    useEffect() {
		fetch('/myProfile')
			.then(response => {
				if(response.ok) {
					return response.json()
				}
				throw response;
			})
			.then(data => {
				setInfo(data);
			})
			.catch(error => {
				console.error("Error fetching data:", error);
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
                    <h1 id="name"> {info['name']} </h1>
                    <p id="email"> {info['email']} </p>
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

                            <input type="text" id="venmoUser" placeholder="Venmo Username" onChange={(e)=>this.setState({payType: e.target.value})}/>


                            {/*Login Info*/}
                            <div id="loginInfo" onChange={(e)=>this.setState({loginPrefs: e.target.value})}>
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
                            <input type="checkbox" id="contactMe" onChange={this.setState({contact: e.target.value})}/>
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
                    <Button id="edit"> Apply Changes </Button>
                    <Button id="stopTutoring" variant="danger"> Stop Tutoring </Button>
                </div>
            </>
        );
    }
}

export default TutorProfile;
