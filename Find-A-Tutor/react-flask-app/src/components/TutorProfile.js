import { DropdownButton, Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { BsFillTrashFill } from "react-icons/bs";

import React, { useState } from "react";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import TextField from '@mui/material/TextField';

import "./TutorProfile.css"

const NewClass = () => {
    return (
        <div id="newClass">
            Verified
            HUMA 200 A
            <label id="rate" htmlFor="rate"> Hourly Rate: $</label>
            <input type="number" id="hourlyRate" size="2" />
            <Button variant="danger">
                <BsFillTrashFill />
            </Button>
        </div>
    )
}

const TutorProfile = () => {

    const [inputList, setInputList] = useState([]);

    const AddNewClass = event => {
        // const newDiv = document.createElement("div");
        // newDiv.append(<NewClass />);
        // const currentDiv = document.getElementById("AddClass");
        // let parentDiv = currentDiv.parentNode
        // parentDiv.insertBefore(newDiv, currentDiv);
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

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div id="days" className="d-flex justify-content-around pt-3">
                    <div>
                        <p id="day"> Sunday </p>
                        <Button id="dropBtn"> 5:00PM </Button>
                        <Button variant="danger">
                            <BsFillTrashFill />
                        </Button>
                    </div>

                    <div>
                        <p id="day"> Monday </p>
                        <Button id="dropBtn"> 5:00PM </Button>
                        <Button variant="danger">
                            <BsFillTrashFill />
                        </Button>
                    </div>

                    <div>
                        <p id="day"> Tuesday </p>
                        <Button id="dropBtn"> 5:00PM </Button>
                        <Button variant="danger">
                            <BsFillTrashFill />
                        </Button>
                    </div>

                    <div>
                        <p id="day"> Wednesday </p>
                        <Button id="dropBtn"> 5:00PM </Button>
                        <Button variant="danger">
                            <BsFillTrashFill />
                        </Button>
                    </div>

                    <div>
                        <p id="day"> Thursday </p>
                        <Button id="dropBtn"> 5:00PM </Button>
                        <Button variant="danger">
                            <BsFillTrashFill />
                        </Button>
                    </div>

                    <div>
                        <p id="day"> Friday </p>
                        <Button id="dropBtn"> 5:00PM </Button>
                        <Button variant="danger">
                            <BsFillTrashFill />
                        </Button>
                    </div>

                    <div>
                        <p id="day"> Saturday </p>
                        <Button id="dropBtn"> 5:00PM </Button>
                        <Button variant="danger">
                            <BsFillTrashFill />
                        </Button>
                    </div>
                </div>
            </LocalizationProvider>

            {/* Bottom Buttons */}
            <div id="bottom">
                <Button id="edit"> Apply Changes </Button>
                <Button id="stopTutoring" variant="danger"> Stop Tutoring </Button>
            </div>
        </>
    )
}

export default TutorProfile;
