import React, { Component } from "react";
import moment from 'moment';
import TutorProfileStatic from "./TutorProfileStatic";
import TutorProfile from "./TutorProfile/T_Profile";
import StudentProfile from "./StudentProfile";
import NavBar from './NavBar';

const format = 'h:mm a';    //Format for TimePicker

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
        this.convertToMoment = this.convertToMoment.bind(this);
    }//constructor

    /**
     * Toggles isEdit
     * then fetches any changes from the db
     */
    edit() {
        this.setState({ isEdit: !this.state.isEdit }, function () {
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
                    //Convert result[times] to moment
                    console.log(result)
                    let times = result['times'];
                    result['times'] = this.convertToMoment(times);
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
        let staticOrEditTutor = this.state.isEdit ?
            <TutorProfile items={this.state.items} edit={this.edit} /> :
            <TutorProfileStatic items={this.state.items} edit={this.edit} />
        var profile = this.state.items['isTutor'] ?
            staticOrEditTutor :
            <StudentProfile items={this.state.items} />
        return (
            <>
            <div style={{margin: '130px'}}><NavBar /></div>
                {profile}
            </>
        );//return
    }//render
}//LoadProfile

export default LoadProfile;