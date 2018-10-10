// Machine learning experiment for tic tac toe
// Written by Ken Kahn 
// No rights reserved.

((async function () {

let model_trained = false;
let models = {};
let model;

let data; // current data available for training
let evaluation;

const settings_element = document.getElementById('settings');
const create_data_button = document.getElementById('create_data');
const create_model_button = document.getElementById('create_model');
const train_button = document.getElementById('train');
const evaluate_button = document.getElementById('evaluate');
const save_and_load_button = document.getElementById('save_and_load');

const add_to_models = function (model) {
    let new_name = !models[model.name];
    models[model.name] = model;
    if (evaluation) {
        // new name so update player 1 and 2 choices
        update_evaluation_model_choices();                 
    }
};

const update_evaluation_model_choices = function () {
    let names = Object.keys(models);
    if (names.length === 0) {
        return;
    }
    const updateDatDropdown = function(target, list) { 
        // copied from https://stackoverflow.com/questions/16166440/refresh-dat-gui-with-new-values  
        innerHTMLStr = "";
        if(list.constructor.name == 'Array'){
            for(var i=0; i<list.length; i++){
                var str = "<option value='" + list[i] + "'>" + list[i] + "</option>";
                innerHTMLStr += str;        
            }
        }

        if(list.constructor.name == 'Object'){
            for(var key in list){
                var str = "<option value='" + list[key] + "'>" + key + "</option>";
                innerHTMLStr += str;
            }
        }
        if (innerHTMLStr != "") target.domElement.children[0].innerHTML = innerHTMLStr;
    }
    names = ['Random player'].concat(names); // keep the same order of options
    evaluation.__controllers.forEach(function (controller) {
        if (controller.property === 'Player 1' || controller.property === 'Player 2') {
            updateDatDropdown(controller, names);
        }
    });     
};

const create_model = function (model_configuration, learning_rate, name) {
  // following inspired by https://github.com/johnflux/deep-learning-tictactoe/blob/master/play.py
  const model = tf.sequential({name: name});
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
  return model;
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
            board_copy[possible_move] = player_number;
            tf.tidy(() => {
                let board_tensor = tf.tensor2d(board_copy, [1, 9]);
                let probability_tensor = models[player].predict(board_tensor);
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
  add_to_models(model);
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
      let new_data = await create_data(number_of_games, [player_1, player_2]);
      if (!data || gui_state["Evaluation"]["What to do with new games"] === 'Replace training dataset') {
          data = new_data;
      } else {
          let merged_data = {boards: data.boards.concat(new_data.boards),
                             outcomes: data.outcomes.concat(new_data.outcomes),
                             statistics: new_data.statistics};
          data = merged_data;
      }
      train_button.disabled = false;
      create_model_button.disabled = false; // there is data so can move forward (though really only training needs data)
      message.style.font = "Courier"; // looks better with monospaced font
      let statistics = data.statistics;
      message.innerHTML = 
          number_of_games + " games created.<br>" +
          "X wins = " + statistics.x_wins + " ("   + Math.round(100*statistics.x_wins/number_of_games) +"%); " +
          "O wins = " + statistics.x_losses + " (" + Math.round(100*statistics.x_losses/number_of_games) +"%); " +
          "Ties = "   + statistics.ties + " ("     + Math.round(100*statistics.ties/number_of_games) + "%)<br>";
      const update_button = function (button) {
          const old_version = document.getElementById(button.id);
          if (old_version) {
              old_version.remove();
          }
          interface_element.appendChild(button);
      };
      message.innerHTML +=
           "<b>" + player_1 + ": </b>" +
           "Wins = "   + statistics.player_1_wins + " (" + Math.round(100*statistics.player_1_wins/number_of_games) + "%); " +
           "Losses = " + statistics.player_2_wins + " (" + Math.round(100*statistics.player_2_wins/number_of_games) + "%)<br>";
      const show_first_player_playing_x_button = 
          create_button("Show a game where " + player_1 + " was X",
                        function () {
                            const playing_first_boards = data.boards.slice(0, data.statistics.last_board_with_player_1_going_first);
                            replace_button_results(show_first_player_playing_x_button,
                                                   random_game_display(playing_first_boards));
                        });
      update_button(show_first_player_playing_x_button);
      const show_first_player_playing_o_button = 
          create_button("Show a game where " + player_1 + " was O",
                        function () {
                             const playing_second_boards = data.boards.slice(data.statistics.last_board_with_player_1_going_first);
                             replace_button_results(show_first_player_playing_o_button,
                                                    random_game_display(playing_second_boards));
                        });
      update_button(show_first_player_playing_o_button);
    });
  };
  let button = create_button(button_label, play_games);
  interface_element.appendChild(button);
};

let parameters_gui;

const parameters_interface = function () {
  if (!parameters_gui) {
      parameters_gui = create_parameters_interface();
  }
  return parameters_gui;
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
        parameters_interface().input_data.open();
        create_data_initialised = true;
    } else {
//         surface.label.click();
    }
};

let create_model_with_current_settings_button;

const create_model_with_parameters = function () {
  const surface = tfvis.visor().surface({name: 'Tic Tac Toe', tab: 'Model'});
  const draw_area = surface.drawArea;
  parameters_interface().model.open();
  let name_input;
  let message;
  const create_model_with_current_settings = function () {
      let model_configuration = [Math.round(gui_state["Model"]["Size of first layer"])];
      if (gui_state["Model"]["Size of second layer"] > .5) {
        model_configuration.push(Math.round(gui_state["Model"]["Size of second layer"]));
      }
      if (gui_state["Model"]["Size of third layer"] > .5) {
        model_configuration.push(Math.round(gui_state["Model"]["Size of third layer"]));
      }
      const name = name_input.value;
      model = create_model(model_configuration, gui_state["Model"]["Learning rate"], name);
      train_button.disabled = false;
      let html = "<br>A new model named '" + name + "' created and it is ready to be trained.";
      if (models[name]) {
          html += "<br>It replaces the old model of the same name.";
      }
      model.summary(50, // line length
                    undefined,
                    (line) => {
                      html += "<br>" + line;
                    });
      message.innerHTML = html;
  };
  if (!create_model_with_current_settings_button) {
      name_input = document.createElement('input');
      name_input.type = 'text';
      name_input.id = "name_element";
      name_input.name = "name_element";
      name_input.value = 'my-model';
      const label = document.createElement('label');
      label.for = "name_element";
      label.innerHTML = "Name of model: ";
      const div = document.createElement('div');
      div.appendChild(label);
      div.appendChild(name_input);
      draw_area.appendChild(div);
      create_model_with_current_settings_button = 
          create_button("Create model with current settings", create_model_with_current_settings);
      draw_area.appendChild(create_model_with_current_settings_button);
      message = document.createElement('div');
      draw_area.appendChild(message);        
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
  parameters_interface().training.open();
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
      let model_name = gui_state["Evaluation"]['Player 1'];
      let player_1_model = models[model_name];
      if (!player_1_model) {
          player_1_model = model;
          html += "Player 1 is not using a model so current model used instead.<br><br>";
      }
      for (let i = 0; i < 9; i++) {
          board[i] = 1;
          let prediction = Math.round(100*player_1_model.predict(tf.tensor2d(board, [1, 9])).dataSync()[0]);
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
  const show_first_move_scores_button = create_button("Show the scores for first moves by Player 1", show_first_moves);
  draw_area.appendChild(show_first_move_scores_button);
  show_first_move_scores_button.appendChild(display);
  parameters_interface().evaluation.open();
  create_data_interface("Play games using 'Player 1' and 'Player 2' settings",
                        () => Math.round(gui_state["Evaluation"]["Number of games to play"]),
                        draw_area);
//   create_data_interface("Play trained player against itself",
//                         () => Math.round(gui_state["Evaluation"]["Number of games to play"]),
//                         draw_area,
//                         [1, 2]); // both players use the model
};

const gui_state = 
  {"Input data": {"Random player versus random player games": 100},
   "Model": {"Learning rate": .001,
             "Size of first layer": 100,
             "Size of second layer": 50,
             "Size of third layer": 20},
   "Training": {"Number of iterations": 120},
   "Testing": {},
   "Evaluation": {"Number of games to play": 100,
                  "Player 1": 'Random player',
                  "Player 2": 'Random player',
                  "Player 1's strategy": 'Use scores as probabilities',
                  "Player 2's strategy": 'Use scores as probabilities',
                  "What to do with new games": 'Add to dataset for future training',}
};

const create_parameters_interface = function () {
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
  training.add(gui_state["Training"], 'Number of iterations').min(1).max(1000);
  evaluation = parameters_gui.addFolder("Evaluation");
  evaluation.add(gui_state["Evaluation"], "Number of games to play").min(1).max(100000);
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
                 ["Add to dataset for future training", "Replace training dataset"]);
  update_evaluation_model_choices();
  return {input_data: input_data,
          model: model,
          training: training,
          evaluation: evaluation};
};

let save_button;
let load_button;

const save_and_load = function () {
    const surface = tfvis.visor().surface({name: 'Tic Tac Toe', tab: 'Save/Load'});
    const draw_area = surface.drawArea;
    if (save_button) {
        return; // already set up 
    }
    draw_area.innerHTML = ""; // reset if rerun
    save_button = create_button("Save trained model", save_model);
    draw_area.appendChild(save_button);
    load_button = create_button("Load a trained model", load_model);
    draw_area.appendChild(load_button);
    const file_input = function(label, id) {
      const div = document.createElement('div');
      const label_element = document.createElement('label');
      const input_element = document.createElement('input');
      label_element.for = id;
      label_element.innerHTML = label;
      input_element.type = 'file';
      input_element.id = id;
      input_element.name = id;
      div.appendChild(label_element);
      div.appendChild(input_element);
      div.style.padding = "12px";
      return div;
    };
    draw_area.appendChild(file_input('Saved model JSON file: ', 'saved_json'));
    draw_area.appendChild(file_input('Saved model weights file: ', 'saved_weights'));
};

const save_model = async function () {
  let URL = 'downloads://' + model.name;
  return await model.save(URL);
};

const load_model = async function () {
  const saved_model_element = document.getElementById('saved_json');
  const saved_weights_element = document.getElementById('saved_weights');
  if (!saved_model_element.files[0] || !saved_weights_element.files[0]) {
      let message = document.createElement('p');
      message.innerHTML = "Please choose files below and then click this again.";
      replace_button_results(load_button, message);
      return;
  }
  model = await tf.loadModel(tf.io.browserFiles([saved_model_element.files[0],
                                                 saved_weights_element.files[0]]));
  model_trained = true;
  let message = document.createElement('p');
  const model_name = saved_model_element.files[0].name.substring(0, saved_model_element.files[0].name.length-".json".length);
  message.innerHTML = model_name + " loaded and ready to evaluate.";
  model.name = model_name;
  if (models[name]) {
     message.innerHTML += "<br>Replaced a model with the same name.";
  }
  add_to_models(model);
  replace_button_results(load_button, message);  
  // to add more data enable these options
  create_model_button.disabled = false;
  evaluate_button.disabled = false;
};

let create_button = function (label, click_handler) {
  const button = document.createElement('button');
  button.innerHTML = label;
  button.className = "support-window-button";
  button.addEventListener('click', click_handler);
  button.id = label; // for ease of replacing it with a newer version
  return button;
};

create_data_button.addEventListener('click', create_data_with_parameters);
create_model_button.addEventListener('click', create_model_with_parameters);
train_button.addEventListener('click', train_with_parameters);
evaluate_button.addEventListener('click', evaluate_training);
save_and_load_button.addEventListener('click', save_and_load);
  
}()));
