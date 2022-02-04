import React, {useState, useEffect} from 'react'; 
import { DropdownButton, Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { BsFillTrashFill, BsFillPlusCircleFill } from "react-icons/bs";

import React, { useState } from "react";

import moment from 'moment';
import Time from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

import "./TutorProfile.css"

const format = 'h:mm a';
const now = moment().hour(0).minute(0);
const buttonSize = 14;

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
	const [payType, setPayType] = useState("")
	const [payVal, setPayVal] = useState("")
	const [loginPref, setLoginPref] = useState(false)
	const [classes, setClasses] = useState([])
	const [rates, setRates] = useState([])
	const [contact, setContact] = useState(false)
	const [times, setTimes] =useState([[]])
	
	useEffect(()=> {
		fetch('/myProfile', {method:"GET"}).then(
			response => response.json()
		).then(data => setInfo(data))
	}, []);
	

    const [value, setValue] = React.useState(null);

    function onChange(value) {
        console.log(value && value.format(format));
    }


    const AddNewClass = event => {
        setInputList(inputList.concat(<NewClass key={inputList.length} />));

    }
    return (
        <>

            <div className="container-fluid text-center">
                {/* User Info */}
                <h1 id="name"> {info['name']} </h1>
                <p id="email"> {info['email']} </p>
            </div>

            {/* Payment Info*/}
            <div id="center" className="d-flex justify-content-around">
                <div className="p-2">
                    <p id="header"> Payment Info </p>
                    <div className="paymentType" onChange={(e)=>setPayType(e.target.value)}>
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
                                <Dropdown.Divider />
								<Dropdown.Item eventKey="2">Cash</Dropdown.Item>
                                
                            </DropdownType>
                        ))}
                    </div>

                    <input type="text" id="venmoUser" placeholder="Venmo Username" onChange={(e)=>setPayVal(e.target.value)}/>


                    {/*Login Info*/}
                    <div id="loginInfo" onChange={(e)=>setLoginPref(e.target.value)}>
                        <input type="radio" id="studentView" value="StudentView " name="logInPref"/> Student View <br/>
                        <input type="radio" id="tutorView" value="TutorView " name="logInPref"/> Tutor View
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
                        <input type="checkbox" id="contactMe" onChange={(e)=>setContact(e.target.value)}/>
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
                        <BsFillTrashFill size={buttonSize} />
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
                        <BsFillTrashFill size={buttonSize} />
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
                        <BsFillTrashFill size={buttonSize} />
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
                        <BsFillTrashFill size={buttonSize} />
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
                        <BsFillTrashFill size={buttonSize} />
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
                        <BsFillTrashFill size={buttonSize} />
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
                        <BsFillTrashFill size={buttonSize} />
                    </Button>
                    <Button id="addHour">
                        <BsFillPlusCircleFill />
                    </Button>
                </div>
            </div>

            {/* Bottom Buttons */}
            <div id="bottom">
                <Button type = "submit" id="save"
					onClick={async () => {
					const values = [{payType, payVal, loginPref, contact, times}];
						const response = await fetch("/myProfile/", {
						method: "POST",
						headers: {
						'Content-Type' : 'application/json'
						},
						body: JSON.stringify(values)
					})}}
				> Save and Close </Button>
                <Button id="stopTutoring" variant="danger"> Stop Tutoring </Button>
            </div>
        </>
    )
}

export default TutorProfile;
