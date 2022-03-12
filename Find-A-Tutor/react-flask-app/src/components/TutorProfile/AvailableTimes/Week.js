import React, { Component } from "react";
import Weekday from './Weekday'

/** Week Component
 * Displays 7 weekdays and vertical divider
 */
class Week extends React.Component {
    render() {
        let times = this.props.times;   // Available times from the DB
        return (
            <>
                <div className="d-flex justify-content-center">
                    <div className="vr"></div>
                    <Weekday day="sunday" times={times} />
                    <div className="vr"></div>
                    <Weekday day="monday" times={times} />
                    <div className="vr"></div>
                    <Weekday day="tuesday" times={times} />
                    <div className="vr"></div>
                    <Weekday day="wednesday" times={times} />
                    <div className="vr"></div>
                    <Weekday day="thursday" times={times} />
                    <div className="vr"></div>
                    <Weekday day="friday" times={times} />
                    <div className="vr"></div>
                    <Weekday day="sunday" times={times} />
                    <div className="vr"></div>
                </div>
            </>
        );//return
    }//render
}//Week

export default Week;