// Questions and answers for pneumonia scenario for LIFE game
// Written by Ken Kahn 
// License: New BSD

"use strict";

const sentences_and_answers = () => {
    let group_of_questions = [];
    let answers = [];
    group_of_questions.push([ // 0
        "Why is this algorithm only for children less than 5 years old?",
        "Can the algorithm be used for older children or adults? ",
    ]);
    // could display a link to (re: Macpherson L et al, BMJ Global Health 2019)
    answers.push("The guidelines so far developed are based on the available evidence for children less than 5 years. " +
                 "Although clinicians have used these algorithms in older children, " +
                 "we will need further evidence (and age-specific guidelines) for these groups of children.");

    group_of_questions.push(["How can we tell if there is cyanosis?"]);
    answers.push("This is examined and interpreted as bluish discolouration " +
                 "under the gum or on the tongue (commonly called central cyanosis).");

    group_of_questions.push(["What does AVPU stand for?"]);
    answers.push("AVPU is an acronym for Alert, responds to Verbal stimulus, responds to Painful stimulus and " + 
                 "Unresponsive to (or inappropriately responds to) painful stimulus. " + 
                 "When sick children are clinically assessed for their neurological status (level of consciousness and wakefulness), " + 
                 "they will be graded on AVPU scale as either at A, V, P or U. ");

    group_of_questions.push(["The ‘P’ is for pain but how should one access pain? "]);
    answers.push("A painful stimulus is applied by rubbing one’s knuckles/exerting firm pressure on the child’s sternum (breast bone). " + 
                 "If the infant/child (usually over 9 months of age) responds by pushing away the examiner’s hand, " + 
                 "this is considered an appropriate response and the infant/child is graded at P. " + 
                 "If the infant less than 9 months cries vigorously (not a weak cry/moan), " + 
                 "this is also considered an appropriate response. Other responses " +
                 "(weak cry, moaning, wiggles, or no response are considered inappropriate and the infant/child will be graded at U.");

    group_of_questions.push(["The ‘V’ is for verbal but what if the child is too young to be verbal? "]);
    answers.push("Verbal response means appropriate response to a verbal stimulus such as when you call out the infant/child " + 
                 "or when you clap hands near the baby’s ear. It does not mean the infant/child verbalizing. Response that is expected (appropriate) is opening the eyes, coos, with or without crying to the verbal stimulus. The only challenge will be for infants/children with hearing impairment. ");

    group_of_questions.push(["Does wheezing definitely indicate it is not pneumonia? "]);
    answers.push("Wheezing, a high pitched sound often heard when the lower airway pipes are narrowed plus with mucus fluid " + 
                 "has commonly been associated with asthma. However it might also " + 
                 "mean other diseases that lead to lower airway pipe narrowing including pneumonia. ");

    group_of_questions.push(["Is stridor the same as wheezing? "]);
    answers.push("Stridor occurs with upper airway narrowing, while wheezing occurs with lower airway narrowing. " + 
                 "Causes of stridor are therefore different from those of wheezing. ");

    group_of_questions.push(["How should I check oxygen saturation? "]);
    answers.push("One needs a gadget called oxygen saturation monitor with a small probe attached to it and " + 
                "connected to the child/infant (usually on a digit). " + 
                "The probe has light sensitive sensor that will analyse the oxygen levels in the bloodstream and " + 
                "send the information on the monitor in percentages (0-100%) with Oxygen levels over 94% as normal. ");

    group_of_questions.push(["How can I tell if the child is grunting? "]);
    answers.push("Grunting is noisy breathing usually indicating very high effort to get air in the lungs (increased work of breathing). " +
                 "It’s characteristics are different from stridor and wheezing. ");

    group_of_questions.push(["What is a grunting respiration?"])
    answers.push("Grunting respirations are noisy breathing, similar as described above.");

    group_of_questions.push(["How rapid is rapid breathing? "]);
    answers.push("This is age specific. Breathing is considered fast if it is greater than or equal to 50 breaths/minute (infants up to 11 months) " + 
                 "and 40 breaths/minute (older children 12months to 5 years). " +
                 "One has to count for a whole minute the number of breaths.");

    group_of_questions.push(["How slow is very slow breathing? "]);
    answers.push("Very slow breathing in all children less than 5 years is breathing less than 12 breaths per minute " + 
                 "(which requires that artificial/assisted ventilation is performed with a bag/mask device).");

    group_of_questions.push(["What is indrawing? "]);
    answers.push("This is assessed by examining the chest wall during breathing in (inspiration). " + 
                 "The space in between the ribs as well as the lower end of the ribs. " + 
                 "Indrawing means moving in of the space in between the ribs or at the lower end of the chest wall during inspiration.");

    group_of_questions.push(["How can I tell if breathing is deep? "]);
    answers.push("Deep breathing is subjectively assessed (by looking during breathing) and is interpreted as excessive chest wall movement (inspiration). A better way to put it is how one breaths after running for a 100 meters. ");

    group_of_questions.push(["How fast is a very fast large pulse? "]);
    answers.push("This is age specific. For infants, this is a pulse rate of equal to or greater than 180/minute " + 
                 "and for children 1-5 years of greater than 160/minute");

    group_of_questions.push(["How slow is a very slow large pulse? "]);
    answers.push("For infants and children (up to the beginning of puberty), this is a pulse of less than 60 beats/minute");

    group_of_questions.push(["How to tell if the peripheral pulse is weak? "]);
    answers.push("The examiner has to compare the peripheral (usually radial pulse) and central pulse (either carotid or brachial/femoral) " + 
                 "and subjectively interpret if the peripheral pulse as not easy to feel, thready, weak or sometimes absent. ");

    group_of_questions.push(["How can I be sure a pulse is not palpable? "]);
    answers.push("When placing firmly one’s fingers on where the artery passes, e.g the carotid pulse, one is unable to feel the pulsation. ");

    group_of_questions.push(['How should I decide if a chest is “indrawing”? ']);
    answers.push("One will need to observe the exposed chest of the infant/child during breathing. " + 
    "Lower Chest indrawing is present if the lower ribs on the chest moves in during breathing in. " + 
    "Sometimes there may also be indrawing in between the ribs (intercostal recession) during breathing in. " + 
    "Both lower chest and intercostal indrawing are abnormal, and are signs of difficulty in breathing/increased work of breathing");

    group_of_questions.push(["What are the signs of severe dehydration? "]);
    answers.push("These include lethargy, irritability, delayed skin turgor and sunken eyes. " + 
                 "Other signs include rapid pulses and cold extremities. ");

    group_of_questions.push(["What are the signs of severe pallor? "]);
    answers.push("Clinically identified as pale/white discoloration of hands and mucous membranes. ");

    group_of_questions.push(["What are the signs of severe malnutrition? "]);
    answers.push("Identified as low weight for height/length of ≤3 Z score or visible severe muscle wasting. " + 
                 "Or a Mid Upper Arm Circumference MUAC of <11.5cm.");

    group_of_questions.push(["How long is a prolonged skin pinch? "]);
    answers.push("≥2 seconds");

    group_of_questions.push(["How should I “position” a child? "]);
    answers.push("Positioning commonly refers to an aspect of airway management for children with reduced level of consciousness, less than alert. " + 
                 "For a child, the correct position of the airway is placing the head into a sniffing position.");

    group_of_questions.push(["How can I get a child to open their mouth? "]);
    answers.push("If they are of verbal age and will obey commands, you will ask them to open the mouth. If they are non-verbal (young children and infants or are not alert), you will have to open it by pulling the chin down. Alternatively, when they cry, their mouth will open.");

    group_of_questions.push("What should I expect to see when I look in the mouth? ");
    answers.push("Normally you will see the normal organs such as the tongue and teeth. " + 
                 "There might however be foreign material such as vomitus, food particles or other residue. ");

    group_of_questions.push(['How should I decide if there is a “history of a cough”? How often? How long? ',
                             'How do I elicit a history of cough? ']);
    answers.push("History of cough is elicited by asking the parent/caretaker. " + 
                 "E.g. has your baby been coughing, for how many days now, and is it related to e.g. time of the day/night or crying?");

    group_of_questions.push(["How do I know if a child is unable to drink? "]);
    answers.push("This is assessed by asking the mother e.g. to attempt to breastfeed as you watch " + 
                 "or to attempt to give the child something to drink over a cup as you observe. " + 
                 "If they are not able to e.g due to looking tired, limp or the severity of the illness, " + 
                 "then one says there is inability to drink/breastfeed/feed.");

    group_of_questions.push(["How do I know if a child has difficulty with breathing? "]);
    answers.push("There are clinical signs that indicate difficulty in breathing (also called respiratory distress) " + 
                 "and include fast breathing, chest indrawing, head bobbing, deep breathing, grunting respirations, wheezing. " + 
                 "Any of these signs indicates difficulty in breathing. ");

    group_of_questions.push(["When should I give O2? "]);
    answers.push("All children signs of difficulty in breathing should be given oxygen. " + 
    "If Oxygen is limited, priority should be given to those with signs of severe respiratory distress such as " + 
    "grunting respirations, wheezing and fast breathing associated with fatigue. " + 
    "Children whose oxygen saturation is less than 90% and/or who have central cyanosis are also a high priority for being given oxygen");

    group_of_questions.push(["What is a septic screen and when should I do it? "]);
    answers.push("Sick children may require additional assessment besides clinical signs. " + 
                 "This additional assessment includes drawing their blood (sometimes also urine and fluid from their spine, called Cerebral Spinal Fluid, CSF) " + 
                 "to determine if they have any evidence of infection and where possible the infection causing organisms. " + 
                 "This is what constitutes a septic screen. ");

    return {group_of_questions, answers};

};