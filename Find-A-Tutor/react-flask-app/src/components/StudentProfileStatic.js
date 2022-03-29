import React from "react";
import { Button } from 'react-bootstrap';
import { BsFillTrashFill, BsFillPlusCircleFill, BsPatchCheckFill } from "react-icons/bs";
import "./TutorProfile.css"

class ClassesStudying extends React.Component {
    render() {
        let classes = this.props.classes;
        let classesList = [];
        classes.forEach(aClass => {
            classesList.push(<>
                <p style={{ margin: "10px" }} > {aClass} </p>
            </>)
        })
        return (
            <>
                <div className="p-2 studentClasses">
                    <p style={{ fontWeight: "bold" }}> Current Classes </p>
                    <div id="classes">
                        {classesList}
                    </div>
                </div>
            </>
        );//return
    }//render
}//ClassesStudying

class StudentProfileStatic extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            classesList: [],
            isLoaded: false,
            isTutorView: true
        }
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
                    <ClassesStudying classes={items['classesTaking']} />
                </div>

                {/* Bottom Buttons */}
                <div id="bottom">
                    <Button variant="success" type="submit" id="Edit"
                        onClick={this.props.edit}
                    > Edit </Button>
                </div>
            </>
        )
    }
}

export default StudentProfileStatic;