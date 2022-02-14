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
            items: "",
            isTutorView: false
        }

        this.AddNewClass = this.AddNewClass.bind(this);
        this.RemoveClass = this.RemoveClass.bind(this);
    }

    componentDidMount() {
        fetch("/myProfile")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.items
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    
    handleSubmit = () => {
        const values = [{
            "classes" : this.state.classesList
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
        return (
            <>
                <p className="text-end pe-2"><i> Logged in as a Student </i></p>
                <div className="container-fluid text-center">
                    {/* User Info */}
                    <h1 id="name"> {this.state.items['name']} </h1>
                    <p id="email"> {this.state.items['email']} </p>
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
                                            <BsPatchCheckFill name="verified" id={index} className="verified" size="22" />
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
                    <Link to='/calendar'>
                        <Button id="submit"> To Calendar </Button>
                    </Link>
                </div>
            </>
        )
    }
}

export default StudentProfile;