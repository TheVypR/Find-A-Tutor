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
                <div className="d-flex justify-content-center availableTimes">
                    <Weekday day="sunday" times={times} moments={this.props.moments}/>
                    <div className="vr"></div>
                    <Weekday day="monday" times={times} moments={this.props.moments}/>
                    <div className="vr"></div>
                    <Weekday day="tuesday" times={times} moments={this.props.moments}/>
                    <div className="vr"></div>
                    <Weekday day="wednesday" times={times} moments={this.props.moments}/>
                    <div className="vr"></div>
                    <Weekday day="thursday" times={times} moments={this.props.moments}/>
                    <div className="vr"></div>
                    <Weekday day="friday" times={times} moments={this.props.moments}/>
                    <div className="vr"></div>
                    <Weekday day="saturday" times={times} moments={this.props.moments}/>
                    <div className="vr"></div>
                </div>
            </>
        );//return
    }//render
}//Week

export default Week;