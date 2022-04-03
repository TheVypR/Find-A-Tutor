import React, { Component } from "react";

class FileUpload extends React.Component {
	uploadFile = async (e) => {
	  const files = e.target.files;
	  if (file != null) {
		const data = new FormData();
		for file in files {
			data.append('file', file);
		}
		console.log(data);
		let response = await fetch('/fileUpload/',
		  {
			method: 'post',
			body: data,
		  }
		);
		let res = await response.json();
		if (res.status !== 1) {
		  alert('Error uploading file');
		}
	  }
	};
	  
	// the form
	render() {
		return (
		<form>
		  <input
			type="file"
			onChange={this.uploadFile}>
		  </input>
		</form>
		)
	}
}

export default FileUpload;