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
    }

    render() {
        let times = this.props.times;
        return (
            <>
                <div className="d-flex flex-column">
                    <div className="d-flex justify-content-end contactMe">
                        <input type="checkbox" id="contactMe" onChange={this.contactMe} />
                        <label htmlFor="contactMe"> Contact Me For Availability </label>
                    </div>
                    <Week times={times} />
                </div>
            </>
        );//Return
    }//render
}//AvailableTimes

export default AvailableTimes;