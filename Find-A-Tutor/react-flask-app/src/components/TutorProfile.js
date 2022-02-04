import React, {useState, useEffect} from 'react'; 
import { DropdownButton, Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { BsFillTrashFill } from "react-icons/bs";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import TextField from '@mui/material/TextField';

import "./TutorProfile.css"

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const TutorProfile = () => {
    const [isTutorView, setTutorView] = useState(false)
	const [info, setInfo] = useState({})
	const [payType, setPayType] = useState("")
	const [payVal, setPayVal] = useState("")
	const [loginPref, setLoginPref] = useState(false)
	const [classes, setClasses] = useState([])
	const [rates, setRates] = useState([])
	const [contact, setContact] = useState(false)
	const [times, setTimes] =useState([[]])
	
    const handleViewChange = () => {
        setTutorView(isTutorView => !isTutorView);
        console.log(isTutorView);
    }

	useEffect(()=> {
		fetch('/myProfile', {method:"GET"}).then(
			response => response.json()
		).then(data => setInfo(data))
	}, []);
	
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
						<label id="rate" htmlFor="rate"> Class </label>
                        <input type="text" id="class" onChange={(e)=>setClasses([classes, e.target.value])}/>
						<label id="rate" htmlFor="rate"> Hourly Rate: $</label>
                        <input type="number" id="hourlyRate" size="2" onChange={(e)=>setRates([rates, e.target.value])}/>
                        <Button variant="danger">
                            <BsFillTrashFill />
                        </Button>
                    </div>
                    <Button type="button" id="AddClass" variant="primary"> Add Class </Button>
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
					
                    <button type="button" onClick={handleViewChange}>
                        Switch View
                    </button>
                </div>
            </LocalizationProvider>

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

export default TutorProfile
