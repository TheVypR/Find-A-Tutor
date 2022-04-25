import React, {useEffect} from 'react';

export default function ApproveDenySubmission() {
	const params = new URLSearchParams(window.location.search);
	
	const approveCode = params.get("approve_code");
	var approve = params.get("approve");
	
	useEffect (() => {
		console.log(approveCode);
		console.log(approve);
		fetch('/approveOrDeny/?approve=' + approve + "&approve_code=" + approveCode)
	},[])
	
	return (
	<>
	<div>
		<label style={{"font-size": '50px'}}><strong>Thank you for the response</strong></label>
	</div>
	< />
	
	)
}