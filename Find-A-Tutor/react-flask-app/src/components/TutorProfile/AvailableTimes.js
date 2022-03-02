import React, { Component } from "react";
import Week from './Week'


class AvailableTimes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false  //Boolean that stores in state if the contact me checkbox is checked or not
        }

        this.contactMe = this.contactMe.bind(this);
    }

    /**
     * Post for contact me check box change
     */
    contactMe() {
        this.setState({checked: !this.state.checked});
        let value = this.state.checked ? 1:0
        let submission = {
            'contactMe': value
        };

        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submission)
        })//fetch
    }

    render() {
        return (
            <>
                <div className="row justify-content-start">
                    <div className="col-4">
                        <input type="checkbox" id="contactMe" onChange={this.contactMe}/>
                        <label htmlFor="contactMe"> Contact Me For Availability </label>
                    </div>
                    <h6 id="header" className="col-4 text-center"> Available Times</h6>
                </div>
                <Week />
            </>
        );//Return
    }//render
}//AvailableTimes

export default AvailableTimes;