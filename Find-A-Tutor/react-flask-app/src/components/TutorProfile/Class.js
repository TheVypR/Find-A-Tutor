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
import Popper from '@mui/material/Popper';

/**
 * Renders the Inputs for a Class
 */
class Class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			courseCode: "",
			rate: "",
			allClasses: "",
			error: ""
		}

		this.onlyNumbers = this.onlyNumbers.bind(this);
		this.setCourseCode = this.setCourseCode.bind(this);
		this.setRate = this.setRate.bind(this)
	}

	setCourseCode(code) {
		this.setState({courseCode: code});
	}

	setRate(rate) {
		this.setState({rate: rate})
	}

	onlyNumbers(e) {
		if (!e.code.includes("Digit")) {
			e.preventDefault();
		}
	}

	requestVerify(e) {
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
		let allClasses = this.props.allClasses.map(cls => cls.toString());

		const PopperMy = function (props) {
			return <Popper {...props} style={{width: 'fit-content'}} placement="bottom-start" />;
		};

		return (
			<TableRow key={index} hover>
				<TableCell>
					<Button className="btn-success submitClass" onClick={() => 
						this.props.updateClasses(this.state.courseCode, this.state.rate, index)}> Submit </Button>
				</TableCell>
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
						onChange={e => {this.setCourseCode(e.target.textContent)}}
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
						onChange={e => this.props.setRate(e.target.value)}
						required
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