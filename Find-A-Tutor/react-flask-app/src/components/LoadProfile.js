import React, { Component } from "react";

import T_Profile from "./TutorProfile/T_Profile";
import StudentProfile from "./StudentProfile";

/**
 * Determines if a student or tutor has logged in and loads the corresponding profile
 */
class LoadProfile extends React.Component {
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
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }//componentDidMount

    render() {
        var profile = this.state.items['isTutor'] ? 
            <T_Profile items={this.state.items} /> :
            <StudentProfile items={this.state.items} />
        return (
            <>
                {profile}
            </>
        );//return
    }//render
}//LoadProfile

export default LoadProfile;