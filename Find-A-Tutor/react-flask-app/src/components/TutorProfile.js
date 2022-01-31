import React, {useState, useEffect} from 'react';

const Header = () => {
	const  [info, setInfo] = useState({})
	const  [payment, setPayment] = useState({})
	const  [loginPref, setLoginPref] = useState(false)
	const  [classes, setClasses] = useState([{}])
	const  [contact, setContact] = useState(false)
	const  [times, setTimes] = useState({})
	const  [values, setValues] = useState([{}])
	
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
                        <button id="paymentType" onChange={(e)=>setPayment({'pay_type':e.target.value})}> Payment </button>
                        {/*TODO: Dropdown Button */}
                        <input type="text" id="venmoUser" placeholder="Venmo Username" onChange={(e)=>setPayment({payment, 'pay_info':e.target.value})}/>
                    

                    {/*Login Info*/}
                        <div id="loginInfo">
                            <h6> Login Preferences </h6>
                            <input type="radio" id="studentView" value="StudentView" onChange={(e)=>setLoginPref(!e.target.value)}/>
                            <label for="stuentView"> Student View </label><br/>
                            <input type="radio" id="tutorView" value="TutorView" onChange={(e)=>setLoginPref(e.target.value)}/>
                            <label for="tutorView"> Tutor View </label>
                        </div>
                    </div>
                

                    {/*Classes*/}
                    <div id="ClassesLabels">
                        <h6 id="tutoringFor"> Tutoring For </h6>
                        <div id="Classes">
                            <input type="text" id="class_name" placeholder="Enter Class" onChange={(e)=>setClasses([classes, {'class':e.target.value}])}/>
                            <label for="rate"> Hourly Rate: $</label>
                            <input type="number" id="hourlyRate" size="2" onChange={(e)=>setClasses([classes, {'rate':e.target.value}])}/>
                            <button type="button" classname="RemoveClass"> Remove </button> <br/>
                        </div>
                        <button type="button" id="AddClass"> Add Class </button>
                    </div>
                </div>

                {/*Available Times*/}
                <div id="AvailableTimes">
                    <input id="" type="checkbox" id="contactMe" onChange={(e)=>setContact(e.target.value)}/>
                    <label for="contactMe"> Contact Me For Availability </label>
                    <h6 id="timesLabel"> Available Times</h6>
                </div>

                <div id="WeekDays">
                    <div>
                        <p> Sunday </p>
                        <button type="button" classname="removeTime"> Remove </button>
                        <button classname="dropBtn"> 5:00PM </button>
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
                        <p> Friday </p>
                        <button type="button" classname="removeTime"> Remove </button>
                        <button classname="dropBtn"> 5:00PM </button>
                    </div>

                    <div>
                        <p> Saturday </p>
                        <button type="button" classname="removeTime"> Remove </button>
                        <button classname="dropBtn"> 5:00PM </button>
                    </div>
					
					<button 
						type="submit" 
						value="todo"
						onClick={async () => {
						setValues([],classes)
						const response = await fetch("/myProfile/", {
						method: "POST",
						headers: {
						'Content-Type' : 'application/json'
						},
					})}}>Submit
					</button>
                </div>
            </body>
        </div>
    )
}

export default Header
