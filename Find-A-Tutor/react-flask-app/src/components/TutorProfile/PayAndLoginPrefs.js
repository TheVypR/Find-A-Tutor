import React, { Component } from "react";

import { DropdownButton, Dropdown, ButtonGroup, Button } from 'react-bootstrap';

class PayAndLoginPrefs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            paymentType: "Payment Type"
        }

        this.handleSelect = this.handleSelect.bind(this);
        this.setPaymentType = this.setPaymentType.bind(this);
    }

    /**
     * Set prop to set state of parent for payment type
     * 
     * @param {string} type 
     */
    setPaymentType(type) {
        this.props.setPaymentType("Venmo");
    }

    /**
     * Updates payment username to selected item
     * sends selection to parent
     * 
     * @param {String} type selected payment method
     */
    handleSelect(type) {
        this.setState({ paymentType: type })

        var user = document.getElementById("paymentUser");
        if (user.style.display != "none" && this.paymentType == "Cash") {
            user.style.display = "none";
        } else {
            user.style.display = "block";
        }

        //Send to parent
        this.setPaymentType(type);
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
                                    onSelect={e => this.handleSelect(e)}
                                >
                                    <Dropdown.Item eventKey="Venmo">Venmo</Dropdown.Item>
                                    <Dropdown.Item eventKey="Paypal">Paypal</Dropdown.Item>
                                    <Dropdown.Item eventKey="Cash">Cash</Dropdown.Item>
                                </DropdownType>
                            ))}
                        </div>

                        {/* Payment Username */}
                        <input
                            type="text"
                            id="paymentUser"
                            placeholder={this.state.paymentType + " Username"}
                            onChange={e => this.props.setPaymentUser(e.target.value)}
                        />


                        {/*Login Info*/}
                        <div id="loginInfo" onChange={(e) => this.props.setLoginPrefs(e.target.value)}>
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