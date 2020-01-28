
import { fabric } from 'fabric';

fabric.Object.prototype.transparentCorners = true;
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

let availableWords = [];

class InputCanvas {
  constructor(elementId, textSettings, words) {
    this.fabricCanvas = new fabric.Canvas(elementId);;
    this.allCoords = textSettings.wordObjs;
    this.allWords = words;
    this.isEdit = false;
    this.text = {
      fontSize: textSettings.fontSize,
      dragSize: textSettings.dragSize,
      hoverSize: textSettings.hoverSize,
      fontFamily: textSettings.fontFamily,
      wordCount: textSettings.wordCount,
      fontColors:textSettings.fontColors,
    };
    this.initializeFabricCanvas();
  }

  setNewTextSettings = (textSettings) => {
    this.text = textSettings;
    //TODO CHANGE TEXT reload canvas?
  };

  initializeFabricCanvas = () => {
    availableWords = this.allWords;
    this.fabricCanvas.on('mouse:over', function(e) {
      if(e && e.target){
        e.target.set('fontSize', this.hoverSize);
        this.fabricCanvas.renderAll();
      }
    });
    this.fabricCanvas.on('mouse:out', function(e) {
      if(e && e.target){
        e.target.set('fontSize', this.fontSize);
        this.fabricCanvas.renderAll();
      }
    });
    this.fabricCanvas.on({
      'object:moving': this.onObjectChange,
      'mouse:up': this.onMouseUp
    });
  };

  onObjectChange = (element) => {
    element.target.setCoords();
    this.fabricCanvas.forEachObject(function(obj) {
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
      this.fabricCanvas.renderAll();
    });
  };

  onMouseUp = (element) => {
    // const collisionObj = element.target;
    element.target.setCoords();
    this.fabricCanvas.forEachObject(function(obj) {
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

  handleObjectNoCollision = (collisionObj, fabricCanvas) => {
    const startCoords = this.getCoordinateObjById(collisionObj.id);
    collisionObj.top = startCoords.top;
    collisionObj.left = startCoords.left;
    fabricCanvas.renderAll();
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

    console.log(availableWords)
    availableCoords.forEach(coordsObj => {
      const randIndex = Math.floor(Math.random()*availableWords.length);
      const randomWord = availableWords.splice(randIndex,1)[0];
      this.fabricCanvas.add(this.generateTextElement(randomWord, coordsObj.left, coordsObj.top, coordsObj.id));
    });
    if(reuseWords)
      reuseWords.forEach(word => {
        availableWords.push(word);
      })
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