// Questions and answers for pneumonia scenario for LIFE game
// Written by Ken Kahn 
// License: New BSD

"use strict";

// Most paraphrases by Ken Kahn
// a few from https://quillbot.com/

LIFE.sentences_and_answers = () => {
    let group_of_questions = [];
    let answers = [];
    group_of_questions.push([ // 0
        "Why is this algorithm only for children less than 5 years old?",
        "Can the algorithm be used for older children or adults?",
        "Can I use this with children older than 5?",
        "Should I use this algorithm with older children too?",
        "Why is this limited to children under 5?",
        "Can I follow this for five year olds?",
        "What should I do for children over five?",
        "Are these guidelines good for older children as well?",
        "Should I follow this guidance for children over four years old?",
        "Why are these guidelines only for young children?"
    ]);
    // could display a link to (re: Macpherson L et al, BMJ Global Health 2019)
    answers.push("The guidelines so far developed are based on the available evidence for children less than 5 years. " +
                 "Although clinicians have used these algorithms in older children, " +
                 "we will need further evidence (and age-specific guidelines) for these groups of children.");

    group_of_questions.push(["How can we tell if there is cyanosis?", // 1
                             "What should I see if there is cyanosis?",
                             "What does cyanosis look like?",
                             "Where should I look for cyanosis?",
                             "How can we say if cyanosis has occurred?",
                             "How might I determine if there is cyanosis?",
                             "Please tell me how to examine for cyanosis.",
                             "If there is cyanosis, what should I see?",
                             "What should I examine to see if there is cyanosis?",
                             "What colour should I see if there is cyanosis?"]);
    answers.push("This is examined and interpreted as bluish discolouration " +
                 "under the gum or on the tongue (commonly called central cyanosis).");

    group_of_questions.push(["What does AVPU stand for?", // 2
                             "Could you explain AVPU please?",
                             "What is the meaning of AVPU?",
                             "What does AVPU mean?",
                             "Please explain AVPU.",
                             "AVPU? What is that?",
                             "What is AVPU an acronym for?",
                             "What the meaning of AVPU?",
                             "I forget what AVPU means.",
                             "What is AVPU again?"]);
    answers.push("<span style='color:red'>AVPU</span> is an acronym for <span style='color:red'>A</span>lert, " + 
                 "responds to <span style='color:red'>V</span>erbal stimulus, " + 
                 "responds to <span style='color:red'>P</span>ainful stimulus and " + 
                 "<span style='color:red'>U</span>nresponsive to (or inappropriately responds to) painful stimulus. " + 
                 "When sick children are clinically assessed for their neurological status (level of consciousness and wakefulness), " + 
                 "they will be graded on AVPU scale as either at A, V, P or U. ");

    group_of_questions.push(["The ‘P’ is for pain but how should one access pain? ", // 3
                             "How should I tell what the response to pain is?",
                             "How do I assess the pain stimulus response?",
                             "How should I measure pain stimulus response?",
                             "What is an appropriate pain stimulus?",
                             "What pain stimulus should I apply to test the response?",
                             "How do I go about finding out the response to pain stimulus?",
                             "What pain stimulus is appropriate?",
                             "What response should I expect from pain stimulus?",
                             "To assess pain stimulus response what should I do?"]);
    answers.push("A painful stimulus is applied by rubbing one’s knuckles/exerting firm pressure on the child’s sternum (breast bone). " + 
                 "If the infant/child (usually over 9 months of age) responds by pushing away the examiner’s hand, " + 
                 "this is considered an appropriate response and the infant/child is graded at P. " + 
                 "If the infant less than 9 months cries vigorously (not a weak cry/moan), " + 
                 "this is also considered an appropriate response. Other responses " +
                 "(weak cry, moaning, wiggles, or no response are considered inappropriate and the infant/child will be graded at U.");

    group_of_questions.push(["The ‘V’ is for verbal but what if the child is too young to be verbal? ", // 4
                             "What is the verbal response for infants?",
                             "How should I assess the responses to verbal stimulus?",
                             "What verbal stimulus should I use?",
                             "How can I assess the response to verbal stimulus?",
                             "What is a normal response to verbal stimulus?",
                             "How can I assess the verbal stimulus response for very young children?",
                             "If the child is pre-verbal, can I assess his or her response to verbal stimulus?",
                             "What verbal stimulus should I use and what response should I expect?",
                             "What should I expect in response to verbal stimulus?"]);
    answers.push("Verbal response means appropriate response to a verbal stimulus such as when you call out the infant/child " + 
                 "or when you clap hands near the baby’s ear. " + 
                 "It does not mean the infant/child verbalizing. " + 
                 "Response that is expected (appropriate) is opening the eyes, coos, with or without crying to the verbal stimulus. " + 
                 "The only challenge will be for infants/children with hearing impairment. ");

    group_of_questions.push(["Does wheezing definitely indicate it is not pneumonia? ", // 5
                             "Can we rule out pneumonia if there is wheezing?",
                             "Why does wheezing rule out pneumonia?",
                             "Can there be both pneumonia and wheezing?",
                             "Why do we expect there to be no wheezing if a child has pneumonia?",
                             "What is the connection between wheezing and pneumonia?",
                             "How does wheezing mean there is no pneumonia?",
                             "Why can't there be wheezing and pneumonia?",
                             "So if there is wheezing, we know there is no pneumonia?",
                             "Can we be sure there is pneumonia if there is wheezing?"]);
    answers.push("Wheezing, a high pitched sound often heard when the lower airway pipes are narrowed plus with mucus fluid " + 
                 "has commonly been associated with asthma. However, it might also " + 
                 "mean other diseases that lead to lower airway pipe narrowing including pneumonia. ");

    group_of_questions.push(["Is stridor the same as wheezing? ", // 6
                             "How is stridor different from wheezing?",
                             "Are stridor and wheezing the same?",
                             "What is the difference between wheezing and stridor?",
                             "How can I distinguish between stridor and wheezing?",
                             "Are stridor and wheezing different?",
                             "What distinguishes stridor from wheezing?",
                             "Why are wheezing and stridor different in the lungs?",
                             "Do stridor and wheezing sound the same?",
                             "Are wheezing and stridor generated in the part of the airway?"]);
    answers.push("Stridor occurs with upper airway narrowing, while wheezing occurs with lower airway narrowing. " + 
                 "Causes of stridor are therefore different from those of wheezing. ");

    group_of_questions.push(["How should I check oxygen saturation? ", // 7
                             "How can I measure oxygen saturation?",
                             "How do I check the saturation of oxygen?",
                             "What do I use to measure oxygen saturation?",
                             "What instrument should I use for oxygen saturation level?",
                             "How do I determine the oxygen saturation level?",
                             "What do I connect to a child to measure oxygen saturation?",
                             "What do I use for oxygen saturation levels?",
                             "What instrument can analyse the oxygen levels?",
                             "To measure oxygen saturation, what should I use?"]);
    answers.push("One needs a gadget called oxygen saturation monitor with a small probe attached to it and " + 
                "connected to the child/infant (usually on a digit). " + 
                "The probe has light sensitive sensor that will analyse the oxygen levels in the bloodstream and " + 
                "send the information on the monitor in percentages (0-100%) with oxygen levels over 94% as normal. ");

    group_of_questions.push(["How can I tell if the child is grunting? ", // 8
                             "How does grunting sound like?",
                             "What is a grunting respiration?",
                             "How to assess if there is grunting?",
                             "How is grunting different from stridor and wheezing?",
                             "If a child is grunting what will is sound like?",
                             "What should I listen for to determine if there is grunting respiration?",
                             "What is the difference between grunting and wheezing and stridor?",
                             "How are grunting and stridor different?",
                             "Is grunting different from wheezing?"]);
    answers.push("Grunting is noisy breathing usually indicating very high effort to get air in the lungs (increased work of breathing). " +
                 "It’s characteristics are different from stridor and wheezing. ");

    // too much confusion about rapid versus slow breathing so combined

    group_of_questions.push(["How fast is rapid breathing? ", // 9
                             "What rate is considered rapid breathing?",
                             'How many breaths per minute is considered fast?',
                             "What is a fast rate of breathing?",
                             "How do I determine if there is fast breathing?",
                             'How often should there be breaths to be treated as fast breathing',
                             'What is the definition of rapid breathing?',
                             'What rate is considered to be "rapid breathing"?',
                             'How quick is fast breathing?',
                             'What is the cut-off rate for rapid breathing?',
                             "How slow is very slow breathing? ",
                             "What rate is very slow breathing?",
                             'What is considered to be "very slow breathing"?',
                             'How many breaths per minutes counts as "very slow breathing"?',
                             'How should I determine if there is an indication of "very slow breathing"?',
                             '"Very slow breathing" is how many breaths per minute?',
                             'How can I tell if the breathing is so slow to be classified as "very slow breathing"?',
                             'Does "very slow breathing" have a maximum breathing rate?',
                             'What exactly is meant be "very slow breathing"?',
                             'What counts as "very slow breathing"?']);
    answers.push("Breathing is considered fast if it is greater than or equal to 50 breaths/minute (infants up to 11 months) " + 
                 "and 40 breaths/minute (older children 12 months to 5 years). " +
                 "Very slow breathing in all children less than 5 years is breathing less than 12 breaths per minute " + 
                 "(which requires that artificial/assisted ventilation is performed with a bag/mask device). " +
                 "One has to count for a whole minute the number of breaths.");

    group_of_questions.push(["What is indrawing? ", // 10
                             "Can you tell me what indrawing is please?",
                             "How can I assess indrawing?",
                             "Please remind me about indrawing.",
                             "Tell me about indrawing.",
                             "Indrawing is what again?",
                             "What are the indications of indrawing?",
                             "What should I examine to tell if there is indrawing?",
                             'How should I decide if a chest is "indrawing"? ',
                             'What is an indrawing chest like?']);
// there were two overlapping questions about indrawing - combined here
//     answers.push("This is assessed by examining the chest wall during breathing in (inspiration). " + 
//                  "The space in between the ribs as well as the lower end of the ribs. " + 
//                  "Indrawing means moving of the space in between the ribs or at the lower end of the chest wall during inspiration.");
    answers.push("One will need to observe the exposed chest of the child during breathing. " + 
                 "Lower Chest indrawing is present if the lower ribs on the chest moves in during breathing in. " + 
                 "Sometimes there may also be indrawing in between the ribs (intercostal recession) during breathing in. " + 
                 "Both lower chest and intercostal indrawing are abnormal, and are signs of difficulty in breathing/increased work of breathing.");

    group_of_questions.push(["How can I tell if breathing is deep? ", // 11
                             "What should I look for to determine if the breathing is deep?",
                             "How can I tell if there's deep breathing?",
                             'How am I able to tell if there is "deep breathing"?',
                             "What is deep breathing like?",
                             'How does one assess "deep breathing"?',
                             'What is a definition of "deep breathing"?',
                             'Tell me how to assess "deep breathing".',
                             'What exactly is "deep breathing"?',
                             'What is "deep breathing" like?']);
    answers.push("Deep breathing is subjectively assessed (by looking during breathing) and " + 
                 "is interpreted as excessive chest wall movement (inspiration). " + 
                 "A better way to put it is how one breaths after running for a 100 meters. ");

    // fast and slow pulse rates were confused so combined
    group_of_questions.push(["How fast is a very fast large pulse? ", // 12
                             "What rate is considered a very fast large pulse?",
                             'How many pulses per minute is considered "a very fast large pulse"?',
                             'How should I determine if there is a very fast large pulse?',
                             'What exactly is a "a very fast large pulse"?',
                             'What rate constitutes "a very fast large pulse"?',
                             '"A very fast large pulse" has what rate?',
                             'What rate cut-off should I use to decide if there is a very fast large pulse?',
                             'When should I decide that a child has "a very fast large pulse"?',
                             "What decides whether a rate is a very fast large pulse?",
                             "How slow is a very slow large pulse? ",
                             "What rate is considered a very slow large pulse?",
                             'How many pulses per minute is considered "a very slow large pulse"?',
                             'How should I determine if there is a very slow large pulse?',
                             'What exactly is a "a very slow large pulse"?',
                             'What rate constitutes "a very slow large pulse"?',
                             '"A very slow large pulse" has what rate?',
                             'What rate cut-off should I use to decide if there is a very slow large pulse?',
                             'When should I decide that a child has "a very slow large pulse"?',
                             "What decides whether a rate is a very slow large pulse?"]);
    answers.push("This is age specific. For infants a pulse rate of more than 180/minute " + 
                 "and for children 1-5 years of greater than 160/minute is considered very fast. " +
                 "For infants and children (up to the beginning of puberty), a very slow pulse is less than 60 beats/minute.");

    group_of_questions.push(["How to tell if the peripheral pulse is weak? ", // 13
                             "How can I tell if the peripheral pulse is weak?",
                             "What constitutes a weak peripheral pulse?",
                             "How do I know if the peripheral pulse is weak?",
                             "What indicates a weak peripheral pulse?",
                             "What should I do to decide if the peripheral pulse is weak?",
                             'What is a "weak peripheral pulse"?',
                             'What do people mean by a "weak peripheral pulse"?',
                             'How can one assess a "weak peripheral pulse"?',
                             'What is the definition of "a weak peripheral pulse"?']);
    answers.push("The examiner has to compare the peripheral (usually radial pulse) and central pulse (either carotid or brachial/femoral) " + 
                 "and subjectively interpret if the peripheral pulse as not easy to feel, thready, weak or sometimes absent. ");

    group_of_questions.push(["How can I be sure a pulse is not palpable? ", // 14
                             "What is a palpable pulse like?",
                             "What is the indication of a palpable pulse?",
                             "What does it means for a pulse to be palpable?",
                             "How can one assess whether or not a pulse is palpable?",
                             "What should a palpable pulsation be like?",
                             "What indicates whether a pulse if palpable?",
                             "What should I do to decide if the pulse is palpable or not?",
                             "How is a palpable pulse defined?",
                             "How should a palpable pulse feel?"]);
    answers.push("When placing firmly one’s fingers on where the artery passes, e.g. the carotid pulse, one is unable to feel the pulsation. ");

    group_of_questions.push(["What are the signs of severe dehydration? ", // 15
                             "How can I tell if there is severe dehydration?",
                             "What are the severe dehydration signs?",
                             "When is dehydration considered severe?",
                             "What should I look for to assess the level of dehydration?",
                             "What is considered severe dehydration?",
                             "What are the indications of severe dehydration?",
                             "What should I do to decide if the child is severely dehydrated?",
                             "What signs are there of severe dehydration?",
                             "How can one determine if a child is severely dehydration?"]);
    answers.push("These include lethargy, irritability, delayed skin turgor and sunken eyes. " + 
                 "Other signs include rapid pulses and cold extremities. ");

    group_of_questions.push(["What are the signs of severe pallor? ", // 16
                             "What should I look for to determine if there is severe pallor?",
                             "What are the severe pallor signs?",
                             "How should one determine if there is severe pallor?",
                             'How is "severe pallor" defined?',
                             'Where should I look to assess severe pallor?',
                             "What's severe pallor's definition?",
                             'What indicates severe pallor?',
                             'What is the appearance of severe pallor?',
                             'What does severe pallor look like?']);
    answers.push("Clinically identified as pale/white discoloration of hands and mucous membranes. ");

    group_of_questions.push(["What are the signs of severe malnutrition? ", // 17
                             "How can I tell if there is severe malnutrition?",
                             "What are the severe malnutrition signs?",
                             "How should one determine if there is severe malnutrition?",
                             'How is "severe malnutrition" defined?',
                             'Where should I consider in assessing severe malnutrition?',
                             "What's severe malnutrition's definition?",
                             'What indicates severe malnutrition?',
                             'What measurements help indicate severe malnutrition?',
                             'How should I decide if there is severe malnutrition?']);
    answers.push("Identified as low weight for height/length of ≤3 Z score or visible severe muscle wasting. " + 
                 "Or a Mid Upper Arm Circumference MUAC of <11.5cm.");

    group_of_questions.push(["How long is a prolonged skin pinch? ", // 18
                             "How long should I do a prolonged skin pinch?",
                             "How long should a skin pinch be?",
                             "What length of skin pinch is considered 'prolonged'?",
                             "How many seconds should a skin pinch be?",
                             "A prolonged skin pitch is how many seconds?",
                             "What duration does a prolonged skin pitch have?",
                             "How long should one pinch the child?",
                             "What is a good length of a skin pitch?",
                             "How long should one prolong a skin pitch?"]);
    answers.push("≥2 seconds");

    group_of_questions.push(['How should I "position" a child? ', // 19
                             'What is "positioning"?',
                             'Tell me about "positioning"?',
                             'How does one position a child?',
                             "What does position refer to?",
                             "What is a good way of positioning a child?",
                             "What is the best position for a child who is not alert?",
                             "When do we need to position the child?",
                             "Why do we position children?",
                             "What is the correct way to position the child?"]);
    answers.push("Positioning commonly refers to an aspect of airway management for children with reduced level of consciousness, less than alert. " + 
                 "For a child, the correct position of the airway is placing the head into a sniffing position.");

    group_of_questions.push(["How can I get a child to open their mouth? ", // 20
                             "What is a good way get a child to open his or her mouth?",
                             "What do you recommend for getting a child to open their mouth?",
                             "How should one get a child to open their mouth?",
                             "What are good techniques for getting a child's mouth to open?",
                             "What should I do to get the child to open its mouth?",
                             "What are the best recommendations for getting a child to open his or her mouth?",
                             "What are tips for opening a child's mouth?",
                             "Can you tell me how get a child to open its mouth?",
                             "What is the best trick for getting a child to open his or her mouth?"]);
    answers.push("If they are of verbal age and will obey commands, you will ask them to open the mouth. " + 
                 "If they are non-verbal (young children and infants or are not alert), you will have to open it by pulling the chin down. " + 
                 "Alternatively, when they cry, their mouth will open.");

    group_of_questions.push(["What should I expect to see when I look in the mouth? ", // 21
                             "What should I look for in the child's mouth?",
                             "If I look in the mouth, what should I hope to see?",
                             "When I look into a child's mouth, what should I look for?",
                             "What might I see in a child's mouth?",
                             "What might be in a child's mouth?",
                             "What could be in his or her mouth?",
                             "What things might be in a child's mouth?",
                             "What might be visible in their mouth?",
                             "What material should I look for when looking into the mouth?"]);
    answers.push("Normally you will see the normal organs such as the tongue and teeth. " + 
                 "There might however be foreign material such as vomitus, food particles or other residue. ");

    group_of_questions.push(['How should I decide if there is a "history of a cough"? How often? How long? ', // 22
                             'How do I elicit a history of cough?',
                             'How should I decide whether there is a cough history? How often does this happen? How long does it take?',
                             "How do I find out the child's history of a cough?",
                             "How can one obtain the history of a child's cough?",
                             "What should I do to learn the history of the cough?",
                             "What aspects of the history of the child's cough should I determine?",
                             "What should I ask about the cough's history?",
                             "What should I try to learn about the history of the cough?",
                             "What should one find out about a cough's history?"]);
    answers.push("History of cough is elicited by asking the parent/caretaker. " + 
                 "E.g. has your baby been coughing, for how many days now, and is it related to e.g. time of the day/night or crying?");

    group_of_questions.push(["How do I know if a child is unable to drink? ", // 23
                             "How can I determine if a child cannot drink?",
                             "How do I know if it is impossible for a child to drink?",
                             "How can one find out if a child is unable to drink?",
                             "What should I do to see if the child can drink?",
                             "How do you recommend I determine if a child is unable to drink?",
                             "What are ways of determining if a child can drink or not?",
                             "What can be done to find out if a child can drink?",
                             "How can we assess if a child can drink?",
                             "What should one do to discover if the child can drink?"]);
    answers.push("This is assessed by asking the mother e.g. to attempt to breastfeed as you watch " + 
                 "or to attempt to give the child something to drink over a cup as you observe. " + 
                 "If they are not able to e.g. due to looking tired, limp or the severity of the illness, " + 
                 "then one says there is inability to drink/breastfeed/feed.");

    group_of_questions.push(["How do I know if a child has difficulty with breathing? ", // 24
                             "What are the signs of a child having difficulty breathing?",
                             "How do I know if a child is having trouble breathing?",
                             "What are the signs of respiratory distress?",
                             "What kinds of difficulty with breathing might there be?",
                             "How should I decide if a child has difficulty breathing?",
                             "What are the indications of breathing difficulty?",
                             "How can I determine what kinds of respiratory distress there is?",
                             "What constitutes difficulty in breathing?",
                             "What constitutes respiratory distress?"]);
    answers.push("There are clinical signs that indicate difficulty in breathing (also called respiratory distress) " + 
                 "and include fast breathing, chest indrawing, head bobbing, deep breathing, grunting respirations, wheezing. " + 
                 "Any of these signs indicates difficulty in breathing.");

    group_of_questions.push(["When should I give O2? ", // 25
                             "Under what conditions should I give a child oxygen?",
                             "How should I decide whether to give O2 or not?",
                             "What are the signs that oxygen is required?",
                             "When is oxygen required?",
                             "When is O2 recommended?",
                             "How does one know if oxygen is needed?",
                             "Under what conditions should one give O2?",
                             "When is it recommended that a child be given oxygen?",
                             "What is the recommendation regarding providing oxygen?"]);
    answers.push("All children signs of difficulty in breathing should be given oxygen. " + 
                 "If Oxygen is limited, priority should be given to those with signs of severe respiratory distress such as " + 
                 "grunting respirations, wheezing and fast breathing associated with fatigue. " + 
                 "Children whose oxygen saturation is less than 90% and/or who have central cyanosis are also a high priority for being given oxygen");

    group_of_questions.push(["What is a septic screen and when should I do it? ", // 26
                             "How should I use a septic screen?",
                             "When is a septic screen recommended?",
                             "Under what circumstances should one do a septic screen?",
                             "What exactly is a septic screen?",
                             "What can one learn from a septic screen?",
                             "What does a septic screen involve?",
                             "What is involved in a septic screen?",
                             "How should one decide if a septic screen is called for?",
                             "Why would one do a septic screen?"]);
    answers.push("Sick children may require additional assessment besides clinical signs. " + 
                 "This additional assessment includes drawing their blood " + 
                 "(sometimes also urine and fluid from their spine, called Cerebral Spinal Fluid, CSF) " + 
                 "to determine if they have any evidence of infection and where possible the infection causing organisms. " + 
                 "This is what constitutes a septic screen. ");

    return {group_of_questions, answers};

};
