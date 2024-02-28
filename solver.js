let items = document.querySelectorAll(".grid-item");

for (let i = 1; i < items.length + 1; i++) {
  // input.setSelectionRange(input.value.length, input.value.length);
  let ele = items[i - 1];
  let row = i % 9 == 0 ? Math.floor(i / 9) : Math.floor(i / 9) + 1;
  let col = i % 9 == 0 ? 9 : i % 9;
  ele.setAttribute("data-row", row);
  ele.setAttribute("data-col", col);
  ele.addEventListener("input", function (e) {
    let x = ele;

    let { value } = e.target;
    if (value > 9) e.target.value = Math.floor(e.target.value / 10);
    if (value > 0 && value <= 9) ele.classList.add("firstClick");
    if (e.target.value.length == 0) ele.classList.remove("firstClick");
    if (value == 0) e.target.value = "";
  });

  ele.addEventListener("focus", function (e) {
    for (let elem of items) {
      if (e.target.value > 0 && elem.value == e.target.value) {
        elem.classList.add("makeBold");
      } else elem.classList.remove("makeBold");
    }

    let nextRow = row,
      nextCol = col;
    ele.addEventListener("keydown", function (event) {
      if (
        event.key === "ArrowLeft"
      ) {
        nextCol = col > 1 ? col - 1 : 9;
        nextRow = col === 1 ? Math.max(row - 1, 1) : row;
      } else if (
        event.key === "ArrowRight"
      ) { 
        nextCol = col < 9 ? col + 1 : 1;
        nextRow = col === 9 ? Math.min(row + 1, 9) : row;
      } else if (event.key === "ArrowUp") nextRow = (row - 1 + 9) % 9;
      else if (event.key === "ArrowDown") nextRow = (row + 1) % 10;
      const nextCell = items[(nextRow - 1) * 9 + (nextCol - 1)];
      if (nextCell) {
        nextCell.focus();
      }
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
      }
    });

    for (let elem of items) {
      let tempRow = elem.getAttribute("data-row");
      let tempCol = elem.getAttribute("data-col");
      if (tempRow == row || tempCol == col) {
        elem.classList.add("focused");
        if (elem.value.length > 0 && (tempRow != row || tempCol != col))
          elem.classList.add("makePurple");
      }
    }
    ele.addEventListener("blur", function () {
      for (let elem of items) {
        elem.classList.remove("makeBold");
        if (
          elem.getAttribute("data-row") == row ||
          elem.getAttribute("data-col") == col
        ) {
          elem.classList.remove("focused");
          elem.classList.remove("makePurple");
        }
      }
    });
    ele.addEventListener("input", function (e) {
      for (let elem of items) {
        if (e.target.value > 0 && elem.value == e.target.value) {
          elem.classList.add("makeBold");
        } else elem.classList.remove("makeBold");
      }
    });
  });
}

let btn = document.querySelector(".ButtComp");
btn.addEventListener("click", solveSudoku);

function isValid(board, row, col, k) {
  board[row][col] = "";
  for (let i = 0; i < 9; i++) {
    const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const n = 3 * Math.floor(col / 3) + (i % 3);
    if (board[row][i] == k || board[i][col] == k || board[m][n] == k) {
      return false;
    }
  }
  board[row][col] = k;
  return true;
}

function sodokoSolver(data) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (data[i][j] == "") {
        for (let k = 1; k <= 9; k++) {
          if (isValid(data, i, j, `${k}`)) {
            data[i][j] = `${k}`;
            if (sodokoSolver(data)) {
              return true;
            } else {
              data[i][j] = "";
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}

function solveSudoku() {
  let n = 9;
  let twoD = Array.from({ length: n }, () =>
    Array.from({ length: n }).fill("")
  );

  for (let i = 1; i < items.length + 1; i++) {
    let ele = items[i - 1];
    let row = i % 9 == 0 ? Math.floor(i / 9) : Math.floor(i / 9) + 1;
    let col = i % 9 == 0 ? 9 : i % 9;
    row--, col--;
    twoD[row][col] = ele.value;
  }
  let z = 0;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (twoD[i][j] != "" && !isValid(twoD, i, j, twoD[i][j])) {
        z = 1;
        break;
      }
    }
    if (z) break;
  }
  if (!z) {
    let x = sodokoSolver(twoD);
    if (x) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          items[i * 9 + j].value = twoD[i][j];
        }
      }
      console.log("Sudoku puzzle solved successfully!");
      return;
    }
  }
  let popUp = document.querySelector("dialog");
  popUp.showModal();
  console.log("no solution");
  return;
}

let input = document.querySelector(".btn").addEventListener("click", () => {
  items[0].focus();
});

// let btnDialogue = document.querySelectorAll(".dial");
// console.log(btnDialogue[2]);
