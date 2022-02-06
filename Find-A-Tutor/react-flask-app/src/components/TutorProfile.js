import { DropdownButton, Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { BsFillTrashFill, BsFillPlusCircleFill, BsPatchCheckFill } from "react-icons/bs";

import React, { useState } from "react";

import moment from 'moment';
import Time from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

import "./TutorProfile.css"

const format = 'h:mm a';
const now = moment().hour(0).minute(0);
const removeTimeSize = 14;

const TutorProfile = () => {

    const NewClass = () => {
        return (
            <div id="newClass">
                <BsPatchCheckFill id="verified" size="22"/>
                <input id="courseCode" type="text" placeholder='HUMA 200 A' size="8"></input>
                <label id="rate" htmlFor="rate"> Hourly Rate: $</label>
                <input type="number" id="hourlyRate" size="2" />
                <Button variant="danger">
                    <BsFillTrashFill />
                </Button>
            </div>
        )
    }

    const [inputList, setInputList] = React.useState([]);
    const [value, setValue] = React.useState(null);

    function onChange(value) {
        console.log(value && value.format(format));
    }


    const AddNewClass = event => {
        setInputList(inputList.concat(<NewClass key={inputList.length} />));

    }
    return (
        <>
            <p className="text-end pe-2"><i> Logged in as a Tutor </i></p>

            <div className="container-fluid text-center">
                {/* User Info */}
                <h1 id="name"> Tim Warner </h1>
                <p id="email"> WarnerTR18@gcc.edu </p>
            </div>

            {/* Payment Info*/}
            <div id="center" className="d-flex justify-content-around">
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
                            >
                                <Dropdown.Item eventKey="1">Venmo</Dropdown.Item>
                                <Dropdown.Item eventKey="2">Cash</Dropdown.Item>
                                <Dropdown.Divider />
                            </DropdownType>
                        ))}
                    </div>

                    <input type="text" id="venmoUser" placeholder="Venmo Username" />


                    {/*Login Info*/}
                    <div id="loginInfo">
                        <p id="loginPreferences"> Login Preferences </p>
                        <input type="radio" id="studentView" value="StudentView" />
                        <label htmlFor="stuentView"> Student View </label><br />
                        <input type="radio" id="tutorView" value="TutorView" />
                        <label htmlFor="tutorView"> Tutor View </label>
                    </div>
                </div>


                {/*Classes*/}
                <div className="p-2">
                    <p id="header"> Tutoring For </p>
                    <div id="classes">
                        <NewClass />
                        {inputList}
                    </div>
                    <Button type="button" id="AddClass" variant="primary" onClick={AddNewClass}> Add Class </Button>
                </div>
            </div>

            {/*Available Times*/}
            <div id="availiableTimesFlex" className="container-fluid pt-5">
                <div className="row justify-content-start">
                    <div className="col-4">
                        <input type="checkbox" id="contactMe" />
                        <label htmlFor="contactMe"> Contact Me For Avalability </label>
                    </div>
                    <h6 id="header" className="col-4 text-center"> Available Times</h6>
                </div>
            </div>

            <div id="days" className="d-flex justify-content-around pt-3">
                <div>
                    <p id="day"> Sunday </p>
                    <Time
                        id="timepicker"
                        showSecond={false}
                        defaultValue={now}
                        className="xxx"
                        onChange={onChange}
                        format={format}
                        use12Hours
                        inputReadOnly
                        minuteStep={30}
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
                    <p id="day"> Monday </p>
                    <Time
                        id="timepicker"
                        showSecond={false}
                        defaultValue={now}
                        className="xxx"
                        onChange={onChange}
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
                    <p id="day"> Tuesday </p>
                    <Time
                        id="timepicker"
                        showSecond={false}
                        defaultValue={now}
                        className="xxx"
                        onChange={onChange}
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
                        onChange={onChange}
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
                        onChange={onChange}
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
                        onChange={onChange}
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
                        onChange={onChange}
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
    )
}

export default TutorProfile;
