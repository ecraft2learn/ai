// Machine learning experiment for tic tac toe
// Written by Ken Kahn 
// No rights reserved.

async function tic_tac_toe() {
  const GAMES_PER_FIT = 5;
  const FIT_COUNT = 100;
  const model = tf.sequential();
  let model_trained = false;
  let game_number = 0;

  model.add(tf.layers.dense({units: 1,
                             inputShape: [9],
                             activation: 'relu'}));

  model.compile({
      loss: 'meanSquaredError',
      optimizer: 'sgd'
  });

  let boards = [];
  let outcomes = [];
  const outcome_names = ["", "win for X", "win for O", "tie"];

  const play = function () {
      let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      let player = 1; // player 1 starts
      let game_history = [];
      while (true) {
          move(player, board, game_history);
          player = player === 1 ? 2 : 1;
          let outcome = game_over(board);
          if (outcome) {
              boards = boards.concat(game_history);
              if (outcome === 3) {
                 // tied
                 game_outcomes = game_history.map(() => 2);
              } else if (outcome === 1) {
                 game_outcomes = game_history.map((ignore, index) => (index+1)%2);
              } else {
                 game_outcomes = game_history.map((ignore, index) => index%2);
              }
              outcomes = outcomes.concat(game_outcomes);
              game_number++;
              break;
          }
      }
  };

  const moves = function (board) {
      let indices = [];
      board.forEach((position, index) => {
          if (position === 0) {
              indices.push(index);
          }
      });
      return indices;
  };

  const move = function (player, board, history) {
      let possible_moves = moves(board);
      let move;
      if (model_trained) {
          let best_move;
          let best_probability = 0;
          tf.tidy(() => {
              possible_moves.forEach(possible_move => {
                  let board_copy = board.slice();
                  board_copy[possible_move] = player;
                  let probability = model.predict(tf.tensor2d(board_copy, [1, 9])).dataSync()[0];
                  if (probability > best_probability) {
                      best_move = possible_move;
                      best_probability = probability;
                  }
              });
          });
          move = best_move;
      }
      if (typeof move === 'undefined') {
          move = possible_moves[Math.floor(possible_moves.length*Math.random(possible_moves.length))];
      }
      board[move] = player;
      history.push(board.slice());
  };

  const wins =
      [[0, 1, 2],
       [3, 4, 5],
       [6, 7, 8],
       [0, 3, 6],
       [1, 4, 7],
       [2, 5, 8],
       [0, 4, 8],
       [2, 4, 6]];

  const game_over = function (board) {
      // returns 1, 2, or 3 (for tie)
      let result;
      wins.some(win => {
          if (win.every(position => board[position] === 1)) {
              result = 1;
              return true;
          }
          if (win.every(position => board[position] === 2)) {
              result = 2;
              return true;
          }
      });
      if (result) {
          return result;
      }
      if (board.indexOf(0) < 0) {
          // no empty squares left
          return 3;
      }
  };

  const play_self = async function () {
      for (let fit = 0; fit < FIT_COUNT; fit++) {
          for (let game = 0; game < GAMES_PER_FIT; game++) {
               play();
          }
          if (model_trained) {
              tf.tidy(() => {
                  let corner  = model.predict(tf.tensor2d([1, 0, 0, 0, 0, 0, 0, 0, 0], [1, 9])).dataSync()[0];
                  let center  = model.predict(tf.tensor2d([0, 0, 0, 0, 1, 0, 0, 0, 0], [1, 9])).dataSync()[0];
                  let neither = model.predict(tf.tensor2d([0, 1, 0, 0, 0, 0, 0, 0, 0], [1, 9])).dataSync()[0];
                  document.getElementById('output_div').innerHTML += 
                      "Game#" + game_number + 
                      " corner: "  + Math.round(100*corner) + 
                      " center: "  + Math.round(100*center) +
                      " neither: " + Math.round(100*neither) + "<br>";
              });
          }
          const xs = tf.tensor2d(boards);
          const ys = tf.tensor2d(outcomes, [outcomes.length, 1]);
          // collect next batch of boards and outcomes
          boards = [];
          outcomes = [];
          // Train the model using the data.
          await model.fit(xs, ys, {epochs: 250});
          model_trained = true;
          tf.dispose(xs);
          tf.dispose(ys);
          console.log(tf.memory().numTensors);
      }
  };

  await play_self();

}

tic_tac_toe();