// Machine learning to provide intelligent support for the University of Oxford's LIFE game
// Written by Ken Kahn 
// License: New BSD

// following originally based upon sample code at 
// https://github.com/tensorflow/tfjs-models/tree/master/universal-sentence-encoder

"use strict";
window.LIFE =
  ((() => {

Math.seedrandom(42); // so can shuffle paraphrases and then set aside a subset for testing.

const number_of_test_questions_per_group = 1;

let group_of_questions = [];
let answers = [];

let embedding_model;
let loaded_model;

let knn_classifier; // will be bound if use_knn_classifier is true

const logs = {
	unanswered: [],
	answered: [],
	passed_off_to_others: [],
	too_low_speech_recognition_confidence: []
};

const cosine_similarity = (embedding1, embedding2) => {
	const cosine_similarity_tensor = tf.dot(embedding1, tf.transpose(embedding2));
	const similarity = cosine_similarity_tensor.arraySync()[0];
	cosine_similarity_tensor.dispose();
	return Math.max(...similarity);
};

let model_confidence_threshold = .25;
let model_confidence_threshold_if_knn_rejected = .6;
let similarity_threshold = .75;
let similarity_minimum = .6;
let similarity_only_threshold = .9;
let similarity_difference_threshold = .1;

const use_model_and_knn_to_respond_to_question = async (the_question, answer_expected) => {
    return use_model_to_respond_to_question(the_question).then((model_result) => {
        if (knn_classifier) {
        	const {best_answer_index, best_score, second_best_answer_index, second_best_score, model_predictions, question_embedding} = model_result;
		 	return knn_classifier.predictClass(question_embedding, 2).then(prediction => {
		 		const knn_predictions = Object.values(prediction.confidences);
		 		const combined_result = {...model_result, knn_predictions};
		 		const knn_indices = best_indices(knn_predictions);
		 		const indices_passing_thresholds = [];
		 		const add_index_and_similarity = (new_pair) => {
		 			if (new_pair[1] < similarity_minimum) {
		 				return;
		 			}
		 			if (indices_passing_thresholds.map(pair => pair[0]).indexOf(new_pair[0]) < 0) { // only add it once
		 				indices_passing_thresholds.push(new_pair);
		 			}
		 		};
		 		knn_indices.forEach((knn_index, index) => {
		 			const model_confidence_of_knn_index = model_predictions[knn_index];
		 			const similarity_knn_index = cosine_similarity(question_embedding, LIFE.knn_dataset[knn_index]);
		 			const similarity_model_best = cosine_similarity(question_embedding, LIFE.knn_dataset[best_answer_index]);
		 			if (similarity_model_best >= similarity_only_threshold) {
		 				add_index_and_similarity([knn_index, similarity_knn_index]);
		 			} else if (model_confidence_of_knn_index >= model_confidence_threshold ||
		 			           (knn_index === best_answer_index || knn_index === second_best_answer_index) ||
		 			           similarity_knn_index >= similarity_threshold) {
		 				add_index_and_similarity([knn_index, similarity_knn_index]);
		 			}
		 			if (similarity_model_best >= similarity_only_threshold) {
                        add_index_and_similarity([best_answer_index, similarity_model_best]);
		 			} else if ((best_score >= model_confidence_threshold_if_knn_rejected && 
		 				similarity_model_best >= similarity_threshold)) {
                        add_index_and_similarity([best_answer_index, similarity_model_best]);
		 		    } else if (answer_expected && index === knn_indices.length-1 && add_index_and_similarity.length === 0) {
						console.log({answer_expected, model_confidence_of_knn_index, model_confidence_threshold,
							         knn_index, best_score, best_answer_index, second_best_answer_index, knn_indices,
							         similarity_knn_index, similarity_model_best, model_result});
		 			}
		 		});
		 		if (indices_passing_thresholds.length > 0) {
		 			indices_passing_thresholds.sort((a, b) => b[1]-a[1]); // sort by similarity
					combined_result.best_indices = [indices_passing_thresholds[0][0]]; // top index always reported
					if (indices_passing_thresholds.length > 1) {
						// see if it is a close race and eliminate those not close 
						for (let i = 1; i < indices_passing_thresholds.length; i++) {
							if (indices_passing_thresholds[i-1][1]-indices_passing_thresholds[i][1] < similarity_difference_threshold) {
								combined_result.best_indices.push(indices_passing_thresholds[i][0]);
							}
						}
					}		 			
		 		} else {
		 			combined_result.best_indices = []; // no good matches
// 		 			if (answer_expected) {
// 		 				console.log({knn_predictions, model_predictions});
// 		 			}
		 		}		 		
		 		return(combined_result);
		 	});
        } else {
        	return result;
        }
    });
};

let javascript = "// Automatically generated sentence embeddings for context sensitive questions\nlet questions;\n";

const download_context_sensitive_questions = () => {
	if (LIFE.context_sensitive_questions && LIFE.context_sensitive_questions.length > 0) {
		const {scenario, earliest_step, latest_step, questions, answer} = LIFE.context_sensitive_questions[0];
		const current_scenario = LIFE.scenarios[scenario];
		LIFE.context_sensitive_questions = LIFE.context_sensitive_questions.slice(1);
		embedding_model.embed(questions).then(embeddings => {
			javascript += "questions = {\n";
			javascript += "embeddings: tf.tensor(" + JSON.stringify(embeddings.arraySync()) + "),\n";
			javascript += "questions: " + JSON.stringify(questions) + ",\n";
			javascript += "answer: " + JSON.stringify(answer) + "};\n"; 
				for (let i = earliest_step; i <= latest_step; i++) {
					javascript += "if (typeof LIFE.scenarios[" + scenario + "][" + i + "].context_sensitive_questions !== 'object') {\n";
					javascript += "  LIFE.scenarios[" + scenario + "][" + i + "].context_sensitive_questions = [];\n}\n";
					javascript += "LIFE.scenarios[" + scenario + "][" + i + "].context_sensitive_questions.push(questions);\n";
				}
				download_context_sensitive_questions();
			});
	} else {
		create_download_anchor(javascript, "context_sensitive_covid_questions.js");
	}
};

const use_model_to_respond_to_question = async (the_question) => {
	return embedding_model.embed([the_question]).then((question_embedding) => {
		const prediction_tensor = loaded_model.predict([question_embedding]);
		const model_predictions = prediction_tensor.arraySync()[0];
		prediction_tensor.dispose();
		let best_score = 0;
		let second_best_score;
		let best_answer_index;
		let second_best_answer_index;
		model_predictions.forEach((score, index) => {
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
		log({model_predictions, the_question, best_score, best_answer_index});
        return({best_answer_index,
			    best_score,
				second_best_answer_index,
				second_best_score,
				model_predictions,
				question_embedding});			
	});
};

const best_indices = (list) => {
	const list_and_indices = list.map((element, index) => [element, index]);
    list_and_indices.sort((a, b) => b[0]-a[0]);
    const indices_of_non_zero_values = [];
    list_and_indices.forEach(element_and_index => {
    	if (element_and_index[0] !== 0) {
    		indices_of_non_zero_values.push(element_and_index[1]);
    	}
    });
    return indices_of_non_zero_values;
};

// const precision = (x, n) => Math.round(x*Math.pow(10, n))/Math.pow(10, n);

const setup = () => {
	const group_of_questions_and_answers = LIFE.sentences_and_answers();
	group_of_questions = group_of_questions_and_answers.group_of_questions;
	answers = group_of_questions_and_answers.answers;
	let group_of_questions_embeddings = [];
	const obtain_embeddings = (group_of_questions, callback) => {
		if (typeof all_questions === 'undefined') {
			obtain_USE_embeddings(group_of_questions, callback);
		} else {
			obtain_gpt3_embeddings(group_of_questions, callback);
		}
	};
    const obtain_USE_embeddings = (group_of_questions, callback, group_number) => {
        if (typeof group_number === 'undefined') {
          	group_number = 0;
        }
        if (group_number === 0) {
            group_of_questions_embeddings = [];
        }        
        embedding_model.embed(group_of_questions[group_number]).then((embeddings) => {
            // 'embeddings' is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
            group_of_questions_embeddings.push(embeddings);
            if (group_number+1 < group_of_questions.length) {
                obtain_USE_embeddings(group_of_questions, callback, group_number+1);
            } else {
            	callback(group_of_questions_embeddings);
            }
        });        
    };
    let wrong = [];
    const top_two_indices = (list) => { // obsolete????
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
    const write_good_and_bad = (question, response, good, group_number, question_number, message, best_indices) => {
    	document.writeln(question + "<br>");
    	document.writeln("<b>" + message + "</b><br>");
    	best_indices.forEach((wrong_index, i) => {
    		document.writeln("Wrong questions #" + i + ":<br>");
    		group_of_questions[wrong_index].forEach(question => {
    			document.writeln("<blockquote>" + question + "</blockquote>");
    		});
    		document.writeln("<br>");
    	});
    	if (typeof response === 'number') {
    		document.writeln("Bad answer: " + answers[response] + "<br>");
//     	} else if (typeof response === 'object') {
//     		const {best_score, best_answer_index, second_best_answer_index, second_best_score, question_embedding, knn_predictions} = response;
//     		const [best_knn_index, second_best_knn_index] = knn_predictions ? top_two_indices(knn_predictions) : [-1, -1];
//     		document.writeln(group_number + ":" + question_number + " (Group number: question number)<br>");
//     		document.writeln("model: " + best_answer_index + ", " + second_best_answer_index + "<br>");
//     		if (best_knn_index >= 0) {
//     			document.writeln("KNN  : " + best_knn_index + ", " + second_best_knn_index + "<br>");
//     		}
//     		if (best_answer_index !== group_number) {
//     			document.writeln("Best model answer is <b>wrong</b>. ");
//     		}
//     		if (best_knn_index >= 0 && best_knn_index !== group_number) {
//     			document.writeln("KNN's best answer is <b>wrong</b>.");
//     		}
//     		document.writeln("<br>");
//     		if (best_knn_index >= 0 && best_answer_index !== best_knn_index) {
//     			document.writeln("Model (" + best_answer_index + ") and KNN (" + best_knn_index + ") <b>disagree</b> on best answer.<br>");
//     		}
//     		if (best_knn_index >= 0 && second_best_answer_index !== second_best_knn_index && second_best_knn_index >= 0) {
//     			document.writeln("Model (" + second_best_answer_index + ") and KNN (" + second_best_knn_index + ") disagree on second best answer.<br>");
//     		}
//     		document.writeln("Best model answer has a model second best score of " + second_best_score.toFixed(4));
//     		if (best_knn_index >= 0) {
//     			document.writeln(" and that answer has a KNN score of " + knn_predictions[second_best_answer_index].toFixed(4));
//     			if (second_best_answer_index !== second_best_knn_index && second_best_knn_index >= 0) {
//     				document.writeln(". And KNN's second best answer's score is " + knn_predictions[second_best_knn_index].toFixed(4))
//     			}							
// 			}
// 			document.writeln(".<br>");
//     		document.writeln("Best model answer is: <blockquote>" + answers[best_answer_index] + "</blockquote>");
//     		document.writeln("And the second best model answer is <b>" + 
//     			             (second_best_answer_index === group_number ? 'correct' : 'wrong') +
//     					     "</b> with a score of " + second_best_score.toFixed(4) + ".<br>");
//     		if (best_knn_index >= 0) {
//     			document.writeln("KNN confidence of second best is " + knn_predictions[second_best_answer_index].toFixed(4) + ".<br>");								
// 			}
//     		if (best_knn_index >= 0 && second_best_knn_index !== group_number && second_best_answer_index !== second_best_knn_index && second_best_knn_index >= 0) {
//     			document.writeln("Second best model (" + second_best_answer_index + ") and KNN (" + second_best_knn_index + ") <b>disagree</b>.<br>");
//     		}
//     		if (second_best_answer_index !== group_number) {
//     			// if it is right then it'll be printed out next
//     			document.writeln("Second best model answer is <blockquote>" + answers[second_best_answer_index] + "</blockquote><br>");
//     		}
    	}
        document.writeln("Good answer: <blockquote>" + good + "</blockquote><br><br>");
    };
    const test_all_questions = () => {
    	let total = 0;
    	let no_answer = 0;
    	let singleton_response_right = 0;
    	let singleton_response_wrong = 0;
    	let first_of_many_responses_right = 0;
    	let second_of_many_responses_right = 0;
    	let many_responses_wrong = 0;
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
            	use_model_and_knn_to_respond_to_question(question, group_number).then(response => {
            		const {best_indices, best_score, best_answer_index, second_best_score, second_best_answer_index, question_embedding, knn_predictions} = response;
            		response.correct_index = group_number;
            		if (knn_predictions) {
            			const add_problem_to_page = (message) => {
            			    write_good_and_bad(question, response, answers[group_number], group_number, question_number, message, best_indices);
            			};
						total++;
						const more_info = '<br>Best score = ' + best_score.toFixed(4) + "; best score index = " + best_answer_index + 
							              "; second best score = " + second_best_score.toFixed(4) + "; second best index = " + second_best_answer_index +
							              ' ;Correct answer = ' + group_number;
						if (best_indices.length === 0) {
							no_answer++;
							add_problem_to_page('No answer. ' + more_info);
							console.log("no answer", response);
						} else if (best_indices.length === 1) {
							if (best_indices[0] === group_number) {
								singleton_response_right++;
							} else {
								singleton_response_wrong++;
								add_problem_to_page('singleton wrong: ' + best_indices[0] + " != " + group_number + more_info);
								console.log("singleton wrong", response);
								if (second_best_answer_index === group_number) {
									// right but below score threshold
									const similarity = cosine_similarity(question_embedding, LIFE.knn_dataset[second_best_answer_index]);
									console.log("similarity with second best model index", similarity);
								} else {
									const similarity = cosine_similarity(question_embedding, LIFE.knn_dataset[best_indices[0]]);
									console.log("similarity with best overall index (incorrect) ", similarity);									
								}
							}
						} else {
							if (best_indices[0] === group_number) {
								first_of_many_responses_right++;
							} else if (best_indices[1] === group_number) {
								second_of_many_responses_right++;
							} else {
								many_responses_wrong++;
								add_problem_to_page('top two responses wrong: ' + best_indices[0] + " and " + best_indices[1] + " != " + group_number + more_info);
								console.log("top two responses wrong", response);
							}
						}
						// and now the old obsolete? measurements
						const [best_knn_index, second_best_knn_index] = top_two_indices(knn_predictions);
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
							console.log({no_answer, singleton_response_right, singleton_response_wrong, 
							             first_of_many_responses_right, second_of_many_responses_right, many_responses_wrong});
							console.log("old",
							            {total, both_right, model_only_right, knn_only_right, both_wrong, 
									     model_right_knn_second_right, knn_right_model_second_right,
									     votes_right_if_either_wrong});
				            if (total === singleton_response_right + first_of_many_responses_right) {
				            	document.writeln("All " + total + " questions answered correctly!");
				            }
				            if (negative_test) {
				            	knn_classifier.setClassifierDataset(LIFE.knn_dataset); // includes the test questions which are removed for testing
				            	load_and_test_negative_questions();
				            }
						}
						question_embedding.dispose();
// 						if (best_answer_index !== group_number || best_knn_index !== group_number) {
// 							// at least one is wrong
// 							const votes = {};
// 							const model_weight = 0.5;
// 							const knn_weight = 1-model_weight;
// 							votes[best_answer_index] = model_weight*best_score +
// 							                           (second_best_knn_index === best_answer_index ? 
// 							                            knn_weight*knn_predictions[second_best_knn_index] : 
// 							                            0);
// 							votes[second_best_answer_index] = model_weight*second_best_score +
// 							                                  (best_knn_index === second_best_answer_index ? 
// 							                                   knn_weight*knn_predictions[best_knn_index] :
// 							                                   (second_best_knn_index === second_best_answer_index ?
// 							                                    knn_weight*knn_predictions[second_best_knn_index] :
// 							                                    0));
// 						    if (best_knn_index !== best_answer_index && best_knn_index !== second_best_answer_index) {
// 						    	votes[best_knn_index] = knn_weight*knn_predictions[best_knn_index];
// 						    }
// 						    if (second_best_knn_index !== best_answer_index && 
// 						        second_best_knn_index !== second_best_answer_index &&
// 						        second_best_knn_index >= 0) {
// 						    	votes[second_best_knn_index] = knn_weight*knn_predictions[second_best_knn_index];
// 						    }
// 						    const winner = (votes) => {
// 						    	let best_so_far = Number.MIN_VALUE;
// 						    	let best_index;
// 						    	Object.entries(votes).forEach((entry) => {
// 						    		if (entry[1] > best_so_far) {
// 						    			best_so_far = entry[1];
// 						    			best_index = entry[0];
// 						    		}
// 						    	});
// 						    	return +best_index;
// 						    };
// 						    if (winner(votes) === group_number) {
// 						    	votes_right_if_either_wrong++;
// 						    } else {
// 						    	// neither unanimous nor did voting work
// 						    	const best_knn_score = knn_predictions[best_knn_index];
// 						    	const second_best_knn_score = knn_predictions[second_best_knn_index];
// 								console.log({group_number, best_answer_index, second_best_answer_index,
// 								             best_score, second_best_score,
// 											 best_knn_index, second_best_knn_index,
// 											 best_knn_score, second_best_knn_score,
// 											 votes,
// 											 question_number});						    	
// 						    }
// 						}
            		}
// 					if (best_score < threshold || 
// 					    best_answer_index !== group_number ||
// 					    (knn_predictions && knn_predictions[group_number] < threshold)) {
// 						write_good_and_bad(question, response, answers[group_number], group_number, question_number);
// 					}
            	});
            }); 
        });
    };
    let topic_index = 0;
    const load_and_test_negative_questions = () => {
    	const test_negative_questions = () => {
    		const group_of_questions_and_answers = LIFE.sentences_and_answers();
	        const negative_group_of_questions = group_of_questions_and_answers.group_of_questions;
	        const answer = (group_of_questions, group_number, question_number, answers_when_there_are_none) => {
	        	const group = group_of_questions[group_number];
	        	const question = group[question_number];
				use_model_and_knn_to_respond_to_question(question, false).then(response => {
					const {best_indices, best_answer_index, model_predictions, knn_predictions, question_embedding} = response;
					if (best_indices.length > 0) {
						answers_when_there_are_none++;
						const similarity = cosine_similarity(question_embedding, LIFE.knn_dataset[best_indices[0]]);
						const closest_question_knn = group_of_questions[best_indices[0]];
						const closest_question_model = group_of_questions[best_answer_index];
						console.log({similarity, response, question, closest_question_knn, closest_question_model});
					}
					question_embedding.dispose();
					if (question_number < group.length-1) {
						answer(group_of_questions, group_number, question_number+1, answers_when_there_are_none);
					} else if (group_number < group_of_questions-1) {
						answer(group_of_questions, group_number+1, 0, answers_when_there_are_none);
					} else {
						console.log({answers_when_there_are_none});
						topic_index++;
						load_and_test_negative_questions();
					}
				});	
			};
    		answer(negative_group_of_questions, 0, 0, 0);
    	};
    	if (topics[topic_index] === topic) { // skip the positive one
    		topic_index++
    	}
    	if (topic_index > topics.length-1) {
    		return;
    	}
    	let questions_name = topic_to_questions_name[topics[topic_index]];
        console.log("Testing negative " + questions_name);
		load_local_or_remote_scripts([// "knn-dataset-" + questions_name + ".js", 
		                              questions_name + ".js"],
									 undefined,
									 test_negative_questions);        	
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
    };
    const training_data = (callback) => {
    	let inputs_and_outputs = [];
    	let group_tensors;
    	if (LIFE.knn_dataset) {
    		group_tensors = Object.values(LIFE.knn_dataset);
    	} else {
    		// GPT-3 embeddings
    		obtain_embeddings(group_of_questions,
    		                  (embeddings) => {
    		                  	 group_tensors = embeddings;
    		                  });    		                  
    	} 	
    	const number_of_groups = group_tensors.length;
    	group_tensors.forEach((group_tensor, group_number) => {
    		const group_embeddings = group_tensor.arraySync().slice(number_of_test_questions_per_group);
    		group_tensor.dispose();
    		group_embeddings.forEach((sentence_embedding) => {
    			inputs_and_outputs.push([sentence_embedding, group_number]);
    		})    		
    	});
    	tf.util.shuffle(inputs_and_outputs);
    	const xs = tf.tensor(inputs_and_outputs.map(input_and_output => input_and_output[0]));
    	const ys = tf.oneHot(tf.tensor1d(inputs_and_outputs.map(input_and_output => input_and_output[1]), 'int32'), number_of_groups);
    	callback({xs, ys});
//     	const number_of_groups = group_of_questions.length;
//     	group_of_questions.forEach((group, group_number) => {
//             group.forEach((question) => {
//             	questions.push(question);
//             	outputs.push(group_number);
//             });
//     	});	
//     	get_embeddings(questions, (embeddings) => {
// 			callback({xs: embeddings,
// 					  ys: ys});
//     	});
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
    const training_scripts =
        ["../ecraft2learn.js",
        "../js/train.js",
        "../js/invoke_callback.js",
        "../js/train-report-results.js"];
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
		const create_classifier_dataset_javascript = (callback) => {
        	const group_of_questions_and_answers = LIFE.sentences_and_answers();
        	const group_of_questions = group_of_questions_and_answers.group_of_questions;
        	let dataset_javascript = "// Automatically generated sentence embeddings of " + topic_to_questions_name[topic] + "\n";
        	dataset_javascript += "LIFE.knn_dataset = {\n";
        	const fill_dataset = (group_number) => {
        		if (group_number < group_of_questions.length) {
        			const questions = group_of_questions[group_number]; 
					embedding_model.embed(questions).then((embeddings) => {
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
			create_classifier_dataset_javascript((dataset_javascript) => {
				create_download_anchor(dataset_javascript, "knn-dataset-" + topic_to_questions_name[topic] + ".js");
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
						// KNN should only use the questions remaining after test questions removed
						obtain_embeddings(group_of_questions, 
						                  (knn_dataset) => {
						                  	  knn_classifier.setClassifierDataset(knn_dataset);
						                  	  test_all_questions();
						                  });
					}
				});       	
			} else if (mode === 'create model') {
				load_local_or_remote_scripts([...training_scripts,
				                              "../js/tfjs-vis.js"],
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
				load_local_or_remote_scripts([...training_scripts, "../js/hyperparameters.js"],
											 undefined,
											 () => {
												setup_data(search);
											 });
			}
        };
        if (just_download_context_sensitive_questions) {
			download_context_sensitive_questions();
        } else if (use_knn_classifier) {
        	load_local_or_remote_scripts(["../js/knn-classifier.js", // "https://cdn.jsdelivr.net/npm/@tensorflow-models/knn-classifier",
        	                              "knn-dataset-" + topic_to_questions_name[topic] + ".js"], 
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

let question_area; // there may not be one

const keep_listening = false; // if true speech recognition should stay on until explictly stopped but never fully debugged
// strange that onend events repeatedly triggered

const setup_interface =
	() => {
        question_area = document.getElementById('question');
        let toggle_speech_recognition = document.getElementById('speech-recognition');
        let sound_effect = sounds.wrong; // used when question heard but no answer forthcoming
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
        			let voices = window.speechSynthesis.getVoices(); // does this cause the voices to be pre-loaded?
        			speak(answer_area.textContent);
        		}          
        	} else {
        		answer_area.innerHTML = "<b style='color:red;'>Sorry I can't answer <i>\"" + question + "\"</i></b>";
        		if (speech_recognition_on) {
        			if (first_cant_answer) {
        				first_cant_answer = false;
        				speak("Sorry I can't answer '" + question + "'. Next time I can't answer you will only hear the following sound.", 
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
        		const {best_indices, best_score, best_answer_index, second_best_score, second_best_answer_index, question_embedding, knn_predictions} = response;	
				if (best_indices.length === 1) {
					respond_with_answer("<b>" + answers[best_indices[0]] + "</b>", question);
				} else if (best_indices.length > 1) {
					// ignoring more than 2 answers for now
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
				log(response);
			};
        if (mode === 'answer questions') {
        	use_model_and_knn_to_respond_to_question(question, true).then(handle_answer, record_error);
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
//     	ecraft2learn.start_speech_recognition_v2(recognition_callback, {error_callback: handle_recognition_error, keep_listening});
    };
    const handle_recognition_error = (error) => {
    	if (listening) {
			if (error === "no-speech") {
				// keep listening
				turn_speech_recognition_on(true);
			} else {
				toggle_speech_recognition_label.innerHTML = 
					"Type your questions because speech recognition causes this error: " 
					+ error;
			}    		
    	}
    };
    const toggle_speech = () => {
    	// this is for the interface where questions can be typed (not the covid scenario)
    	if (speech_recognition_on) {
    		speech_recognition_on = false;
    		toggle_speech_recognition_label.innerHTML = turn_on_speech_recognition_label;
    	} else {
    		speech_recognition_on = true;
    		toggle_speech_recognition_label.innerHTML = turn_off_speech_recognition_label;
    	}
    	turn_speech_recognition_on(speech_recognition_on);
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
	if (mode === 'covid scenario') {
		const files = ["covid-scenario-" + covid_scenario_number + ".js"];
		if (listen_and_speak) {
			files.push("context_sensitive_covid_questions.js");
			files.push("../ecraft2learn.js"); // for convenience in using speech recognition and synthesis
			files.push("../js/invoke_callback.js");
			files.push("../js/knn-classifier.js"); // "https://cdn.jsdelivr.net/npm/@tensorflow-models/knn-classifier",
        	files.push("knn-dataset-" + topic_to_questions_name[topic] + ".js");
		}
		load_local_or_remote_scripts(files, undefined, initialize_covid_scenario);				                             
	} else if (mode === 'answer questions') {
		document.getElementById('question answering interface').hidden = false;
    	load_local_or_remote_scripts(["../ecraft2learn.js", "../js/invoke_callback.js"], undefined, setup_interface);
    } else if (mode === 'create model') {
    	document.body.innerHTML = "Training started";
    }
    if (mode === 'test') { //  || mode === 'create model'
    	split_into_train_and_test_datasets();
    }
};

const load_question_answering_model = (callback) => {
    use.load().then((model) => {
		embedding_model = model;
		knn_classifier = knnClassifier.create();
		knn_classifier.setClassifierDataset(LIFE.knn_dataset);
		tf.loadLayersModel("models/" + model_options.model_name + ".json").then((model) => {
			loaded_model = model;
			use_model_to_respond_to_question("Warm up GPU").then(() => {});
			callback();
		});
	});
};

const step_types = {1: 'display info',
                    2: 'quiz',
                    3: 'display info', // unclear why this is different from type 1
                    5: 'finished', // needed?
                    6: 'display algorithm',
                    7: 'video'};


const opening_credits_container = document.getElementById('opening-credits');
const opening_credits_image = document.getElementById('opening-credits-image');
const next_item_button = document.getElementById('next-item-button');
const previous_item_button = document.getElementById('previous-item-button');
const previous_item_button_in_quiz = document.getElementById('previous-item-button-in-quiz');
const previous_item_button_video = document.getElementById('previous-item-button-video');
const next_item_button_video = document.getElementById('next-item-button-video');
const more_info_button = document.getElementById('more-info-button');
const help_link = document.getElementById('help');
const quit_button = document.getElementById('quit-button');
const toggle_listen_button = document.getElementById('toggle-listen-button');
const final_message = document.getElementById('final-message');
const congratulations = document.getElementById('congratulations');
const scenario_interface = document.getElementById('scenario-interface');
const scenario_info = document.getElementById('scenario-info');
const doctor_image = document.getElementById('doctor-image'); // container of the following
const doctor_image_eyes_open = document.getElementById('doctor-image-eyes-open');
const doctor_image_eyes_closed = document.getElementById('doctor-image-eyes-closed');
const algorithm = document.getElementById('algorithm');
const quiz_interface = document.getElementById('quiz-interface');
const quiz_question = document.getElementById('quiz-question');
const quiz_options = document.getElementById('quiz-options');
const video_interface = document.getElementById('video-interface');
const video = document.getElementById('video');
const submit_button = document.getElementById('submit-button');
const answer_to_question_container = document.getElementById('answer-to-question-container');
const answer_to_question = document.getElementById('answer-to-question');
const answer_to_question_close_button = document.getElementById('answer-to-question-close-button');
const last_thing_heard_feedback = document.getElementById('last-thing-heard');
const sounds = {wrong: document.getElementById('wrong-sound'),
                right: document.getElementById('right-sound'),
                next: document.getElementById('next-sound'),
                back: document.getElementById('back-sound'),
                more_info: document.getElementById('more-info-sound')};

let scenario;

// can't start speaking until the user has done something
let user_action_has_been_performed = false;
let speech_ready_notification_permitted = false;
const user_action_performed = () => {
	if (!user_action_has_been_performed) { // first time
		user_action_has_been_performed = true;
		if (speech_ready_notification_permitted) {
			notify_speech_ready();
		}		
	}
};

const notify_speech_ready = () => {
	window.speechSynthesis.cancel(); // fixes a mysterious problem where the speaking is in progress forever without making a sounds
	let callback = () => {
		sounds.more_info.play();
		if (!document.hidden) {
			window.speechSynthesis.cancel();
			ecraft2learn.speaking_ongoing = false;
			console.log("starting speech recognition");
			turn_speech_recognition_on(true);
		}
	};
	const run_callback_only_once = () => {
		if (callback) {
            callback();
            callback = undefined;
        }
	};
	speak("Ready to listen to your questions. You'll hear this noise if I can't answer the question.", run_callback_only_once);
	toggle_listen_button.innerHTML = turn_off_listen;
	toggle_listen_button.addEventListener('click', toggle_listen);
	// following works around a bug where the speech never ends (though nothing is heard)
    setTimeout(run_callback_only_once, 7500);
};

let listening = true;
const turn_off_listen = "Stop listening to speech";
const resume_listen = "Resume listening to speech";
const not_yet_ready_to_listen = "Not yet ready to listen to speech";

const toggle_listen = () => {
	// this is only for the Covid scenarios
	turn_speech_recognition_on(!listening);
};

const turn_speech_recognition_on = (flag) => {
	listening = flag;
	if (listening) {
        ecraft2learn.start_speech_recognition_v2(speech_listening_callback, 
												 {error_callback: handle_recognition_error,
												  keep_listening});
    } else {
		ecraft2learn.stop_speech_recognition()
	}
	if (listening) {
       	toggle_listen_button.innerHTML = turn_off_listen;
    } else {
        toggle_listen_button.innerHTML = resume_listen; 
    }
};

const initialize_covid_scenario = () => {
	scenario = LIFE.scenarios[covid_scenario_number]; // set this once scenario file has loaded 
	previous_item_button.addEventListener('click', previous_item_button_action);
	previous_item_button_in_quiz.addEventListener('click', previous_item_button_action);
	previous_item_button_video.addEventListener('click', previous_item_button_action);
	next_item_button.addEventListener('click', next_item_button_action);
	next_item_button_video.addEventListener('click', next_item_button_action);
	hide_element(more_info_button);
	more_info_button.addEventListener('click', display_more_info);
	answer_to_question_close_button.addEventListener('click', 
	    () => {
	    	answer_to_question_container.hidden = true;
	    	if (window.speechSynthesis) {
                window.speechSynthesis.cancel(); // should stop all utterances
            }
	    });
	quit_button.addEventListener('click', display_final_message);
	toggle_listen_button.innerHTML = not_yet_ready_to_listen;
	blink_doctor_image();
	if (initial_step_number === 0) { // URL parameter not used to start in the middle
		opening_credits();
	} else {
		leave_opening_credits();
	}
    if (listen_and_speak) {
    	load_question_answering_model(() => {
    		// if tab is minimized then recognition is stopped, start listening again when no longer hidden
			window.addEventListener('visibilitychange', () => {
				turn_speech_recognition_on(!document.hidden);
			});
    		if (user_action_has_been_performed) {
				notify_speech_ready();
			} else { // notify when first user action performed
				speech_ready_notification_permitted = true;
			}
    	});
    }
};

let opening_credits_urls = ["./images/credits.png", "./images/legal.png", "./images/start.png"];
const opening_credits_duration = 2000;

const opening_credits = () => {
	const next_image = () => {
		if (opening_credits_urls.length > 0) {
			opening_credits_image.src = opening_credits_urls[0];
			opening_credits_urls = opening_credits_urls.slice(1);
			window.setTimeout(next_image, opening_credits_duration);
		} else {
			leave_opening_credits();
		}
	};
	opening_credits_container.hidden = false;
	opening_credits_image.addEventListener('click', next_image);
	window.setTimeout(next_image, opening_credits_duration);
};

const leave_opening_credits = () => {
	opening_credits_container.hidden = true;
	scenario_interface.hidden = false;
	show_element(help_link);
	show_element(quit_button);
	show_element(toggle_listen_button);
	run_covid_scenario();
};

const plain_text = (html) => {
	const div = document.createElement('div');
	div.innerHTML = html;
	return div.textContent;
};

const speak = (message, callback) => {
	ecraft2learn.speak(message,
			           undefined,
			           undefined, 
			           ecraft2learn.get_voice_number_matching(["uk", "female"], 0),
			           undefined,
			           undefined,
			           callback);
};

const ask_site = (question) => {
	question = question.toLowerCase();
	let end_of_trigger_index = contains_fragment(['research explorer'], question);
	if (end_of_trigger_index) {
		return ask_research_explorer(question.slice(end_of_trigger_index).trim());
	}
	let end_of_who = contains_fragment(['who', 'w h o', 'wh0', 'w80', 'who0'], question);
	if (end_of_who) {
		end_of_trigger_index = contains_fragment(['newsroom', 'news room'], question);
		if (end_of_trigger_index) {
			return ask_WHO_newsroom(question.slice(end_of_trigger_index).trim());
		}
		end_of_trigger_index = contains_fragment(['publications', 'publication'], question);
		if (end_of_trigger_index) {
			return ask_WHO_publications(question.slice(end_of_trigger_index).trim());
		}
		end_of_trigger_index = contains_fragment(['advice for the public', 'advice to the public', 'public advice'], question);
		if (end_of_trigger_index) {
			return ask_WHO_advice_for_the_public(question.slice(end_of_trigger_index).trim());
		}
		return ask_WHO(question.slice(end_of_who).trim());
	}
};

const contains_fragment = (fragments, question) => {
	for (let i = 0; i < fragments.length; i++) {
		const fragment = fragments[i];
		const index = question.indexOf(fragment);
		if (index >= 0) {
			return index+fragment.length;
		}
	}
};

const ask_research_explorer = (question) =>
    `<div><p>Exercise scepticism when perusing these results since many papers are pre-prints or report on preliminary or tentative findings.</p>
     <iframe width=768 height=386 src="https://covid19-research-explorer.appspot.com/results?mq= ${question}"></div>`;

const ask_WHO = (question) => 
    `<a href="https://www.google.com/search?q=${question} site%3Awho.int" target="_blank">
     Click to see what is in the WHO website related to "${question}"</a>`;

const ask_WHO_newsroom = (question) => 
    `<a href="https://www.google.com/search?q=${question} site%3Awho.int%2Fnews-room%2Fq-a-detail%2F" target="_blank">
     Click to see what is in the WHO newsroom related to "${question}"</a>`;

const ask_WHO_advice_for_the_public = (question) =>
    `<a href="https://www.google.com/search?q=${question} site%3A%2Fwww.who.int%2Femergencies%2Fdiseases%2Fnovel-coronavirus-2019%2Fadvice-for-public%2F" target="_blank">
     Click to see the WHO advice to the public related to "${question}"</a>`;

const ask_WHO_publications = (question) => 
   `<a href="https://www.google.com/search?q=${question} site%3Ahttps%3A%2F%2Fwww.who.int%2Fpublications%2Fi%2Fitem%2F" target="_blank">
    Click to see the WHO publications related to "${question}"</a>`;
// following caused error:
//?covid-scenario=1&covid&listen:1 Refused to display 'https://www.google.com/search?q=site%3Ahttps%3A%2F%2Fwww.who.int%2Fpublications%2Fi%2Fitem%2F%20s%20if%20someone%20can%20get%20covered%20twice' in a frame because it set 'X-Frame-Options' to 'sameorigin'.   
//          '<div><p>Publications from WHO.</p>' +
// 		 '<iframe width=768 height=386 src="https://www.google.com/search?q=site%3Ahttps%3A%2F%2Fwww.who.int%2Fpublications%2Fi%2Fitem%2F ' + question + '"></div>';

const speech_listening_callback = (original_question, ignore, confidence) => {
	let question = original_question.toLowerCase();
	question = question.replace(/covered/gi, 'covid'); // correct for speech recognition mistake
    const process_response = (response) => {
	    const {best_indices, question_embedding, best_score} = response;
		if (best_indices.length === 1) { // what if there are more than one answer?
			const answer = answers[best_indices[0]];
			process_answer(answer);
			logs.answered.push({question, answer, score: best_score});
		} else {
            if (is_covid_question(question)) {
				speak("This app can't answer your question so passing it along to Google's Covid research explorer");
				answer_to_question_container.hidden = false;
				answer_to_question.innerHTML = ask_research_explorer(question);
				logs.passed_off_to_others.push({question: original_question});
			} else {
				sounds.more_info.play();
				logs.unanswered.push({question});
			}
		}
		question_embedding.dispose();
		console.log(response); // for now
    };
    const process_answer = (answer) => {
    	speak(plain_text(answer));
		answer_to_question_container.hidden = false;
		answer_to_question.innerHTML = answer;
// 		console.log({answer});
    };
    if (user_action_has_been_performed) {
        if (confidence >= .5) {
			const otherwise = () => {
				use_model_and_knn_to_respond_to_question(question, true).then(process_response);
			};
			const ask_site_html = ask_site(question);
            if (ask_site_html) {
            	answer_to_question_container.hidden = false;
		        answer_to_question.innerHTML = ask_site_html;
		        logs.passed_off_to_others.push({question});
			} else {
			    try_context_sensitive_questions(question, scenario[step_number].context_sensitive_questions, process_answer, otherwise);
			}
		} else {
			logs.too_low_speech_recognition_confidence.push({question, confidence});
		}
    }
    display_feedback(question + " (confidence: " + confidence.toFixed(2) + ")");
};

const display_feedback = (html) => {
   	show_element(last_thing_heard_feedback);
   	last_thing_heard_feedback.innerHTML = html;
   	window.setTimeout(() => hide_element(last_thing_heard_feedback), 8000);	
};

const is_covid_question = (question) => {
	const covid_words = ['covid', 'corona', 'virus', 'sars', 'pandemic', 'epidemic'];
	const question_lower_case = question.toLowerCase();
	for (let i = 0; i < covid_words.length; i++) {
        if (question_lower_case.indexOf(covid_words[i]) >= 0) {
        	return true;
        }
	}
	return false;
};

const handle_recognition_error = (error) => {
	if (listening) {
		if (error === "no-speech" || error === "No speech heard for a while." || error === 'aborted') {
			if (!document.hidden) {
				// keep listening but seem to need to do a full restart
				ecraft2learn.stop_speech_recognition();
				turn_speech_recognition_on(true);
			}
		} else {
			console.log("Recognition error: ", error);
			display_feedback(error);
		}		
	}
};

const sensitive_question_threshold = .75;

const try_context_sensitive_questions = (question, questions_and_answers, process_answer, callback_if_no_answer) => {
	if (!questions_and_answers || questions_and_answers.length === 0) {
		callback_if_no_answer();
	} else {
		const {embeddings, questions, answer} = questions_and_answers[0];
		embedding_model.embed([question]).then((question_embedding) => {
			const similarity = cosine_similarity(question_embedding, embeddings);
			if (similarity > sensitive_question_threshold) {
				logs.answered.push({question, answer, score: similarity, context_sensitive: true});
				process_answer(answer);
			} else {
				try_context_sensitive_questions(question, questions_and_answers.slice(1), process_answer, callback_if_no_answer);
			}
		});		
	}
};

const display_more_info = () => {
	answer_to_question_container.hidden = true;
	const step = scenario[step_number];
	const message = step['More_Info 2'];
	if (message) {
		step.displaying_more_info = true;
		display_response(message, also_display_algorithm(step['more_info']));
		hide_element(more_info_button);
		if (step.quiz_correct || text_piece_index < text_pieces.length-1) {
			// if correct or there is more to display 
			show_element(next_item_button);
		} else {
			hide_element(next_item_button);
		}
		sounds.more_info.play();
	}
};

const hide_element = (element) => {
	element.style.opacity = 0;
};

const show_element = (element) => {
	element.style.opacity = 100;
};

const split_text = (text) => {
	const pieces = [];
	let text_piece_length = 250;
	while (true) {
		if (text.length < text_piece_length) {
			pieces.push(text);
			return pieces;
		} else {
			const index_of_last_space_in_piece = text.lastIndexOf(' ', text_piece_length);
			const index_of_last_period_in_piece = text.lastIndexOf('.', text_piece_length);
			const end_with_a_sentence = ((index_of_last_space_in_piece-index_of_last_period_in_piece) < 30) || // include little bit of sentence that is left
			                            ((text.length-index_of_last_space_in_piece) < 30) ; // include little bit that is left overall
			const piece_length = end_with_a_sentence ?
			                     index_of_last_period_in_piece+1 : // end with a sentence
			                     index_of_last_space_in_piece;
			const ellipsis = end_with_a_sentence ? ".." : "..."; // already has one period if ends with a sentence
			pieces.push(text.slice(0, piece_length) + ellipsis);
			text = text.slice(piece_length);
		}	
	}
};

let text_piece_index = 0;
let text_pieces;
let step_number;
let submission_count = 0;

const run_covid_scenario = (current_submission_count) => {
	if (typeof step_number !== 'number') {
		step_number = initial_step_number;
	}
	if (typeof current_submission_count === 'number') {
		submission_count = current_submission_count; 
	} else {
		submission_count = 0;
	}
	const step = scenario[step_number];
	const step_type = step_types[step.type];
	step.quiz_correct = true; // unless answered incorrectly below - if incorrect next_item_button is hidden in more info
	if (step_type === 'display info' || step_type === 'display algorithm') {
		show_interface('info');
		text_pieces = split_text(step.text);
		text_piece_index = -1;
		next_item_button_action();
		display_algorithm_on_left_side(step_type === 'display algorithm');
		if (step['More_Info 2']) {
			// there is more info 
			show_element(more_info_button);
		} else {
			hide_element(more_info_button);
		}
	} else if (step_type === 'quiz') {
		text_pieces = undefined;
		submit_button.disabled = true;
		show_interface('quiz');
        quiz_question.innerHTML = step.text;
        remove_all_children(quiz_options);
        const buttons = [];
        step.choices.forEach((choice) => {
        	const button = document.createElement('button');
        	button.innerHTML = choice;
		    button.classList.add('choice-button');
			button.addEventListener('click', () => toggle_choice_selection(button, buttons, step));
			buttons.push(button);
        });
        const correct_buttons = buttons.slice(0, step.Correct_Choices);
        tf.util.shuffle(buttons);
        buttons.forEach(button => {
        	quiz_options.appendChild(button);
        	quiz_options.appendChild(document.createElement('br'));
        });     
        submit_button.onclick = () => {
        	answer_to_question_container.hidden = true;
        	submission_count++;
        	show_element(previous_item_button);
        	step.quiz_correct = correct_buttons.every(button => button.classList.contains('choice-selected'));
            if (step.quiz_correct) {
            	show_element(next_item_button);
            	display_response(step['Correct_Feedback'], also_display_algorithm(step['correct_feedback']));
            	sounds.right.play();
            } else {
            	hide_element(next_item_button);
            	if (submission_count === 1) {
					display_response(step['Incorrect_Feedback 2'], also_display_algorithm(step['incorrect_feedback']));
				} else {
					display_response(step['Incorrect_more than 2_Feedback 2'], also_display_algorithm(step['incorrect_more_than_2_feedback']));
				}
				sounds.wrong.play();
            }
        }
	} else if (step_type === 'video') {
		video.src = step.video_URL;
        show_interface('video');
	} else if (step_type === 'finished') {
		display_final_message(true);
// 		display_response(step.text);
// 		hide_element(next_item_button); 
	} else {
		console.log('unknown step type', step_type);
	}
};

const display_final_message = (finished) => {
	answer_to_question_container.hidden = true;
	if (finished === true) {
		congratulations.hidden = false;
	}
	const new_line = "%0D%0A";
	let email_body = new_line;
	if (logs.unanswered.length > 0) {
		email_body += new_line + "The following are questions the app was unable to answer:" + new_line;
		logs.unanswered.forEach(({question}) => {
			email_body += question + new_line;
		});
	}
	if (logs.passed_off_to_others.length > 0) {
		email_body += new_line + "The following are questions the app was unable to answer but passed off to covid19-research-explorer.appspot.com:" + new_line;
		logs.passed_off_to_others.forEach(({question}) => {
			email_body += question + new_line;
		});
	}
	if (logs.answered.length > 0) {
		email_body += new_line + "The following are questions the app answered. Please highlight any that were inappropriate or incorrect." + new_line;
		logs.answered.forEach(({question, answer}) => {
			email_body += "Question: " + question + new_line + "Answer: " + answer.replace(/\n/g, "%0D%0A") + new_line + new_line;
		});
	}
	if (logs.too_low_speech_recognition_confidence.length > 0) {
		email_body += new_line + "The following was heard but but with too low confidence to answer:" + new_line;
		logs.too_low_speech_recognition_confidence.forEach(({question, confidence}) => {
			email_body += question + " (confidence: " + confidence + ")" + new_line;
		});
	}
	document.getElementById('email-link').href += email_body;
	scenario_interface.hidden = true;
	hide_element(quit_button);
    final_message.hidden = false;
    ecraft2learn.stop_speech_recognition();
};

const next_item_button_action = (event) => {
	answer_to_question_container.hidden = true;
	if (event) {
		user_action_performed();
	}
	if (text_pieces) {
		text_piece_index++;
	}
	if ((text_piece_index === 0 || !text_pieces) && step_number === 0) {
		hide_element(previous_item_button);
	} else {
		show_element(previous_item_button);
	}
	if (!text_pieces || text_piece_index >= text_pieces.length) {
		step_number++;
		run_covid_scenario();
	} else {
		display_info(text_pieces[text_piece_index]);
		const step = scenario[step_number];
		if (text_piece_index === text_pieces.length-1 && // last one
		   !step.quiz_correct && // user got quiz wrong
		   step.displaying_more_info) {
            hide_element(next_item_button);
		}
	}
	if (event) {
		if (document.getElementById('landscape-warning-message')) {
			document.getElementById('landscape-warning-message').remove();
		}
		sounds.next.play();	
	}
};

const previous_item_button_action = () => {
	answer_to_question_container.hidden = true;
	if (text_piece_index === 0 || !text_pieces) {
		if (step_number === 0) {
			hide_element(previous_item_button);
		} else {
			if (!info_interface() ||
			    step_types[scenario[step_number].type] !== 'quiz') {
				// quizzes don't have back buttons but feedback (info interface) from submit does
				step_number--;
				submission_count = 0;
			}
			run_covid_scenario(submission_count);
		}
	} else if (text_pieces) {
		text_piece_index--;	
		scenario_info.innerHTML = text_pieces[text_piece_index];
	}
	sounds.back.play();	
};

const also_display_algorithm = (value => value === 'Pneumonia-COVID19');

const show_interface = (name) => {
	if (name === 'quiz') {
		quiz_interface.hidden = false;
        scenario_interface.hidden = true;
        video_interface.hidden = true;
	} else if (name === 'info') {
	    quiz_interface.hidden = true;
	    video_interface.hidden = true;
        scenario_interface.hidden = false;
	} else if (name === 'video') {
	    quiz_interface.hidden = true;
        scenario_interface.hidden = true;
        video_interface.hidden = false;		
	}
};

const info_interface = () => !scenario_interface.hidden;

const display_algorithm_on_left_side = (display) => {
	doctor_image.hidden = display;
	algorithm.hidden = !display;
};

const doctor_displayed = () => !doctor_image.hidden;

const display_info = (message) => {
	scenario_info.innerHTML = message;
};

const display_response = (response, also_display_algorithm) => {
	text_pieces = split_text(response);
	text_piece_index = 0;
	show_interface('info');
	display_algorithm_on_left_side(also_display_algorithm);
	display_info(text_pieces[0]);
	const step = scenario[step_number];
	const message = step['More_Info 2'];
    if (message && response !== message) {
    	// there is more info and this response isn't itself more info
    	show_element(more_info_button);
    }
};

const remove_all_children = (element) => {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
};

const toggle_choice_selection = (button, buttons, step) => {
	if (button.classList.contains('choice-selected')) {
		button.classList.remove('choice-selected');
	} else {
		button.classList.add('choice-selected');
		if (step.Correct_Choices === 1) {
			buttons.forEach((sibling_button) => {
				// make sure the others are no longer selected
				if (sibling_button !== button) {
					sibling_button.classList.remove('choice-selected');
				}
			});
		}
	}
	submit_button.disabled = count_selected(buttons) !== step.Correct_Choices;
};

const count_selected = (buttons) => {
	let count = 0;
	buttons.forEach(button => {
		if (button.classList.contains('choice-selected')) {
			count++;
		}
	});
	return count;
};

const blink_doctor_image = () => {
	let eyes_open = true;
	const open_eyes_duration = 4000;
	const blink_duration = 200;
	const one_cycle = () => {
		window.setTimeout(() => {
			doctor_image_eyes_closed.hidden = false;
			doctor_image_eyes_open.hidden = true;
		}, open_eyes_duration);
		window.setTimeout(() => {
			doctor_image_eyes_closed.hidden = true;
			doctor_image_eyes_open.hidden = false;
		}, open_eyes_duration+blink_duration);
	};
	one_cycle();
	window.setInterval(one_cycle, open_eyes_duration+blink_duration);
}

const split_into_train_and_test_datasets = () => {
	group_of_questions.forEach((group, group_number) => {
//     	tf.util.shuffle(group); // groups are now shuffled before saving
    	group_of_questions_test[group_number] = group.slice(0, number_of_test_questions_per_group);
    	group_of_questions[group_number] = group.slice(number_of_test_questions_per_group);
    });
};

document.addEventListener('DOMContentLoaded',    
	() => {
		load_local_or_remote_scripts("./" + topic_to_questions_name[topic] + ".js", null, initialize);
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
