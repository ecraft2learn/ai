// Machine learning experiment for tic tac toe
// Written by Ken Kahn 
// No rights reserved.

((async function () {

// let games_per_batch = 100;
// let batch_count = 1;
// let training_epochs = 50;
// let evaluation_runs = 50;
// let learning_rate = .0001;
// let model_configuration = [100, 50, 20]; // later may add more options
// let model_players = []; // if [1, 2] is model-versus-model

let model_trained = false;
let model;

let data;
let batch_number;

const settings_element = document.getElementById('settings');
const create_data_button = document.getElementById('create_data');
const create_model_button = document.getElementById('create_model');
const train_button = document.getElementById('train');
const evaluate_button = document.getElementById('evaluate');

const create_model = function (model_configuration, learning_rate) {
  // following inspired by https://github.com/johnflux/deep-learning-tictactoe/blob/master/play.py
  model = tf.sequential();
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

  const play = function (model_players, game_history, non_deterministic) {
      let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      let player = 1; // player 1 starts
      while (true) {
          move(model_players, player, board, game_history, non_deterministic);
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

const move = function (model_players, player, board, history, non_deterministic) {
      let possible_moves = empty_squares(board);
      let move;
      if (model_trained && model_players.indexOf(player) >= 0) {
          let best_move;
          let best_probability = 0;
          let predictions = [];
          possible_moves.forEach(possible_move => {
              let board_copy = board.slice();
              board_copy[possible_move] = player;
              tf.tidy(() => {
                  let board_tensor = tf.tensor2d(board_copy, [1, 9]);
                  let probability_tensor = model.predict(board_tensor);
                  let probability = probability_tensor.dataSync()[0];
                  predictions.push(probability);
                  if (probability > best_probability) {
                      best_move = possible_move;
                      best_probability = probability;
                  }           
              });
          });
          if (non_deterministic) {
              predictions = predictions.sort().reverse(); // consider the most likely first
              const sum = predictions.reduce((accumulator, value) => accumulator + value);
              predictions.some((prediction, index) => {
                 if (Math.random() <= prediction/sum) {
                     best_move = possible_moves[index]
                     return true;
                 }
              });
          }
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

const play_self = async function (number_of_games, model_players, non_deterministic) {
    let x_wins = 0;
    let ties = 0;
    let x_losses = 0;
    for (let game = 0; game < number_of_games; game++) {
         let game_history = [];
         let outcome = play(model_players, game_history, non_deterministic);
         switch (outcome) {
           case 1: 
             x_wins++;
             break;
           case 2:
             x_losses++;
             break;
           case 3:
             ties++;
             break;
         }
    }
    return {x_wins: x_wins,
            ties: ties,
            x_losses: x_losses};
};

// const play_random = function () {
//       let model_players = [Math.random() > .5 ? 1 : 2]; // just one player
//       let outcome = play(model_players);
//       if (outcome === model_players[0]) {
//           return 1; // model won
//       } else if (outcome === 2) { // tied
//           return .5;
//       } else {
//           return 0; // lost
//       } 
// };

// const model_versus_random = function (trial_count) {
//     let model_wins = 0;
//     let model_ties = 0;
//     let model_losses = 0;
//     for (let i = 0; i < trial_count; i++) {
//         let won = play_random();
//         if (won === 1) {
//             model_wins++;
//         } else if (won === 0) {
//             model_losses++;
//         } else {
//             model_ties++;
//         }
//     }
//     return {wins: model_wins,
//             ties: model_ties,
//             losses: model_losses};
// };

let boards = [];
let outcomes = [];

const create_data = async function (number_of_games, model_players) {
  boards = [];
  outcomes = [];
  let statistics;
  let random_versus_random = model_players.length === 0;
  let model_versus_model = typeof model_players[0] === 'number';
  let non_deterministic = gui_state["Evaluation"]["Use probabilities instead of best move"] === 'true'; 
  if (random_versus_random || model_versus_model) {
      statistics = await play_self(number_of_games, model_players, non_deterministic);
  } else {
      // run half with model player being first
      let plays_first  = await play_self(number_of_games/2, [1], non_deterministic);
      let last_board_with_model_playing_x = boards.length;
      let plays_second = await play_self(number_of_games/2, [2], non_deterministic);
      statistics = {x_wins:   plays_first.x_wins + plays_second.x_wins,
                    x_losses: plays_first.x_losses + plays_second.x_losses,
                    model_wins:   plays_first.x_wins   + plays_second.x_losses,
                    model_losses: plays_first.x_losses + plays_second.x_wins,
                    ties: plays_first.ties + plays_second.ties,
                    last_board_with_model_playing_x: last_board_with_model_playing_x};
  }
  return {boards: boards,
          outcomes: outcomes,
          statistics: statistics};
};

const train_model = async function (data, epochs) {
  const xs = tf.tensor2d(data.boards);
  const ys = tf.tensor2d(data.outcomes, [data.outcomes.length, 1]);
  // callbacks based upon https://storage.googleapis.com/tfjs-vis/mnist/dist/index.html
  const epoch_history = [];
  const callbacks = {onEpochEnd: async (epoch, h) => {
                                     epoch_history.push(h);
                                     tfvis.show.history({name: 'Error rate', tab: 'Training' },
                                                        epoch_history,
                                                        ['loss']);
                                  }};
  // Train the model using the data.
  let start = Date.now();
  await model.fit(xs,
                  ys, 
                  {epochs: epochs,
                   callbacks: callbacks});
  let duration = Math.round((Date.now()-start)/1000);
  model_trained = true;
  xs.dispose();
  ys.dispose();
  return {duration: duration,
          loss: epoch_history[epochs-1].loss};
};

const moves_to_html = function (moves, board) {
  let html = "";
  for (let i = 0; i < 9; i++) {
    let move_number = moves.indexOf(i);
    if (move_number >= 0) {
        html += board[i] === 1 ? "&nbsp;X" : "&nbsp;O";
        html += "<sub>" + (move_number+1) + "</sub>"; // +1 for 1-indexing
    } else {
        // otherwise empty square at end of game_history
        html += "&nbsp;&nbsp;&nbsp;&nbsp;";
    }
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

const random_game_display = function (boards) {
    let board_number = Math.floor(Math.random()*boards.length);
    let board = boards[board_number];
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
         if (board_without_blanks.length === 1) { // first move
             break;
         }
         board_number--;
         board = boards[board_number];
    }
    let moves = [];
    let previous_board = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // empty board
    while (true) {
        moves.push(board_difference(previous_board, board));
        previous_board = board;
        board_number++;
        board = boards[board_number];
        if (game_over(board)) {
            // add last move to moves
            moves.push(board_difference(previous_board, board)); 
            break;
        }
    }
    let element = document.createElement('div');
    element.innerHTML = "<br>" + moves_to_html(moves, board);
    return element;
};

const replace_button_results = function(element, child) {
    if (element.firstChild.nextSibling) {
        element.firstChild.nextSibling.remove();
    }
    element.appendChild(child);
};

const create_data_interface = async function(button_label, number_of_games_function, interface_element, model_players) {
  const play_games = async function () {
    const message = document.createElement('p');
    message.innerHTML = "Please wait.";
    button.appendChild(message);
    setTimeout(async function () {
      // without the timeout the please wait message isn't seen
      let number_of_games = number_of_games_function();
      if (number_of_games%2 === 1) {
          number_of_games++; // make it even in case need to split it in two
      }
      let new_data = await create_data(number_of_games, model_players);
      if (!data || gui_state["Evaluation"]["Replace training data with these games"] === 'true') {
          data = new_data;
      } else {
          let merged_data = {boards: data.boards.concat(new_data.boards),
                             outcomes: data.outcomes.concat(new_data.outcomes),
                             statistics: new_data.statistics};
          data = merged_data;
      }
      let boards = data.boards; // buttons showing games closes over this
      create_model_button.disabled = false; // there is data so can move forward (though really only training needs data)
      message.style.font = "Courier"; // looks better with monospaced font
      let statistics = data.statistics;
      message.innerHTML = 
          number_of_games + " games created.<br>" +
          "X wins = " + statistics.x_wins + " ("   + Math.round(100*statistics.x_wins/number_of_games) +"%); " +
          "O wins = " + statistics.x_losses + " (" + Math.round(100*statistics.x_losses/number_of_games) +"%); " +
          "Ties = "   + statistics.ties + " ("     + Math.round(100*statistics.ties/number_of_games) + "%)<br>";
      if (typeof statistics.model_wins === 'undefined') {
          const show_random_game_button = 
              create_button(model_players.length === 0 ? "Show a two random players game" : "Show a trained player versus self game",
                            function () {
                                replace_button_results(show_random_game_button,
                                                       random_game_display(boards));
                            });
          interface_element.appendChild(show_random_game_button);
      } else {
          message.innerHTML +=
              "<b>Trained model: </b>" +
              "Wins = " + statistics.model_wins + " (" + Math.round(100*statistics.model_wins/number_of_games) + "%); " +
              "Losses = " + statistics.model_losses + " (" + Math.round(100*statistics.model_losses/number_of_games) + "%)<br>";
          const show_model_playing_x_button = 
              create_button("Show a game where trained player was X",
                            function () {
                                const playing_first_boards = boards.slice(0, statistics.last_board_with_model_playing_x);
                                replace_button_results(show_model_playing_x_button,
                                                       random_game_display(playing_first_boards));
                            });
          interface_element.appendChild(show_model_playing_x_button);
          const show_model_playing_o_button = 
              create_button("Show a game where trained player was O",
                            function () {
                                const playing_second_boards = boards.slice(statistics.last_board_with_model_playing_x);
                                 replace_button_results(show_model_playing_o_button,
                                                        random_game_display(playing_second_boards));
                            });
          interface_element.appendChild(show_model_playing_o_button);
      }
    });
  };
  let button = create_button(button_label, play_games);
  interface_element.appendChild(button);
};

let parameters_tabs;

const create_data_with_parameters = async function () {
    const surface = tfvis.visor().surface({name: 'Tic Tac Toe', tab: 'Input Data'});
    const draw_area = surface.drawArea;
//     draw_area.innerHTML = ""; // reset if rerun
    if (!parameters_tabs) {
        // first time this is run
        parameters_tabs = parameters_interface();
        create_data_interface("Play random player against random player",
                              () => Math.round(gui_state["Input data"]["Random player versus random player games"]),
                              draw_area,
                              []); // no players use the model
        parameters_tabs.input_data.open();
    } else {
//         surface.label.click();
    }
};

let create_model_with_current_settings_button;

const create_model_with_parameters = function () {
  const surface = tfvis.visor().surface({name: 'Tic Tac Toe', tab: 'Define model'});
  const draw_area = surface.drawArea;
  parameters_tabs.model.open();
  const create_model_with_current_settings = function () {
      let model_configuration = [Math.round(gui_state["Model"]["Size of first layer"])];
      if (gui_state["Model"]["Size of second layer"] > .5) {
        model_configuration.push(Math.round(gui_state["Model"]["Size of second layer"]));
      }
      if (gui_state["Model"]["Size of third layer"] > .5) {
        model_configuration.push(Math.round(gui_state["Model"]["Size of third layer"]));
      }
      create_model(model_configuration, gui_state["Model"]["Learning rate"]);
      train_button.disabled = false;
      let ready = document.createElement('div');
      ready.innerHTML = "<br>A new model created and is ready to be trained.";
      draw_area.appendChild(ready);    
  };
  if (!create_model_with_current_settings_button) {
      create_model_with_current_settings_button = 
          create_button("Create model with current settings", create_model_with_current_settings);
      draw_area.appendChild(create_model_with_current_settings_button);    
  }
};

let train_with_current_settings_button;

const train_with_parameters = async function () {
  const surface = tfvis.visor().surface({name: 'Tic Tac Toe', tab: 'Training'});
  const draw_area = surface.drawArea;
  const train_with_current_settings = async function () {
    let message = document.createElement('div');
    message.innerHTML = "<br>Training started. Learning from " + data.boards.length + " game moves. Please wait.";
    draw_area.appendChild(message);
    setTimeout(async function () {
        // without the timeout the message above isn't displayed
        let {duration, loss} = await train_model(data, Math.round(gui_state["Training"]["Number of iterations"]));
        message.innerHTML = "<br>Training took " + duration + " seconds. Final error rate is " + Math.round(100*loss) +"%.";
        evaluate_button.disabled = false;       
    });
  };
  parameters_tabs.training.open();
  if (!train_with_current_settings_button) {
      train_with_current_settings_button = create_button("Train model with current settings", train_with_current_settings);
      draw_area.appendChild(train_with_current_settings_button);    
  }
};

const evaluate_training = function () {
  const surface = tfvis.visor().surface({name: 'Tic Tac Toe', tab: 'Evaluation'});
  const draw_area = surface.drawArea;
  draw_area.innerHTML = ""; // reset if evaluation button pressed again
  const display = document.createElement('div');
  const show_first_moves = function () {
    tf.tidy(() => {
      let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      let html = "<br>";
      for (let i = 0; i < 9; i++) {
          board[i] = 1;
          let prediction = Math.round(100*model.predict(tf.tensor2d(board, [1, 9])).dataSync()[0]);
          board[i] = 0;
          if (prediction < 10) {
              html += "&nbsp;";
          }
          html += prediction;
          if ((i+1)%3 !== 0) {
              html += " | ";
          } else if (i < 8) {
              html += "<br>&nbsp;------------&nbsp;<br>";
          } else {
              html += "<br>";
          }
      }
      display.innerHTML = html;
      display.style.font = "Courier"; // looks better with monospaced font
//       show_first_move_scores_button.remove();                 
    });
  };
  const show_first_move_scores_button = create_button("Show the scores for different first moves", show_first_moves);
  draw_area.appendChild(show_first_move_scores_button);
  show_first_move_scores_button.appendChild(display);
  parameters_tabs.evaluation.open();
  create_data_interface("Play trained player against random player",
                        () => Math.round(gui_state["Evaluation"]["Games with trained versus random player"]),
                        draw_area,
                        [[1], [2]]); // split the games between trained player going first or not
  create_data_interface("Play trained player against itself",
                        () => Math.round(gui_state["Evaluation"]["Games with trained versus self"]),
                        draw_area,
                        [1, 2]); // both players use the model
};

const gui_state = 
  {"Input data": {"Random player versus random player games": 100},
   "Model": {"Learning rate": .001,
             "Size of first layer": 100,
             "Size of second layer": 50,
             "Size of third layer": 20},
   "Training": {"Number of iterations": 120},
   "Testing": {},
   "Evaluation": {"Games with trained versus random player": 100,
                  "Games with trained versus self": 100,
                  "Use probabilities instead of best move": true,
                  "Replace training data with these games": false}
};

const parameters_interface = function () {
  const parameters_gui = new dat.GUI({width: 600,
                                      autoPlace: false});
  settings_element.appendChild(parameters_gui.domElement);
  settings_element.style.display = "block";
  parameters_gui.domElement.style.padding = "12px";
  let input_data = parameters_gui.addFolder("Input data");
//   const architectureController =
//     input.add(guiState.input, 'mobileNetArchitecture', ['1.01', '1.00', '0.75', '0.50']);
//   input.add(guiState.input, 'outputStride', [8, 16, 32]);
  input_data.add(gui_state["Input data"], 'Random player versus random player games').min(1).max(10000);
  let model = parameters_gui.addFolder("Model");
  model.add(gui_state["Model"], 'Learning rate').min(.00001).max(.1);
  model.add(gui_state["Model"], 'Size of first layer').min(1).max(100);
  model.add(gui_state["Model"], 'Size of second layer').min(0).max(100);
  model.add(gui_state["Model"], 'Size of third layer').min(0).max(100);
  let training = parameters_gui.addFolder("Training");
  training.add(gui_state["Training"], 'Number of iterations').min(1).max(10000);
  let evaluation = parameters_gui.addFolder("Evaluation");
  evaluation.add(gui_state["Evaluation"], "Games with trained versus random player").min(1).max(10000);
  evaluation.add(gui_state["Evaluation"], "Games with trained versus self").min(1).max(10000);
  evaluation.add(gui_state["Evaluation"], "Use probabilities instead of best move", [true, false]);
  evaluation.add(gui_state["Evaluation"], "Replace training data with these games", [true, false]);
  return {input_data: input_data,
          model: model,
          training: training,
          evaluation: evaluation};
};

let create_button = function (label, click_handler) {
  const button = document.createElement('button');
  button.innerHTML = label;
  button.className = "support-window-button";
  button.addEventListener('click', click_handler);
  return button;
};

create_data_button.addEventListener('click', create_data_with_parameters);
create_model_button.addEventListener('click', create_model_with_parameters);
train_button.addEventListener('click', train_with_parameters);
evaluate_button.addEventListener('click', evaluate_training);
  
}()));
