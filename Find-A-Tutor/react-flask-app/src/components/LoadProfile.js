import React from "react";
import moment from 'moment';
import Profiles from './Profiles'

const format = 'h:mm a';    //Format for TimePicker

/**
 * Determines if a student or tutor has logged in and loads the corresponding profile
 */
class LoadProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            isEdit: false,
            isEditStudent: false,
            isLoaded: false
        }

        this.edit = this.edit.bind(this);
        this.editStudent = this.editStudent.bind(this);
        this.doFetch = this.doFetch.bind(this);
        this.convertToMoment = this.convertToMoment.bind(this);
        this.updateProfiles = this.updateProfiles.bind(this);
    }//constructor

    updateProfiles() {
        this.doFetch();
    }

    /**
     * Toggles isEdit
     * then fetches any changes from the db
     */
    edit() {
        console.log("edit");
        this.setState({ isEdit: !this.state.isEdit }, () => {
            this.doFetch()
        });
    }//edit

    /**
     * Toggles isEditSTudent
     * then fetches any changes from the db
     */
    editStudent() {
        console.log("edit");
        this.doFetch();
        console.log("done get")
        this.setState({ isEditStudent: !this.state.isEditStudent }, () => {this.doFetch()});
    }//editStudent

    /**
     * calls doFetch on initial mounting of component
     */
    async componentDidMount() {
        //gets the studnent info
        this.doFetch();
        //gets tutor info
    }//componentDidMount

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
            ).then(console.log(this.state.items))
    }//doFetch

    /**
     * Converts DD-MM-YYYYTHH:mm:ss to moment
     * 
     * @param {Array[T]} times 
     * @returns [{'Monday': {'startTime': moment, 'endTime': moment}, ...]
     */
    convertToMoment(times) {
        var timeSlots = {   //Stores timeslots for each weekday
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
            let day = moment(slot['startTime']).format('dddd');
            let endTime = slot['endTime'];
            startTime = moment(startTime).format(format);
            endTime = moment(endTime).format(format);

            timeSlots[day].push({ 'startTime': startTime, 'endTime': endTime })
        });

        return timeSlots
    }//convetToMoment

    render() {
        let profiles = this.state.isLoaded ?
            <Profiles
                updateProfiles={this.updateProfiles}
                items={this.state.items}
                edit={this.edit}
                editStudent={this.editStudent}
                isEdit={this.state.isEdit}
                isEditStudent={this.state.isEditStudent} /> :
            <h1> Loading... </h1>
        return (
            <>
                {/* instead of passing items, 
                pass map containing items for tutor profile and items for student profile */}
                {profiles}
            </>
        );//return
    }//render
}//LoadProfile

export default LoadProfile;