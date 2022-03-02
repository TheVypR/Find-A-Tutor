import React, { Component } from "react";
import { Button } from 'react-bootstrap';

import Class from './Class'

const index = 1;

class TutorsFor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "classes": []
        }

        this.handleAddClass = this.handleAddClass.bind(this);
        this.renderClass = this.renderClass.bind(this);
        this.removeClass = this.removeClass.bind(this);
    }

    /**
     * Updates array of classes
     * 
     * @param {*} e 
     */
    handleAddClass = (e) => {
        e.preventDefault();
        //Here i form the object
        const aClass = {
            //key:value
        }
        this.setState({ classes: [...this.state.classes, aClass] })
    }

    /**
     * Creates a map of rendered classes
     * 
     * @returns : map of rendered classes
     */
    renderClass() {
        return this.state.classes.map(item => {
            let index = this.state.classes.indexOf(item);
            return <Class
                index={index}
                removeClass={() => { this.removeClass(index) }}
            />
        })
    }

    removeClass(index) {
         //remove timeslot from DOM
         let filteredClasses = this.state.classes.filter(aClass => aClass !== this.state.classes[index]);
         this.setState({ classes: filteredClasses });
         console.log("index: " + index);
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