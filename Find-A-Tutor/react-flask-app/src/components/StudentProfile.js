import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { BsFillTrashFill, BsFillPlusCircleFill, BsPatchCheckFill } from "react-icons/bs";

import "./StudentProfile.css"

class StudentProfile extends React.Component {
	
    constructor(props) {
        super(props)
		
        this.state = {
            classesList: [{ verified: "", courseCode: "", rate: "" }],
            isLoaded: false,
            isTutorView: true
        }

        this.AddNewClass = this.AddNewClass.bind(this);
        this.RemoveClass = this.RemoveClass.bind(this);
    }
	
    handleSubmit = () => {
        const values = [{
            "classes" : this.state.classesList,
			'token': localStorage.getItem('token')
        }];

        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
    }

    AddNewClass() {
        this.setState({
            classesList: [
                ...this.state.classesList,
                { verified: "", courseCode: "", rate: "" }
            ]
        });
    }

    RemoveClass = index => {
        this.state.classesList.splice(index, 1);

        this.setState({
            classesList: this.state.classesList
        })
    }
	
    render() {
        var items = this.props.items;
        return (
            <>
                <p className="text-end pe-2"><i> Logged in as a Student </i></p>
                <div className="container-fluid text-center">
                    {/* User Info */}
                    <h1 id="name"> {items['name']} </h1>
                    <p id="email"> {items['email']} </p>
                </div>

                <div className="d-flex justify-content-center">
                    {/*Classes*/}
                    <fieldset>
                        <div className="p-2">
                            <p id="header"> Classes </p>
                            <div id="classes">

                                {this.state.classesList.map((thisClass, index) => {
                                    return (
                                        <div className="input-group mb-3">
                                            <input name="courseCode" id={index} className="courseCode" type="text" placeholder='HUMA 200 A' size="8"></input>
                                            <div className="input-group-append">
                                                <Button id={index} className="removeClass" variant="danger" onClick={() => this.RemoveClass(index)}>
                                                    <BsFillTrashFill />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                            <Button type="button" id="AddClass" variant="primary" onClick={this.AddNewClass}> Add Class </Button>
                        </div>
                    </fieldset>
                </div>

                {/* Bottom Buttons */}
                <div id="bottom">
                    <Button type="submit" id="save"
                        onClick={this.handleSubmit}
                    > Apply </Button>
                </div>
            </>
        )
    }
}

export default StudentProfile;