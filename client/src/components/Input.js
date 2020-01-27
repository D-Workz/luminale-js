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
      canvas : {
        fabricCanvas:null,
        words: {
          available : {
            words:props.words,
            coordinates:props.config.wordObjs,
          },
          displayed : [],
        },
        image:{
          height: 4592,
          width: 3448
        },
        dimensions: {
          height: 0,
          width: 0
        },
        text: {
            fontSize: props.config.fontSize,
            dragSize: props.config.dragSize,
            hoverSize: props.config.hoverSize,
            fontFamily: props.config.fontFamily,
            wordCount: props.config.wordCount,
            fontColors:props.config.fontColors,
            wordObjs:props.config.wordObjs
        },
        interaction:{
          active:{},
          passive:{}
        },
        isEdit:false
      },
      isFullscreen : false
    };
  }

  initInputScreen = () => {
    const {canvas } = this.state;
    let availableCoords = canvas.words.available.coordinates;
    const fabricCanvas = canvas.fabricCanvas;
    if(availableCoords.length !== 0){
      let availableWords = canvas.words.available.words;
      const displayWords = availableCoords.map(coordsObj => {
        const randIndex = Math.floor(Math.random()*availableWords.length);
        const randomWord = availableWords.splice(randIndex,1)[0];
        return this.generateTextElement(randomWord, coordsObj.left, coordsObj.top, coordsObj.id);
      });
      availableCoords = [];
      canvas.words.available.coordinates = availableCoords;
      canvas.words.available.words = availableWords;
      canvas.words.displayed = displayWords;
      this.setState({canvas});
    }
  };


  generateTextElement = (word, left, top, id) => {
    const {canvas} = this.state;
    const isEdit = canvas['isEdit'];
    return new fabric.Text(word, {
      id:id,
      fill: this.getRandomColor(),
      angle: -90,
      hasControls: isEdit,
      hasBorders: false,
      fontSize: canvas.text.fontSize,
      textAlign: 'center',
      fontFamily: canvas.text.fontFamily,
      left: left,
      top: top
    });
  };

  saveNewTextFormat = (fontSettings) => {
    const {canvas} = this.state;
    canvas.text = fontSettings;
    this.setState({canvas})
  };

  initCanvasDimensions = (height) => {
    const {canvas} = this.state;
    canvas.dimensions.width = height * canvas.image.width / canvas.image.height;
    canvas.dimensions.height = height;
    this.setState({canvas}, () => {
      // this.initInputCanvas();
      this.initializeCanvasObject();
      const availableCoords = canvas.words.available.coordinates;
      console.log(canvas)
      this.addMissingWordsToCanvas( availableCoords, canvas.fabricCanvas  );
    })
  };

  getRandomColor = () => {
    const {canvas} = this.state;
    const fontColors = canvas.text.fontColors;
    if(fontColors){
      const randIndex = Math.floor(Math.random()*fontColors.length)
      return fontColors[randIndex];
    }
  };

  initializeCanvasObject = () => {
    const {canvas } = this.state;
    const fabricCanvas = new fabric.Canvas('canvas');
    const {fontSize, hoverSize} = canvas.text;
    const that = this;

    fabric.Object.prototype.transparentCorners = true;
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

    fabricCanvas.on('mouse:over', function(e) {
      if(e && e.target){
        e.target.set('fontSize', hoverSize);
        fabricCanvas.renderAll();
      }
    });

    fabricCanvas.on('mouse:out', function(e) {
      if(e && e.target){
        e.target.set('fontSize', fontSize);
        fabricCanvas.renderAll();
      }
    });

    fabricCanvas.on({
      'object:moving': that.handleCanvasObjectChange,
      'mouse:up': that.handleCanvasMouseUp
    });
    canvas.fabricCanvas = fabricCanvas;
    this.setState({canvas})
  };

  handleCanvasObjectChange = (element) => {
    const {canvas} = this.state;
    const fabricCanvas = canvas.fabricCanvas;
    element.target.setCoords();
    fabricCanvas.forEachObject(function(obj) {
      if (obj === element.target) return;
      if(element.target && element.target.intersectsWithObject(obj)){
        console.log("hier")
        this.indicateCollisionRegion(element.target, obj);
      }else{
        console.log("nein")
        obj.set('opacity', 1);
        if(obj.text.indexOf('|') !== -1){
          obj.text = obj.text.replace('|','');
          obj.fontSize = 15;
        }
      }
      fabricCanvas.renderAll();
    });
  };

  handleCanvasMouseUp = (element) => {
    const {canvas} = this.state;
    const fabricCanvas = canvas.fabricCanvas;
    const collisionObj = element.target;

    element.target.setCoords();
    fabricCanvas.forEachObject(function(obj) {
      if (obj === element.target) return;
      if(element.target && element.target.intersectsWithObject(obj)){

        console.log("isCollision")

      }else
        console.log("no coll")
    });

    //   console.log(collision.isCollision)
    // console.log(collision.collidedObj)
    // if(collision.isCollision && collision.collidedObj){
    //   console.log("isCollision")
    //   that.handleObjectCollision(collisionObj, collision, fabricCanvas);
    // }else{
    //   console.log("no collision")
    //   that.handleObjectNoCollision(collisionObj, fabricCanvas);
    // }
  };


  initInputCanvas = () => {
    let {canvas} = this.state;
    let fabricCanvas = new fabric.Canvas('canvas');
    const {fontSize, hoverSize} = canvas.text;
    const that = this;

    fabric.Object.prototype.transparentCorners = true;
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

    fabricCanvas.on('mouse:over', function(e) {
      if(e && e.target){
        e.target.set('fontSize', hoverSize);
        fabricCanvas.renderAll();
      }
    });

    fabricCanvas.on('mouse:out', function(e) {
      if(e && e.target){
        e.target.set('fontSize', fontSize);
        fabricCanvas.renderAll();
      }
    });

    fabricCanvas.on({
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

    function mouseUp(element) {

    }

    let collision = {
      isCollision : false
    };

    function onChange(options) {

    }
    canvas.words.displayed.forEach(word => {
      fabricCanvas.add(word);
    });
  };

  handleObjectNoCollision = (collisionObj, fabricCanvas) => {
    const startCoords = this.getCoordinateObjById(collisionObj.id);
    collisionObj.top = startCoords.top;
    collisionObj.left = startCoords.left;
    fabricCanvas.renderAll();
  };

  getCoordinateObjById = (id) => {
    const {canvas} = this.state;
    const wordObjs = canvas.text.wordObjs;
    return wordObjs.find(coordObj => coordObj.id === id)
  };

  handleObjectCollision = (collisionObj, collision, fabricCanvas) => {
    const {canvas} = this.state;
    collision.collidedObj.text = collision.collidedObj.text.replace('|','');
    let concatText = collision.collidedObj.text + collisionObj.text.toLowerCase();
    if(collision.collisionPosition === "bottom") {
      concatText = collisionObj.text + collision.collidedObj.text.toLowerCase();
    }
    console.log(concatText);
    let availableCoords = [];
    const wordObjs = canvas.text.wordObjs;
    const collObjCoords = wordObjs.find(coordObj => coordObj.id === collisionObj.id);
    const collidedObjCoords = wordObjs.find(coordObj => coordObj.id === collision.collidedObj.id);
    availableCoords.push(collObjCoords);
    availableCoords.push(collidedObjCoords);
    let reuseWords = [];
    reuseWords.push(collisionObj.text);
    reuseWords.push(collision.collidedObj.text);
    fabricCanvas.remove(collisionObj);
    fabricCanvas.remove(collision.collidedObj);
    this.addMissingWordsToCanvas(availableCoords, fabricCanvas, reuseWords)
  };

  addMissingWordsToCanvas = (availableCoords, fabricCanvas, reuseWords) => {
    const {canvas} = this.state;
    let availableWords = canvas.words.available.words;
    console.log(availableWords)
    availableCoords.forEach(coordsObj => {
      const randIndex = Math.floor(Math.random()*availableWords.length);
      const randomWord = availableWords.splice(randIndex,1)[0];
      fabricCanvas.add(this.generateTextElement(randomWord, coordsObj.left, coordsObj.top, coordsObj.id));
    });
    if(reuseWords)
    reuseWords.forEach(word => {
      availableWords.push(word);
    })
    fabricCanvas.renderAll();
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
    const allWords = canvas.words.available.coordinates;
    if(allWords && allWords.length !== 0){
      const height = window.screen.height - 500;
      // this.initInputScreen();
      this.initCanvasDimensions(height);
    }
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
                    panel={(
                        <InputWords
                            {...this.props}
                        />
                    )}
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