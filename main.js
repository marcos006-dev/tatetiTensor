import * as tf from '@tensorflow/tfjs';

const tablero = document.getElementById('tablero');
const restartButton = document.getElementById('btnRestart');
// const btnPredecir = document.getElementById('btnPredecir');

let currentPlayer = 1;
let movesPlayed = 0;
let isGameStarted = true;
let modelo;
let valoresTablero = [0, 0, 0, 0, 0, 0, 0, 0, 0];
// let tableroParaJugarO = [0, 0, 0, 0, 0, 0, 0, 0, 0];

function setCells() {
  const cantidadCelda = 9;
  const contenidoCelda = `
        <div class="main__cell">
            <p class= "main__cell--text"></p>
        </div>
    `;

  let aux = '';
  for (let i = 1; i <= cantidadCelda; i++) {
    aux += contenidoCelda;
  }

  tablero.innerHTML = aux;
}

function restartGame() {
  for (let cell of tablero.children) {
    cell.children[0].innerHTML = '';
  }
  movesPlayed = 0;
  currentPlayer = 1;
  isGameStarted = true;
}

function checkMove(index) {
  const children = tablero.children;

  //Check Row
  if (index >= 0 && index <= 2) {
    if (
      children[0].children[0].innerHTML === children[1].children[0].innerHTML &&
      children[1].children[0].innerHTML === children[2].children[0].innerHTML &&
      children[2].children[0].innerHTML ===
        children[index].children[0].innerHTML
    ) {
      isGameStarted = false;
    }
  } else if (index >= 3 && index <= 5) {
    if (
      children[3].children[0].innerHTML === children[4].children[0].innerHTML &&
      children[4].children[0].innerHTML === children[5].children[0].innerHTML &&
      children[5].children[0].innerHTML ===
        children[index].children[0].innerHTML
    ) {
      isGameStarted = false;
    }
  } else {
    if (
      children[6].children[0].innerHTML === children[7].children[0].innerHTML &&
      children[7].children[0].innerHTML === children[8].children[0].innerHTML &&
      children[8].children[0].innerHTML ===
        children[index].children[0].innerHTML
    ) {
      isGameStarted = false;
    }
  }

  //Check Column
  if (
    children[0].children[0].innerHTML === children[3].children[0].innerHTML &&
    children[3].children[0].innerHTML === children[6].children[0].innerHTML &&
    children[6].children[0].innerHTML === children[index].children[0].innerHTML
  ) {
    isGameStarted = false;
  } else if (
    children[1].children[0].innerHTML === children[4].children[0].innerHTML &&
    children[4].children[0].innerHTML === children[7].children[0].innerHTML &&
    children[7].children[0].innerHTML === children[index].children[0].innerHTML
  ) {
    isGameStarted = false;
  } else if (
    children[2].children[0].innerHTML === children[5].children[0].innerHTML &&
    children[5].children[0].innerHTML === children[8].children[0].innerHTML &&
    children[8].children[0].innerHTML === children[index].children[0].innerHTML
  ) {
    isGameStarted = false;
  }

  //Check Diagonal
  if (
    children[0].children[0].innerHTML === children[4].children[0].innerHTML &&
    children[4].children[0].innerHTML === children[8].children[0].innerHTML &&
    children[8].children[0].innerHTML === children[index].children[0].innerHTML
  ) {
    isGameStarted = false;
  } else if (
    children[2].children[0].innerHTML === children[4].children[0].innerHTML &&
    children[4].children[0].innerHTML === children[6].children[0].innerHTML &&
    children[6].children[0].innerHTML === children[index].children[0].innerHTML
  ) {
    isGameStarted = false;
  }

  if (!isGameStarted) {
    swal({ title: `Ganó el jugador ${currentPlayer}`, icon: 'success' });
  } else if (currentPlayer === 1) {
    currentPlayer++;
  } else if (currentPlayer === 2) {
    currentPlayer--;
  }
}

function playerClick(cell, index) {
  // validar que la celda no este vacia
  if (!cell) return false;

  let value = cell.children[0].innerHTML;
  if (isGameStarted && value === '') {
    movesPlayed++;
    if (currentPlayer === 1) {
      cell.children[0].innerHTML = 'X';
      checkMove(index);
      valoresTablero[index] = -1;
      setTimeout(() => {
        predecirJugada();
      }, 100);
    } else if (currentPlayer === 2) {
      cell.children[0].innerHTML = 'O';
      checkMove(index);
      valoresTablero[index] = 1;
    }

    if (movesPlayed === 9 && isGameStarted) {
      swal({ title: 'Empate', icon: 'success' });
      isGameStarted = false;
    }
  }
}

function setEventListeners() {
  for (let i = 0; i < tablero.children.length; i++) {
    let cell = tablero.children[i];
    cell.addEventListener('click', function () {
      playerClick(this, i);
    });
  }
}

function setCellStyles() {
  const borderSize = 7;
  let borderStyle1 = `border-width: 0 ${borderSize}px ${borderSize}px 0`;
  let borderStyle2 = `border-width: 0 0 ${borderSize}px 0`;
  let borderStyle3 = `border-width: 0 ${borderSize}px 0 0`;

  for (let i = 0; i < tablero.children.length; i++) {
    switch (i) {
      case 0:
        tablero.children[i].style = borderStyle1;
        break;
      case 1:
        tablero.children[i].style = borderStyle1;
        break;
      case 2:
        tablero.children[i].style = borderStyle2;
        break;
      case 3:
        tablero.children[i].style = borderStyle1;
        break;
      case 4:
        tablero.children[i].style = borderStyle1;
        break;
      case 5:
        tablero.children[i].style = borderStyle2;
        break;
      case 6:
        tablero.children[i].style = borderStyle3;
        break;
      case 7:
        tablero.children[i].style = borderStyle3;
        break;
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setCells();
  setCellStyles();
  setEventListeners();
  cargarModelo();
  // boton reiniciar

  restartButton.addEventListener('click', function () {
    restartGame();
    // resetear variable
    valoresTablero = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  });

  //boton predecir
  // btnPredecir.addEventListener('click', function () {
  //   // console.log(valoresTablero);
  // });
});

const cargarModelo = () => {
  tf.ready().then(() => {
    const modelPath = './model/ttt_model.json';
    tf.tidy(() => {
      tf.loadLayersModel(modelPath).then((model) => {
        modelo = model;
      });
    });
  });
};

const predecirJugada = () => {
  // console.log(valoresTablero);
  const valoresX = tf.tensor(valoresTablero);

  const matches = tf.stack([valoresX]);

  const result = modelo.predict(matches);

  const resultArray = result.arraySync()[0];
  // console.log(resultArray);

  // obtener celdas del tablero y verificar si estan vacias y sino asginarle 0 a su valor correspondiente en el array
  for (let i = 0; i < tablero.children.length; i++) {
    if (tablero.children[i].children[0].innerHTML !== '') {
      resultArray[i] = 0;
    }
  }

  const elementoMayor = Math.max(...resultArray);
  const index = resultArray.indexOf(elementoMayor);

  // console.log(resultArray);
  // console.log(elementoMayor);
  // console.log(index);

  // encontrar la celda que corresponde al indice
  const cell = tablero.children[index];

  playerClick(cell, index);
  console.log(valoresTablero);
};
