const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorsBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

//global variables with default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
selectedColor = "#000",
brushWidth = 5;

const setCanvasBackground = () => {
    //seting whole canvas background to white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; //setting fillstyle back to selected color
};

window.addEventListener("load", () => {
    //setting canvas width/height offset that returns viewabla width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    //I'm not using because I think it's coll backgroudless
    //setCanvasBackground();
});

const drawRect = (e) => {
    //if fillColor isn't checked, draw a rect with border, else draw rect with backgournd
    if(!fillColor.checked){
        //creating rect according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    return ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); //creating a new path to draw a circle
    //getting radius for the circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); //creating a circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillColor is checked, fill circle, else draw border circle
}

const drawTriangle = (e) => {
    ctx.beginPath(); //creating a new path to draw a triangle
    ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); //crating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY) //creating bottom line of triangle
    ctx.closePath(); //closing path of a triangle, so the third line is draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillColor is checked, fill triangle, else draw border triangle
}

// const drawPentagon = (e) => {
//     let size = 5;
//     let step =  2*Math.PI/5;
//     let shift = (Math.PI/180)*-18
//     ctx.beginPath(); //creating a new path to draw a triangle
//     ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
//     ctx.lineTo(e.offsetX, e.offsetY); //crating first line according to the mouse pointer
//     // for(let i = 1; i < size; i++){
//     //     let curStep = i*step+shift;
//     //     ctx.lineTo(e.offsetX - prevMouseX * Math.cos(curStep), e.offsetY - prevMouseY * Math.sin(curStep))
//     // }
//     ctx.lineTo(prevMouseX*0.85, e.offsetY*1.3) //creating bottom line oftriangle
//     ctx.lineTo(prevMouseX*1.15, e.offsetY*1.3) //creating bottom line of triangle
//     ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY ) //creating bottom line of triangle
//     ctx.closePath(); //closing path of a triangle, so the third line is draw automatically
//     //fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillColor is checked, fill triangle, else draw border triangle
//     ctx.stroke();
// }

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; //passing current mouseX position as previousMouseX value
    prevMouseY = e.offsetY; //passing current mouseY position as previousMouseY value
    ctx.beginPath(); //creating a new path to draw
    ctx.lineWidth = brushWidth; //passing brushSize as lineWidth
    ctx.strokeStyle = selectedColor; //passing selected color as brush style
    ctx.fillStyle = selectedColor; //passing selected color as fill style
    //copying canvas data and passing as snapshots value, this avoids dragging the form
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return; // if isDrawing is false return
    ctx.putImageData(snapshot, 0, 0,); //adding copied canvas to this canvas
    switch(selectedTool) {
        case 'brush':
            ctx.lineTo(e.offsetX, e.offsetY); // creating a line according to the mouse pointer
            ctx.stroke(); // drawing/filing the line with color
            break;
        case 'eraser':
            ctx.strokeStyle = "#fff";
            ctx.lineTo(e.offsetX, e.offsetY); // creating a line according to the mouse pointer
            ctx.stroke(); // drawing/filing the line with color
            break;
        case 'circle': 
            drawCircle(e);
            break;
        case 'triangle':
            drawTriangle(e);
            break;
        case 'rectangle':
            drawRect(e);
            break;
        case 'pentagon':
            drawPentagon(e);
            break;
        default: //brush
            ctx.lineTo(e.offsetX, e.offsetY); // creating a line according to the mouse pointer
            ctx.stroke(); // drawing/filing the line with color
            break;
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { //adding click event to all tool buttons
        //removing active class from the previous and adding it to the current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        //console.log(btn.id);
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); //passing slider value as brushwidth

colorsBtns.forEach(btn => {
    btn.addEventListener("click", () => { //adding click event to all color buttons
         //removing selected class from the previous and adding it to the current clicked option
         document.querySelector(".options .selected").classList.remove("selected");
         btn.classList.add("selected");
         //passing selected button background color as selectedcolor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    //passing picked color value from color picker to last color button
    colorPicker.parentElement.style.backgroundColor = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //cleaning the whole canvas
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`; //passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link to href value
    link.click(); //clicking link to download img
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing=false);
