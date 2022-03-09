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
        this.doFetch = this.doFetch.bind(this);
    }//constructor

    /**
     * Toggles isEdit
     * then fetches any changes from the db
     */
    edit() {
        this.setState({ isEdit: !this.state.isEdit }, function() {
            this.doFetch();
        });
    }//edit

    /**
     * calls doFetch on initial mounting of component
     */
    async componentDidMount() {
        this.doFetch();
    }//componentDidMount

    /**
     * Gets info from db
     */
    doFetch() {
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
    }//doFetch

    render() {
        let staticOrEditTutor = this.state.isEdit ?
            <TutorProfile items={this.state.items} edit={this.edit} /> :
            <TutorProfileStatic items={this.state.items} edit={this.edit} />
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