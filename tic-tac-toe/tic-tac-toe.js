// Machine learning experiment for tic tac toe
// Written by Ken Kahn 
// No rights reserved.

async function tic_tac_toe() {
  const GAMES_PER_FIT = 100;
  const FIT_COUNT = 3;
  let model_players = [1, 2]; // by default model used for both playes
  const model = tf.sequential();
  let model_trained = false;
  let game_number = 0;

  model.add(tf.layers.dense({units: 1,
                             inputShape: [9],
                             activation: 'relu'}));
//   model.add(tf.layers.dense({units: 1,
//                              activation: 'relu'}));
//   model.add(tf.layers.dense({units: 1,
//                              activation: 'relu'}));

  model.compile({
      loss: 'meanSquaredError',
      optimizer: 'sgd'
  });

  let boards = [];
  let outcomes = [];
  const outcome_names = ["", "win for X", "win for O", "tie"];

  const play = function (game_history) {
      let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      let player = 1; // player 1 starts
      while (true) {
          move(player, board, game_history);
          player = player === 1 ? 2 : 1; // and next the other player will play
          let outcome = game_over(board);
          if (outcome && game_history) {
              boards = boards.concat(game_history);
              if (outcome === 3) {
                 // tied
                 game_outcomes = game_history.map(() => .5);
              } else if (outcome === 1) {
                 game_outcomes = game_history.map((ignore, index) => (index+1)%2);
              } else {
                 game_outcomes = game_history.map((ignore, index) => index%2);
              }
              outcomes = outcomes.concat(game_outcomes);
          }
          if (outcome) {
              game_number++;
              return outcome;
          }
      }
  };

  const move = function (player, board, history) {
      let possible_moves = empty_squares(board);
      let move;
      if (model_trained && model_players.indexOf(player) >= 0) {
          let best_move;
          let best_probability = 0;
          possible_moves.forEach(possible_move => {
              let board_copy = board.slice();
              board_copy[possible_move] = player;
              let board_tensor = tf.tensor2d(board_copy, [1, 9]);
              let probability_tensor = model.predict(board_tensor);
              let probability = probability_tensor.dataSync()[0];
              board_tensor.dispose();
              probability_tensor.dispose();
              if (probability > best_probability) {
                  best_move = possible_move;
                  best_probability = probability;
              }
          });
          move = best_move;
      }
      if (typeof move === 'undefined') {
          move = possible_moves[Math.floor(possible_moves.length*Math.random(possible_moves.length))];
      }
      board[move] = player;
      if (history) {
          history.push(board.slice());
      }
  };

  const empty_squares = function (board) {
      let indices = [];
      board.forEach((position, index) => {
          if (position === 0) {
              indices.push(index);
          }
      });
      return indices;
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
               let game_history = [];
               play(game_history);
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
          console.log(xs.shape, ys.shape, tf.memory().numTensors);
          await model.fit(xs, ys, {epochs: 250});
          model_trained = true;
          xs.dispose();
          ys.dispose();
//           console.log(tf.memory().numTensors);
      }
  };

  const play_random = function () {
      model_players = [Math.random() > .5 ? 1 : 2]; // just one player
      let outcome = play();
      if (outcome === model_players[0]) {
          return 1; // model won
      } else if (outcome === 2) { // tied
          return .5;
      } else {
          return 0; // lost
      } 
  }

  await play_self();

  const TRIAL_COUNT = 500;

  let model_wins = 0;
  for (let i = 0; i < TRIAL_COUNT; i++) {
      model_wins += play_random();
  }
  document.getElementById('output_div').innerHTML += (100*model_wins)/TRIAL_COUNT + "% wins<br>";


}

tic_tac_toe();