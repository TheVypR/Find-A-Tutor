import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import { BsFillTrashFill, BsPatchCheckFill } from "react-icons/bs";

class Class extends React.Component {
    constructor(props) {
        super(props);
        
        this.RemoveClass
    }
    
    render() {
        let index = this.props.index;
        return (
            <>
                <div className="input-group mb-3">
                    <BsPatchCheckFill name="verified" id={index} className="verified" size="22" />
                    <input name="courseCode" id={index} className="courseCode" type="text" placeholder='HUMA 200 A' size="8"></input>
                    <label id={index} className="rateLabel" htmlFor="rate"> Hourly Rate: $</label>
                    <input name="rate" type="number" id={index} className="hourlyRate" size="2" />
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