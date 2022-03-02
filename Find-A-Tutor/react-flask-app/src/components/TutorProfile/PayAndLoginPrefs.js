import React, { Component } from "react";
import Week from './Week'

import { DropdownButton, Dropdown, ButtonGroup, Button } from 'react-bootstrap';

class PayAndLoginPrefs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            paymentType: "Payment Type"
        }

        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect = (e) => {
        this.setState({paymentType: e})
        paymentType = e;

        var user = document.getElementById("paymentUser");
        if (user.style.display != "none" && paymentType == "Cash") {
            user.style.display = "none";
        } else {
            user.style.display = "block";
        }

    }

    render() {
        return (
            <>
                <fieldset>
                    <div className="p-2">
                        <p id="header"> Payment Info </p>
                        <div className="paymentType">
                            {[DropdownButton].map((DropdownType, idx) => (
                                <DropdownType
                                    as={ButtonGroup}
                                    key={idx}
                                    id={'dropdown-button-drop-${idx}'}
                                    size="sm"
                                    variant="primary"
                                    title={this.state.paymentType}
                                    onSelect={(e) => {this.handleSelect(e)}}
                                >
                                    <Dropdown.Item eventKey="Venmo">Venmo</Dropdown.Item>
                                    <Dropdown.Item eventKey="Paypal">Paypal</Dropdown.Item>
                                    <Dropdown.Item eventKey="Cash">Cash</Dropdown.Item>
                                </DropdownType>
                            ))}
                        </div>

                        <input type="text" id="paymentUser" placeholder={this.state.paymentType + " Username"}/>


                        {/*Login Info*/}
                        <div id="loginInfo" onChange={(e) => this.setState({ loginPrefs: e.target.value })}>
                            <p id="loginPreferences"> Login Preferences </p>
                            <input name="loginPrefs" type="radio" id="studentView" value="StudentView" />
                            <label htmlFor="stuentView"> Student View </label><br />
                            <input name="loginPrefs" type="radio" id="tutorView" value="TutorView" />
                            <label htmlFor="tutorView"> Tutor View </label>
                        </div>
                    </div>
                </fieldset>

            </>
        );//return
    }//render
}//LoginPrefs

export default PayAndLoginPrefs;