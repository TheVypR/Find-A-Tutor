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
        this.setState({checked: !this.state.checked});
        let value = this.state.checked ? 1:0
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
                <div className="row justify-content-start">
                    <div className="col-4">
                        <input type="checkbox" id="contactMe" onChange={this.contactMe}/>
                        <label htmlFor="contactMe"> Contact Me For Availability </label>
                    </div>
                    <h6 id="header" className="col-4 text-center"> Available Times</h6>
                </div>
                <Week times={times}/>
            </>
        );//Return
    }//render
}//AvailableTimes

export default AvailableTimes;