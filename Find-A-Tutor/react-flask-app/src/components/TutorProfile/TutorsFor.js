import React, { Component } from "react";
import { Button } from 'react-bootstrap';

import Class from './Class'

const index = 1;

class TutorsFor extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddClass = this.handleAddClass.bind(this);
        this.renderClass = this.renderClass.bind(this);
        this.removeClass = this.removeClass.bind(this);

        this.setCourseCode = this.setCourseCode.bind(this);
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

    /**
     * Creates a map of rendered classes
     * 
     * @returns : map of rendered classes
     */
    renderClass() {
        return this.props.classes.map(item => {
            let index = this.props.classes.indexOf(item);
            return <Class
                index={index}
                removeClass={() => { this.removeClass(index) }}
                setCourseCode={this.setCourseCode}
            />
        })
    }

    removeClass(index) {
         this.props.removeClass(index);
    }

    setCourseCode(code) {
        this.props.setCourseCode(code);
    }

    render() {
        return (
            <>
                <fieldset>
                    <div className="p-2">
                        <p id="header"> Tutoring For </p>
                        <div id="classes">
                            {this.renderClass()}
                        </div>
                        <Button type="button" id="AddClass" variant="primary" onClick={this.handleAddClass}> Add Class </Button>
                    </div>
                </fieldset>
            </>
        );//return
    }//render
}//TutorsFor

export default TutorsFor;