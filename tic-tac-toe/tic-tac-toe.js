// Machine learning experiment for tic tac toe
// Written by Ken Kahn 
// No rights reserved.

((async function () {

const models = () => tensorflow.models;

let evaluation_data; // maybe exploring how games go without wanting to add to training data
let evaluation;

const settings_element = document.getElementById('settings');
const create_data_button = document.getElementById('create_data');
const create_model_button = document.getElementById('create_model');
const train_button = document.getElementById('train');
const evaluate_button = document.getElementById('evaluate');
const optimize_button = document.getElementById('optimize');
const save_and_load_button = document.getElementById('save_and_load');

const tensorflow_add_to_models = tensorflow.add_to_models;

tensorflow.add_to_models = (model) => {
    tensorflow_add_to_models(model);
    if (evaluation) {
        // new name so update player 1 and 2 choices
        update_evaluation_model_choices();                 
    }
};

const gui_state = tensorflow.gui_state;

gui_state["Input data"] = {"Random player versus random player games": 100};

gui_state["Evaluation"] = {"Number of games to play": 100,
                           "Player 1": 'Random player',
                           "Player 2": 'Random player',
                           "Player 1's strategy": 'Use scores as probabilities',
                           "Player 2's strategy": 'Use scores as probabilities',
                           "What to do with new games": 'Add to dataset for future training'};

const create_parameters_interface = function () {
  const parameters_gui = new dat.GUI({width: 600,
                                      autoPlace: false});
  settings_element.appendChild(parameters_gui.domElement);
  settings_element.style.display = "block";
  parameters_gui.domElement.style.padding = "12px";
  let input_data = parameters_gui.addFolder("Input data");
  input_data.add(gui_state["Input data"], 'Random player versus random player games');
  let model = tensorflow.create_model_parameters(parameters_gui);
  let training = tensorflow.create_training_parameters(parameters_gui);
  evaluation = parameters_gui.addFolder("Evaluation");
  evaluation.add(gui_state["Evaluation"], "Number of games to play");
  evaluation.add(gui_state["Evaluation"], "Player 1", ['Random player']);
  evaluation.add(gui_state["Evaluation"], "Player 2", ['Random player']); 
  evaluation.add(gui_state["Evaluation"],
                 "Player 1's strategy",
                 ['Use scores as probabilities', 'Use highest score']);
  evaluation.add(gui_state["Evaluation"],
                 "Player 2's strategy",
                 ['Use scores as probabilities', 'Use highest score']);
  evaluation.add(gui_state["Evaluation"],
                 "What to do with new games",
                 ["Add to dataset for future training",
                  "Replace training dataset",
                  "Use for future training and save old games for validation",
                  "Don't add to dataset"]);
  update_evaluation_model_choices();
  let optimize = tensorflow.create_hyperparameter_optimize_parameters(parameters_gui);
  return {input_data: input_data,
          model: model,
          training: training,
          evaluation: evaluation,
          optimize: optimize};
};

let report_error = function (error) {
    console.error(error);
    let error_message = typeof error === 'string' ? error : error.message;
    alert(error_message);
};

const one_hot = (board) => {
    let board_as_one_hot = [];
    board.forEach((position) => {
        if (position === 1) {
            board_as_one_hot = board_as_one_hot.concat([1, 0, 0]);
        } else if (position === 2) {
            board_as_one_hot = board_as_one_hot.concat([0, 1, 0]);
        } else {
            board_as_one_hot = board_as_one_hot.concat([0, 0, 1]); // empty
        }
    });
    return board_as_one_hot;
};

const play = function (players, game_history, non_deterministic) {
      let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      let player_number = 0; // player 1 starts
      while (true) {
          move(player_number, players, board, game_history, non_deterministic);
          player_number = (player_number+1)%2; // and next the other player will play
          let outcome = game_over(board);
          if (outcome && game_history) {
              boards = boards.concat(game_history);
              if (outcome === 3) {
                  // tied
                  game_outcomes = game_history.map(() => 0);
              } else if (outcome === 1) { // first player won
                  game_outcomes = game_history.map((ignore, index) => index%2 === 0 ? 1 : -1);
              } else {
                  game_outcomes = game_history.map((ignore, index) => index%2 === 1 ? 1 : -1);
              }
              outcomes = outcomes.concat(game_outcomes);
          }
          if (outcome) {
              return outcome;
          }
      }
};

const move = function (player_number, players, board, history, non_deterministic) {
    let possible_moves = empty_squares(board);
    let move;
    let player = players[player_number];
    if (player !== 'Random player') {
        let best_move;
        let best_probability = 0;
        let predictions = [];
        possible_moves.forEach(possible_move => {
            let board_copy = board.slice();
            board_copy[possible_move] = player_number+1;
            tf.tidy(() => {
                let board_tensor = tf.tensor2d(one_hot(board_copy), [1, 27]);
                let probability_tensor = tensorflow.get_model(player).predict(board_tensor);
                let probability = probability_tensor.dataSync()[0];
                predictions.push(probability);
                if (probability > best_probability) {
                    best_move = possible_move;
                    best_probability = probability;
                }
            });
        });
        if (non_deterministic) {
//             predictions = predictions.sort().reverse(); // consider the most likely first
            const sum = predictions.reduce((accumulator, value) => value > 0 ? accumulator + value : accumulator);
            predictions.some((prediction, index) => {
               if (Math.random() <= prediction/sum) {
                   best_move = possible_moves[index]
                   return true;
               }
            });
        } // otherwise best_move has already been computed when the predictions were received
        move = best_move;
    }
    if (typeof move === 'undefined') {
        move = possible_moves[Math.floor(possible_moves.length*Math.random(possible_moves.length))];
    }
    board[move] = player_number+1; // 1 or 2 is clearer player number 
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

const play_games = async function (number_of_games, players, non_deterministic) {
    let x_wins = 0;
    let ties = 0;
    let x_losses = 0;
    for (let game = 0; game < number_of_games; game++) {
         let game_history = [];
         let outcome = play(players, game_history, non_deterministic);
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

let boards = [];
let outcomes = [];

const create_data = async function (number_of_games, players) {
  boards = [];
  outcomes = [];
  let statistics;
  let non_deterministic_1 = gui_state["Evaluation"]["Player 1's strategy"] === 'Use scores as probabilities';
  let non_deterministic_2 = gui_state["Evaluation"]["Player 2's strategy"] === 'Use scores as probabilities'; 
  // run half with model player being first
  let plays_first  = await play_games(number_of_games/2, players, non_deterministic_1);
  let last_board_with_player_1_going_first = boards.length;
  let plays_second = await play_games(number_of_games/2, players.reverse(), non_deterministic_2);
  statistics = {x_wins:   plays_first.x_wins + plays_second.x_wins,
                x_losses: plays_first.x_losses + plays_second.x_losses,
                player_1_wins: plays_first.x_wins   + plays_second.x_losses,
                player_2_wins: plays_first.x_losses + plays_second.x_wins,
                ties: plays_first.ties + plays_second.ties,
                last_board_with_player_1_going_first: last_board_with_player_1_going_first};
  return {input: boards,
          output: outcomes,
          statistics: statistics};
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

const create_data_interface = async function(button_label, number_of_games_function, interface_element) {
    const play_games = async function () {
      const message = document.createElement('p');
      let number_of_games = number_of_games_function();
      if (number_of_games%2 === 1) {
          number_of_games++; // make it even in case need to split it in two
      }
      let player_1 = gui_state["Evaluation"]['Player 1'];
      let player_2 = gui_state["Evaluation"]['Player 2'];
      message.innerHTML = "Please wait as " + player_1 + " plays " + number_of_games + 
                          " games against " + player_2 + ".";
      if (player_1 !== player_2) {
          message.innerHTML += "<br>They will each go first half the time.";
      }
      button.appendChild(message);
      setTimeout(async function () {
          // without the timeout the please wait message isn't seen    
           evaluation_data= await create_data(number_of_games, [player_1, player_2]);
          let new_data = {input: evaluation_data.input.map(one_hot),
                          output: evaluation_data.output};
          let what_to_do_with_new_games = gui_state["Evaluation"]["What to do with new games"];
          if (!tensorflow.get_data('all models', 'training') || what_to_do_with_new_games === 'Replace training dataset') {
              tensorflow.set_data('all models', 'training', new_data);
          } else if (what_to_do_with_new_games === 'Add to dataset for future training') {
              tensorflow.set_data('all models', 'training', tensorflow.add_to_data(new_data, 'all models', 'training'));
              tensorflow.get_data('all models', 'training').statistics = new_data.statistics;
          } else if (what_to_do_with_new_games === 'Use for future training and save old games for validation') {
              // add current training data to validation data and set training data to the new data
              tensorflow.set_data('all models', 'validation', tensorflow.add_to_data(tensorflow.get_data('all models', 'training'), 'all models', 'validation'));
              tensorflow.set_data('all models', 'training', new_data);
          } // do nothing for Don't add to dataset
          train_button.disabled = false; // not really but it will behave sensibly if run too soon
          optimize_button.disabled = false;
          create_model_button.disabled = false; // there is data so can move forward (though really only training needs data)
          message.style.font = "Courier"; // looks better with monospaced font
          let statistics = evaluation_data.statistics;
          message.innerHTML = 
              number_of_games + " games created.<br>" +
              player_1 + " (" + gui_state["Evaluation"]["Player 1's strategy"] + ")" + " vs<br> " + 
              player_2 + " (" + gui_state["Evaluation"]["Player 2's strategy"] + ")" + "<br>" +
              "X wins = " + statistics.x_wins + " ("   + Math.round(100*statistics.x_wins/number_of_games) + "%); " +
              "O wins = " + statistics.x_losses + " (" + Math.round(100*statistics.x_losses/number_of_games) + "%); " +
              "Ties = "   + statistics.ties + " ("     + Math.round(100*statistics.ties/number_of_games) + "%)<br>";
          const update_button = function (button) {
              const old_version = document.getElementById(button.id);
              if (old_version) {
                  old_version.remove();
              }
              interface_element.appendChild(button);
          };
          message.innerHTML +=
               "<b>Player 1: </b>" +
               "Wins = "   + statistics.player_1_wins + " (" + Math.round(100*statistics.player_1_wins/number_of_games) + "%); " +
               "Losses = " + statistics.player_2_wins + " (" + Math.round(100*statistics.player_2_wins/number_of_games) + "%)<br>";
          const show_first_player_playing_x_button = 
              tensorflow.create_button(
                  "Show a game where " + player_1 + " was X",
                  () => {
                      const playing_first_boards = 
                          evaluation_data.input.slice(0, evaluation_data.statistics.last_board_with_player_1_going_first);
                      tensorflow.replace_button_results(show_first_player_playing_x_button,
                                                        random_game_display(playing_first_boards));
                  });
          update_button(show_first_player_playing_x_button);
          const show_first_player_playing_o_button = 
              tensorflow.create_button(
                  "Show a game where " + player_1 + " was O",
                  () => {
                      const playing_second_boards =
                          evaluation_data.input.slice(evaluation_data.statistics.last_board_with_player_1_going_first);
                      tensorflow.replace_button_results(show_first_player_playing_o_button,
                                                        random_game_display(playing_second_boards));
                  });
          update_button(show_first_player_playing_o_button);
      });
    };
    let button = tensorflow.create_button(button_label, play_games);
    interface_element.appendChild(button);
};

let create_data_initialised = false;

const create_data_with_parameters = async function () {
    const surface = tfvis.visor().surface({name: 'Tic Tac Toe', tab: 'Input'});
    const draw_area = surface.drawArea;
    if (!create_data_initialised) {
        // first time this is run
        create_data_interface("Play random player against random player",
                              () => Math.round(gui_state["Input data"]["Random player versus random player games"]),
                              draw_area,
                              []); // no players use the model
        tensorflow.parameters_interface(create_parameters_interface).input_data.open();
        create_data_initialised = true;
    } else {
        tfvis.visor().setActiveTab('Input');
    }
};

const predict = (model_name, input, success_callback, error_callback) => {
    let model = tensorflow.get_model(model_name);
    if (!model) {
        error_callback("No model named " + model_name);
        return;
    }
    try {
        let input_tensor;
        if (typeof input === 'number') {
            input_tensor = tf.tensor2d([input], [1, 1]);
        } else {
            input_tensor = tf.tensor2d([input], [1].concat(shape_of_data(input)));
        }
        let prediction = model.predict(input_tensor);
        success_callback(prediction.dataSync()[0]);
    } catch (error) {
        error_callback(error.message);
    }
};

const evaluate_training = function () {
  const surface = tfvis.visor().surface({name: 'Tic Tac Toe', tab: 'Evaluation'});
  const draw_area = surface.drawArea;
  setTimeout(() => {
      // delay this since the prediciton interface will open after this
      tfvis.visor().setActiveTab('Evaluation');
  });
  if (document.getElementById('evaluation_div')) {
      return;
  }
  const display = document.createElement('div');
  display.id = 'evaluation_div';
  const show_first_moves = function () {
    tf.tidy(() => {
      let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      let html = "<br>";
      let model_name = gui_state["Evaluation"]['Player 1'];
      let player_1_model = tensorflow.get_model(model_name);
      if (!player_1_model) {
          if (typeof model === 'undefined') {
              display.innerHTML = "<br>No model found named '" + model_name + "'.<br>";
              return;
          }
          player_1_model = model;
          html += "Player 1 is not using a model so current model used instead.<br><br>";
      }
      for (let i = 0; i < 9; i++) {
          board[i] = 1;
          let prediction = Math.round(100*player_1_model.predict(tf.tensor2d(one_hot(board), [1, 27])).dataSync()[0]);
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
  const show_first_move_scores_button =
      tensorflow.create_button("Show the scores for first moves by Player 1", show_first_moves);
  draw_area.appendChild(show_first_move_scores_button);
  show_first_move_scores_button.appendChild(display);
  create_data_interface("Play games using 'Player 1' and 'Player 2' settings",
                        () => Math.round(gui_state["Evaluation"]["Number of games to play"]),
                        draw_area);
  tensorflow.parameters_interface(create_parameters_interface).evaluation.open();
};

// a hack to update the list of choices of models a player should use
const update_evaluation_model_choices = function () {
    let names = Object.keys(tensorflow.models());
    if (names.length === 0) {
        return;
    }
    const update_dropdown_menu = (target, names) => { 
        // based upon https://stackoverflow.com/questions/16166440/refresh-dat-gui-with-new-values  
        let html = "";
        names.forEach((name) => {
            let property = target.property;
            html += "<option value='" + name + "'" +
                    // preserve which option is selected
                    ((name === gui_state["Evaluation"][property]) ? " selected" : "") +
                    ">" + name + "</option>";
        });
        target.domElement.children[0].innerHTML = html;
    }
    names = ['Random player'].concat(names); // keep the same order of options
    evaluation.__controllers.forEach((controller) => {
        if (controller.property === 'Player 1' || controller.property === 'Player 2') {
            update_dropdown_menu(controller, names);
        }
    });
};

create_data_button.addEventListener('click', create_data_with_parameters);
                                    
create_model_button.addEventListener('click',
                                     () => {
                                         tensorflow.create_model_with_parameters('Tic Tac Toe');
                                     });
train_button.addEventListener('click',
                              () => {
                                  tensorflow.train_with_parameters('Tic Tac Toe');
                              });
evaluate_button.addEventListener('click', evaluate_training);
optimize_button.addEventListener('click',
                                 () => {
                                    tensorflow.create_hyperparamter_optimization_tab('Tic Tac Toe');
                                 });
save_and_load_button.addEventListener('click', 
                                      (event) => {
                                          tensorflow.save_and_load(event);
                                          const load_training_data = document.getElementById("load_training_data");
                                          if (load_training_data) {
                                              // enable model creation after loading data
                                              load_training_data.addEventListener('change',
                                                                                  () => {
                                                                                      create_model_button.disabled = false;
                                                                                      optimize_button.disabled = false;
                                                                                  });
                                          }
                                      });
  
}()));

