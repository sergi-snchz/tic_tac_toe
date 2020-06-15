const game_modal = document.getElementById("game-modal");
const game = document.getElementById("game");
const play_again_btn = document.querySelector("#container #play-again div button");
const play_again_div = document.getElementById("play-again");
const play_again_p = document.querySelector("#container #play-again p");
const game_grid = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9"
};

let player_choice;
let computer_choice;
let is_first_move = true;

function main() {
  // Event Listeners
  game_modal.addEventListener("click", choice);
  player_selection();
}

function selection(event_obj) {
  if (event_obj.target.id !== "game") {
    event_obj.target.innerText = player_choice;
    game_grid[event_obj.target.id] = player_choice;
    if (is_winner(game_grid)) {
      // game_over("You Have Won! Congratulations!");
      setTimeout(game_over.bind(null, "You Have Won! Congratulations!"), 1000);
    }
    is_first_move = false;
    computer_selection();
  }
}

function is_winner(game_grid) {
  if ((game_grid[1] === game_grid[2] && game_grid[1] == game_grid[3]) || 
  (game_grid[1] === game_grid[5] && game_grid[1] == game_grid[9]) || 
  (game_grid[1] === game_grid[4] && game_grid[1] == game_grid[7]) ||
  (game_grid[2] === game_grid[5] && game_grid[2] == game_grid[8]) ||
  (game_grid[3] === game_grid[6] && game_grid[3] == game_grid[9]) ||
  (game_grid[3] === game_grid[5] && game_grid[3] == game_grid[7]) ||
  (game_grid[4] === game_grid[5] && game_grid[4] == game_grid[6]) ||
  (game_grid[7] === game_grid[8] && game_grid[7] == game_grid[9])) {
    return true;
  }
  return false;
}

function choice(event_obj) {
  if (event_obj.target.tagName === "BUTTON") {
    player_choice = event_obj.target.id;
    computer_choice = player_choice === "X" ? "O" : "X";
    const flip = check_who_starts();
    if (flip === 0) {
      computer_selection();
    }
    game.style.display = "grid";
    game_modal.style.display = "none";
  }
}

function computer_selection() {
  let id;
  let made_a_move = false;
  // Check if the computer has two in a row to win
  const can_win = has_two_in_a_row(computer_choice, player_choice, game_grid);
  if (can_win.length) {
    id = can_win[0];
    computer_placement(id);
    setTimeout(game_over.bind(null, "You Have Lost!"), 1000);
    made_a_move = true;
  }

  // Check if the player has two in a row to win
  const can_lose = has_two_in_a_row(player_choice, computer_choice, game_grid);
  if (!made_a_move && can_lose.length) {
    id = can_lose[0];
    computer_placement(id);
    made_a_move = true;
  }

  // Check if the computer can fork the game 
  const computer_fork = fork(computer_choice, player_choice);
  if (!made_a_move && computer_fork) {
    id = computer_fork;
    computer_placement(id);
    made_a_move = true;
  }

  // Check if the player can fork the game
  const player_fork = fork(player_choice, computer_choice);
  if (!made_a_move && player_fork) {
    id = player_fork;
    computer_placement(id);
    made_a_move = true;
  }

  // Check if the center spot is available
  if (!made_a_move && is_center_available() && !is_first_move) {
    computer_placement(5);
    made_a_move = true;
  }

  // Check if the opposite corner is available
  const opposite = opposite_corner();
  if (!made_a_move && opposite) {
    id = opposite;
    computer_placement(id);
    made_a_move = true;
  }

  // Check if an empty corner is available
  const empty = empty_corner();
  if (!made_a_move && empty) {
    id = empty;
    computer_placement(id);
    made_a_move = true;
    is_first_move = false;
  }

  // Check if an empty side is available
  const side = empty_side();
  if (!made_a_move && side) {
    id = side;
    computer_placement(id);
  }

  if (is_board_full()) {
    setTimeout(game_over.bind(null, "It's A Draw"), 1000)
    // game_over("It's A Draw");
  };
}

function computer_placement(id) {
  const div = document.getElementById(id);
  div.innerText = computer_choice;
  game_grid[id] = computer_choice;
}

function player_selection() {
  // Check is board is full and thus the game is over
  game.addEventListener("click", selection);
}

// check if player (or comouter) has two in a row
function has_two_in_a_row(selection, other_selection, grid) {
  const winner_arr = [];
  if (((grid[1] === selection && grid[2] === selection) || (grid[9] === selection && grid[6] === selection) || (grid[5] === selection && grid[7] === selection)) && grid[3] !== other_selection) {
    winner_arr.push(3);
  }
  
  if (((grid[1] === selection && grid[3] == selection) || (grid[8] === selection && grid[5] === selection)) && grid[2] !== other_selection) {
    winner_arr.push(2);
  } 

  if (((grid[3] === selection && grid[2] === selection) || (grid[5] === selection && grid[9] === selection) || (grid[4] === selection && grid[7] === selection))  && grid[1] !== other_selection) {
    winner_arr.push(1);
  }

  if (((grid[1] === selection && grid[5] === selection) || (grid[7] === selection && grid[8] === selection) || (grid[3] === selection && grid[6] === selection))  && grid[9] !== other_selection) {
    winner_arr.push(9);
  }

  if (((grid[1] === selection && grid[9] === selection) || (grid[2] === selection && grid[8] === selection) || (grid[4] === selection && grid[6] === selection) || (grid[3] === selection && grid[7] === selection)) && grid[5] !== other_selection) {
    winner_arr.push(5);
  }

  if (((grid[1] === selection && grid[4] === selection) || (grid[3] === selection && grid[5] === selection) || (grid[9] === selection && grid[8] === selection)) && grid[7] !== other_selection) {
    winner_arr.push(7);
  }

  if (((grid[1] === selection && grid[7] === selection) || (grid[5] === selection && grid[6] === selection)) && grid[4] !== other_selection) {
    winner_arr.push(4);
  }

  if (((grid[2] === selection && grid[5] === selection) || (grid[7] === selection && grid[9] === selection)) && grid[8] !== other_selection) {
    winner_arr.push(8);
  }

  if (((grid[3] === selection && grid[9] === selection) || (grid[4] === selection && grid[5] === selection)) && grid[6] !== other_selection) {
    winner_arr.push(6);
  }

  return winner_arr;
}

// for each of the empty cells fill it (in a copy) and run has_two_in_a_row() to see if two places are in a row.
function fork(selection, other_selection) {
  const game_grid_copy = {...game_grid};
  for (const key in game_grid_copy) {
    if (game_grid_copy[key] !== "X" && game_grid_copy[key] !== "O") {
      game_grid_copy[key] = selection;
      if (has_two_in_a_row(selection, other_selection, game_grid_copy).length > 1) {
        return has_two_in_a_row(selection, other_selection, game_grid_copy)[0];
      } 
      game_grid_copy[key] = "dummy";
    }
  }
  return 0;
}

function is_center_available() {
  return game_grid[5] !== "O" && game_grid[5] !== "X";
}

function opposite_corner() {
  if (game_grid[1] === player_choice && game_grid[9] !== player_choice && game_grid[9] !== computer_choice) {
    return 9;
  }

  if (game_grid[9] === player_choice && game_grid[1] !== player_choice && game_grid[1] !== computer_choice) {
    return 1;
  }

  if (game_grid[3] === player_choice && game_grid[7] !== player_choice && game_grid[7] !== computer_choice) {
    return 7;
  }

  if (game_grid[7] === player_choice && game_grid[3] !== player_choice && game_grid[3] !== computer_choice) {
    return 3;
  }
  return 0
}

// Play in an empty corner
function empty_corner() {
  if (game_grid[1] !== "X" && game_grid[1] !== "O") {
    return 1;
  }

  if (game_grid[3] !== "X" && game_grid[3] !== "O") {
    return 3;
  }

  if (game_grid[7] !== "X" && game_grid[7] !== "O") {
    return 7;
  }

  if (game_grid[9] !== "X" && game_grid[9] !== "O") {
    return 9;
  }
  return 0;
}

// Play in an empty side
function empty_side() {
  if (game_grid[2] !== "X" && game_grid[2] !== "O") {
    return 2;
  }

  if (game_grid[4] !== "X" && game_grid[4] !== "O") {
    return 4;
  }

  if (game_grid[6] !== "X" && game_grid[6] !== "O") {
    return 6;
  }

  if (game_grid[8] !== "X" && game_grid[8] !== "O") {
    return 8;
  }
  return 0;
}

// Restart Game
function restart_game() {
  for (const key in game_grid) {
    game_grid[key] = key.toString();
  }
  play_again_div.style.display = "none";
  // game.style.display = "grid";
  game_modal.style.display = "flex";
  const clear_board = document.querySelectorAll("#container #game div");
  for (let div of clear_board) {
    div.innerText = "";
  }
}

function is_draw() {
  for (const key in game_grid) {
    if (game_grid[key] !== "X" && game_grid[key] !== "O") {
      return false;
    }
  }
  return true;
}

function check_who_starts() {
  return Math.floor(Math.random() * 2);
}

function is_board_full() {
  for (const key in game_grid) {
    if (game_grid[key] !== "X" && game_grid[key] !== "O") {
      return false;
    }
  }
  return true;
}

function game_over(message) {
  game.style.display = "none";
  play_again_p.innerText = message;
  play_again_div.style.display = "flex";
  play_again_btn.addEventListener("click", restart_game);
  is_first_move = true;
}

main();