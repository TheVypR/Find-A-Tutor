import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import '../TutorProfile.css';

import AvailableTimes from './AvailableTimes/AvailableTimes'
import PayAndLoginPrefs from './PayAndLoginPrefs'
import TutorsFor from "./TutorsFor";



/** Tutor Profile Component
 *  
 *  Puts together all components needed for the Tutor Profile
 *  Retrieves data for profile for back end.
 */
class T_Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentType: "",    //Venmo, Paypal, or Cash
            paymentUser: "",    //Username for choosen payment type (unless cash)
            loginPrefs: -1,     //Default profile that loads on login (student or tutor)
            classes: [],       //Classes the tutor tutors for
            applyState: true
        }//state

        this.handleSubmit = this.handleSubmit.bind(this);
        this.setPaymentType = this.setPaymentType.bind(this);
        this.setLoginPrefs = this.setLoginPrefs.bind(this);
        this.setPaymentUser = this.setPaymentUser.bind(this);
        this.addClass = this.addClass.bind(this);
        this.removeClass = this.removeClass.bind(this);
        this.setCourseCode = this.setCourseCode.bind(this);
        this.setRate = this.setRate.bind(this);
        this.checkForEmptyState = this.checkForEmptyState.bind(this);
    }//constructor

    /**
     * Collects state values and sends them to the backend
     */
    handleSubmit() {
        //Collect state values
        let post = {
            'token': localStorage.getItem("token"),
            'pay_type': this.state.paymentType,
            'pay_info': this.state.paymentUser,
            'login_pref': this.state.loginPrefs,
            'classes': this.state.classes
        }//post

        this.checkForEmptyState(post);

        //check if cash and set username accordingly
        if (this.state.paymentType === "Cash") {
            post['pay_info'] = "";
        }

        //Fetch
        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })//fetch
        this.props.edit();
    }//handleSubmit

    /**
     * If the state is empty if fills in with db data
     * 
     * @param {dictionary} post things being sent to backend
     */
    checkForEmptyState(post) {
        //Check for empty values
        for (let postKey in post) {
            if ((post[postKey] === "" || post[postKey] == -1) && postKey != 'classes') {
                //replace with db data
                for (let getKey in this.props.items) {
                    if (postKey == getKey) {
                        post[postKey] = this.props.items[getKey];
                    }//if
                }//for
            }//if
        }//for
    }//checkForEmptyState

    /**
     * Sets array value with empty class
     * 
     * @param {dictionary} aClass empty dictionary representing a class
     */
    addClass(aClass) {
        this.setState({ classes: [...this.state.classes, aClass] })
    }//addClass

    /**
     * Removes class from DOM
     * 
     * @param {int} index index of class to be removed
     */
    removeClass(index) {
        var classes = this.state.classes;
        //remove class from DOM
        let filteredClasses = classes.filter(aClass => aClass !== classes[index]);
        this.setState({ classes: filteredClasses });
    }//removeClass

    /**
     * Sets payment state
     * 
     * @param {string} type entered payment type
     */
    setPaymentType(type) {
        this.setState({ paymentType: type });
    }//setPaymentType

    /**
     * Converts given login pref to an int and sets the state
     * 
     * @param {String} pref 0=StudentVeiw 1=TutorView
     */
    setLoginPrefs(pref) {
        let loginPref = -1

        if (pref == "StudentView")
            loginPref = 0;
        else
            loginPref = 1;
        this.setState({ loginPrefs: loginPref });
    }//setLoginPrefs

    /**
     * Sets paymentUser state
     * 
     * @param {string} user entered username for the choosen payment type
     */
    setPaymentUser(user) {
        this.setState({ paymentUser: user });
    }//setPaymentUser

    /**
     * sets the courseCode for a class in the classes state
     * 
     * @param {string} code entered courseCode
     * @param {int} index given index of class
     */
    setCourseCode(code, index) {
        let classes = this.state.classes;
        let aClass = { ...classes[index] };
        aClass['class_code'] = code;
        classes[index] = aClass;
        this.setState({ classes: classes })
    }//setCourseCode

    /**
     * sets the rate for a class in the classes state
     * 
     * @param {int} rate entered rate
     * @param {int} index given index
     */
    setRate(rate, index) {
        this.setState({ applyState: true })
        let classes = this.state.classes;
        let aClass = { ...classes[index] };
        aClass['rate'] = rate;
        classes[index] = aClass;
        this.setState({ classes: classes });
    }//setRate

    componentDidMount() {
        let filledInClasses = this.props.items['tutorsFor'];
        for (let aClass in filledInClasses) {
            var classesList = this.state.classes;
            classesList.push({'class_code': filledInClasses[aClass]['class_code'], 'rate': filledInClasses[aClass]['rate']});
            this.setState({classes: classesList});
        ;}
    }

    render() {
        let items = this.props.items;

        let apply = this.state.applyState ?
            <Button type="submit" id="save" onClick={this.handleSubmit}> Apply </Button> :
            <Button type="submit" id="save" disabled> Apply </Button>

        return (
            <>
                <p className="text-end pe-2"><i> Logged in as a Tutor </i></p>
                <div className="container-fluid text-center">
                    {/* User Info */}
                    <h1 id="name"> {items['name']} </h1>
                    <p id="email"> {items['email']} </p>
                </div>

                <div id="center" className="d-flex justify-content-around">
                    <PayAndLoginPrefs
                        setPaymentType={this.setPaymentType}
                        setLoginPrefs={this.setLoginPrefs}
                        setPaymentUser={this.setPaymentUser}
                        pay_type={items['pay_type']}
                        pay_info={items['pay_info']}
                        login_pref={items['login_pref']}
                    />

                    <AvailableTimes times={items['times']} />

                    <TutorsFor
                        classes={this.state.classes}
                        addClass={this.addClass}
                        removeClass={this.removeClass}
                        setCourseCode={this.setCourseCode}
                        setRate={this.setRate}
                    />
                </div>

                <div id="bottom">
                    {apply}
                    <Button type="submit" id="stopTutoring" variant="danger"> Stop Tutoring </Button>
                </div>
            </>
        );//return
    }//render
}//T_Profile

export default T_Profile;