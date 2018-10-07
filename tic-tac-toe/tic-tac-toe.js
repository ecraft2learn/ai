// Machine learning experiment for tic tac toe
// Written by Ken Kahn 
// No rights reserved.

((async function () {

let games_per_batch = 100;
let batch_count = 1;
let training_epochs = 50;
let evaluation_runs = 50;
let learning_rate = .0001;
let model_configuration = [100, 50, 20]; // later may add more options
let model_players = []; // if [1, 2] is model-versus-model

let model_trained = false;
const model = tf.sequential();

let data;
let batch_number;

const output_div = document.getElementById('output');

output_div.innerHTML =
    "<b>games between training: " + games_per_batch +
    "; number of trainings: " + batch_count +
    "; training training_epochs: " + training_epochs +
    "; evaluation runs: " + evaluation_runs +
    "; learning rate: " + learning_rate +
    "; dense layers: " + model_configuration +
    "; players using model: " + (model_players.length === 0 ? "none" : model_players) +
    "</b><br>";

const create_model = function (model_configuration, learning_rate) {
  // following inspired by https://github.com/johnflux/deep-learning-tictactoe/blob/master/play.py
  model_configuration.forEach((size, index) => {
      let configuration = {units: size,
                           activation: 'relu'};
      if (index === 0) {
          configuration.inputShape = [9];
      }
      model.add(tf.layers.dense(configuration));  
  });
  model.add(tf.layers.dense({units: 1,
                             activation: 'relu',
                             useBias: false}));
  model.compile({
      loss: 'meanSquaredError',
      optimizer: tf.train.adam(learning_rate)
  });
};

  const play = function (model_players, game_history) {
      let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      let player = 1; // player 1 starts
      while (true) {
          move(model_players, player, board, game_history);
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
              return outcome;
          }
      }
  };

  const move = function (model_players, player, board, history) {
      let possible_moves = empty_squares(board);
      let move;
      if (model_trained && model_players.indexOf(player) >= 0) {
          let best_move;
          let best_probability = 0;
          possible_moves.forEach(possible_move => {
              let board_copy = board.slice();
              board_copy[possible_move] = player;
              tf.tidy(() => {
                  let board_tensor = tf.tensor2d(board_copy, [1, 9]);
                  let probability_tensor = model.predict(board_tensor);
                  let probability = probability_tensor.dataSync()[0];
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
      for (batch_number = 0; batch_number < batch_count; batch_number++) {
          for (let game = 0; game < games_per_batch; game++) {
               let game_history = [];
               play(model_players, game_history);
          }
      }
  };

  const play_random = function () {
      let model_players = [Math.random() > .5 ? 1 : 2]; // just one player
      let outcome = play(model_players);
      if (outcome === model_players[0]) {
          return 1; // model won
      } else if (outcome === 2) { // tied
          return .5;
      } else {
          return 0; // lost
      } 
  }

  const model_versus_random = function (trial_count) {
    let model_wins = 0;
    let model_ties = 0;
    let model_losses = 0;
    for (let i = 0; i < trial_count; i++) {
        let won = play_random();
        if (won === 1) {
            model_wins++;
        } else if (won === 0) {
            model_losses++;
        } else {
            model_ties++;
        }
    }
    output_div.innerHTML += 
        (100*model_wins)/trial_count + "% wins; " +
        (100*model_ties)/trial_count + "% ties; " + 
        (100*model_losses)/trial_count + "% losses; " +
        "<br>";
  };

let boards = [];
let outcomes = [];

const create_data = async function () {
  boards = [];
  outcomes = [];
  await play_self();
  return {boards: boards,
          outcomes: outcomes};
};

const train_model = async function (data) {
  const xs = tf.tensor2d(data.boards);
  const ys = tf.tensor2d(data.outcomes, [data.outcomes.length, 1]);
  // Train the model using the data.
  console.log(xs.shape, ys.shape, tf.memory().numTensors);
  let start = Date.now();
  await model.fit(xs, ys, {epochs: training_epochs});
  let duration = Math.round((Date.now()-start)/1000);
  model_trained = true;
  xs.dispose();
  ys.dispose();
  tf.tidy(() => {
      output_div.innerHTML += 
          "<br>Games played " + (batch_number+1)*games_per_batch + " last training, Duration " + duration + " seconds<br>";
          let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (let i = 0; i < 9; i++) {
              board[i] = 1;
              let prediction = Math.round(100*model.predict(tf.tensor2d(board, [1, 9])).dataSync()[0]);
              board[i] = 0;
              if (prediction < 10) {
                  output_div.innerHTML += "&nbsp;";
              }
              output_div.innerHTML += prediction;
              if ((i+1)%3 !== 0) {
                  output_div.innerHTML += " | ";
              } else if (i < 8) {
                  output_div.innerHTML += "<br>&nbsp;------------&nbsp;<br>";
              } else {
                   output_div.innerHTML += "<br>";
              }
          }
          model_versus_random(evaluation_runs);                
      });
};

const moves_to_html = function (moves, board) {
  let html = "";
  for (let i = 0; i < 9; i++) {
    html += board[i] === 1 ? "&nbsp;X" : "&nbsp;O";
    html += "<sub>" + (moves.indexOf(i)+1) + "</sub>"; // +1 for 1-indexing
    if ((i+1)%3 !== 0) {
        html += " | ";
    } else if (i < 8) {
        html += "<br>&nbsp;&nbsp;------------------&nbsp;<br>";
    } else {
        html += "<br>";
    }
  }
  return html;
}

const surface = tfvis.visor().surface({name: 'Tic Tac Toe', tab: 'Input Data'});
const draw_area = surface.drawArea;
    
const show_examples = async function () {
    const please_wait = document.createElement('p');
    const game_element = document.createElement('p');
    please_wait.innerHTML = "Please wait.";
    draw_area.appendChild(please_wait);
    data = await create_data();
    please_wait.remove();
    draw_area.appendChild(game_element);
    const show_random_game_button = document.createElement('button');
    show_random_game_button.innerHTML = "Show a random game";
    show_random_game_button.className = "support-window-button";
    const show_random_game = function () {
      let board_number = Math.floor(Math.random()*data.boards.length);
      let board = data.boards[board_number];
      let board_without_blanks;
      const board_difference = function (previous_board, current_board) {
        for (let i = 0; i < 9; i++) {
          if (previous_board[i] !== current_board[i]) {
            return i;
          }
        }
      };
      // go back to the first move
      while (true) {
         board_without_blanks = board.filter(position => position !== 0);
         if (board_without_blanks.length === 1) {
           break;
         }
         board_number--;
         board = data.boards[board_number];
      }
      let moves = [];
      let previous_board = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // empty board
      while (true) {
        moves.push(board_difference(previous_board, board));
        previous_board = board;
        board_number++;
        board = data.boards[board_number];
        if (board.filter(position => position !== 0).length === 1) {
          // next game 
          break;
        }
      }
      game_element.innerHTML = moves_to_html(moves, data.boards[board_number-1]);                            
    };
    show_random_game_button.addEventListener('click', show_random_game);
    draw_area.appendChild(show_random_game_button);
    draw_area.appendChild(game_element);
};

document.getElementById('create_data').addEventListener('click', show_examples);

  create_model(model_configuration, learning_rate);

  data = await create_data();

  await train_model(data);

  console.log(tf.memory());
  
}()));
