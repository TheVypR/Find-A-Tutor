import React, { Component } from "react";
import Week from './Week'


/**
 * Renders the available times and contact me check box
 */
class AvailableTimes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false  //Boolean that stores in state if the contact me checkbox is checked or not
        }//state

        this.contactMe = this.contactMe.bind(this);
    }//constructor

    /**
     * Post for contact me check box change
     */
    contactMe() {
        this.setState({ checked: !this.state.checked });
        let value = this.state.checked ? 1 : 0
        let submission = {
            'email': localStorage.getItem("email"),
            'contactMe': value
        };

        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submission)
        })//fetch
    }//contact me

    render() {
        let times = this.props.times;   // Tutors available times from the db
        return (
            <>
                <div className="d-flex flex-column">
                    <div className="d-flex justify-content-start contactMe">
                        <input type="checkbox"  id="contactMe" onChange={this.contactMe} />
                        <label htmlFor="contactMe"  id="contactMeLabel"> Contact Me For Availability </label>
                        
                    </div>
                    <h5> Available Times </h5>
                    <div className="d-flex justify-content-center"> 
                        <Week times={times} moments={this.props.moments} />
                    </div>
                </div>
            </>
        );//Return
    }//render
}//AvailableTimes

export default AvailableTimes;