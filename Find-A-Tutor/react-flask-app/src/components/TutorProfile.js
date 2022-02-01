import { DropdownButton, Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { BsFillTrashFill } from "react-icons/bs";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import TextField from '@mui/material/TextField';

import "./TutorProfile.css"

const TutorProfile = () => {
    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <body>
                    <p class="text-end pe-2"><i> Logged in as a Tutor </i></p>

                    <div class="container-fluid text-center">
                        {/* User Info */}
                        <h1 id="name"> Tim Warner </h1>
                        <h6 id="email"> WarnerTR18@gcc.edu </h6>
                    </div>

                    {/* Payment Info*/}
                    <div class="d-flex justify-content-around">
                        <div class="p-2">
                            <h6> Payment Info </h6>
                            <div class="paymentType">
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
                                <h6> Login Preferences </h6>
                                <input type="radio" id="studentView" value="StudentView" />
                                <label for="stuentView"> Student View </label><br />
                                <input type="radio" id="tutorView" value="TutorView" />
                                <label for="tutorView"> Tutor View </label>
                            </div>
                        </div>


                        {/*Classes*/}
                        <div class="p-2">
                            <h6 id="tutoringFor"> Tutoring For </h6>
                            <div id="classes">
                                Verified
                                HUMA 200 A
                                <label id="rate" for="rate"> Hourly Rate: $</label>
                                <input type="number" id="hourlyRate" size="2" />
                                <Button variant="danger">
                                    <BsFillTrashFill/>
                                </Button>
                            </div>
                            <Button type="button" id="AddClass" variant="primary"> Add Class </Button>
                        </div>
                    </div>

                    {/*Available Times*/}
                    <div class="container-fluid pt-5">
                        <div class="row justify-content-start">
                            <div class="col-4">
                                <input class="" type="checkbox" id="contactMe" />
                                <label for="contactMe"> Contact Me For Avalability </label>
                            </div>
                            <h6 class="col-4 text-center"> Available Times</h6>
                        </div>
                    </div>

                    <div class="d-flex justify-content-around pt-3">
                        <div>
                            <p> Sunday </p>
                            <Button type="button" classname="removeTime"> Remove </Button>
                            <Button classname="dropBtn"> 5:00PM </Button>
                        </div>

                        <div>
                            <p> Monday </p>
                            <Button type="button" classname="removeTime"> Remove </Button>
                            <Button classname="dropBtn"> 5:00PM </Button>
                        </div>

                        <div>
                            <p> Tuesday </p>
                            <Button type="button" classname="removeTime"> Remove </Button>
                            <Button classname="dropBtn"> 5:00PM </Button>
                        </div>

                        <div>
                            <p> Wednesday </p>
                            <Button type="button" classname="removeTime"> Remove </Button>
                            <Button classname="dropBtn"> 5:00PM </Button>
                        </div>

                        <div>
                            <p> Thursday </p>
                            <Button type="button" classname="removeTime"> Remove </Button>
                            <Button classname="dropBtn"> 5:00PM </Button>
                        </div>

                        <div>
                            <p> Firday </p>
                            <Button type="button" classname="removeTime"> Remove </Button>
                            <Button classname="dropBtn"> 5:00PM </Button>
                        </div>

                        <div>
                            <p> Saturday </p>
                            <Button type="button" classname="removeTime"> Remove </Button>
                            <Button classname="dropBtn"> 5:00PM </Button>
                        </div>
                    </div>
                </body>
            </LocalizationProvider>
        </div>
    )
}

export default TutorProfile
