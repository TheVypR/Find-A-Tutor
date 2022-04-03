import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import { BsFillTrashFill } from "react-icons/bs";
import VerifiedIcon from '@mui/icons-material/Verified';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

/**
 * Renders the Inputs for a Class
 */
class Class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			allClasses: "",
			error: ""
		}

		this.onlyNumbers = this.onlyNumbers.bind(this);
	}

	onlyNumbers(e) {
		console.log(e)
		if (!e.code.includes("Digit")) {
			e.preventDefault();
			console.log("Not a number")
		}
	}

	requestVerify(e) {
		console.log(this.props.courseCode);
		fetch("/requestVerification/", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: localStorage.getItem("token"),
				class_code: this.props.courseCode
			})
		})
	}

	// componentDidMount() {
	// 	fetch("/allClasses/?token=" + localStorage.getItem("token") + "&view=" + localStorage.getItem("view"))
    //         .then(res => res.json())
    //         .then(
    //             (result) => {
    //                 this.setState({
    //                     allClasses: result
    //                 });
    //             },
    //             (error) => {
    //                 this.setState({
    //                     error: error
    //                 });
    //             }
    //         )
	// }

	render() {
		let index = this.props.index;
		let allClasses = this.props.allClasses;
		return (
			<TableRow key={index} hover>
				<TableCell>
				</TableCell>
				<TableCell>
					<Autocomplete
						sx={{
							display: 'inline-block',
							'& input': {
								width: 100,
								bgcolor: 'background.paper',
								color: (theme) =>
									theme.palette.getContrastText(theme.palette.background.paper),
							},
						}}
						id={index}
						options={allClasses}
						renderInput={(params) => (
							<div ref={params.InputProps.ref}>
								<input type="text" placeholder="Class Code"{...params.inputProps} />
							</div>
						)}
					/>
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