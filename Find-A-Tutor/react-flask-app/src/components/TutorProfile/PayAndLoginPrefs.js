import React, { Component } from "react";

import { DropdownButton, Dropdown, ButtonGroup, Button } from 'react-bootstrap';

class PayAndLoginPrefs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            paymentType: this.props.pay_type,
            pay_info: this.props.pay_info
        }

        this.handleSelect = this.handleSelect.bind(this);
        this.setPaymentType = this.setPaymentType.bind(this);
        this.setLoginPrefs = this.setLoginPrefs.bind(this);
        this.getPayType = this.getPayType.bind(this);
        this.getPayInfo = this.getPayInfo.bind(this);
    }

    /**
     * Set prop to set state of parent for payment type
     * 
     * @param {string} type 
     */
    setPaymentType(type) {
        this.props.setPaymentType(type);
    }

    setLoginPrefs(pref) {
        this.props.setLoginPrefs(pref);
    }

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

    getPayType(pay_type) {
        console.log(pay_type);
        //Set pay_type state to props
        if (pay_type != "") {
            return this.state.paymentType;
        } else {
            return "Payment Type";
        }//set paymentType
    }

    getPayInfo(pay_type, pay_info) {
        //Set Pay info state to props
        if (pay_info != "") {
            return pay_info;
        } else {
            pay_type = this.getPayType(pay_type);
            return pay_type + "Username";
        }//set pay_info
    }

    render() {
        let pay_type = this.props.pay_type;
        let pay_info = this.props.pay_info;
        let login_pref = this.props.login_pref;

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
                                    title={this.getPayType(pay_type)}
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
                            placeholder={this.getPayInfo(pay_type, pay_info)}
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