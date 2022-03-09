import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import Class from './Class'

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
                setRate={this.setRate}
            />
        })//return
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