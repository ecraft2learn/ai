 /**
 * Implements JavaScript functions that extend Snap! to access AI cloud services and the machine learning library tensorflow.js
 * Authors: Ken Kahn
 * License: New BSD
 */

 "use strict"

 const report_averages = (responses, number_of_training_repeats) => {
    const responses_total = {};
    let duration_in_seconds = 0;
    for (let i = 0; i < number_of_training_repeats; i++) {
        const entries = Object.entries(responses[i]);
        entries.forEach(([key, value]) => {
            if (typeof value === 'number') {
                if (key === 'Duration in seconds') {
                    duration_in_seconds += value;
                } else {
                    if (typeof responses_total[key] === 'number') {
                        responses_total[key] += value;
                    } else {
                        responses_total[key] = value;
                    }                   
                }  
            }
        });
    };
    const csv = "<br>Number of training repeats, Stop if no progress, " + 
                Object.keys(responses_total) + ", Duration in seconds<br>" +
                number_of_training_repeats + ", " +
                model_options.stop_if_no_progress_for_n_epochs + ", " +
                Object.values(responses_total).map(value => (value/number_of_training_repeats).toFixed(3)) + ", " +
                duration_in_seconds + "<br>";
    const averages = document.createElement('p');
    averages.innerHTML = csv;
    document.body.appendChild(averages);
};

const add_save_model_button = (label, model, model_name) => {
    const button = document.createElement('button');
    button.innerHTML = label;
    button.className = "save-training-button";
    const save_model = async () => {
        return await model.save('downloads://' + model_name);
    };
    button.addEventListener('click', save_model);
    document.body.appendChild(button);
    return button;
};

const search = (datasets) => {
    const success_callback = (results) => {
        console.log(results);
        let trials = [];
        results.trials.forEach(trial => {
            if (trial.result && trial.result.results) {
                if (!isNaN(trial.result.results["Highest accuracy"])) {
                    trials.push(trial);
                } else {
                    log('ignoring NaN', trail);
                }
            } else {
                // todo: find out why these happen
                console.log("bad trial?", trial);
            }
        });
        document.getElementById('experiment-number').innerHTML = trials.length;
        const compare = (a, b) => b.result.results["Highest accuracy"]-a.result.results["Highest accuracy"];
        trials.sort(compare);
        console.log("all", trials);
        let durations = {};
        const accuracies = {};
        trials.forEach(trial => {
            Object.entries(trial.args).forEach(([key, value]) => {
                if (!durations[key]) {
                    durations[key] = {};
                }
                if (!durations[key][value]) {
                    durations[key][value] = [];
                }
                durations[key][value].push(trial.result.results["Duration in seconds"]);
                if (!accuracies[key]) {
                    accuracies[key] = {};
                }
                if (!accuracies[key][value]) {
                    accuracies[key][value] = [];
                }
                accuracies[key][value].push(trial.result.results["Highest accuracy"]);
            });
        });
        const p = document.createElement('p');
        document.body.appendChild(p);
        p.innerHTML = trials[0].result.results["Spreadsheet values"];
        p.innerHTML += "<br><br><b>Accuracy: </b>" + trials.map(trial => "  " + trial.result.results["Highest accuracy"]) + "<br>";
        const space = model_options.search.space;
        Object.keys(space).forEach(key => {
            p.innerHTML += "<br><b>" + key + ": </b>" + trials.map((trial, index) => "  " + trial.args[key]) + "<br>";
            Object.entries(durations[key]).forEach(([parameter, durations_list]) => {
                if (durations_list.length > 0) {
                    p.innerHTML += parameter + ": " + 
                                   (durations_list.reduce((duration, sum) => duration+sum)/durations_list.length).toFixed(2) + " seconds (" +
                                   durations_list.length + " items)<br>";
                }
            });
            Object.entries(accuracies[key]).forEach(([parameter, accuracies_list]) => {
                if (accuracies_list.length > 0) {
                    p.innerHTML += parameter + ": " + 
                                   (accuracies_list.reduce((duration, sum) => duration+sum)/accuracies_list.length).toFixed(3) + " accuracy (" +
                                   accuracies_list.length + " items)<br>";
                }
            });
        });
        p.innerHTML += "<br><b>Highest accuracy epoch: </b>" + trials.map(trial => "  " + trial.result.results["Highest accuracy epoch"]);
        add_save_model_button("Save best model", trials[0].result.results.model, model_name);
    };
    const error_callback = (results) => {
        console.log('error', results);
    };
    hyperparameter_search(model_options, datasets, success_callback, error_callback);
};