import React, { Component } from "react";

class FileUpload extends React.Component {
	uploadFile = async (e) => {
	  const files = e.target.files;
	  console.log(files)
	  for (var i = 0; i < files.length; i++) {
		  console.log(files[i])
		  if (files[i] != null) {
			const data = new FormData();
			data.append('file', files[i]);
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
	  }
	};
	  
	// the form
	render() {
		return (
		<form>
		  <input
			type="file"
			onChange={this.uploadFile} multiple>
		  </input>
		</form>
		)
	}
}

export default FileUpload;