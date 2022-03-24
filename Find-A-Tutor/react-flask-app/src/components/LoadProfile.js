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
            studentItems: {},
            tutorItems: {},
            isEdit: false,
            isEditStudent: false,
            isLoaded: false
        }
        this.edit = this.edit.bind(this);
        this.editStudent = this.editStudent.bind(this);
        this.tutorFetch = this.tutorFetch.bind(this);
        this.studentFetch = this.studentFetch.bind(this);
        this.convertToMoment = this.convertToMoment.bind(this);
    }//constructor

    /**
     * Toggles isEdit
     * then fetches any changes from the db
     */
    edit() {
        this.setState({ isEdit: !this.state.isEdit }, function () {
            this.tutorFetch();
        });
    }//edit

    /**
     * Toggles isEditSTudent
     * then fetches any changes from the db
     */
    editStudent() {
        this.setState({ isEditStudent: !this.state.isEditStudent }, function () {
            this.tutorFetch();
        });
    }//editStudent

    /**
     * calls doFetch on initial mounting of component
     */
    async componentDidMount() {
        //gets the studnent info
        this.studentFetch();
        //gets tutor info
    }//componentDidMount

    /**
     * Gets info from db
     */
    tutorFetch() {
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
                        tutorItems: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }//tutorFetch

    studentFetch() {
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
                        studentItems: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }//studentFetch

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
        let profiles = this.state.isLoaded ?
            <Profiles isTutor={this.props.isTutor}
                items={this.state.studentItems}
                edit={this.edit}
                editStudent={this.editStudent} /> :
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