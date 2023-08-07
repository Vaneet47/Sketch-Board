let optionsCont = document.querySelector('.options-cont');
let toolsUICont = document.querySelector('.toolsUI-cont');

let pencilIcon = document.querySelector('.pencilicon');
let pencil = document.querySelector('.pencil');
let pencilFlag = false;

let eraserIcon = document.querySelector('.erasericon');
let eraser = document.querySelector('.eraser');
let eraserFlag = false;

let stickynoteicon = document.querySelector('.stickynoteicon');
let body = document.querySelector('body');

let uploadIcon = document.querySelector('.uploadicon');

optionsCont.addEventListener('click', (e) => {
  let iconElement = optionsCont.children[0];

  if (iconElement.innerText === 'menu') {
    iconElement.innerText = 'close';
    closeTools();
  } else {
    iconElement.innerText = 'menu';
    openTools();
  }
});

function openTools() {
  toolsUICont.style.display = 'flex';
}

function closeTools() {
  toolsUICont.style.display = 'none';
  pencil.style.display = 'none';
  pencilFlag = false;
  eraser.style.display = 'none';
  eraserFlag = false;
}

pencilIcon.addEventListener('click', () => {
  if (pencilFlag) pencil.style.display = 'none';
  else pencil.style.display = 'flex';
  pencilFlag = !pencilFlag;
});

eraserIcon.addEventListener('click', () => {
  if (eraserFlag) eraser.style.display = 'none';
  else eraser.style.display = 'flex';
  eraserFlag = !eraserFlag;
});

stickynoteicon.addEventListener('click', () => {
  createSticky(`
  <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
  </div>
  <div class="note-cont">
        <textarea spellcheck='false' ></textarea>
  </div>`);
});

uploadIcon.addEventListener('click', (e) => {
  let input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.click();
  input.addEventListener('change', (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);
    createSticky(`
    <div class="header-cont">
          <div class="minimize"></div>
          <div class="remove"></div>
    </div>
    <div class="note-cont">
          <img src=${url} />
    </div>`);
  });
});

function createSticky(stickyHTMLTemplate) {
  let stickyCont = document.createElement('div');
  stickyCont.setAttribute('class', 'sticky-cont');
  stickyCont.innerHTML = stickyHTMLTemplate;
  let minimize = stickyCont.querySelector('.minimize');
  let remove = stickyCont.querySelector('.remove');
  noteActions(minimize, remove, stickyCont);
  stickyCont.onmousedown = function (event) {
    dragNDrop(stickyCont, event);
  };
  stickyCont.ondragstart = function () {
    return false;
  };
  body.appendChild(stickyCont);
}

function noteActions(minimize, remove, stickyCont) {
  remove.addEventListener('click', (e) => {
    stickyCont.remove();
  });
  minimize.addEventListener('click', (e) => {
    let noteCont = stickyCont.querySelector('.note-cont');
    let display = getComputedStyle(noteCont).getPropertyValue('display');

    if (display === 'none') noteCont.style.display = 'block';
    else noteCont.style.display = 'none';
  });
}

function dragNDrop(el, event) {
  let shiftX = event.clientX - el.getBoundingClientRect().left;
  let shiftY = event.clientY - el.getBoundingClientRect().top;

  el.style.position = 'absolute';
  el.style.zIndex = 1000;
  //   document.body.append(el);

  moveAt(event.pageX, event.pageY);

  // moves the el at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    el.style.left = pageX - shiftX + 'px';
    el.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the el on mousemove
  document.addEventListener('mousemove', onMouseMove);

  // drop the el, remove unneeded handlers
  el.onmouseup = function () {
    document.removeEventListener('mousemove', onMouseMove);
    el.onmouseup = null;
  };
}
