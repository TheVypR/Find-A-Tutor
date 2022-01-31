const Header = () => {
    return (
        <div>
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
                        <button id="paymentType"> Payment </button>
                        {/*TODO: Dropdown Button */}
                        <input type="text" id="venmoUser" placeholder="Venmo Username"/>
                    

                    {/*Login Info*/}
                        <div id="loginInfo">
                            <h6> Login Preferences </h6>
                            <input type="radio" id="studentView" value="StudentView"/>
                            <label for="stuentView"> Student View </label><br/>
                            <input type="radio" id="tutorView" value="TutorView"/>
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
                            <input type="number" id="hourlyRate" size="2"/>
                            <button type="button" classname="RemoveClass"> Remove </button> <br/>
                        </div>
                        <button type="button" id="AddClass"> Add Class </button>
                    </div>
                </div>

                {/*Available Times*/}
                <div id="AvailableTimes">
                    <input id="" type="checkbox" id="contactMe"/>
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
                        <p> Firday </p>
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
						const response = await fetch("/editProfile/", {
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
