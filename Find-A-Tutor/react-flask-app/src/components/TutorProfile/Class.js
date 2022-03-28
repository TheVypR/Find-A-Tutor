import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import { BsFillTrashFill, BsPatchCheckFill } from "react-icons/bs";

/**
 * Renders the Inputs for a Class
 */
class Class extends React.Component {
    constructor(props) {
        super(props)

        this.onlyNumbers = this.onlyNumbers.bind(this);
    }

    onlyNumbers(e) {
        console.log(e)
        if (!e.code.includes("Digit")) {
            e.preventDefault();
            console.log("Not a number")
        }

    }

    render() {
        let index = this.props.index;
        return (
            <>
                <div className="input-group mb-3">
                    {/* Verified indicator */}
                    <BsPatchCheckFill name="verified" id={index} className="verified" size="22" />

                    {/* course code input */}
                    <input name="courseCode"
                        id={index}
                        className="courseCode"
                        type="text"
                        placeholder='HUMA 200 A'
                        size="8"
                        onChange={e => this.props.setCourseCode(e.target.value, index)}
                    ></input>

                    {/* hourly rate input */}
                    <label id={index} className="rateLabel" htmlFor="rate"> Hourly Rate: $</label>
                    <input name="rate"
                        type="number"
                        id={index}
                        className="hourlyRate"
                        min="0"
                        size="2"
                        onKeyPress={e => this.onlyNumbers(e)}
                        onChange={e => this.props.setRate(e.target.value, index)}
                    />

                    {/* remove class button */}
                    <div className="input-group-append">
                        <Button id={index} className="removeClass" variant="danger" onClick={() => this.props.removeClass(index)}>
                            <BsFillTrashFill />
                        </Button>
                    </div>
                </div>
            </>
        );//return
    }//render
}//Class

export default Class;