import React, { Component } from "react";

import TutorProfileStatic from "./TutorProfileStatic";
import TutorProfile from "./TutorProfile/T_Profile"
import StudentProfile from "./StudentProfile";

/**
 * Determines if a student or tutor has logged in and loads the corresponding profile
 */
class LoadProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            isEdit: false
        }
        this.edit = this.edit.bind(this);
    }//constructor

    /**
     * Toggles isEdit
     */
    edit() {
        this.setState({ isEdit: !this.state.isEdit });
    }//edit

    /**
     * Fetches user info from backend
     */
    async componentDidMount() {
        fetch("/myProfile/?email=" + localStorage.getItem("email"))
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
        let staticOrEditTutor = this.state.isEdit ?
            <TutorProfile items={this.state.items} edit={this.edit}/> :
            <TutorProfileStatic items={this.state.items} edit={this.edit}/>
        var profile = this.state.items['isTutor'] ?
            staticOrEditTutor :
            <StudentProfile items={this.state.items} />
        return (
            <>
                {profile}
            </>
        );//return
    }//render
}//LoadProfile

export default LoadProfile;