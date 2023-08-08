let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll('.pencil-color');
let pencilWidthElement = document.querySelector('.pencil-width');
let eraserWidthElement = document.querySelector('.eraser-width');
let downloadIcon = document.querySelector('.downloadicon');
let redoIcon = document.querySelector('.redoicon');
let undoIcon = document.querySelector('.undoicon');

let penColor = 'black';
let eraserColor = 'white';
let penWidth = pencilWidthElement.value;
let eraserWidth = eraserWidthElement.value;

let undoRedoTracker = []; // data
let track = 0; // Represent which action from tracker array.

let mouseDown = false;

let tool = canvas.getContext('2d');

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// mousedown -> start new path, mousemove -> path fill (graphics)

canvas.addEventListener('mousedown', (e) => {
  mouseDown = true;
  beginPath({
    x: e.clientX,
    y: e.clientY,
  });
  // pencil.style.display = 'none';
  // pencilFlag = false;
  // eraser.style.display = 'none';
  // eraserFlag = false;
  // let data = {
  //   x: e.clientX,
  //   y: e.clientY,
  // };
  // send data to server
  // socket.emit('beginPath', data);
});

canvas.addEventListener('mousemove', (e) => {
  // if (mouseDown) {
  //   let data = {
  //     x: e.clientX,
  //     y: e.clientY,
  //     color: eraserFlag ? eraserColor : penColor,
  //     width: eraserFlag ? eraserWidth : penWidth,
  //   };

  //   socket.emit('drawStroke', data);
  // }
  if (mouseDown) {
    drawStroke({
      x: e.clientX,
      y: e.clientY,
      color: eraserFlag ? eraserColor : penColor,
      width: eraserFlag ? eraserWidth : penWidth,
    });
  }
});

canvas.addEventListener('mouseup', (e) => {
  mouseDown = false;

  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length - 1;
  // console.log(track);
});

function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}

pencilColor.forEach((colorElement) => {
  colorElement.addEventListener('click', () => {
    let color = colorElement.classList[0];
    penColor = color;
    tool.strokeStyle = color;

    pencilIcon.style.color = color;
  });
});

pencilWidthElement.addEventListener('change', (e) => {
  penWidth = pencilWidthElement.value;
  tool.lineWidth = penWidth;
});

eraserWidthElement.addEventListener('change', (e) => {
  eraserWidth = eraserWidthElement.value;
  tool.lineWidth = eraserWidth;
});

eraserIcon.addEventListener('click', (e) => {
  if (eraserFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = penColor;
    tool.lineWidth = penWidth;
  }
});

downloadIcon.addEventListener('click', (e) => {
  let url = canvas.toDataURL();
  let a = document.createElement('a');
  a.href = url;
  a.download = 'board.jpg';
  a.click();
});

undoIcon.addEventListener('click', (e) => {
  if (track > 0) track--;
  // let url = undoRedoTracker[track];
  let data = {
    trackValue: track,
    undoRedoTracker,
  };
  undoRedoAction(data);
  // socket.emit('redoUndo', data);
});

function undoRedoAction(trackObj) {
  track = trackObj.trackValue;
  undoRedoTracker = trackObj.undoRedoTracker;

  let img = new Image(); // new image reference element
  img.src = undoRedoTracker[track];
  // console.log(canvas.width, canvas.height);
  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

redoIcon.addEventListener('click', (e) => {
  if (track < undoRedoTracker.length - 1) track++;
  // let url = undoRedoTracker[track];
  let data = {
    trackValue: track,
    undoRedoTracker,
  };
  undoRedoAction(data);
  // socket.emit('redoUndo', data);
});

// tool.beginPath(); // new graphic (path) (line)
// tool.moveTo(10, 10); // start point
// tool.lineTo(100, 100); //end point
// tool.stroke(); // fill graphic

// tool.strokeStyle = 'red';
// tool.beginPath();
// tool.moveTo(100, 1040);
// tool.lineTo(200, 250);
// tool.fill();
