import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import Class from './Class'
import VerifiedIcon from '@mui/icons-material/Verified';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { BsFillTrashFill } from "react-icons/bs";

/**
 * Allows users to add classes that they tutor for
 */
class TutorsFor extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddClass = this.handleAddClass.bind(this);
        this.renderClass = this.renderClass.bind(this);
        this.removeClass = this.removeClass.bind(this);
        this.setCourseCode = this.setCourseCode.bind(this);
        this.setRate = this.setRate.bind(this);
    }

    /**
     * Updates array of classes in parent
     * 
     * @param {*} e 
     */
    handleAddClass = (e) => {
        e.preventDefault();
        //Here i form the object
        const aClass = {
            //key:value
        }
        this.props.addClass(aClass);
    }
	
	requestVerify() {
		
	}
	
    /**
     * Maps the filled in classes from the DB and any new classes added by the user
     * 
     * @returns : map of rendered classes
     */
    renderClass() {    
		return (<>
			<div className='d-flex '>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell><strong>Verified</strong></TableCell>
							<TableCell><strong>Class Code</strong></TableCell>
							<TableCell><strong>Rate</strong></TableCell>
							<TableCell><strong>Delete</strong></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.props.classes.map((item) => (
							((typeof(item[0]) === 'string') ?
								<TableRow key={item[0]} hover>
									<TableCell>{(item[2] ? <VerifiedIcon sx={{color: 'green'}}/> : <Button onClick={() => {this.requestVerify()}}>Request</Button>)}</TableCell>
									<TableCell>{item[0]} </TableCell>
									<TableCell>${item[1]} </TableCell>
									<TableCell><Button id={this.props.classes.indexOf(item)} className="removeClass" variant="danger" onClick={() => this.props.removeClass(this.props.classes.indexOf(item))}>
											<BsFillTrashFill />
										</Button>
									</TableCell>
								</TableRow>
							: 
								<Class
									index={this.props.classes.indexOf(item)}
									removeClass={() => { this.removeClass(this.props.classes.indexOf(item)) }}
									setCourseCode={this.setCourseCode}
									setRate={this.setRate}
								/>
							)
						))}
					</TableBody>
				</Table>
			</div>
		</>)
        //return
    }//renderClass

    /**
     * Calls parent's removeClass passing in the current class index
     * 
     * @param {int} index current class index
     */
    removeClass(index) {
        this.props.removeClass(index);
    }//removeClass

    /**
     * Calls parent's setCourseCode passing in the course code and the index
     * 
     * @param {string} code entered course code
     * @param {int} index index of class
     */
    setCourseCode(code, index) {
        this.props.setCourseCode(code, index);
    }//setCourseCode

    /**
     * Calls parent's setRate passing in the rate and the index
     * 
     * @param {int} rate entered hourly rate for tutoring a class
     * @param {int} index index of class
     */
    setRate(rate, index) {
        this.props.setRate(rate, index);
    }//setRate

    render() {
        let classes = this.props.classes
        return (
            <>
                <div className="p-2" id="fieldset">
                    <p id="header"> Tutoring For </p>
                    <div id="classes">
                        {this.renderClass()}
                    </div>
                    <Button type="button" id="AddClass" variant="primary" onClick={this.handleAddClass}> Add Class </Button>
                </div>
            </>
        );//return
    }//render
}//TutorsFor

export default TutorsFor;