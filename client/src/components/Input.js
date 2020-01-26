import React, { Component } from 'react';
import {Button, Card, Tab, Tabs} from "@blueprintjs/core";
import { fabric } from 'fabric';
import InputWords from "./InputWords";
import InputSettings from "./InputSettings";
import * as screenfull from "screenfull";

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allWords: props.words,
      config: props.config,
      canvas : {
        words: {
          available : [],
          displayed : [],
        },
        image:{
          height: 4592,
          width: 3448
        },
        dimensions: {
          height: 0,
          width: 0
        }
      },
      isFullscreen : false
    };
  }

  initInputScreen = () => {
    const {allWords, config} = this.state;
    if(allWords.length !== 0 && Object.entries(config).length !== 0 && config.constructor === Object ){


    }
  };

  initCanvasDimensions = (height) => {
    const {canvas} = this.state;
    canvas.dimensions.width = height * canvas.image.width / canvas.image.height;
    canvas.dimensions.height = height;
    this.setState({canvas}, () => {
      this.initInputCanvas();
    })
  };

  initInputCanvas = () => {
    let canvas = new fabric.Canvas('canvas');
    const haus = new fabric.Text("Haus", {
      fill: "red",
      angle: -90,
      hasControls: false,
      hasBorders: false,
      fontSize: 15,
      textAlign: 'center',
      fontFamily: 'Helvetica Nue, Helvetica, Sans-Serif, Arial, Trebuchet MS',
      left: 62,
      top: 110
    });

    const mauer = new fabric.Text("Mauer", {
      fill: "green",
      angle: -90,
      hasControls: false,
      hasBorders: false,
      fontSize: 15,
      textAlign: 'center',
      fontFamily: 'Helvetica Nue, Helvetica, Sans-Serif, Arial, Trebuchet MS',
      left: 500,
      top: 265
    });

    // var canvas = this.__canvas = new fabric.Canvas('c');
    fabric.Object.prototype.transparentCorners = true;
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

    canvas.on('mouse:over', function(e) {
      if(e && e.target){
        e.target.set('fontSize', '18');
        canvas.renderAll();
      }
    });

    canvas.on('mouse:out', function(e) {
      if(e && e.target){
        e.target.set('fontSize', '15');
        canvas.renderAll();
      }
    });

    canvas.on({
      'object:moving': onChange,
      'mouse:up':mouseUp
    });


    //TODO prevent object out of canvas

    // canvas.on('object:modified', preventDragOffCanvas);
    //
    // function preventDragOffCanvas(e){
    //   var target = e.target
    //       , height = target.currentHeight
    //       , width = target.currentWidth
    //       , top = target.top
    //       , left = target.left
    //       , rightBound = this.width
    //       , bottomBound = this.height
    //       , modified = false;
    //   // don't move off top
    //   if(top < 0){
    //     top = 0;
    //     modified = true;
    //   }
    //   // don't move off bottom
    //   if(top + height > bottomBound){
    //     top = bottomBound - height;
    //     modified = true;
    //   }
    //   // don't move off left
    //   if(left < 0){
    //     left = 0;
    //     modified = true;
    //   }
    //   // don't move off right
    //   if(left + width > rightBound){
    //     left = rightBound - width;
    //     modified = true;
    //   }
    //
    //   if(modified){
    //     console.log(target)
    //     target.left = left;
    //     target.top = top;
    //   }
    //   canvas.renderAll();
    // }


    let initialCoords={};
    function mouseUp(element) {
      const collisionObj = element.target;
      if(collision.isCollision && collision.collidedObj){
        collision.collidedObj.text = collision.collidedObj.text.replace('|','');
        let concatText = collision.collidedObj.text + collisionObj.text.toLowerCase();
        if(collision.collisionPosition === "bottom") {
          concatText = collisionObj.text + collision.collidedObj.text.toLowerCase();
        }
        console.log(concatText);
        canvas.remove(collisionObj);
        canvas.remove(collision.collidedObj)
      }else{
        if(initialCoords.top && initialCoords.left){
          collisionObj.top = initialCoords.top;
          collisionObj.left = initialCoords.left;
          delete initialCoords.left;
          delete initialCoords.top;
          canvas.renderAll();
        }
      }
    }

    let collision = {
      isCollision : false
    };
    const that = this;

    function onChange(options) {
      if(!initialCoords.top){
        initialCoords.top = options.target.top;
        initialCoords.left = options.target.left;
      }
      options.target.setCoords();
      canvas.forEachObject(function(obj) {
        if (obj === options.target) return;
        if(options.target && options.target.intersectsWithObject(obj)){
          collision.collisionPosition = that.indicateCollisionRegion(options.target, obj);
          collision.isCollision = true;
          collision.collidedObj = obj;
        }else{
          collision.isCollision = false;
          obj.set('opacity', 1);
          if(obj.text.indexOf('|') !== -1){
            obj.text = obj.text.replace('|','');
            obj.fontSize = 15;
            delete collision.collidedObj;
          }
        }
        canvas.renderAll();
      });
    }
    canvas.add(haus);
    canvas.add(mauer);
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
    const height = window.screen.height - 500;
    this.initCanvasDimensions(height);
    this.initInputScreen();
  }

  indicateCollisionRegion = (paramDraggedObj, paramStaticObj) => {
    let collisionPosition = "top";
    let draggedObj = {
      center: (paramDraggedObj.getBoundingRect().top) + (paramDraggedObj.getBoundingRect().height / 2)
    };
    let staticObj = {
      center: paramStaticObj.top,
      text: paramStaticObj.text
    };
    if(staticObj.text.indexOf('|') !== -1){
      staticObj.text = staticObj.text.replace('|','');
    }
    if(draggedObj.center < staticObj.center){
      staticObj.text += '|';
    }else {
      staticObj.text = '|'+ staticObj.text;
      collisionPosition = "bottom";
    }
    paramStaticObj.text = (staticObj.text);
    paramStaticObj.fontSize = 25;
    return collisionPosition;
  };

  refreshTab = () => {

  };

  render() {
    const animate = true;
    const {canvas, isFullscreen} = this.state;
    let menu = [];
    if(!isFullscreen) {
      menu.push(
          <div id="inputMenu" key="menu">
            <Card
                style={{ width:"100%", height:"250px" }}
            >
              <Tabs animate={animate} id="dashboard-tabs" onChange={this.refreshTab}>
                <Tab
                    className="tab"
                    id="setting"
                    title="Einstellungen"
                    panel={(
                        <InputSettings
                            {...this.props}
                        />
                    )}
                />
                <Tab
                    className="tab"
                    id="words"
                    title="Wörter"
                    panel={(
                        <InputWords
                            {...this.props}
                        />
                    )}
                />
              </Tabs>
            </Card>
            <Button
                icon="manually-entered-data"
                text="Save"
                style={{margin:"auto", display:"block", "marginTop":"10px", "marginLeft":"10px", float:"left"}}
            />
            <Button
                id="fullscreenInput"
                icon="manually-entered-data"
                text="Vollbild"
                style={{margin:"auto", display:"block", "marginTop":"10px", "marginRight":"10px", float:"right"}}
                onClick={this.triggerFullscreenBtn}
            />
          </div>
        )
    }

    const Input = () => (
        <div id="input">
          <div id="canvasContainer">
            <canvas id="canvas" width={canvas.dimensions.width+"px"} height={canvas.dimensions.height+"px"}/>
          </div>
          {menu}
        </div>
    );

    return (
      <Input/>
    );
  }
}
export default Input;