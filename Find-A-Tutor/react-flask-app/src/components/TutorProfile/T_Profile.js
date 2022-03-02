import React, { Component } from "react";

import AvailableTimes from './AvailableTimes'
import PayAndLoginPrefs from './PayAndLoginPrefs'

/** Tutor Profile Component
 *  
 *  Puts together all components needed for the Tutor Profile
 *  Retrieves data for profile for back end.
 */
class T_Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {}
        }

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

    render() {
        return (
            <>
                <div className="container-fluid text-center">
                    {/* User Info */}
                    <h1 id="name"> {this.state.items['name']} </h1>
                    <p id="email"> {this.state.items['email']} </p>
                </div>

                <div id="center" className="d-flex justify-content-around">
                    <PayAndLoginPrefs />
                    <p> placeholder </p>
                </div>

                <AvailableTimes />
            </>
        );//return
    }//render
}//T_Profile

export default T_Profile;