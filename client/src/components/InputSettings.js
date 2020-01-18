import React, { Component } from 'react';
import {Button, FormGroup, InputGroup} from "@blueprintjs/core";

class InputSettings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fontSize: 15,
      dragSize: 18,
      hoverSize: 20,
      fontColors:[
          "#48AFF0",
          "#aa007f",
          "#0c0a7f",
          "#00aa00"
      ],


    };
  }

  componentDidMount() {

  }


  render() {
    const { fontColors, fontSize, dragSize, hoverSize } = this.state;
    let fontColorsDiv;
    fontColorsDiv = fontColors.map( (color,index) => {
      return(<div key={index+"a"} style={{"backgroundColor":color, width:"10px", height:"10px", margin:"5px"}}></div>)
    });

    return(
      <div>
        <div style={{width:"40%", float:"left"}}>
          <FormGroup
              label="Font Size"
              labelInfo="(required)"
              className="formGroup"
              // helperText={error.name && 'Set a name'}
              // intent={error.name ? Intent.DANGER : Intent.NONE}
          >
            <InputGroup
                id="fontSize"
                leftIcon="chevron-right"
                value={fontSize}
                onChange={this.handleChange}
                // intent={error.name ? Intent.DANGER : Intent.NONE}
            />
          </FormGroup>
          <FormGroup
              label="Drag Size"
              labelInfo="(required)"
              // helperText={error.name && 'Set a name'}
              // intent={error.name ? Intent.DANGER : Intent.NONE}
          >
            <InputGroup
                id="dragSize"
                leftIcon="chevron-right"
                value={dragSize}
                onChange={this.handleChange}
                // intent={error.name ? Intent.DANGER : Intent.NONE}
            />
          </FormGroup>
          <FormGroup
              label="Hover Size"
              labelInfo="(required)"
              // helperText={error.name && 'Set a name'}
              // intent={error.name ? Intent.DANGER : Intent.NONE}
          >
            <InputGroup
                id="hoverSize"
                leftIcon="chevron-right"
                value={hoverSize}
                onChange={this.handleChange}
                // intent={error.name ? Intent.DANGER : Intent.NONE}
            />
          </FormGroup>
        </div>
        <div>

        </div>
        <div style={{width:"50%", float:"right"}}>
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
      </div>
    )
  }
}
export default InputSettings;