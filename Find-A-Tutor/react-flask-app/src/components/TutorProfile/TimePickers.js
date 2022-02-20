import React, { Component } from "react";
import moment from 'moment';
import Time from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import "./TutorProfile.css"

const format = 'h:mm a';                //Format for TimePicker
const now = moment().hour(0).minute(0); //Default value for TimePickers

/** TimePickers Component
 * @returns label and TimePickers for the given TimeSlot
 * @props timeSlotChange(e, String): a callback function from the parent to set the given state
 *      timeSlotChange @params e: Moment object, String defining which timepicker was changed
 */
class TimePickers extends React.Component {
    render() {
        return (
            <>
                {/* TimePicker Labels */}
                <div className="d-flex justify-content-center" id="timeSlot">
                    <label id="startTimeLabel" className="timeLabel"> Start Time </label>
                    <label id="endTimeLabel" className="timeLabel"> End Time </label><br />
                </div>
                {/* Time Pickers */}
                <div className="d-flex justify-content-center" id="sundayTimeSlot">
                    
                    {/* Start Time */}
                    <Time
                        className="startTime"
                        defaultValue={now}
                        onChange={(e) => this.props.timeSlotChange(e, "start")}
                        format={format}
                        use12Hours
                        inputReadOnly
                        minuteStep={30}
                        name="startTime"
                    /> {/* startTime */}


                    {/* End Time */}
                    <Time
                        className="endTime"
                        defaultValue={now}
                        onChange={(e) => this.props.timeSlotChange(e, "start")}
                        format={format}
                        use12Hours
                        inputReadOnly
                        minuteStep={30}
                        name="endTime"
                    />{/* endTime */}

                </div> {/* TimeSlots */}
            </>
        );//return
    }//render
}//Pickers

export default TimePickers;