import React, { Component } from "react";
import moment from 'moment';
import TutorProfileStatic from "./TutorProfileStatic";
import TutorProfile from "./TutorProfile/T_Profile";
import StudentProfile from "./StudentProfile";
import StudentProfileStatic from "./StudentProfileStatic"
import NavBar from './NavBar';

const format = 'h:mm a';    //Format for TimePicker

/**
 * Determines if a student or tutor has logged in and loads the corresponding profile
 */
class Profiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
        }
        this.edit = this.edit.bind(this);
        this.editStudent = this.editStudent.bind(this);
    }//constructor

    /**
     * Toggles isEdit
     * then fetches any changes from the db
     */
    edit() {
        this.props.edit();
    }//edit

    /**
     * Toggles isEditSTudent
     * then fetches any changes from the db
     */
    editStudent() {
        this.props.editStudent();
    }//editStudent

    render() {
        let items = this.props.items;
        let isTutor = (localStorage.getItem("view")=== "tutor");
        console.log(isTutor);

        let staticOrEditTutor = this.props.isEdit ?
            <TutorProfile items={items} edit={this.edit} /> :
            <TutorProfileStatic items={items} edit={this.edit} />

        let staticOrEditStudent = this.props.isEditStudent ?
            <StudentProfile items={items} edit={this.editStudent} /> :
            <StudentProfileStatic items={items} edit={this.editStudent} />

        var profile = isTutor ?
            staticOrEditTutor :
            staticOrEditStudent
        return (
            <>
            <div style={{margin: '75px'}}><NavBar /></div>
                {profile}
            </>
        );//return
    }//render
}//LoadProfile

export default Profiles;