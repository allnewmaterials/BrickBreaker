let controlsmodal = document.getElementById("controls-modal");
let audiomodal = document.getElementById("audio-modal");
//var difficultymodal = document.getElementById("difficulty-modal");

let canvascovermodal = document.getElementById("canvas-cover");


function closeModal(modalID) {
  controlsmodal.style.display = "none";
  audiomodal.style.display = "none";
  //difficultymodal.style.display = "none";
  gameState = "pause";
}

function showModal(modalID){
  gameState = "modal";
  switch (modalID) {
    case "controls":
      controlsmodal.style.display = "block";
      break;
    case "audio":
      audiomodal.style.display = "block";
      break;
    case "difficulty":
      //difficultymodal.style.display = "block";
      break;
  }
}

window.onclick = function(event) {
  if (event.target == controlsmodal || event.target == audiomodal) {
    controlsmodal.style.display = "none";
    audiomodal.style.display = "none";
    //difficultymodal.style.display = "none";
  }
} 

function startGame() {
  console.log("asda");
  canvascovermodal.style.display = "none";
  gameState = "pause";
  
}

function rightMove(event) {
  if(event.key != leftKey && event.key != undefined){
    rightKey = event.key;  
    document.getElementById("controls-modal-text").innerHTML = event.key;
    controlsmodal.removeEventListener('keydown', rightMove);
    setTimeout(() => {     document.getElementById("controls-modal-text").innerHTML = ""; }, 1500);

  }    
}

function listenRight(){
  controlsmodal.addEventListener("keydown", rightMove);
  document.getElementById("controls-modal-text").innerHTML = "Listening right...";
}


function leftMove(event) {
  if(rightKey != event.key && event.key != undefined){
    console.log(event.key);
    leftKey = event.key;  
    document.getElementById("controls-modal-text").innerHTML = event.key;
    controlsmodal.removeEventListener('keydown', leftMove);
    setTimeout(() => {     document.getElementById("controls-modal-text").innerHTML = ""; }, 1500);

  }    
}

function listenLeft(){
  controlsmodal.addEventListener("keydown", leftMove, false);
  document.getElementById("controls-modal-text").innerHTML = "Listening left...";
}