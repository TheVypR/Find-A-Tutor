import React from "react";
import { Button } from 'react-bootstrap';
import { BsFillTrashFill, BsFillPlusCircleFill, BsPatchCheckFill } from "react-icons/bs";
import "./TutorProfile.css"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

class ClassesStudying extends React.Component {
    render() {
        let classes = this.props.classes;
        let classesList = [];
        classes.forEach(aClass => {
            classesList.push(aClass)
        })
        return (
            <>
                <div className="p-2 studentClasses">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Class Code</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {classesList.map((item) => (
                                <TableRow key={item} hover>
                                    <TableCell>{item} </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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