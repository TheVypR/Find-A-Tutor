import React, { Component } from "react";
import Week from './Week'

class AvailableTimes extends React.Component {
    render() {
        return (
            <>
                <div className="row justify-content-start">
                    <div className="col-4">
                        <input type="checkbox" id="contactMe" />
                        <label htmlFor="contactMe"> Contact Me For Availability </label>
                    </div>
                    <h6 id="header" className="col-4 text-center"> Available Times</h6>
                </div>
                <Week />
            </>
        );//Return
    }//render
}//AvailableTimes

export default AvailableTimes;