import React, { Component } from 'react';
import {Button, FormGroup, InputGroup} from "@blueprintjs/core";

class InputSettings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fontSize: props.config.fontSize,
      dragSize: props.config.dragSize,
      hoverSize: props.config.hoverSize,
      fontFamily: props.config.fontFamily,
      wordCount: props.config.wordCount,
      fontColors:props.config.fontColors,
    };
  }

  componentDidMount() {
  }

  handleChange = (event) => {
    const key = event.target.id;
    let retObj = {};
    retObj[key] = event.target.value;
    this.setState( retObj )
  };

  saveChanges = () =>  {
    const {saveNewTextFormat} = this.props;
    const {fontSize, dragSize, hoverSize, fontFamily, wordCount, fontColors} = this.state;
    console.log("ja")
    saveNewTextFormat({fontSize, dragSize, hoverSize, fontFamily, wordCount, fontColors})

  };


  render() {
    const { fontColors, fontSize, dragSize, hoverSize, wordCount,fontFamily } = this.state;
    let fontColorsDiv;
    if(fontColors){
      fontColorsDiv = fontColors.map( (color,index) => {
        return(<div key={index+"a"} style={{"backgroundColor":color, width:"10px", height:"10px", margin:"5px"}}></div>)
      });
    }


    return(
      <div style={{padding:"10px"}}>
        <div style={{width:"60%", float:"left"}}>
          <FormGroup
              label="Font Size"
              labelInfo="(required)"
              className="formGroup"
          >
            <InputGroup
                id="fontSize"
                leftIcon="chevron-right"
                value={fontSize}
                onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup
              label="Drag Size"
              labelInfo="(required)"
              className="formGroup"
          >
            <InputGroup
                id="dragSize"
                leftIcon="chevron-right"
                value={dragSize}
                onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup
              label="Hover Size"
              labelInfo="(required)"
              className="formGroup"
          >
            <InputGroup
                id="hoverSize"
                leftIcon="chevron-right"
                value={hoverSize}
                onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup
                label="Anzahl Wörter"
                labelInfo="(required)"
                className="formGroup"
            >
              <InputGroup
                  id="wordCount"
                  leftIcon="chevron-right"
                  value={wordCount}
                  onChange={this.handleChange}
              />
            </FormGroup>
          <FormGroup
              label="Font Family"
              labelInfo="(required)"
              className="formGroup"
          >
            <InputGroup
                id="fontFamily"
                leftIcon="chevron-right"
                value={fontFamily}
                onChange={this.handleChange}
            />
          </FormGroup>
          </div>
        <div style={{width:"30%", float:"left"}}>
          <div style={{float:"left"}}>
            Farben
          </div>
          <Button
              icon="manually-entered-data"
              text="Farben bearbeiten"
              style={{display:"block", float:"right", "marginBottom":"10px"}}
          />
          <div style={{clear: "both"}}/>
          <div style={{"backgroundColor":"white", padding:"5px"}}>
            {fontColorsDiv}
          </div>
        </div>
        <div style={{width:"10%", float:"left"}}>
          <Button
              icon="manually-entered-data"
              text="Save"
              style={{margin:"auto", display:"block"}}
              onClick={this.saveChanges}
          />
        </div>

        <div style={{clear: "both"}}/>
      </div>

    )
  }
}
export default InputSettings;