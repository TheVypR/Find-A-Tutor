import React, { Component } from "react";
import { Button } from 'react-bootstrap';

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
            items: {},
            paymentType: "",
            paymentUser: "",
            loginPrefs: -1,
            classes: [],
            courseCode: ""
        }

        this.handleSubmit = this.handleSubmit.bind(this);

        this.setPaymentType = this.setPaymentType.bind(this);
        this.setLoginPrefs = this.setLoginPrefs.bind(this);
        this.setPaymentUser = this.setPaymentUser.bind(this);

        this.addClass = this.addClass.bind(this);
        this.removeClass = this.removeClass.bind(this);
    }//constructor

    /**
     * Fetches user info from backend
     */
    async componentDidMount() {
        fetch("/myProfile/")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }//componentDidMount

    handleSubmit() {
        let classes = {
            'courseCode': this.state.courseCode,
            'rate': this.state.rate
        }

        let post = {
            'paymentType': this.state.paymentType,
            'paymentUser': this.state.paymentUser,
            'loginPrefs': this.state.loginPrefs,
            'classes': classes
        }
        console.log(post);
        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })//fetch
        console.log("applied");
    }

    addClass(aClass) {
        this.setState({classes: [...this.state.classes, aClass]})
    }
    
    removeClass(index) {
        //remove timeslot from DOM
        let filteredClasses = this.props.classes.filter(aClass => aClass !== this.props.classes[index]);
        this.setState({ classes: filteredClasses });
        console.log("index: " + index);
    }

    setPaymentType(type) {
        this.setState({ paymentType: type });
    }

    setLoginPrefs(pref) {
        this.setState({ loginPrefs: pref });
    }

    setPaymentUser(user) {
        this.setState({ paymentUser: user });
    }

    setCourseCode(code) {
        this.setState({courseCode: code});
    }

    render() {
        return (
            <>
                <div className="container-fluid text-center">
                    {/* User Info */}
                    <h1 id="name"> {this.state.items['name']} </h1>
                    <p id="email"> {this.state.items['email']} </p>
                </div>

                <div id="center" className="d-flex justify-content-around">
                    <PayAndLoginPrefs
                        setPaymentType={this.setPaymentType}
                        setLoginPrefs={this.setLoginPrefs}
                        setPaymentUser={this.setPaymentUser}
                    />
                    <TutorsFor
                        classes={this.state.classes}
                        addClass={this.addClass}
                        removeClass={this.removeClass}
                        setCourseCode={this.setCourseCode}
                    />
                </div>

                <AvailableTimes />

                <div id="bottom">
                    <Button type="submit" id="save"
                        onClick={this.handleSubmit}
                    > Apply </Button>
                    <Button id="stopTutoring" variant="danger"> Stop Tutoring </Button>
                </div>
            </>
        );//return
    }//render
}//T_Profile

export default T_Profile;