// Machine learning to provide intelligent support for the University of Oxford's LIFE game
// Written by Ken Kahn 
// License: New BSD

// following originally based upon sample code at 
// https://github.com/tensorflow/tfjs-models/tree/master/universal-sentence-encoder

"use strict";
window.LIFE =
  ((() => {

let group_of_questions = [];
let answers = [];

let embedding_model;
let loaded_model;

let group_of_questions_embeddings = [];
let group_of_questions_mean_embeddings = [];

const use_model_to_respond_to_question = async (the_question) => {
	const start = Date.now();
	return embedding_model.embed([the_question]).then((question_embedding) => {
		const embedding_duration = (Date.now()-start)/1000 + " seconds for embedding";
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
		const total_duration = (Date.now()-start)/1000 + " seconds total"
		log({prediction, the_question, best_score, best_answer_index, embedding_duration, total_duration});
		return({best_answer_index,
			    best_score,
			    second_best_answer_index,
			    second_best_score,
			    question_embedding});
	});
};



const precision = (x, n) => Math.round(x*Math.pow(10, n))/Math.pow(10, n);

const respond_to_question = async (the_question, distance_threshold) => {
    return embedding_model.embed([the_question]).then((embedding) => {
        let best_answer;
        let best_answer_distance = 1;
        let second_best_answer;
        let second_best_answer_distance;
//         console.log(the_question);
//         embedding.print(true /* verbose */);
        group_of_questions_mean_embeddings.forEach((group_mean, mean_number) => {
            let distance = tf.metrics.cosineProximity(embedding.flatten(), group_mean).dataSync()[0];
            if (distance < best_answer_distance) {
                if (best_answer) {
                    second_best_answer = best_answer;
                    second_best_answer_distance = best_answer_distance;
                }
                best_answer = mean_number;
                best_answer_distance = distance;
            }
        });
        if (best_answer_distance > distance_threshold) {
            console.log("No question close enough. Closest question is " + precision(1+best_answer_distance, 3) 
                        + " units away. It is '" + group_of_questions[best_answer][0] + "'");
            return; // no answer 
        }
        console.log("Closest question is " + precision(1+best_answer_distance, 3) 
                    + " units away. It is '" + group_of_questions[best_answer][0] + "'");
        if (second_best_answer) {
            console.log("The second closest question is " + precision(1+second_best_answer_distance, 3) 
                        + " units away. It is '" + group_of_questions[second_best_answer][0] + "'");
        }
        return best_answer;
    });
};

const setup = () => {
	const group_of_questions_and_answers = LIFE.sentences_and_answers();
	group_of_questions = group_of_questions_and_answers.group_of_questions;
	answers = group_of_questions_and_answers.answers;
    const do_when_group_of_questions_mean_embeddings_available = () => {
    	if (mode === 'old test') {
    		console.log(group_of_questions_mean_embeddings);
        	old_test_all_questions();
    	}
    };
    const obtain_embeddings = (group_number) => {
        embedding_model.embed(group_of_questions[group_number]).then((embeddings) => {
            // 'embeddings' is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
            group_of_questions_embeddings.push(embeddings);
            group_of_questions_mean_embeddings.push(embeddings.mean(0));
            if (group_number+1 < group_of_questions.length) {
                obtain_embeddings(group_number+1);
            } else {
                let define_group_of_questions_mean_embeddings = "group_of_questions_mean_embeddings = [\n";
                group_of_questions_mean_embeddings.forEach((embedding) => {
                    define_group_of_questions_mean_embeddings += "tf.tensor1d([" + embedding.dataSync() + "])\n,"                     
                });
                define_group_of_questions_mean_embeddings += "];";
                console.log(define_group_of_questions_mean_embeddings);
                do_when_group_of_questions_mean_embeddings_available();
            }
        });        
    };
    let wrong = [];
    const write_good_and_bad = (question, response, good, group_number, question_number) => {
    	document.writeln(question + "<br>");
    	if (typeof response === 'number') {
    		document.writeln("Bad answer: " + answers[response] + "<br>");
    	} else if (typeof response === 'object') {
    		document.writeln("Best answer has a score of " + response.best_score + 
    		                 " which is less than the threshold of " + model_options.score_threshold + ".<br>");
    		if (response.best_answer_index !== group_number) {
    			document.writeln("Best answer is below threshold and wrong.<br>");
    		}
    		document.writeln("Best answer is: " + answers[response.best_answer_index] + "<br>");
    		document.writeln("And the second best answer is <b>" + 
    			             (response.second_best_answer_index === group_number ? 'correct' : 'wrong') +
    					     "</b> with a score of " + response.second_best_score + ".<br>");
    		if (response.second_best_answer_index !== group_number) {
    			// if it is right then it'll be printed out next
    			document.writeln("Second best answer is " + answers[response.second_best_answer_index] + "<br>");
    		}
    	}
        document.writeln("Good answer: " + good + "<br>");
        document.writeln(group_number + ":" + question_number + " (Group number: question number)<br><br>");
    };
    const test_all_questions = () => {
        group_of_questions.forEach((group, group_number) => {
            group.forEach((question, question_number) => {
            	use_model_to_respond_to_question(question).then(response => {
            		const {best_score, best_answer_index, question_embedding} = response;
					if (best_score < model_options.score_threshold || best_answer_index !== group_number) {
						write_good_and_bad(question, response, answers[group_number], group_number, question_number);
					}
					question_embedding.dispose();
            	});
            }); 
        }); 	
    };
    const old_test_all_questions = () => {
        group_of_questions.forEach((group, group_number) => {
            group.forEach((question, question_number) => {
                embedding_model.embed([question]).then((embedding) => {
                    let distances = [];
                    group_of_questions_mean_embeddings.forEach((group_mean, mean_number) => {
                        let distance = tf.metrics.cosineProximity(embedding.flatten(), group_mean);
                        distances.push([mean_number, distance.dataSync()[0]]);
                    });
                    distances.sort((a, b) => a[1] - b[1]);
                    if (group_number !== distances[0][0]) {
                        wrong.push([question,
                                    "bad answer: " + answers[distances[0][0]],
                                    "good answer:" + answers[group_number],
                                    group_number + ":" + question_number,
                                    distances]);
                        write_good_and_bad(question, distances[0][0], answers[group_number], group_number, question_number);
                        distances.forEach((answer_id_and_distance) => {
                            document.writeln("#" + answer_id_and_distance[0] + " = " + answer_id_and_distance[1] + "<br>");
                        });
                        document.writeln("<br>");
                    }
//                     console.log(distances[0][1]); // just to see what best distances look like
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
		} else if (mode === 'old test' || mode === 'old answer questions') {
			if (group_of_questions_mean_embeddings.length === 0) {
				obtain_embeddings(0);
			} else {
				do_when_group_of_questions_mean_embeddings_available();
			}        	
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
};

const load_mean_embeddings = (when_loaded_callback) => {
    const android = (navigator.userAgent.toLowerCase().indexOf('android') >= 0);
	const script = document.createElement('script');
	if (android) {
		script.src = "./mean-embeddings-android.js";
	} else {
		script.src = "./mean-embeddings.js";
	}
	script.onload = when_loaded_callback;
	document.head.appendChild(script);
};

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
        		const {best_score, best_answer_index, second_best_score, second_best_answer_index, question_embedding} = response;
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
				if (best_score >= model_options.score_threshold) {
					respond_with_answer("<b>" + answers[best_answer_index] + "</b>", question);
					question_embedding.dispose();
				} else if (typeof response === 'object' && two_possible_answers()) {
					const start = Date.now();
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
						console.log((Date.now()-start)/1000 + " seconds to check distances");
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
        	use_model_to_respond_to_question(question).then(handle_answer, record_error);
        } else if (mode === 'old answer questions') {
        	LIFE.respond_to_question(question, -0.55).then(old_handle_answer, record_error);
        	// reasonable matches must be less than -0.55 cosineProximity
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
	} else {
		console.log(message);
	}
};

const initialize = () => {
    try {
		setup();
	} catch (error) {
		record_error(error);
	}
    if (mode === 'old answer questions' || mode === 'old test') {
    	load_mean_embeddings(setup_interface);
    } else if (mode === 'answer questions') {
    	setup_interface();
    } else if (mode === 'create model') {
    	document.body.innerHTML = "Training started";
    }
};

document.addEventListener('DOMContentLoaded',    
	() => {
		let file_name;
		if (pneumonia_questions) {
			file_name = "./pneumonia-qa.js";
		} else if (covid_questions) {
			file_name = "./covid-qa.js";
		} else {
			file_name = "./neonatal-qa.js";
		}
		load_local_or_remote_scripts([file_name], null, initialize);
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

return {respond_to_question: respond_to_question};

})());
