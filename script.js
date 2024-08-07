//HTML elements
const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill__color");
const sizeSlider = document.querySelector("#size__slider");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color__picker");
const clearCanvas = document.querySelector(".clear__canvas");
const saveImg = document.querySelector(".save__img");

const ctx = canvas.getContext("2d");

// Variables
let prevMouseX;
let prevMouseY;
let snapshot;
let isDrawing = false;
let selectedTool = "brush";
let brushWidth = 5;
let selectedColor = "#000000";

// FunctionsetCanvasBackground
const setCanvasBackground = () => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor; //setting fillstyle back to the selectedColor, it'll be the brush color
};

// Event listener "load"
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  // function call setCanvasBackground
  setCanvasBackground();
});

// Function drawRect
const drawRect = (e) => {
  if (!fillColor.checked) {
    //creating circle according to the mouse pointer
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

// Function drawCircle
const drawCircle = (e) => {
  ctx.beginPath(); //creating new path to draw circle
  //getting radius for circle according to the mouse pointer
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

// Function drawTriangle
const drawTriangle = (e) => {
  ctx.beginPath(); //creating new path to draw circle
  ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating bottom line of triangle
  ctx.closePath(); //closing path of a triangle so the third line draw automatically
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

// Function drawLine
const drawLine = (e) => {
  ctx.beginPath(); //creating new path to draw circle
  ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer
  ctx.stroke();
};

// Function startDraw
const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath(); //creating new path to draw
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor; //passing selectedColor as stroke style
  ctx.fillStyle = selectedColor; //passing selectedColor as fill style
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// Function drawing
const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush" || selectedTool === "eraser") {
    //if selected tool is eraser, then set strokeStyle to white
    //to paint white color on to the existing canvas content else set the stroke color to selected color
    ctx.strokeStyle = selectedTool === "eraser" ? "#ffffff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); //creating the line according to the mouse pointer
    ctx.stroke(); //drawing line with color
  } else if (selectedTool === "rectangle") {
    // Function call drawRect(e)
    drawRect(e);
  } else if (selectedTool === "circle") {
    // Function call drawCircle(e)
    drawCircle(e);
  } else if (selectedTool === "triangle") {
    // Function call drawTriangle(e)
    drawTriangle(e);
  } else {
    // Function call drawLine(e)
    drawLine(e);
  }
};

toolBtns.forEach((btn) => {
  // Event listener "click"
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});

// Event listener "change"
sizeSlider.addEventListener("change", () => {
  brushWidth = sizeSlider.value;
});

colorBtns.forEach((btn) => {
  // Event listener "click"
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

// Event listener "change"
colorPicker.addEventListener("change", () => {
  //passing picked color value from color picker to last color btn background
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

// Event listenr "click"
clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clearing whole canvas
  // Function call setCanvasBackground()
  setCanvasBackground();
});

// Event listener "click"
saveImg.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`; //passing current date as link download value
  link.href = canvas.toDataURL(); //passing canvasData as link href value
  link.click(); //clicking link to download image
});

// Event listener "mousedown" and function call startDraw
canvas.addEventListener("mousedown", startDraw);
// Event listener "mousemove" and function call drawing
canvas.addEventListener("mousemove", drawing);
// Event listener "mouseup"
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});
