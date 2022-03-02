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
            loginPrefs: -1,
            classes: []
        }

        this.handleSubmit = this.handleSubmit.bind(this);

        this.setPaymentType = this.setPaymentType(this);
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
        console.log("applied");
    }

    setPaymentType(e) {
        this.setState({paymentType: e})
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
                    <PayAndLoginPrefs setPaymentType={() => {this.setPaymentType(e)}}/>
                    <TutorsFor />
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