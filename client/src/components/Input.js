import React, { Component } from 'react';
import {Button, Card, Tab, Tabs} from "@blueprintjs/core";
import InputCanvas from "./input/InputCanvas";
import InputSettings from "./input/InputSettings";
import * as screenfull from "screenfull";


class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputCanvas : {},
      canvas : {
        available : {
          coordinates:props.config.wordObjs,
        },
        image:{
          height: 4592,
          width: 3448
        },
        dimensions: {
          height: 0,
          width: 0
        },
      },
      isFullscreen : false
    };
  }

  saveNewTextFormat = (fontSettings) => {
    const {inputCanvas} = this.state;
    inputCanvas.setNewTextSettings(fontSettings);
  };

  initCanvasDimensions = (height) => {
    const {canvas} = this.state;
    const {config, words, sendWord} = this.props;
    canvas.dimensions.width = height * canvas.image.width / canvas.image.height;
    canvas.dimensions.height = height;
    this.setState({canvas}, () => {
      const inputCanvas = new InputCanvas('canvas', config, words, sendWord);
      inputCanvas.addMissingWordsToCanvas( canvas.available.coordinates );
    });
  };

  triggerFullscreenBtn = () => {
    if (screenfull.isEnabled) {
        this.setState({isFullscreen:true}, () => {
          screenfull.request(); // fullscreen element
          this.initCanvasDimensions(window.screen.height);
          screenfull.onchange(event => {
            if(!screenfull.isFullscreen){
              this.setState({isFullscreen:false}, () => {
                this.initCanvasDimensions(window.screen.height - 500)
              })
            }
          })
        });
    }
  };

  componentDidMount() {
    const {canvas} = this.state;
    const coordinates = canvas.available.coordinates;
    if(coordinates && coordinates.length !== 0){
      const height = window.screen.height - 500;
      this.initCanvasDimensions(height);
    }
  }

  refreshTab = () => {

  };

  render() {
    const {canvas, isFullscreen} = this.state;
    let menu = [];
    if(!isFullscreen) {
      menu.push(
          <div id="inputMenu" key="menu">
            <Card
                style={{ width:"100%", height:"300px" }}
            >
              <Tabs animate={true} id="dashboard-tabs" onChange={this.refreshTab}>
                <Tab
                    className="tab"
                    id="setting"
                    title="Einstellungen"
                    panel={(
                        <InputSettings
                            {...this.props}
                            saveNewTextFormat={this.saveNewTextFormat}
                        />
                    )}
                />
                <Tab
                    className="tab"
                    id="words"
                    title="Wörter"
                />
              </Tabs>
            </Card>

          </div>
        )
    }

    const Input = () => (
        <div id="input">
          <div id="canvasContainer">
            <canvas id="canvas" width={canvas.dimensions.width+"px"} height={canvas.dimensions.height+"px"}/>
          </div>
          <Button
              id="fullscreenInput"
              icon="manually-entered-data"
              text="Vollbild"
              style={{margin:"auto", display:"block", "marginTop":"20px", "marginRight":"20px", float:"right"}}
              onClick={this.triggerFullscreenBtn}
          />
          {menu}
        </div>
    );

    return (
      <Input/>
    );
  }
}
export default Input;