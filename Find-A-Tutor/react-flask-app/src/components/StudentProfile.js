import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { BsFillTrashFill, BsFillPlusCircleFill, BsPatchCheckFill } from "react-icons/bs";

import "./TutorProfile.css"

class StudentProfile extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            classesList: [],
            isLoaded: false,
            isTutorView: true
        }

        this.AddNewClass = this.AddNewClass.bind(this);
        this.RemoveClass = this.RemoveClass.bind(this);
        this.setCourseCode = this.setCourseCode.bind(this);
    }

    handleSubmit = () => {
        const values = {
            'token': localStorage.getItem("token"),
            "classesTaking": this.state.classesList
        };

        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
        this.props.edit();
    }

    AddNewClass() {
        this.setState({
            classesList: [
                ...this.state.classesList,
                ""
            ]
        });
    }

    /**
     * sets the courseCode for a class in the classes state
     * 
     * @param {string} code entered courseCode
     * @param {int} index given index of class
     */
    setCourseCode(code, index) {
        let classes = this.state.classesList;
        let aClass = { ...classes[index] };
        aClass = code;
        classes[index] = aClass;
        this.setState({ classesList: classes })
    }//setCourseCode

    RemoveClass = index => {
        this.state.classesList.splice(index, 1);

        this.setState({
            classesList: this.state.classesList
        })
    }

    render() {
        var items = this.props.items;
        let filledInClasses = items['classesTaking'];
        let classesList = [];
        filledInClasses.forEach(aClass => {
            classesList.push(<>
                    <hr />
                    <p style={{ margin: "5px" }} > {aClass} </p>
            </>)
        })
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
                    <div className="studentClasses">
                        <p style={{ fontWeight: "bold" }}> Classes </p>
                        <div id="classes">
                            {classesList}
                            {this.state.classesList.map((thisClass, index) => {
                                return (
                                    <div className="input-group mb-3">
                                        <input
                                            name="courseCode"
                                            id={index}
                                            className="courseCode"
                                            onChange={e => this.setCourseCode(e.target.value, index)}
                                            type="text"
                                            placeholder='HUMA 200 A'
                                            size="8">
                                        </input>
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