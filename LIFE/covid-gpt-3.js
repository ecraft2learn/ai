let all_questions = [
    "What are effective triage practices in hospitals?",
    "What triage practices are effective strategies for infection prevention and control in hospitals?",
    "What are best practices for hospital triage?",
    "In the strategies for effective infection prevention and control\n(IPC), what does triage entail at hospitals?",
    "Should triage be carried out by nurses only?",
    "Is it only nurses who should carry out triage?",
    "Are nurses the only ones that should handle triage?",
    "Are nurses the only hospital staff who should carry out triage?",
    "What is the best part of a hospital for carrying out triage?",
    "Where should triage be carried out in the health facility?",
    "Where in a health facility should we carry out triage?",
    "Where should triage of patient take place in a healthcare facility?",
    "Is a cloth mask sufficient for use during triage (screening)?",
    "For triage screening is a cloth mask enough?",
    "Can we handle triage with only cloth masks?",
    "Are cloth masks enough for carrying out triage?",
    "Is infection through one's eyes a high risk?",
    "Is the risk high of getting infected through the eyes?",
    "What is the risk of getting infected through the eyes?",
    "Are eyes a high risk becoming infected?",
    "When must we use eye shields?",
    "Is the use of eye shi essential?",
    "How essential is the use of eye shield?",
    "Are eye shields essential?",
    "Can infected droplets contacting wounds or abrasions cause the disease?",
    "Can the disease be transmitted through wounds or abrasions if they have contact with infected droplets?",
    "Are contacts with wounds and abrasions by infected droplets a transmission risk?",
    "Can one become infected if infected droplets contact a wound?",
    "Can cloth masks prevent the transmission of the disease?",
    "How effective are cloth masks?",
    "Are cloth masks effective to interrupt the transmission of COVID-19?",
    "Do cloth masks protect against transmission?",
    "Should surgical masks be used by uninfected community members?",
    "Should uninfected people use surgical masks?",
    "Are surgical masks recommended for uninfected persons?",
    "Can uninfected persons in the community use the surgical mask?",
    "How long can we wear the same surgical mask?",
    "What is the longest time one should wear a surgical mask?",
    "What is the maximum length of time one can wear a surgical mask?",
    "How long should one wear a surgical mask?",
    "Can we reuse N95 respirators and if so for how long?",
    "Are respirators reusable?",
    "How can we reuse an N95 mask?",
    "Can respirators like N95 be re-used and for how long?",
    "What can you do to reuse a cloth mask?",
    "What can one do to decontaminate a cloth mask for re-use?",
    "Is there a way to decontaminate a cloth mask?",
    "How can you decontaminate a cloth mask for re-use?",
    "What materials are recommended for making cloth masks?",
    "How can one make good cloth masks?",
    "What is the best way to make cloth masks?",
    "What are the recommendations for making cloth masks?",
    "What is the right way to wear a surgical mask?",
    "What is the best way of wearing a surgical mask?",
    "How should one wear a surgical mask?",
    "Which way should one wear a surgical mask?",
    "What should we do with medical or surgical masks after use?",
    "What should one do with used face masks?",
    "How should a used face mask be disposed?",
    "How should we dispose of used face masks?",
    "Is it advisable to use alcohol spray on N95 masks after use, or to wash and allow it to dry and reuse?",
    "Can we wash and dry N95 masks?",
    "Is it OK to spray alcohol on N95 masks in order to reuse them?",
    "Can we reuse an N95 mask after spraying it with alcohol or washing and drying it?",
    "What face mask is ideal for COVID-19 protection?",
    "Which kind of face mask should we use for protection?",
    "What is the best mask for protecting against infection?",
    "What is the ideal face mask for protecting oneself from COVID-19 infection?",
    "Is double masking (N95 mask and then a second surgical mask over the N95 mask) recommended?",
    "Is it a good idea to cover an N95 mask with a surgical mask?",
    "Is it recommended to wear an N95 mask and a surgical mask over it?",
    "Should we put a surgical mask over a N95 mask?",
    "Is the effectiveness of N95 masks affected by cream or makeup?",
    "Can makeup and cream make N95 masks less effective?",
    "Do makeup and cream compromise the effectiveness of N95 masks?",
    "Is it OK to wear makeup and an N95 mask?",
    "Is a surgical mask a good way to provide protection?",
    "How good is the protection from surgical masks?",
    "Do surgical masks provide good protection?",
    "How much protection does a surgical mask provide?",
    "Are there masks suitable for very young children?",
    "Should young children wear masks?",
    "Why are children less than two years not allowed to wear masks?",
    "Is there a possibility of having special masks for children under two?",
    "What masks should hospital laundry workers wear?",
    "What equipment should be provided to laundry workers?",
    "What kind of mask does the laundry worker require to be safe?",
    "What PPE is recommended for laundry workers in a hospital?",
    "What risks are there from prolonged use of a mask?",
    "Are there adverse effects from wearing a face mask for a long time?",
    "Are there risks from wearing a mask over several hours?",
    "Is there any risk of an adverse effect in using the face mask for a prolonged period?",
    "Is it OK to sneeze into a mask?",
    "What should I do if I am wearing a mask and feel an urge to sneeze?",
    "What if I have to sneeze while wearing a mask?",
    "Can I sneeze while wearing a mask?",
    "How can healthcare workers protect themselves when there is little or no PPE available?",
    "What can health workers do for protection if there is no PPE?",
    "What should we do if there is no PPE available?",
    "How can we protect healthcare workers when there isn't enough PPE?",
    "Should we use a second hood to protect the neck?",
    "Is it recommended to protect the neck with another hood?",
    "Is it advisable to use an additional hood to cover the neck?",
    "Can an additional hood that covers the neck provide more protection?",
    "In isolation wards should we wear shoe covers?",
    "Are shoe covers recommended when in an isolation ward?",
    "Are shoe covers necessary in isolation wards?",
    "Should one wear shoe covers in isolation wards?",
    "What PPE should be used with procedures can create aerosols?",
    "How can we protect ourselves when doing aerosol-generating procedures?",
    "What protection is recommended when performing procedures that might generate aerosols?",
    "What are aerosol-generating procedures and what PPE are used?",
    "Is it OK to don and doff in the same area?",
    "Can we don and doff in the same place?",
    "Can we use the same area for donning and doffing?",
    "Is it safe to use the same area for donning and doffing?",
    "Are gloves recommended in the community?",
    "Is it recommended that community members wear gloves?",
    "What is the advice on use of gloves in the community?",
    "Should people in the community wear gloves?",
    "Is it ok to change gloves in a patient's room?",
    "Can we change gloves while in patients’ room?",
    "Is it safe for healthcare workers to change gloves while in a patient's room?",
    "Can healthcare workers change gloves in patients’ room?",
    "Should coveralls be worn when taking care of COVID-19 patients?",
    "Are coveralls recommended when taking care of patients?",
    "When taking care of covid patients should one wear coveralls?",
    "Is it necessary to always wear a coverall while taking care of COVID-19 patients?",
    "Is it good practice to change gloves in the period between attending to one patient and another in the isolation ward?",
    "Should gloves be changed when attending to different patients in the isolation ward?",
    "Is it recommended that one changes gloves in the isolation ward when attending to different patients?",
    "When attending to different patients in the isolation ward should you change gloves?",
    "Should you double glove when dealing with COVID-19 patients?",
    "Is it recommended to wear double gloves when dealing with covid patients?",
    "Should we wear two pairs of gloves to protect ourselves from covid patients?",
    "Is double gloving indicated for dealing with COVID-19 patients?",
    "During doffing, when should I remove the respirator?",
    "During doffing, when exactly am I expected to remove my respirator?",
    "When should I remove my respirator when doffing?",
    "What order should I remove items when doffing?",
    "What PPE should be used in the community?",
    "What is PPE is recommended for use in the community?",
    "What protection should be used in the community?",
    "What types of PPE are recommended for use in the community?",
    "What is the minimum PPE that personnel at the triage area should have?",
    "In the triage area, what is the minimum protective equipment?",
    "What is the least PPE that workers should wear in the triage area?",
    "How little PPE can provide protection in the triage area?",
    "How long can one wear the complete PPE for effective protection?",
    "What is the maximum time we can wear complete PPE for good protection?",
    "How long can one wear complete PPE and still be protected?",
    "What is the longest time one can wear complete PPE and stay protected?",
    "Are the Ebola PPE adequate for working in COVID-19 treatment centres?",
    "Can we use Ebola PPE in COVID treatment areas?",
    "When treating COVID-19 patients can we use Ebola PPE?",
    "Is Ebola PPE OK when treating covid patients?",
    "Is it necessary to change PPE in the period between attending to one patient and another?",
    "Is changing PPE recommended before attending to a second patient?",
    "Should one change PPE between attending one patient and another?",
    "When switching between patients do we need to change PPE?",
    "How do we handle tea and lunch break, do we need new PPE when coming from break?",
    "Do we need new PPE after taking a tea or meal break?",
    "Must we put on new PPE after a lunch break?",
    "After taking a meal do we need to use new PPE?",
    "Do we need to disinfect gumboots after doffing?",
    "Is it necessary to disinfect gumboots after doffing?",
    "After doffing should we disinfect gumboots?",
    "Should we disinfect gumboots after doffing?",
    "To make the coronavirus incapable of infecting what disinfectant should I use?",
    "What kinds of disinfectant is recommended for neutralising SARS-CoV-2?",
    "What disinfectants are good at preventing covid?",
    "What type of disinfectant is effective for COVID-19 prevention?",
    "Should we add a disinfectant to water for handwashing?",
    "Is there an added benefit of adding mild disinfectant to water provided for handwashing?",
    "Is it recommended to add a mild disinfectant to handwashing water?",
    "Is it a good idea to add a disinfectant to water for washing hands?",
    "Should we add PVP-Iodine to nasal spray or mouthwash?",
    "Can PVP-Iodine be used in handwash and hand rub products or even as nasal spray and gargle mouthwash?",
    "Can we use PVP-Iodine in handwash or nasal spray products?",
    "Is it recommended to add PVP-Iodine to handwash or hand rub products?",
    "What are the recommendations regarding disinfecting health facilities?",
    "How frequently should health facilities be disinfected?",
    "How often should one disinfect health facilities?",
    "What frequency should health facilities be disinfected?",
    "How can we disinfect door handles and wall tiles within the hospital setting?",
    "How should hospital door handles and wall tiles be disinfected?",
    "What are the recommendations for disinfecting walls and door handles in hospitals?",
    "What is recommended to disinfect hospital door handles?",
    "Does soap inactivate the virus?",
    "Can we deactivate the virus by washing our hands with soap?",
    "Does washing hands with soap destroy the virus?",
    "Does handwashing with soap kill the virus?",
    "What options are there for hand hygiene other than soap?",
    "What alternatives are there to washing hands with soap?",
    "What other alternatives can be prescribed for hand hygiene?",
    "How can one sanitize hands without soap?",
    "What comes first cleaning or disinfection?",
    "Should one clean or disinfect first?",
    "Does it matter whether you clean or disinfect first?",
    "What order should one clean and disinfect?",
    "What can one use to clean and disinfect public places?",
    "How should we clean and disinfect surfaces?",
    "What kind of disinfectants can be used to clean and disinfect public places?",
    "What is recommended for cleaning and disinfecting?",
    "What concentration of sodium hypochlorite is recommended for hospital use with the current pandemic?",
    "In a hospital setting what concentration of chlorine high test hypochlorite is recommended?",
    "What is the recommended level of dilution for sodium hypochlorite in a hospital?",
    "How much should we dilute sodium hypochlorite for hospital use?",
    "How should we clean the computer keyboards?",
    "What is the recommendation for keeping keyboards clean?",
    "What is the best way to keep keyboards clean?",
    "How do we clean computer keyboards?",
    "How can we disinfect commonly used items like mobile phones, money, wallets, etc?",
    "How should we disinfect phones, wallets, and other common items?",
    "What is a good method for disinfecting phones?",
    "What is recommended for disinfecting money?",
    "Which are the low-touch and which are the high-touch areas in the hospitals?",
    "What hospital areas are considered high-touch versus low-touch?",
    "What is the difference between high-touch and low-touch hospital areas?",
    "Which areas in a hospital are low-touch and which are high-touch?",
    "Is there guidance on cleaning of airports and seaports?",
    "How should one clean an airport?",
    "What is the best way of cleaning air and sea ports?",
    "What is recommended for cleaning ports?",
    "What method is recommended for environmental cleaning in COVID-19 setting, floor cloth or mopping?",
    "Which method is best for cleaning floors in a covid setting?",
    "Is it better to use a mop or floor cloth for environmental cleaning?",
    "Is there guidance about the best way to clean floors?",
    "How should one disinfect the cuffs on blood pressure machines?",
    "How should you disinfect stethoscopes?",
    "How should screening instruments such as stethoscopes and blood pressure machine cuffs be disinfected?",
    "What guidance is there regarding disinfecting screening instruments?",
    "What is recommended for cleaning restrooms?",
    "Is there any need for special cleaning of bathrooms or restrooms?",
    "Do bathrooms need any special cleaning?",
    "Is there anything special we should do to clean restrooms?",
    "What is recommended for disposal of isolation facility medical waste?",
    "How should medical waste from isolation facilities be treated?",
    "How should we handle medical waste from isolation areas?",
    "What is the best practice for disposing of medical waste from the isolation wards?",
    "Should we clean hands with chlorine?",
    "What about chlorine handwashing?",
    "What is the recommendation regarding chlorine for washing hands?",
    "Is chlorine is agood way to disinfect hands?",
    "What should we use to disinfect terminals?",
    "What is the recommended disinfectant for terminal cleaning?",
    "What is the recommendation for disinfecting terminals?",
    "How should we disinfect terminals?",
    "How long should the staff wait before using a room after chlorine disinfection?",
    "When we use a room after using chlorine disinfection?",
    "How long does it take for a room to be useable after disinfected with chlorine?",
    "How soon after disinfecting a room with chlorine can it be used?",
    "Are linens decontaminated after washing and drying in the air?",
    "Does routine laundry and air-drying sufficiently decontaminate linens?",
    "Is laundry and air-drying enough to disinfect linens?",
    "Can ordinary laundry decontaminate lines?",
    "How should we disinfect mattresses?",
    "How effective is fumigating surfaces like beds and mattresses?",
    "Should we fumigate beds and mattresses?",
    "Is fumigating beds recommended?",
    "Should we spray workers before they doff the PPE with a chlorine solution?",
    "In the management of COVID-19 patients, is it recommended to spray healthcare workers with disinfectant before doffing full PPE?",
    "What is the recommendation regarding spraying with a disinfectant before doffing the PPE?",
    "Should healthcare workers be sprayed before doffing?",
    "Is it recommended that streets be sprayed with disinfectants?",
    "Should streets be sprayed with disinfectant?",
    "I see videos from many countries of spraying streets with disinfectant, is this something we should do to control the spread of COVID-19?",
    "Is it a good idea to spray streets with disinfectants?",
    "Is it advisable to repurpose places like stadiums, hostels and schools to serve as COVID-19 treatment centres?",
    "What are the recommendations regarding using public buildings as covid treatment centres?",
    "Should public buildings be used as treatment centres?",
    "Is it a good idea to repurpose stadiums as treatment centres?",
    "Can air-conditioners be used in COVID-19 treatment centres?",
    "Is the running of air conditioners in treatment areas safe?",
    "Is it safe to use air conditioners in treatment centres?",
    "Is it OK for treatment centres to run air conditioners?",
    "What is recommended about keeping isolation wards cool?",
    "What is the recommended way to cool isolation units?",
    "How should we keep isolation units cool?",
    "What are good ways of cooling the isolation units?",
    "Is there a need for HEPA filter in isolation rooms, triage areas, swapping rooms and care areas of COVID-19 patients?",
    "Are HEPA filters recommended in isolation areas?",
    "Should triage areas use HEPA filters?",
    "Should we use HEPA filters in treatment centres?",
    "Can a toilet be shared in a quarantine facility?",
    "Is it OK to share toilet facilities in quarantine?",
    "What is recommended regarding sharing of toilets in quarantine?",
    "In a quarantine area can toilets be shared?",
    "Should visitors be allowed to visit the isolation facilities?",
    "Should visits to isolation areas be allowed?",
    "Should isolation areas be off-limits to visitors?",
    "What is recommended about visitors to isolation facilities?",
    "Can opening windows during transportation help prevent the spread of COVID-19?",
    "What is recommended regarding open windows in public transport?",
    "Should windows be open to prevent transmission while in a bus or train?",
    "During transport do open windows help prevent transmission of covid?",
    "What is the recommendation for homecare for confirmed mild cases of COVID-19?",
    "What is recommended regarding homecare for mild cases?",
    "For mild cases is homecare safe?",
    "Is homecare ok for confirmed mild cases of covid?",
    "What is the recommendation for vulnerable healthcare workers?",
    "What should staff with underlying conditions do?",
    "How do we address staffing problems in settings with high HIV infection rates where healthcare workers are affected and fall within the vulnerable group that should not work in COVID-19 isolation facilities?",
    "Should vulnerable staff work with covid patients?",
    "What can healthcare workers do when they come home?",
    "What extra precautions do you advise healthcare workers to observe when they arrive home from their workstations to protect their families against COVID-19 infection?",
    "What are best practices to protect the families of staff?",
    "What can staff do to protect their families when they return home?",
    "What is recommended about testing of frontline workers caring for COVID-19 patients?",
    "When should an HCW get tested and how often?",
    "When and how often should frontline workers be tested while caring for covid patients?",
    "How often or at what stage should frontline workers be advised to go for test while caring for COVID-19 patients?",
    "Can a health worker contract covid after leaving an isolation centre from their clothing?",
    "Is it possible for health workers to contract COVID-19 through their clothes after leaving the isolation centre?",
    "Might a healthcare worker's clothes transmit covid after working in an isolation area?",
    "Is there a risk of transmission to healthcare workers from their clothes after leaving an isolation area?",
    "How might healthcare workers contract covid?",
    "What are the common risks to health workers from covid?",
    "What are the most common risk factors for contracting COVID-19 by healthcare workers?",
    "What are the risks to healthcare workers of COVID-19?",
    "What are the best ways of handling covid corpses?",
    "What are the IPC recommendations for handling COVID-19 corpses?",
    "How should covid corpses be handled?",
    "What are the recommendations regarding COVID-19 corpses?",
    "Is it risk of transmission from corpses of family members who died of covid",
    "Can covid be transmitted from the corpse of a family member?",
    "Is it safe to care for corpses of family members who died of COVID-19?",
    "Does the corpse of a family member who died of covid provide risks of transmission?",
    "Why is there inconsistency and divergent views about physical distancing, 1 meter, 1.5 meter, 6 feet and 2 meter?",
    "Is physical distancing 1 or 2 meters?",
    "What is the definition of physical distancing?",
    "What distance should be maintained for physical distancing?",
    "What should be done to to reduce transmission when overcrowding is unavoidable?",
    "Among internally displaced persons setting where overcrowding is inevitable, how do we ensure IPC measures?",
    "How should unavoidable overcrowding be safely handled?",
    "What is recommended when overcrowding cannot be avoided?",
    "How can pharmacists reduce their risks of transmission from their patients?",
    "What should medicine vendors do who are in contact with patients?",
    "What is recommended for pharmacists who interact with ill patients?",
    "What are the IPC considerations for pharmacies and patent medicine vendors who attend to ill patients?",
    "What are the best practices for communities in Africa to reduce transmission?",
    "What are the recommendations for protecting African communities?",
    "What is the best way to protect communities in Africa?",
    "What is the most effective protective measure for the community in African context?",
    "How can one reduce the risk of shopping?",
    "What are the important precautions during and after shopping?",
    "How can shopping be made safer?",
    "What are the recommendations for safer shopping?",
    "Is there a difference between quarantining and isolating?",
    "What is the difference between quarantine and isolation?",
    "Are isolation and quarantine the same thing?",
    "How does quarantine and isolation differ?"
];

function obtain_gpt3_embeddings(questions, callback) {
    const embeddings_for_questions = 
        questions.map((question_group, index) =>
            tf.tensor(question_group.map(question => embeddings[embeddings_gpt3_engine][all_questions.indexOf(question)])));
    callback(embeddings_for_questions);  
}

//const all_questions_tensors = tf.tensor(all_questions);

const test_each = () => {
    let bad_count = 0;
    const in_group_1 = [];
    const in_group_2 = [];
    const in_group_3 = [];
    const closest_index = [];
    const bad = [];
    const analyse_embeddings = (embeddings_list, index, name) => {
            const all_but = embeddings_list.slice(0, index).concat(embeddings_list.slice(index+1));
            const all_but_tensor = tf.tensor(all_but);
            const embedding = embeddings_list[index];
            const embedding_tensor = tf.tensor(embedding);
            const cosines_tensor = tf.metrics.cosineProximity(embedding_tensor, all_but_tensor);
            const question_order_cosines = cosines_tensor.dataSync();
            cosines_tensor.dispose();
            all_but_tensor.dispose();
            embedding_tensor.dispose();
            const sorted_cosines = [...question_order_cosines].sort((a,b) => a-b);
            const group_number = x => Math.floor(x/4);
            const adjust = x => x < index ? x : x+1;
            const first_in_group = group_number(index)*4;
            const group1 = sorted_cosines.indexOf(question_order_cosines[first_in_group+0]);
            const group2 = sorted_cosines.indexOf(question_order_cosines[first_in_group+1]);
            const group3 = sorted_cosines.indexOf(question_order_cosines[first_in_group+2]);
            in_group_1.push(group1);
            in_group_2.push(group2);
            in_group_3.push(group3);
            const correct_group = group_number(index);
            const closest = adjust(question_order_cosines.indexOf(sorted_cosines[0]));
            closest_index.push(closest);
    //         let votes = [];
    //         const group_in_the_top_n = (n) => { 
    //             for (let i = 0; i < n; i++) {
    //                 votes.push(adjust(question_order_cosines.indexOf(sorted_cosines[i])))
    //             }
    //         };
    //        let groups = []; // votes.map(group_number);
    //         const k = 10;
    //         group_in_the_top_n(all_questions.length-1);
            const good = group1 === 0 || group2 === 0 || group3 === 0;
            if (!good) {
                if (name === 'USE')
                    embedding_model.embed([all_questions[closest]]).then(embedding => {
                        if (embedding.arraySync()[0][0] !== embeddings['USE'][closest][0]) {
                            console.log('closest', embedding.arraySync()[0]);
                            console.log('in USE', embeddings['USE'][closest]);
                        }
                    });
                return(name + ": " + 
                          'closest: ' + closest + 
                          ' group of closest: ' + group_number(closest) + 
                          ' correct group: ' + correct_group + '\n' +
                          ' query: ' + all_questions[index] + '\n' +
                          ' wrong question: ' + all_questions[closest] + '\n' +
                          (first_in_group+0 !== index ? ' question 1: ' + all_questions[first_in_group+0] + '\n' : '') +
                          (first_in_group+1 !== index ? ' question 2: ' + all_questions[first_in_group+1] + '\n' : '') +
                          (first_in_group+2 !== index ? ' question 3: ' + all_questions[first_in_group+2] + '\n' : '') +
                          (first_in_group+3 !== index ? ' question 4: ' + all_questions[first_in_group+3] + '\n' : ''));
            }
//             const first_to_get_n_votes = (n) => {
//                 let votes_so_far = {};
//                 for (let i = 0; i < all_questions.length; i++) {
//                     let group = group_number(adjust(question_order_cosines.indexOf(sorted_cosines[i])));
//                     groups.push(group);
//                     if (!votes_so_far[group]) {
//                         votes_so_far[group] = 0;
//                     }
//                     votes_so_far[group]++;
//                     if (votes_so_far[group] === n) {
//                         return(group);
//                     }
//                 }
//             }
//             const best_group = first_to_get_n_votes(3);
//             const good = correct_group === best_group;         
    }
    const analyse_all_embeddings = (names) => {
        for (index = 0; index < all_questions.length; index++) {
            let problems = '';
            let count = 0;
            names.forEach(name => {
                const problem = analyse_embeddings(embeddings[name], index, name);
                if (problem) {
                    problems += problem + "\n";
                    count++;
                }
            });
            if (count > 0) {
                bad.push(count + ' sources wrong:\n' + problems);
            }   
        };
    };
//                 console.log('index of closest', closest_index,
//                             'group of closest', group_number(closest_index),
//                             'top score', sorted_cosines[0].toFixed(3));
//                 console.log(//'ok', good ? "good" : "bad",
//                             'index', index,
//                             'group', correct_group, 
//                             // 1-indexing so that '2' means second highest
//                             'in-group1', in_group_1+1, question_order_cosines[first_in_group+0].toFixed(3),
//                             'in-group2', in_group_2+1, question_order_cosines[first_in_group+1].toFixed(3),
//                             'in-group3', in_group_3+1, question_order_cosines[first_in_group+2].toFixed(3),
//                             );
//                 console.log(groups);
//     //             console.log(question_order_cosines[k-1].toFixed(3), question_order_cosines[0].toFixed(3));
//                 console.log('---------------');
//                 bad_count++;
    analyse_all_embeddings(['ada', 'babbage', 'curie', 'davinci']);
    console.log(bad);    
};

let embedding_model; // for debugging

const load_use = (callback) => {
    use.load().then((model) => {
//         model.embed([all_questions[11], "Should coveralls be worn when taking care of coronavirus patients?", all_questions[9], all_questions[10], all_questions[8]]).then(e => {
//             const embeddings = e.arraySync();
//             const cosines_tensor = tf.metrics.cosineProximity(tf.tensor([embeddings[0]]), tf.tensor(embeddings.slice(1)))
//             const cosines = cosines_tensor.arraySync();
//             console.log(cosines);
//         });
        embedding_model = model;
        embeddings['USE'] = [];
        const chunks = 16;
        let chunk_size = all_questions.length/chunks;
        const next_chunk = (i) => {
            model.embed(all_questions.slice(i*chunk_size, (i+1)*chunk_size)).then(embeddings_tensor => {
                embeddings['USE'] = embeddings['USE'].concat(embeddings_tensor.arraySync());
                embeddings_tensor.dispose();
                if (i < chunks-1) {
                    setTimeout(() => { // give other processes a chance to run
                        next_chunk(i+1);
                    });
                } else {
                    callback();
                }
            });
         };
         next_chunk(0); 
    });
};

// load_use(test_each);
// test_each();