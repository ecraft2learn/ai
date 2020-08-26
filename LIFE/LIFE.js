// Machine learning to provide intelligent support for the University of Oxford's LIFE game
// Written by Ken Kahn 
// License: New BSD

// following originally based upon sample code at 
// https://github.com/tensorflow/tfjs-models/tree/master/universal-sentence-encoder

"use strict";
window.LIFE =
  ((() => {

Math.seedrandom(45); // so can shuffle paraphrases and then set aside a subset for testing.

const number_of_test_questions_per_group = 2;

let group_of_questions = [];
let answers = [];

let embedding_model;
let loaded_model;

let group_of_questions_embeddings = [];
let group_of_questions_mean_embeddings = [];

let knn_classifier; // will be bound if 'knn' is a URL option
let knn_dataset;

const use_model_and_knn_to_respond_to_question = async (the_question) => {
    return use_model_to_respond_to_question(the_question).then((result) => {
        if (knn_classifier) {
		 	return knn_classifier.predictClass(result.question_embedding, 1).then(prediction => {
		 		const knn_prediction = Object.values(prediction.confidences);
		 		return({...result,
						knn_prediction});
		 	});
        } else {
        	return result;
        }
    });
};

const use_model_to_respond_to_question = async (the_question) => {
	return embedding_model.embed([the_question]).then((question_embedding) => {
		const prediction_tensor = loaded_model.predict([question_embedding]);
		const prediction = prediction_tensor.arraySync()[0];
		prediction_tensor.dispose();
		let best_score = 0;
		let second_best_score;
		let best_answer_index;
		let second_best_answer_index;
		prediction.forEach((score, index) => {
			if (score > best_score) {
				second_best_score = best_score;
				second_best_answer_index = best_answer_index;
				best_score = score;
				best_answer_index = index;
			} else if (score > second_best_score) {
				second_best_score = score;
				second_best_answer_index = index;
			}
		});
		log({prediction, the_question, best_score, best_answer_index});
        return({best_answer_index,
			    best_score,
				second_best_answer_index,
				second_best_score,
				question_embedding});			
	});
};

// const precision = (x, n) => Math.round(x*Math.pow(10, n))/Math.pow(10, n);

const setup = () => {
	const group_of_questions_and_answers = LIFE.sentences_and_answers();
	group_of_questions = group_of_questions_and_answers.group_of_questions;
	answers = group_of_questions_and_answers.answers;
    const obtain_embeddings = (group_number) => {
        embedding_model.embed(group_of_questions[group_number]).then((embeddings) => {
            // 'embeddings' is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
            group_of_questions_embeddings.push(embeddings);
            group_of_questions_mean_embeddings.push(embeddings.mean(0));
            if (group_number+1 < group_of_questions.length) {
                obtain_embeddings(group_number+1);
//             } else {
//                 let define_group_of_questions_mean_embeddings = "group_of_questions_mean_embeddings = [\n";
//                 group_of_questions_mean_embeddings.forEach((embedding) => {
//                     define_group_of_questions_mean_embeddings += "tf.tensor1d([" + embedding.dataSync() + "])\n,"                     
//                 });
//                 define_group_of_questions_mean_embeddings += "];";
//                 console.log(define_group_of_questions_mean_embeddings);
//                 do_when_group_of_questions_mean_embeddings_available();
            }
        });        
    };
    let wrong = [];
    const top_two_indices = (list) => {
    	let best = Number.MIN_VALUE;
    	let best_index = -1;
    	let second_best = Number.MIN_VALUE;
    	let second_best_index = -1;
    	list.forEach((x, index) => {
    		if (x > best) {
    			if (best > Number.MIN_VALUE) {
    				second_best = best;
    				second_best_index = best_index;
    			}
    			best = x;
    			best_index = index;
    		} else if (x > second_best) {
    			second_best = x;
    			second_best_index = index;
    		}
    	});
    	return [best_index, second_best_index];
    };
    const write_good_and_bad = (question, response, good, group_number, question_number) => {
    	document.writeln(question + "<br>");
    	if (typeof response === 'number') {
    		document.writeln("Bad answer: " + answers[response] + "<br>");
    	} else if (typeof response === 'object') {
    		const {best_score, best_answer_index, second_best_answer_index, second_best_score, question_embedding, knn_prediction} = response;
    		const [best_knn_index, second_best_knn_index] = knn_prediction ? top_two_indices(knn_prediction) : [-1, -1];
    		document.writeln(group_number + ":" + question_number + " (Group number: question number)<br>");
    		document.writeln("model: " + best_answer_index + ", " + second_best_answer_index + "<br>");
    		if (best_knn_index >= 0) {
    			document.writeln("KNN  : " + best_knn_index + ", " + second_best_knn_index + "<br>");
    		}
    		if (best_answer_index !== group_number) {
    			document.writeln("Best model answer is <b>wrong</b>. ");
    		}
    		if (best_knn_index >= 0 && best_knn_index !== group_number) {
    			document.writeln("KNN's best answer is <b>wrong</b>.");
    		}
    		document.writeln("<br>");
    		if (best_knn_index >= 0 && best_answer_index !== best_knn_index) {
    			document.writeln("Model (" + best_answer_index + ") and KNN (" + best_knn_index + ") <b>disagree</b> on best answer.<br>");
    		}
    		if (best_knn_index >= 0 && second_best_answer_index !== second_best_knn_index && second_best_knn_index >= 0) {
    			document.writeln("Model (" + second_best_answer_index + ") and KNN (" + second_best_knn_index + ") disagree on second best answer.<br>");
    		}
    		document.writeln("Best model answer has a model second best score of " + second_best_score.toFixed(4));
    		if (best_knn_index >= 0) {
    			document.writeln(" and that answer has a KNN score of " + knn_prediction[second_best_answer_index].toFixed(4));
    			if (second_best_answer_index !== second_best_knn_index && second_best_knn_index >= 0) {
    				document.writeln(". And KNN's second best answer's score is " + knn_prediction[second_best_knn_index].toFixed(4))
    			}							
			}
			document.writeln(".<br>");
    		document.writeln("Best model answer is: <blockquote>" + answers[best_answer_index] + "</blockquote>");
    		document.writeln("And the second best model answer is <b>" + 
    			             (second_best_answer_index === group_number ? 'correct' : 'wrong') +
    					     "</b> with a score of " + second_best_score.toFixed(4) + ".<br>");
    		if (best_knn_index >= 0) {
    			document.writeln("KNN confidence of second best is " + knn_prediction[second_best_answer_index].toFixed(4) + ".<br>");								
			}
    		if (best_knn_index >= 0 && second_best_knn_index !== group_number && second_best_answer_index !== second_best_knn_index && second_best_knn_index >= 0) {
    			document.writeln("Second best model (" + second_best_answer_index + ") and KNN (" + second_best_knn_index + ") <b>disagree</b>.<br>");
    		}
    		if (second_best_answer_index !== group_number) {
    			// if it is right then it'll be printed out next
    			document.writeln("Second best model answer is <blockquote>" + answers[second_best_answer_index] + "</blockquote><br>");
    		}
    	}
        document.writeln("Good answer: <blockquote>" + good + "</blockquote><br><br>");
    };
    const test_all_questions = () => {
    	let total = 0;
    	let both_right = 0;
    	let model_right_knn_second_right = 0;
    	let knn_right_model_second_right = 0;
    	let model_only_right = 0;
    	let knn_only_right = 0;
    	let both_wrong = 0;
    	let votes_right_if_either_wrong = 0;
    	const threshold = model_options.score_threshold;
        group_of_questions_test.forEach((group, group_number) => {
            group.forEach((question, question_number) => {
            	use_model_and_knn_to_respond_to_question(question).then(response => {
            		const {best_score, best_answer_index, second_best_score, second_best_answer_index, question_embedding, knn_prediction} = response;
            		if (knn_prediction) {
            			const [best_knn_index, second_best_knn_index] = top_two_indices(knn_prediction);
						total++;
						if (best_answer_index === group_number) {
							if (best_knn_index === group_number) {
								both_right++;
							} else {
								model_only_right++;
							}
							if (second_best_knn_index === group_number) {
								model_right_knn_second_right++;
							}
						} else if (best_knn_index === group_number) {
							knn_only_right++;
							if (second_best_answer_index === group_number) {
								knn_right_model_second_right++;
							}
						} else {
							both_wrong++;
						}
						if (group_number === group_of_questions.length-1 && question_number === group.length-1) {
							console.log({total, both_right, model_only_right, knn_only_right, both_wrong, 
									     model_right_knn_second_right, knn_right_model_second_right,
									     votes_right_if_either_wrong});
						}
						if (best_answer_index !== group_number || best_knn_index !== group_number) {
							// at least one is wrong
							const votes = {};
							const model_weight = 0.5;
							const knn_weight = 1-model_weight;
							votes[best_answer_index] = model_weight*best_score +
							                           (second_best_knn_index === best_answer_index ? 
							                            knn_weight*knn_prediction[second_best_knn_index] : 
							                            0);
							votes[second_best_answer_index] = model_weight*second_best_score +
							                                  (best_knn_index === second_best_answer_index ? 
							                                   knn_weight*knn_prediction[best_knn_index] :
							                                   (second_best_knn_index === second_best_answer_index ?
							                                    knn_weight*knn_prediction[second_best_knn_index] :
							                                    0));
						    if (best_knn_index !== best_answer_index && best_knn_index !== second_best_answer_index) {
						    	votes[best_knn_index] = knn_weight*knn_prediction[best_knn_index];
						    }
						    if (second_best_knn_index !== best_answer_index && 
						        second_best_knn_index !== second_best_answer_index &&
						        second_best_knn_index >= 0) {
						    	votes[second_best_knn_index] = knn_weight*knn_prediction[second_best_knn_index];
						    }
						    const winner = (votes) => {
						    	let best_so_far = Number.MIN_VALUE;
						    	let best_index;
						    	Object.entries(votes).forEach((entry) => {
						    		if (entry[1] > best_so_far) {
						    			best_so_far = entry[1];
						    			best_index = entry[0];
						    		}
						    	});
						    	return +best_index;
						    };
						    if (winner(votes) === group_number) {
						    	votes_right_if_either_wrong++;
						    } else {
						    	// neither unanimous nor did voting work
						    	const best_knn_score = knn_prediction[best_knn_index];
						    	const second_best_knn_score = knn_prediction[second_best_knn_index];
								console.log({group_number, best_answer_index, second_best_answer_index,
								             best_score, second_best_score,
											 best_knn_index, second_best_knn_index,
											 best_knn_score, second_best_knn_score,
											 votes,
											 question_number});						    	
						    }
						}
            		}
					if (best_score < threshold || 
					    best_answer_index !== group_number ||
					    (knn_prediction && knn_prediction[group_number] < threshold)) {
						write_good_and_bad(question, response, answers[group_number], group_number, question_number);
					}
					question_embedding.dispose();
            	});
            }); 
        });
        
    };
    const get_embeddings = (questions, callback) => {
    	// do this in batches since too many at once causes WebGL compilation errors
    	const batch_size = 100;
    	if (questions.length < batch_size) {
    		embedding_model.embed(questions).then(callback);
    	} else {
    		embedding_model.embed(questions.slice(0, batch_size)).then((first_embeddings) => {
                get_embeddings(questions.slice(batch_size), (rest_of_embeddings) => {
                	const combined_embeddings = tf.concat([first_embeddings, rest_of_embeddings], 0);
                	callback(combined_embeddings);
                });
            });
    	}
    }
    const training_data = (callback) => {
    	let questions = [];
    	let outputs = [];
    	const number_of_groups = group_of_questions.length;
    	group_of_questions.forEach((group, group_number) => {
            group.forEach((question) => {
            	questions.push(question);
            	outputs.push(group_number);
            });
    	});
    	const ys = tf.oneHot(tf.tensor1d(outputs, 'int32'), number_of_groups);
    	get_embeddings(questions, (embeddings) => {
			callback({xs: embeddings,
					  ys: ys});
    	});
    };    	
//     	let group_number = 0;
//     	let question_number = 0;
//     	let group = group_of_questions[group_number];
//     	let question;
//     	const next_question = () => {
//     		if (question_number === group.length) {
//     			group_number++;
//     			question_number = 0;
//     			group = group_of_questions[group_number];
//     		}
//     		if (group_number === number_of_groups) {
//     			callback({xs: tf.tensor(input_array),
//                 		  ys: tf.oneHot(tf.tensor1d(output_array, 'int32'), number_of_groups)});
//                 return;
//     		}
//     		question = group[question_number];
//     		embedding_model.embed([question]).then((embedding) => {
//     			input_array.push(embedding.arraySync());
//                 output_array.push(group_number);
//                 question_number++;
//                 next_question();
//     		});
//     	};
//     	next_question();
//     };
    use.load().then((model) => {
        embedding_model = model;
		const test_loss_message = document.createElement('p');
		let first_time = true;
		let responses = [];
		const number_of_training_repeats = model_options.number_of_training_repeats;
		document.body.appendChild(test_loss_message);
		const next_training = () => {
			model_options.training_number = 1+responses.length; // for visualization tab names
			model_options.categorical = true;
			model_options.tfvis_options =
				{callbacks: ['onEpochEnd'],
	//              yAxisDomain: [.3, .8],
				 width: 500,
				 height: 300,
				 measure_accuracy: true,
	             display_confusion_matrix: true,
				 display_layers_after_creation: true,
				 display_layers_after_training: true,
				 display_graphs: true};
			const error_callback = (error) => {
				record_error("Internal error: " + error.message);
			};
			create_and_train_model(model_options,
								   model_callback,
								   error_callback);
		}
		const model_callback = (response) => {
			if (first_time) {
				test_loss_message.innerHTML = response["Column labels for saving results in a spreadsheet"] + "<br>";
				first_time = false;
			}
			test_loss_message.innerHTML += response["Spreadsheet values"] + "<br>";
			responses.push(response);
			const label = "Save model #" + model_options.training_number;
			add_save_model_button(label, response.model, model_name);
			if (responses.length === number_of_training_repeats) {
				report_averages(responses, number_of_training_repeats);
			} else {
				next_training();
			}
		};
		const setup_data = (callback) => {
			training_data((datasets) => {
        	    model_options.datasets = datasets;
        	    // 'answers' is too verbose for column headers
        	    model_options.class_names = answers.map((ignore, index) => "#" + index);
        	    callback(datasets);
			});
		};
		const create_classifier_dataset = (callback) => {
        	const group_of_questions_and_answers = LIFE.sentences_and_answers();
        	const group_of_questions = group_of_questions_and_answers.group_of_questions;
        	let dataset_javascript = "// Automatically generated sentence embeddings of " + questions_file_name + "\n";
        	dataset_javascript += "LIFE.knn_dataset = {\n";
        	const fill_dataset = (group_number) => {
        		if (group_number < group_of_questions.length) {
					embedding_model.embed(group_of_questions[group_number]).then((embeddings) => {
						// 'embeddings' is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
						dataset_javascript += group_number + ": tf.tensor(" + JSON.stringify(embeddings.arraySync()) + "),\n";
						embeddings.dispose();
						fill_dataset(group_number+1);
					});      			
        		} else {
        			dataset_javascript += "}\n";
        			callback(dataset_javascript);
        		}
            };
            fill_dataset(0);
        };
		if (save_knn_data) {
			create_classifier_dataset((dataset_javascript) => {
				create_download_anchor(dataset_javascript, "knn-dataset-" + questions_name + ".js");
			});
        }
        const process_mode = () => {
			if (mode === 'answer questions' || mode === 'test') {
				tf.loadLayersModel("models/" + model_options.model_name + ".json").then((model) => {
					loaded_model = model;
					if (mode === 'answer questions') {
						use_model_to_respond_to_question("Warm up GPU").then(() => {
							display_message("Ready to answer questions. Answers will appear here.");
						});
					} else if (mode === 'test') {
						document.body.innerHTML = "Testing started";
						test_all_questions();
					}
				});       	
			} else if (mode === 'create model') {
				load_local_or_remote_scripts(["../js/tfjs-vis.js"],
											 undefined,
											 () => {
												setup_data(next_training);
												});
			} else if (mode === 'search') {
				document.body.innerHTML = "Hyperparameter search started. <span id='experiment-number'>0</span>";
				model_options.on_experiment_end = () => {
					document.getElementById('experiment-number').innerHTML =
						+document.getElementById('experiment-number').innerHTML + 1;
				}
				load_local_or_remote_scripts("../js/hyperparameters.js",
											 undefined,
											 () => {
												setup_data(search);
											 });
			}
        };
        if (use_knn_classifier) {
        	load_local_or_remote_scripts(["../js/knn-classifier.js", // "https://cdn.jsdelivr.net/npm/@tensorflow-models/knn-classifier",
        	                              "knn-dataset-" + questions_name + ".js"], 
        	                             undefined,
        	                             () => {
        	                             	 knn_classifier = knnClassifier.create();
        	                                 knn_classifier.setClassifierDataset(LIFE.knn_dataset);
        	                                 process_mode();
        	                             });
        } else {
        	process_mode();
        }
    });
};

const add_paragraph = (text) => {
    const p = document.createElement('p');
    p.innerHTML = text;
    document.body.appendChild(p);
};
    
const add_sample_questions = () => {  
    add_paragraph("<b><i>Here are some sample questions. Try paraphrasing them.</i></b>");
    group_of_questions.forEach((group) => {
        add_paragraph(group[Math.floor(Math.random()*group.length)]);
    });
};

let last_reported_error;
const record_error = (error) => {
    if (last_reported_error !== error.message) {
        add_paragraph(error.message);
        last_reported_error = error.message;
    }
    console.error(error);
};

// const load_mean_embeddings = (when_loaded_callback) => {
//     const android = (navigator.userAgent.toLowerCase().indexOf('android') >= 0);
// 	const script = document.createElement('script');
// 	if (android) {
// 		script.src = "./mean-embeddings-android.js";
// 	} else {
// 		script.src = "./mean-embeddings.js";
// 	}
// 	script.onload = when_loaded_callback;
// 	document.head.appendChild(script);
// };

let download_logs_button;
	
const update_download_button = () => {
	const logs = window.localStorage.getItem(user_id_for_logs) || "";
	const file = new Blob(["[" + logs + "]"], {type: 'text/plain;charset=UTF-8'});
	download_logs_button.href = URL.createObjectURL(file);
	download_logs_button.download = "logs-" + user_id_for_logs + "-" + new Date().getTime() + ".js";
};

const logging_interface = () => {
	const create_anchor_that_looks_like_a_button = (label, listener) => {
		let button = document.createElement('a');
		button.innerHTML = label;
		button.className = 'generic-button';
		button.style.marginRight = "12px";
		button.href = "#";
		button.addEventListener('click', listener);
		return button;
	};
	const reset_logs = () => {
		if (confirm("Are you sure you want to delete the Snap! logs for " + user_id_for_logs + " stored in this browser?")) {
			localStorage.removeItem(user_id_for_logs);
			update_download_button();
		}
	};
    download_logs_button = create_anchor_that_looks_like_a_button("Download logs for " + user_id_for_logs);
    update_download_button();
    document.body.appendChild(download_logs_button);
    const clear_logs_button = document.createElement('button');
    clear_logs_button.innerHTML = "Click to permanently remove the logs for " + user_id_for_logs + " from this browser";
    clear_logs_button.addEventListener('click', reset_logs);
    clear_logs_button.classList.add('generic-button');
    document.body.appendChild(clear_logs_button);
};

const setup_interface =
	() => {
        let question_area = document.getElementById('question');
        let toggle_speech_recognition = document.getElementById('speech-recognition');
        let sound_effect = document.getElementById('sound');
        let speech_recognition_on = false;
        let first_cant_answer = true;
        const toggle_speech_recognition_label = document.createElement('span');
        const turn_on_speech_recognition_label = "Start listening";
        const turn_off_speech_recognition_label = "Stop listening";
        toggle_speech_recognition_label.innerHTML = turn_on_speech_recognition_label;
        toggle_speech_recognition.appendChild(toggle_speech_recognition_label);
        const respond_with_answer = (answer, question) => {
        	log({answer, question});
        	if (answer) {
        		answer_area.innerHTML = answer;
        		if (speech_recognition_on) {
        			let voices = window.speechSynthesis.getVoices();
        			ecraft2learn.speak(answer_area.textContent, undefined, undefined, 
        							   ecraft2learn.get_voice_number_matching(["uk", "female"], 0));
        		}          
        	} else {
        		answer_area.innerHTML = "<b style='color:red;'>Sorry I can't answer <i>\"" + question + "\"</i></b>";
        		if (speech_recognition_on) {
        			if (first_cant_answer) {
        				first_cant_answer = false;
        				ecraft2learn.speak("Sorry I can't answer '" + question + "'. Next time I can't answer you will only hear the following sound.", 
        								   undefined,
        								   undefined, 
        								   ecraft2learn.get_voice_number_matching(["uk", "female"], 0),
        								   undefined,
        								   undefined,
        								   () => {
        									   sound_effect.play(); 
        								   });
        			} else {
        				sound_effect.play();
        			}
        		}
        	}   
        };
        const answer_question = (question) => {
        	answer_area.innerHTML = "Please wait...";
        	const handle_answer = (response) => {
        		const {best_score, best_answer_index, second_best_score, second_best_answer_index, question_embedding, knn_prediction} = response;
        		const two_possible_answers = () => 
        		    // sum of top two exceeds threshold and they are less than 10% apart
            	       best_score+second_best_score > model_options.score_threshold &&
            		   best_score-second_best_score <= .1;	
				const best_answer_close_enough = async () => {
					const embeddings_tensor = await embedding_model.embed(group_of_questions[best_answer_index]);
					const embeddings_for_top_match = embeddings_tensor.arraySync();
					embeddings_tensor.dispose();
					const distance = (array, tensor) => {
						const another_tensor = tf.tensor(array);
						// both tensors have a norm of 1 so can just do a dot product instead
						const cosine_tensor = tf.metrics.cosineProximity(another_tensor, tensor);
						const cosine = cosine_tensor.arraySync()[0];
						another_tensor.dispose();
						cosine_tensor.dispose();
						return cosine;
					};
					let closest_distance = 1;
					embeddings_for_top_match.forEach(embedding => {
														const distance_to_possible_paraphrasing = distance(embedding, question_embedding);
														if (distance_to_possible_paraphrasing < closest_distance) {
															closest_distance = distance_to_possible_paraphrasing;
														}
													 });
							return closest_distance;
				};
				if (knn_prediction) {
					console.log("knn confidence is " + knn_prediction[best_answer_index].toFixed(4) + " while the model's is " + best_score.toFixed(4));
					const cosine_similarity = tf.dot(LIFE.knn_dataset[best_answer_index], tf.transpose(question_embedding));
					console.log("Distance to best model answer is ");
					tf.print(cosine_similarity);
				}		
				if (best_score >= model_options.score_threshold) {
					respond_with_answer("<b>" + answers[best_answer_index] + "</b>", question);
					question_embedding.dispose();
				} else if (typeof response === 'object' && two_possible_answers()) {
					best_answer_close_enough().then(closest_distance => {
						log({closest_distance});
						if (closest_distance < -.5) {
							respond_with_answer("Unsure which of two answers to give. " +
												"The probability that the following answers your question is " + Math.round(response.best_score*100) + '%: <b>' + 
												answers[response.best_answer_index] + '</b> ' +
												"And the probability that the following answers your question is " + Math.round(response.second_best_score*100) + '%: <b>' + 
												answers[response.second_best_answer_index] + '</b>', 
												question);
						} else {
							respond_with_answer(undefined, question);
						}
						question_embedding.dispose();
					})
				} else {
					respond_with_answer(undefined, question);
					question_embedding.dispose();
				}
				log(response);
			};
		const old_handle_answer = (best_answer_index) => {
            if (typeof best_answer_index === 'number') {
            	respond_with_answer("<b>" + answers[best_answer_index] + "</b>", question);
            }
        };
        if (mode === 'answer questions') {
        	use_model_and_knn_to_respond_to_question(question).then(handle_answer, record_error);
        }
    };
    question_area.addEventListener('keypress',
    							   (event) => {
    								   if (event.keyCode === 13 || event.keyCode === 63) { // ? or new line
    									   answer_question(question_area.value);
    								   };
    							   });
    const recognition_callback = (spoken_text, ignore, confidence) => {
    	log({spoken_text, confidence});
    	question_area.value = spoken_text;
    	answer_question(spoken_text);
    	// and start listening to the next question
    	ecraft2learn.start_speech_recognition(recognition_callback, handle_recognition_error);
    };
    const handle_recognition_error = (error) => {
    	if (error === "no-speech") {
    		// keep listening
    		ecraft2learn.start_speech_recognition(recognition_callback, handle_recognition_error);
    	} else {
    		toggle_speech_recognition_label.innerHTML = 
    			"Type your questions because speech recognition causes this error: " 
    			+ error;
    	}
    };
    const toggle_speech = (event) => {
    	if (speech_recognition_on) {
    		speech_recognition_on = false;
    		toggle_speech_recognition_label.innerHTML = turn_on_speech_recognition_label;
    		ecraft2learn.stop_speech_recognition();
    	} else {
    		speech_recognition_on = true;
    		toggle_speech_recognition_label.innerHTML = turn_off_speech_recognition_label;
    		ecraft2learn.start_speech_recognition(recognition_callback, handle_recognition_error);                     
    	}
    };
    toggle_speech_recognition.addEventListener('click', toggle_speech);
    if (user_id_for_logs) {
    	logging_interface();
    }
    // following would be nice but can't use speech without user action
    // see https://www.chromestatus.com/feature/5687444770914304
	//         if (is_mobile()) {
	//             toggle_speech(); // start with it enabled
	//         }
    add_sample_questions();                           
};

let answer_area;
const display_message = (message) => {
	if (!answer_area) {
		answer_area = document.getElementById('answer');
	}
	answer_area.innerHTML = message;
};

const hash_parameters = new URLSearchParams(window.location.hash.slice(1));
const search_parameters = new URLSearchParams(window.location.search);
const user_id_for_logs = search_parameters.get('log') || hash_parameters.get('log');
const pneumonia_questions = search_parameters.has('pneumonia') || hash_parameters.has('pneumonia');
const covid_questions = search_parameters.has('covid') || hash_parameters.has('covid');

const log = (message) => {
	if (user_id_for_logs) {
		let logs = window.localStorage.getItem(user_id_for_logs);
		const time_stamp = Date.now();
		let json = JSON.stringify({message, time_stamp});
		if (logs) {
			logs += "," + json;
		} else {
			logs = json;
		}
		window.localStorage.setItem(user_id_for_logs, logs);
		update_download_button();
	} else if (log_each_prediction) {
		console.log(message);
	}
};

const create_download_anchor = (contents, file_name) => {
	const data_URL = "data:text;charset=utf-8," + encodeURIComponent(contents);
    const anchor = document.createElement('a');
    anchor.setAttribute("href", data_URL);
    anchor.setAttribute("download", file_name);
    document.body.appendChild(anchor); // required for firefox -- still true???
    anchor.click();
    anchor.remove();
};

let group_of_questions_test = [];

const initialize = () => {
    try {
		setup();
	} catch (error) {
		record_error(error);
	}
    if (mode === 'answer questions') {
    	setup_interface();
    } else if (mode === 'create model') {
    	document.body.innerHTML = "Training started";
    }
    if (mode === 'test' || mode === 'create model') {
    	group_of_questions.forEach((group, group_number) => {
    		tf.util.shuffle(group);
    		group_of_questions_test[group_number] = group.slice(0, number_of_test_questions_per_group);
    		group_of_questions[group_number] = group.slice(number_of_test_questions_per_group);
    	});
    }
};

let questions_name;
let questions_file_name;

document.addEventListener('DOMContentLoaded',    
	() => {
		if (pneumonia_questions) {
			questions_name = "pneumonia-qa";
		} else if (covid_questions) {
			questions_name = "covid-qa-50";
		} else {
			questions_name = "neonatal-qa";
		}
		questions_file_name = "./" + questions_name + ".js";
		load_local_or_remote_scripts([questions_file_name], null, initialize);
// 		if (covid_questions) {
// 			generate_covid_qa_js();
// 		}
	});

const generate_covid_qa_js = () => {
    const add_question_paraphrasings = () => {
    	faq.forEach((qa) => {
    	    qa.questions = [qa.question];
    	    faq_similarity.forEach((similarity) => {
			    if (similarity.similar === 1 && qa.question === similarity.question1 && qa.questions.indexOf(similarity.question2) < 0) {
					qa.questions.push(similarity.question2);
				}
    	    });
        });
    };
    const preamble = [
"// Questions and answers for Covid scenario for LIFE game",
"// Written by Ken Kahn ",
"// Many questions and answers from https://github.com/deepset-ai/COVID-QA/blob/master/data/faqs/faq_covidbert.csv",
"// License: New BSD",
"",
'"use strict";',
"",
"// Most paraphrases by Ken Kahn",
"// a few from https://quillbot.com/",
"",
"LIFE.sentences_and_answers = () => {",
"    let group_of_questions = [];",
"    let answers = [];"
];
     const afterword = [
"",
"    return {group_of_questions, answers};",
"",
"};",
];
    const write_qa_js = () => {
    	add_question_paraphrasings();
    	let qa_js = "";
    	const write = (line) => {
    		// replace new lines with space
    		// and replace bad characters with space as well
    		// and links should open in a new tab
    		qa_js += line.replace(/\n/g, " ").replace(/�/g, " ").replace(/<a /, '<a target="_blank" ') + "\n";
    	};
    	const quote_apostrophes = (string) => {
    		return string.replace(/'/g, "\\'");
    	};
    	preamble.forEach((line) => {
    		write(line);
    	});
    	faq.forEach((qa, index) => {
    		write("group_of_questions.push([ // " + index);
    		qa.questions.forEach((question) => {
    			write("'" + quote_apostrophes(question) + "',")
    		});
    		write(']);');
    		write('answers.push(');
    		write("'" + quote_apostrophes(qa.answerhtml) + "');")
    	});
    	afterword.forEach((line) => {
    		write(line);
    	});
    	console.log(qa_js);
    };
    load_local_or_remote_scripts(["./faq_covidbert_pruned.js", "eval_question_similarity_en.js"], undefined, write_qa_js);
};

return {};

})());
