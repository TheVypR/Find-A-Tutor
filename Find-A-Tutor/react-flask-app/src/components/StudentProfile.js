import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { BsFillTrashFill, BsFillPlusCircleFill, BsPatchCheckFill } from "react-icons/bs";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import "./TutorProfile.css"

class StudentProfile extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            classesList: [],
            removeClasses: [],
            isLoaded: false,
            isTutorView: true
        }

        this.AddNewClass = this.AddNewClass.bind(this);
        this.RemoveClass = this.RemoveClass.bind(this);
        this.setCourseCode = this.setCourseCode.bind(this);
    }

    handleSubmit = () => {
        let newClasses = this.state.classesList.filter(cls =>
            Object.keys(cls).includes("new") &&
            Object.keys(cls).includes("class_code"));
        let removeClasses = this.state.removeClasses.filter(cls =>
            Object.keys(cls).includes("class_code"));

        const values = {
            'token': localStorage.getItem("token"),
            "classesTaking": newClasses,
            'removeClassesTaking': removeClasses
        };

        const response = fetch("/myProfile/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        }).then(this.props.edit());
    }

    AddNewClass() {
        this.setState({
            classesList: [
                ...this.state.classesList,
                { "new": true, "fromDB": false }
            ]
        }, () => console.log(this.state.classesList));
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
        aClass['class_code'] = code;
        aClass['new'] = true;
        aClass['fromDB'] = true;
        classes[index] = aClass;
    }//setCourseCode

    /**
     * Removes class from DOM
     * 
     * @param {int} index index of class to be removed
     */
    RemoveClass(index) {
        var classes = this.state.classesList;
        //remove class from DOM
        let filteredClasses = classes.filter(aClass => aClass !== classes[index]);
        let removeClasses = classes.filter(aClass => aClass == classes[index]);

        this.setState({ classesList: filteredClasses });
        this.setState({ removeClasses: removeClasses })
    }//removeClass

    componentDidMount() {
        let filledInClasses = this.props.items['classesTaking'];
        filledInClasses.forEach(aClass => {
            var classesList = this.state.classesList;
            classesList.push({ "fromDB": true, "class_code": aClass[0] })
            this.setState({ classesList: classesList })
        })
    }

    render() {
        var items = this.props.items;
        const PopperMy = function (props) {
			return <Popper {...props} style={{width: 'fit-content'}} placement="bottom-start" />;
		};
        var allClasses = this.props.items['allClasses'].map(cls => cls.toString());
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
                    <div className="p-2 studentClasses">
                        <p style={{ fontWeight: "bold" }}> Classes </p>
                        <div id="classes">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Class Code</strong></TableCell>
                                        <TableCell><strong>Remove</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.classesList.map((item, index = this.state.classesList.indexOf(item)) => (
                                        item['fromDB'] ?
                                            <TableRow key={item['class_code']} hover>
                                                <TableCell> {item['class_code']} </TableCell>
                                                <TableCell>
                                                    <Button id={item['class_code']} className="removeClass" variant="danger" onClick={() => this.RemoveClass(this.state.classesList.indexOf(item))}>
                                                        <BsFillTrashFill />
                                                    </Button>
                                                </TableCell>
                                            </TableRow> :
                                            <TableRow key={item['class_code']} hover>
                                                <TableCell>
                                                    <Autocomplete
                                                        PopperComponent={PopperMy}
                                                        sx={{
                                                            display: 'inline-block',
                                                            '& input': {
                                                                width: 100,
                                                            },
                                                        }}
                                                        options={allClasses}
                                                        renderInput={(params) => (
                                                            <div ref={params.InputProps.ref}>
                                                                <input type="text" placeholder="Class Code"{...params.inputProps} required />
                                                            </div>
                                                        )}
                                                        onChange={e => { this.setCourseCode(e.target.textContent, index) }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button id={index} className="removeClass" variant="danger" onClick={() => this.RemoveClass(index)}>
                                                        <BsFillTrashFill />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                    ))}
                                </TableBody>
                            </Table>


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