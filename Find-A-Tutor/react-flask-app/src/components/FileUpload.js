import React, { Component } from "react";

class FileUpload extends React.Component {
	uploadFile = async (e) => {
	  const file = e.target.files[0];
	  if (file != null) {
		const data = new FormData();
		data.append('file_from_react', file);

		let response = await fetch('/fileUpload/',
		  {
			method: 'post',
			body: data,
		  }
		);
		let res = await response.json();
		if (res.status !== 1){
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