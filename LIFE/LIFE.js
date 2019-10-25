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

let group_of_questions_embeddings = [];
let group_of_questions_mean_embeddings = [];

const sentences_and_answers = () => {

    group_of_questions.push([ // 0
        "Why do we wrap the babies?",
        "Why should I wrap the baby?",
        "Why do you want to wrap the baby?",
        "Why do we want the baby wrapped?"
    ]);

    answers.push(
        "The baby can lose heat and so keeping the baby warm is one of the key things that we need to do " + 
        "with new-born resuscitation, for any babies who are born, " +
        "and so the reason is to wrap them in a dry warm towel, to actually keep them warm, so that they cannot lose heat.");

    group_of_questions.push([ // 1
        "Why isn't one towel enough?",
        "Why not just use only the first towel?",
        "What is wrong with leaving the first towel on the baby?",
        "Does it matter if the towel is wet?",
        "Does it matter if the towel is damp?",
        "What is wrong with leaving the damp towel?",
        "What is the problem with just using the first towel?",
        "What would happen if I only used one towel?",
        "So why do you want to change the towel?",
        "So why do I need to change the towel?",
        "So why do we want to change the towel?",
        "So why do we need to change the towel?",
        "So why do you want the towel changed?",
        "What would happen if you wrapped a baby in a wet towel?",
        "What would happen if I left the baby wrapped in a damp towel?",
        "What would happen if we left the baby wrapped in a wet towel?",
        "What would happen if we didn’t change the towel?",
        "What would happen if I didn’t change the towel?",
    ]);

    answers.push("A wet towel will make the baby lose heat.");

    group_of_questions.push([ // 2
        "Why is it important to make sure that the baby is not cold?",
        "Why would it be important to make sure that the baby is kept warm?",
        "Why is hypothermia dangerous for babies at birth?",
        "Why is hypothermia a concern?",
        "Why must we keep the baby warm?",
        "Should we keep the baby hot?"
    ]);

    answers.push("There is the risk of hypothermia because babies can lose a lot of heat. ");

    group_of_questions.push([ // 3
        "What areas should you dry?",
        "What areas would you be wanting to make sure that you have dried effectively?",
        "What parts of the baby's body should I dry?",
        "Which areas need be dried?",
        "Do I need to dry every part of the baby?"
    ]);

    answers.push("You need to dry their legs, their hands, their stomach, and even their head. " +
                   "You need to dry the whole baby. " + 
                   "While drying see if the baby is breathing, is crying, or is pink. " +
                   "And stimulate the baby as you dry.");

    group_of_questions.push([ // 4
        "What else are you doing as you are drying the baby?",
        "What should you looking for as you dry?",
        "What should you look for while drying the baby?",
        "What are you also doing when drying?",
        "What else goes on as you dry?",
        "What other purpose does drying server?",
        "Is there another reason to dry?",
        "What are the purposes of drying?"
    ]);

    answers.push("While drying see if the baby is breathing, is crying, or is pink. " + 
                   "Be sure to dry all areas. " +
                   "And drying also stimulates the baby.");

    group_of_questions.push([ // 5
        "Can I turn on the radiator instead?",
        "Can I heat the baby by turning on a radiator?",
        "Why not use a radiator?",
        "Why not use a heater instead?",
        "Can I turn on the heater instead?",
        "So if I even have a heater will I still need to cover this baby",
        "Will I still need to cover this baby if I've turned on the heater?",
        "Is there another way to keep the baby warm?"
    ]);

    // what if a student asked "Do I still need to cover the baby if it is a very hot day?"
    // my guess is that this is a reason to understand the procedure so one doesn't wrap with the second towel if it is hot enough

    answers.push("The room might become warm with a heater, but it might not be warm enough for the baby, and hence, you still need to cover the body with a towel.");

    group_of_questions.push([ // 6
        "What should I look for after drying?",
        "What am I looking for in the baby's mouth?",
        "What can be in the baby's mouth?",
        "Why do I need to look into the baby's mouth?",
        "What might I see in the baby's mouth?",
        "What can be in its mouth?"
    ]);

    answers.push("Look for secretions, vomit, and any things that would block the airway.");

    group_of_questions.push([ // 7
        "Why is it important to put the baby’s head in a neutral position?",
        "Why is the importance of keeping the head in neutral position?",
        "Why should I put the baby's head in a neutral position?",
        "Why should I tilt back the baby's head?",
        "Why tilt its head?",
        "What are the dangers of inappropriate positioning of the head?",
        "What can go wrong if the head is not positioned correctly?",
        "Is neutral position the most appropriate position for this baby?"
    ]);

    answers.push("It is important to put the baby in neutral position because if you want to bag the baby, " + 
                   "if the head is not in neutral position, the child will have difficulty in breathing. " +
                   "The neutral position is appropriate for children less than one year old.");

    group_of_questions.push([ // 8
        "Is there something else you should have done first before bagging this baby?",
        "What do I need to do before starting to bag?",
        "What should I check before I bag?",
        "What needs to be done before bagging?",
        "Is there something I should do before bagging?"
    ]);

    answers.push("Look for 5 seconds to see if the chest is rising, listen for any noises from the baby, and feel for any warm air coming from its mouth. " +
                   "If nothing then start bagging.");

    group_of_questions.push([ // 9
        "So how do you know that the bag is effective?",
        "So how do you know that the baggable mask device is effective?",
        "How do you know if you're use of the inflatable bag is effective?",
        "How do I know if the baggable mask device is working properly?",
        "How do I know if the inflatable bag is working properly?",
        "What can go wrong with using the bag?",
        "What can go wrong with using the inflatable bag?",
        "What can go wrong with the baggable mask device?",
        "What if I don't see the chest rising?",
        "What should I do if the chest isn't rising?",
        "Why might the chest not be rising?",
        "What should I do if the chest is not rising?"
    ]);

    answers.push("You need to see the chest rising after every time you inflate the bag. " +
                   "It means you’ve already formed a seal correctly, and you are applying pressure on the bag sufficiently.");

    group_of_questions.push([ // 10
        "How should I assess the circulation?",
        "How should I assess the pulse in the baby?",
        "How can I test for a large enough pulse in the baby?",
        "What ways are there for checking the baby's circulation?",
        "Beside the umbilical pulse how would you assess for a pulse in a new-born?",
        "How can I assess the pulse other than auscultating the baby?",
        "Where can I find the pulse of the baby?"
    ]);

    answers.push("With a new-born, you can assess the pulse at the umbilicus or you can auscultate it and feel for the heart rate. " +
                  "No need to intervene if the pulse rate is 60 or above.");

    group_of_questions.push([ // 11
        "What pulse rate should I expect?",
        "What is a good pulse rate for the baby?",
        "How low a pulse is OK?",
        "What pulse should I be looking for?",
        "What ia a good circulation rate?"
    ]);

    answers.push("If the pulse is more than 60 you don’t need to intervene. Otherwise check the airway and the breathing again. " +
                   "This can be measured at the umbilicus or by ausculatating.");

    group_of_questions.push([ // 12
        "What should I do if the baby is gasping?",
        "The baby is gasping for air, what should one do?",
        "What's to be done if the baby is gasping?",
        "If the baby is gasping should I give it oxygen?",
        "Is it a good idea to give oxygen to a baby that is gasping?",
        "If the baby is gasping should I continue bagging?",
        "Should I keep bagging if the baby is gasping?",
        "What is the most appropriate action for a baby who is gasping?"
    ]);

    answers.push("If the baby is not breathing properly continue bagging, you cannot yet put in oxygen.");

    group_of_questions.push([ // 13
        "What should I do if the baby is breathing fine and has a good pulse?",
        "Is there more to do if the baby is breathing and has good circulation?",
        "If the baby has a good pulse and is breathing OK what more should be done?",
        "What is next if the baby is breathing and has a good pulse?",
        "Is there more to do if the baby has good circulation?",
        "The baby is breathing and has a pulse greater than 60, what is next?",
        "I've finished ventilating the baby for one minute – what’s the next step?"
    ]);

    answers.push("Connect the baby to oxygen, and maybe nasal prongs, or whatever is available. " +
                   "Still keep the baby wrapped warm. Take a history.");

    group_of_questions.push([ //14
        "Why is it important to check the airways a second time?",
        "Why should you reassess the baby's airways after it is breathing?",
        "After bagging why do I need to reasses?",
        "Why access the airways a second time?",
        "What is the purpose of checking that the airways are clear a second time?",
        "Why do we need to reassess after bagging?",
        "Why reassess after the baby begins to breath?",
        "What is the purpose of reassesing after getting the baby to breath?"
    ]);

    answers.push("The baby can have secretions that come up, that were not there initially, " + 
                   "and so you still need to establish that the airway, the mouth is still clear and sometimes even in that motion of bagging, " + 
                   "the neck might actually tilt, so you need to reassess and establish that the neck area, the head is in neutral position, " +
                   "and then you reassess the breathing, that the child, that the baby still needs an intervention in breathing. That is where you look, listen and feel. ");


    group_of_questions.push([ // 15
        "Why would an IV line be necessary?",
        "What good would an IV line be?",
        "What use would one have with an IV?",
        "How would an IV be used?",
        "Why should I have an IV line handy?",
        "What should I do after it is breathing, has a good pulse, and has oxygen?"
    ]);

    answers.push("Use an IV line to give drugs.");         

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
        return answers[best_answer];
    });
};

const setup = () => {
    const do_when_group_of_questions_mean_embeddings_available = () => {
    	if (window.location.hash.indexOf('test') >= 0) {
    		console.log(group_of_questions_mean_embeddings);
        	test_all_questions();
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
    const test_all_questions = () => {
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
                        document.writeln(question + "<br>");
                        document.writeln("bad answer: " + answers[distances[0][0]] + "<br>");
                        document.writeln("good answer:" + answers[group_number] + "<br>");
                        document.writeln(group_number + ":" + question_number + "<br>");
                        distances.forEach((answer_id_and_distance) => {
                            document.writeln("#" + answer_id_and_distance[0] + " = " + answer_id_and_distance[1] + "<br>");
                        });
                        document.writeln("<br>");
                    }
                    if (group_number === 15) {
                        console.log(wrong);
                    }
//                     console.log(distances[0][1]); // just to see what best distances look like
                });
            });
        });
    };
    sentences_and_answers();    
    use.load().then((model) => {
        embedding_model = model;
        if (group_of_questions_mean_embeddings.length === 0) {
            obtain_embeddings(0);
        } else {
            do_when_group_of_questions_mean_embeddings_available();
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
        add_paragraph(group[0]);
    });
};

let last_reported_error;
const record_error = (error) => {
    if (last_reported_error !== error.message) {
        add_paragraph(error.message);
        last_reported_error = error.message;
    }
};

try {
    setup();
} catch (error) {
    record_error(error);
}

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
// }
};

document.addEventListener(
    'DOMContentLoaded',
    load_mean_embeddings(
		() => {
			let question_area = document.getElementById('question');
			let toggle_speech_recognition = document.getElementById('speech-recognition');
			let sound_effect = document.getElementById('sound');
			let answer_area = document.getElementById('answer');
			let speech_recognition_on = false;
			let first_cant_answer = true;
			const toggle_speech_recognition_label = document.createElement('span');
			const turn_on_speech_recognition_label = "Start listening";
			const turn_off_speech_recognition_label = "Stop listening";
			toggle_speech_recognition_label.innerHTML = turn_on_speech_recognition_label;
			toggle_speech_recognition.appendChild(toggle_speech_recognition_label);
			const respond_with_answer = (answer, question) => {
				if (answer) {
					answer_area.innerHTML = "<b>" + answer + "</b>";
					if (speech_recognition_on) {
						let voices = window.speechSynthesis.getVoices();
						ecraft2learn.speak(answer, undefined, undefined, 
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
				LIFE.respond_to_question(question, -0.55).then((answer) => {
					// reasonable matches must be less than -0.55 cosineProximity
					respond_with_answer(answer, question);
				},
				record_error);
			};
			question_area.addEventListener('keypress',
										   (event) => {
											   if (event.keyCode === 13 || event.keyCode === 63) { // ? or new line
												   answer_question(question_area.value);
											   };
										   });
			const recognition_callback = (text) => {
				question_area.value = text;
				answer_question(text);
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
			// following would be nice but can't use speech without user action
			// see https://www.chromestatus.com/feature/5687444770914304
	//         if (is_mobile()) {
	//             toggle_speech(); // start with it enabled
	//         }
			add_sample_questions();                           
		 }));

return {respond_to_question: respond_to_question};

})());
