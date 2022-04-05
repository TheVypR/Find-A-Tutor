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
        this.doFetch = this.doFetch.bind(this);
        this.convertToMoment = this.convertToMoment.bind(this);
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

    /**
     * calls doFetch on initial mounting of component
     */
    async componentDidMount() {
        //this.doFetch();
    }//componentDidMount

    /**
     * Gets info from db
     */
    doFetch() {
        fetch("/myProfile/?token=" + localStorage.getItem("token") + "&view=" + localStorage.getItem("view"))
            .then(res => res.json())
            .then(
                (result) => {
                    //Convert result[times] to moment
                    if ('times' in result) {
                        let times = result['times'];
                        result['times'] = this.convertToMoment(times);
                    }
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

    /**
     * Converts DD-MM-YYYYTHH:mm:ss to moment
     * 
     * @param {Array[T]} times 
     * @returns [{'Monday': {'startTime': moment, 'endTime': moment}, ...]
     */
    convertToMoment(times) {
        var timeSlots = {
            'Monday': [],
            'Tuesday': [],
            'Wednesday': [],
            'Thursday': [],
            'Friday': [],
            'Saturday': [],
            'Sunday': []
        }
        times.forEach(slot => {
            let startTime = slot['startTime'];
            let day = moment(slot['startTime'].replace(/T/, " ")).format('dddd');
            let endTime = slot['endTime'];
            startTime = moment(startTime.replace(/T/, " ")).format(format);
            endTime = moment(endTime.replace(/T/, " ")).format(format);

            timeSlots[day].push({ 'startTime': startTime, 'endTime': endTime })
        });

        return timeSlots
    }//convetToMoment

    render() {
        let items = this.props.items;
        let isTutor = (localStorage.getItem("view")=== "tutor");

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