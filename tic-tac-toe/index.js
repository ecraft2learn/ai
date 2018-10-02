// Machine learning experiment for tic tac toe
// Written by Ken Kahn 
// No rights reserved.

async function tic_tac_toe() {
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 1,
                             inputShape: [9],
                             activation: 'relu'}));

  model.compile({
      loss: 'meanSquaredError',
      optimizer: 'sgd'
  });

  let boards = [];
  let outcomes = [];

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
                 game_outcomes = game_history.map(ignore => 2);
              } else if (outcome === 1) {
                 game_outcomes = game_history.map((ignore, index) => (index+1)%2);
              } else {
                 game_outcomes = game_history.map((ignore, index) => index%2);
              }
              outcomes = outcomes.concat(game_outcomes);
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
      let move = possible_moves[Math.floor(possible_moves.length*Math.random(possible_moves.length))];
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

  for (let i = 0; i < 2; i++) {
      play();
  }

  const xs = tf.tensor2d(boards);
  const ys = tf.tensor2d(outcomes, [outcomes.length, 1]);

  // Train the model using the data.
  await model.fit(xs, ys, {epochs: 250});

  let prediction_1 = model.predict(tf.tensor2d([1, 0, 0, 0, 0, 0, 0, 0, 0], [1, 9])).dataSync();
  document.getElementById('output_div_1').innerHTML += prediction_1 + "<br>";

  let prediction_2 = model.predict(tf.tensor2d([0, 0, 0, 0, 1, 0, 0, 0, 0], [1, 9])).dataSync();
  document.getElementById('output_div_2').innerHTML += prediction_2 + "<br>";

}

tic_tac_toe();