import React, { Component } from 'react';
import {Button, Card, Tab, Tabs} from "@blueprintjs/core";
import { fabric } from 'fabric';
import InputWords from "./InputWords";
import InputSettings from "./InputSettings";

class Input extends Component {

  componentDidMount() {
    // const { importToShowLogs } = this.props;

    var canvas = new fabric.Canvas('canvas');

    var haus = new fabric.Text("Haus", {
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

    var mauer = new fabric.Text("Mauer", {
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

  render() {
    const animate = true;

    let heigth = window.screen.height - 500;
    const imageWidth = 3448;
    const imageHeigth = 4592;
    let width = heigth * imageWidth/imageHeigth;
    // const width = window.screen.width + "px";
    width = width + "px";
    heigth = heigth + "px";
    const Input = () => (
        <div id="input">
          <canvas id="canvas" width={width} height={heigth}/>

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
        </div>
    );

    return (
    <div className="App">
      <Input/>
      <Button
          icon="manually-entered-data"
          text="Save"
          style={{margin:"auto", display:"block", "marginTop":"10px", "marginLeft":"10px", float:"left"}}
      />
      <Button
          icon="manually-entered-data"
          text="Vollbild"
          style={{margin:"auto", display:"block", "marginTop":"10px", "marginRight":"10px", float:"right"}}
      />
    </div>
    );
  }
}
export default Input;