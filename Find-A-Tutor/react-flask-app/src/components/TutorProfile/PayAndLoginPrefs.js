import React, { Component } from "react";

import { DropdownButton, Dropdown, ButtonGroup, Button } from 'react-bootstrap';

class PayAndLoginPrefs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            paymentType: this.props.pay_type,   //type of payment (venmo, paypal, cash)
            pay_info: this.props.pay_info       //username if applicable
        }//state

        this.handleSelect = this.handleSelect.bind(this);
        this.setPaymentType = this.setPaymentType.bind(this);
        this.setLoginPrefs = this.setLoginPrefs.bind(this);
        this.getPayType = this.getPayType.bind(this);
        this.getPayInfo = this.getPayInfo.bind(this);
    }//constructor

    /**
     * Set prop to set state of parent for payment type
     * 
     * @param {string} type 
     */
    setPaymentType(type) {
        this.props.setPaymentType(type);
    }//setPaymentType

    /**
     * Calls parent function
     * 
     * @param {int} pref 0=student 1=tutor
     */
    setLoginPrefs(pref) {
        this.props.setLoginPrefs(pref);
    }//setLoginPref

    /**
     * Updates payment username to selected item
     * sends selection to parent
     * 
     * @param {String} type selected payment method
     */
    handleSelect(type) {
        this.setState({ paymentType: type }, function() {
            var user = document.getElementById("paymentUser");
            if (user.style.display != "none" && this.state.paymentType === "Cash") {
                user.style.display = "none";
            } else {
                user.style.display = "block";
            }
        });

        //Send to parent
        this.setPaymentType(type);
    }//handleSelect

    /**
     * Returns payment type from state or
     * if pay_type isn't known yet returns "Payment Type"
     * 
     * @param {string} pay_type Tutors payment method (venmo, paypal, or cash)
     * @returns either the Tutors payment type or a label for the drop down button
     */
    getPayType(pay_type) {
        //Set pay_type state to props
        if (pay_type != "") {
            return this.state.paymentType;
        } else {
            return "Payment Type";
        }//set paymentType
    }//getPayType

    /**
     * returns the payment type username if set or
     * an placeholder for the text box
     * 
     * @param {string} pay_type Tutor's payment method (venmo, paypal, cash)
     * @param {string} pay_info Tutor's username for payment method if applicable
     * @returns either the entered username for the payment method or a placeholder for the textbox
     */
    getPayInfo(pay_type, pay_info) {
        //Set Pay info state to props
        if (pay_info != "") {
            return pay_info;
        } else {
            pay_type = this.getPayType(pay_type);
            return pay_type + " Username";
        }//set pay_info
    }//getPayInfo

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
                                    title={this.getPayType(this.state.paymentType)}
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
                            placeholder={this.getPayInfo(this.state.paymentType, this.state.pay_info)}
                            onChange={e => this.props.setPaymentUser(e.target.value)}
                        />

                        {/*Login Info*/}
                        <div id="loginInfo" onChange={(e) => this.setLoginPrefs(e.target.value)}>
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