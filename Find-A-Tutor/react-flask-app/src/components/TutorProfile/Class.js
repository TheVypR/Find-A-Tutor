import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import { BsFillTrashFill } from "react-icons/bs";
import VerifiedIcon from '@mui/icons-material/Verified';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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

	requestVerify() {
		
	}

    render() {
        let index = this.props.index;
        return (
            <TableRow key={index} hover>				
					<TableCell>
						<Button id={index} className="verify" onClick={() => {this.requestVerify()}}>
							Request
						</Button>
					</TableCell>
                    <TableCell>
						<input name="courseCode"
							id={index}
							className="courseCode"
							type="text"
							placeholder='HUMA 200 A'
							size="8"
							onChange={e => this.props.setCourseCode(e.target.value, index)}>
						</input>
					</TableCell>
                    <TableCell>
						<input name="rate"
							type="number"
							id={index}
							className='hourlyRate'
							min="0"
							size="2"
							onKeyPress={e => this.onlyNumbers(e)}
							onChange={e => this.props.setRate(e.target.value, index)}
						/>
					</TableCell>
                    <TableCell>
                        <Button id={index} className="removeClass" variant="danger" onClick={() => this.props.removeClass(index)}>
                            <BsFillTrashFill />
                        </Button>
                    </TableCell>
                </TableRow>
        );//return
    }//render
}//Class

export default Class;