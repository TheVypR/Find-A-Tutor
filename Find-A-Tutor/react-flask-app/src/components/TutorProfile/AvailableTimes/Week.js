import React, { Component } from "react";
import Weekday from './Weekday'

/** Week Component
 * Displays 7 weekdays and vertical divider
 */
class Week extends React.Component {
    render() {
        return (
            <>
                <div className="d-flex justify-content-center">
                    <div className="vr"></div>
                    <Weekday day="sunday" />
                    <div className="vr"></div>
                    <Weekday day="monday" />
                    <div className="vr"></div>
                    <Weekday day="tuesday" />
                    <div className="vr"></div>
                    <Weekday day="wednesday" />
                    <div className="vr"></div>
                    <Weekday day="thursday" />
                    <div className="vr"></div>
                    <Weekday day="friday" />
                    <div className="vr"></div>
                    <Weekday day="sunday" />
                    <div className="vr"></div>
                </div>
            </>
        );//return
    }//render
}//Week

export default Week;