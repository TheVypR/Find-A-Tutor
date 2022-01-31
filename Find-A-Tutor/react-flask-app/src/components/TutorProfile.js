import { DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import TextField from '@mui/material/TextField';

const Header = () => {
    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <body>
                    <div id="UserInfo">
                        {/* User Info */}
                        <p id="loginType"><i> Logged in as a Tutor </i></p>
                        <h1 id="name"> Tim Warner </h1>
                        <h6 id="email"> WarnerTR18@gcc.edu </h6>
                    </div>

                    <div id="flex-container">
                        {/* Payment Info*/}
                        <div id="paymentAndLogin">
                            <h6 id="paymentLabel"> Payment Info </h6>

                            <div>
                                {[DropdownButton].map((DropdownType, idx) => (
                                    <DropdownType
                                        as={ButtonGroup}
                                        key={idx}
                                        id={`dropdown-button-drop-${idx}`}
                                        size="sm"
                                        variant="secondary"
                                        title="Payment Info"
                                    >
                                        <Dropdown.Item eventKey="1">Venmo</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">Cash</Dropdown.Item>
                                        <Dropdown.Divider />
                                    </DropdownType>
                                ))}
                            </div>

                            <input type="text" id="vemoUser" placeholder="Venmo Username" />


                            {/*Login Info*/}
                            <div id="loginInfo">
                                <h6> Login Preferences </h6>
                                <input type="radio" id="studentView" value="StudentView" />
                                <label for="stuentView"> Student View </label><br />
                                <input type="radio" id="tutorView" value="TutorView" />
                                <label for="tutorView"> Tutor View </label>
                            </div>
                        </div>


                        {/*Classes*/}
                        <div id="ClassesLabels">
                            <h6 id="tutoringFor"> Tutoring For </h6>
                            <div id="Classes">
                                Verified
                                HUMA 200 A
                                <label for="rate"> Hourly Rate: $</label>
                                <input type="number" id="hourlyRate" size="2" />
                                <button type="button" classname="RemoveClass"> Remove </button> <br />
                            </div>
                            <button type="button" id="AddClass"> Add Class </button>
                        </div>
                    </div>

                    {/*Available Times*/}
                    <div id="AvailableTimes">
                        <input id="" type="checkbox" id="contactMe" />
                        <label for="contactMe"> Contact Me For Availability </label>
                        <h6 id="timesLabel"> Available Times</h6>
                    </div>

                    <div id="WeekDays">
                        <div>
                            <p> Sunday </p>
                            <button type="button" classname="removeTime"> Remove </button>
                            <TimePicker
                                label="Basic example"
                                value={value}
                                onChange={(newValue) => {
                                    setValue(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </div>

                        <div>
                            <p> Monday </p>
                            <button type="button" classname="removeTime"> Remove </button>
                            <button classname="dropBtn"> 5:00PM </button>
                        </div>

                        <div>
                            <p> Tuesday </p>
                            <button type="button" classname="removeTime"> Remove </button>
                            <button classname="dropBtn"> 5:00PM </button>
                        </div>

                        <div>
                            <p> Wednesday </p>
                            <button type="button" classname="removeTime"> Remove </button>
                            <button classname="dropBtn"> 5:00PM </button>
                        </div>

                        <div>
                            <p> Thursday </p>
                            <button type="button" classname="removeTime"> Remove </button>
                            <button classname="dropBtn"> 5:00PM </button>
                        </div>

                        <div>
                            <p> Firday </p>
                            <button type="button" classname="removeTime"> Remove </button>
                            <button classname="dropBtn"> 5:00PM </button>
                        </div>

                        <div>
                            <p> Saturday </p>
                            <button type="button" classname="removeTime"> Remove </button>
                            <button classname="dropBtn"> 5:00PM </button>
                        </div>
                    </div>
                </body>
            </LocalizationProvider>
        </div>
    )
}

export default Header
