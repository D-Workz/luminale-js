
import { fabric } from 'fabric';

fabric.Object.prototype.transparentCorners = true;
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';


class InputCanvas {
  constructor(elementId, textSettings, words, sendWord) {
    this.sendWord = sendWord;
    this.fabricCanvas = new fabric.Canvas(elementId, {
      selection: false,
      hoverCursor: 'pointer',
      rotationCursor: 'default',
      controlsAboveOverlay: true,
      centeredScaling: true
    });
    this.allCoords = textSettings.wordObjs;
    this.wordCount = textSettings.wordCount;
    this.allWords = words;
    this.isEdit = false;
    this.text = {
      fontSize: textSettings.fontSize,
      dragSize: textSettings.dragSize,
      hoverSize: textSettings.hoverSize,
      fontFamily: textSettings.fontFamily,
      fontColors:textSettings.fontColors,
    };
    this.collision = {
      collisionPosition : "top"
  };
    this.initializeFabricCanvas();
  }

  setNewTextSettings = (textSettings) => {
    this.text = textSettings;
    //TODO CHANGE TEXT reload canvas?
  };

  initializeFabricCanvas = () => {
    const that = this;
    this.fabricCanvas.on('mouse:over', function(e) {
      if(e && e.target){
        e.target.set('fontSize', that.text.hoverSize);
        that.fabricCanvas.renderAll();
      }
    });
    this.fabricCanvas.on('mouse:out', function(e) {
      if(e && e.target){
        e.target.set('fontSize', that.text.fontSize);
        that.fabricCanvas.renderAll();
      }
    });
    this.fabricCanvas.on({
      'object:moving': this.onObjectChange,
      'mouse:up': this.onMouseUp
    });
  };

  onObjectChange = (element) => {
    const that = this;
    element.target.setCoords();
    this.fabricCanvas.forEachObject(function(obj) {
      if (obj === element.target) return;
      if(element.target && element.target.intersectsWithObject(obj)){
        that.indicateCollisionRegion(element.target, obj);
      }else {
        obj.set('opacity', 1);
        if (obj.text.indexOf('|') !== -1) {
          obj.text = obj.text.replace('|', '');
          obj.fontSize = that.text.fontSize;
        }
      }
    });
    this.fabricCanvas.renderAll();
  };

  onMouseUp = (element) => {
    if(!element || !element.target) return;
    const that = this;
    const collisionObj = element.target;
    let isCollided = false;
    element.target.setCoords();
    try {
      this.fabricCanvas
          .getObjects()
          .some(obj => {
            if (obj === element.target) return;
            if(element.target && element.target.intersectsWithObject(obj)){
              that.handleObjectCollision(collisionObj, obj);
              isCollided = true;
              return true;
            }
          });
    }catch (e) {

    }
    if(!isCollided && collisionObj) {
      that.handleObjectNoCollision(collisionObj);
    }
  };

  indicateCollisionRegion = (paramDraggedObj, paramStaticObj) => {
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
      this.collision.collisionPosition = "top";
    }else {
      staticObj.text = '|'+ staticObj.text;
      this.collision.collisionPosition = "bottom";
    }
    paramStaticObj.text = (staticObj.text);
    paramStaticObj.fontSize = 25;
  };

  handleObjectCollision = (paramDraggedObj,paramStaticObj) => {
    paramStaticObj.text = paramStaticObj.text.replace('|','');
    let concatText = paramStaticObj.text + paramDraggedObj.text.toLowerCase();
    if(this.collision.collisionPosition === "bottom") {
      concatText = paramDraggedObj.text + paramStaticObj.text.toLowerCase();
    }
    this.sendWord(concatText);
    console.log(concatText);
    let availableCoords = [];
    availableCoords.push(this.allCoords.find(coordObj => coordObj.id === paramDraggedObj.id));
    availableCoords.push(this.allCoords.find(coordObj => coordObj.id === paramStaticObj.id));
    let reuseWords = [];
    reuseWords.push(paramDraggedObj.text);
    reuseWords.push(paramStaticObj.text);
    this.fabricCanvas.remove(paramDraggedObj);
    this.fabricCanvas.remove(paramStaticObj);
    this.addMissingWordsToCanvas(availableCoords, reuseWords)
  };

  handleObjectNoCollision = (collisionObj) => {
    const startCoords = this.getCoordinateObjById(collisionObj.id);
    collisionObj.top = startCoords.top;
    collisionObj.left = startCoords.left;
    this.fabricCanvas.renderAll();
  };

  getCoordinateObjById = (id) => {
    const allCoords = this.allCoords;
    return allCoords.find(coordObj => coordObj.id === id)
  };

  getRandomColor = () => {
    const fontColors = this.text.fontColors;
    if(fontColors){
      const randIndex = Math.floor(Math.random()*fontColors.length)
      return fontColors[randIndex];
    }
  };

  generateTextElement = (word, left, top, id) => {
    return new fabric.Text(word, {
      id:id,
      fill: this.getRandomColor(),
      angle: -90,
      hasControls: this.isEdit,
      hasBorders: false,
      fontSize: this.text.fontSize,
      textAlign: 'center',
      fontFamily: this.text.fontFamily,
      left: left,
      top: top
    });
  };

  addMissingWordsToCanvas = (availableCoords, reuseWords) => {
    availableCoords.forEach(coordsObj => {
      const randIndex = Math.floor(Math.random()*this.allWords.length);
      const randomWord = this.allWords.splice(randIndex,1)[0];
      this.fabricCanvas.add(this.generateTextElement(randomWord, coordsObj.left, coordsObj.top, coordsObj.id));
    });
    if(reuseWords)
      reuseWords.forEach(word => {
        this.allWords.push(word);
      });
    this.fabricCanvas.renderAll();
  };


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



}




export default InputCanvas;