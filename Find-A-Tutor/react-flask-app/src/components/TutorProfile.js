import React, {useState, useEffect} from 'react';
import { DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import TextField from '@mui/material/TextField';

const Header = () => {
	const  [info, setInfo] = useState({})
	const  [payType, setPayType] = useState("")
	const  [payVal, setPayVal] = useState("")
	const  [loginPref, setLoginPref] = useState(false)
	const  [classes, setClasses] = useState([{}])
	const  [contact, setContact] = useState(false)
	const  [times, setTimes] = useState({})
	const  [values, setValues] = useState([[{}]])
	
    useEffect(()=> {
    fetch('/myProfile/', {'method':'GET'}).then(
      response => response.json()
    ).then(data => setInfo(data))
    }, []);
	
    return (
        <div>
            <body>
                <div id="UserInfo"> 
                    {/* User Info */}
                    <p id="loginType"><i> Logged in as a Tutor </i></p>
					<h1 id="name"> {info['name']} </h1>
                    <h6 id="email"> {info['email']} </h6>
                </div>

                <div id="flex-container">
                    {/* Payment Info*/}
                    <div id="paymentAndLogin">
                        <h6 id="paymentLabel"> Payment Info </h6>
                        <button id="paymentType" onChange={(e)=>setPayType(e.target.value)}> Payment </button>
                        {/*TODO: Dropdown Button */}
                        <input type="text" id="venmoUser" placeholder="Venmo Username" onChange={(e)=>setPayVal(e.target.value)}/>
                    

                    {/*Login Info*/}
                        <div id="loginInfo" onChange={(e)=>setLoginPref(!e.target.value)}>
                            <input type="radio" id="studentView" value="StudentView" name="logInPref"/> Student View
                            <input type="radio" id="tutorView" value="TutorView" name="logInPref"/> Tutor View
                        </div>
                    </div>
                

                    {/*Classes*/}
                    <div id="ClassesLabels">
                        <h6 id="tutoringFor"> Tutoring For </h6>
                        <div id="Classes">
                            <input type="text" id="class_name" placeholder="Enter Class" onChange={(e)=>setClasses([classes, {'class':e.target.value}])}/>
                            <label htmlFor="rate"> Hourly Rate: $</label>
                            <input type="number" id="hourlyRate" size="2" onChange={(e)=>setClasses([classes, {'rate':e.target.value}])}/>
                            <button type="button" className="RemoveClass"> Remove </button> <br/>
                        </div>
                        <button type="button" id="AddClass"> Add Class </button>
                    </div>
                </div>

                {/*Available Times*/}
                <div id="AvailableTimes">
                    <input id="" type="checkbox" id="contactMe" onChange={(e)=>setContact(e.target.value)}/>
                    <label htmlFor="contactMe"> Contact Me For Availability </label>
                    <h6 id="timesLabel"> Available Times</h6>
                </div>

                <div id="WeekDays">
                    <div>
                        <p> Sunday </p>
                        <button type="button" className="removeTime"> Remove </button>
                        <button className="dropBtn"> 5:00PM </button>
                    </div>


                        {/*Classes*/}
                        <div id="ClassesLabels">
                            <h6 id="tutoringFor"> Tutoring For </h6>
                            <div id="Classes">
                                Verified
                                HUMA 200 A
                                <label htmlFor="rate"> Hourly Rate: $</label>
                                <input type="number" id="hourlyRate" size="2" />
                                <button type="button" className="RemoveClass"> Remove </button> <br />
                            </div>
                            <button type="button" id="AddClass"> Add Class </button>
                        </div>
                    </div>

                    {/*Available Times*/}
                    <div id="AvailableTimes">
                        <input id="" type="checkbox" id="contactMe" />
                        <label htmlFor="contactMe"> Contact Me For Availability </label>
                        <h6 id="timesLabel"> Available Times</h6>
                    </div>

                    <div id="WeekDays">
                        <div>
                            <p> Sunday </p>
                            <button type="button" className="removeTime"> Remove </button>
                            <TimePicker
                                label="Basic example"
                                value={values}
                                onChange={(newValue) => {
                                    setValues(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </div>

                        <div>
                            <p> Monday </p>
                            <button type="button" className="removeTime"> Remove </button>
                            <button className="dropBtn"> 5:00PM </button>
                        </div>

                        <div>
                            <p> Tuesday </p>
                            <button type="button" className="removeTime"> Remove </button>
                            <button className="dropBtn"> 5:00PM </button>
                        </div>

                        <div>
                            <p> Wednesday </p>
                            <button type="button" className="removeTime"> Remove </button>
                            <button className="dropBtn"> 5:00PM </button>
                        </div>

                        <div>
                            <p> Thursday </p>
                            <button type="button" className="removeTime"> Remove </button>
                            <button className="dropBtn"> 5:00PM </button>
                        </div>

                        <div>
                            <p> Firday </p>
                            <button type="button" className="removeTime"> Remove </button>
                            <button className="dropBtn"> 5:00PM </button>
                        </div>

                        <div>
                            <p> Saturday </p>
                            <button type="button" className="removeTime"> Remove </button>
                            <button className="dropBtn"> 5:00PM </button>
                        </div>
                    </div>
					
					<button 
						type="submit" 
						value="todo"
						onClick={async () => {
						setValues([payType, payVal, loginPref],classes)
						const response = await fetch("/myProfile/", {
						method: "POST",
						headers: {
						'Content-Type' : 'application/json'
						},
					})}}>Submit
					</button>
            </body>
        </div>
    )
}

export default Header
