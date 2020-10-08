// Questions and answers for Covid scenario for LIFE game
// Written by Ken Kahn 
// Many questions and answers from https://github.com/deepset-ai/COVID-QA/blob/master/data/faqs/faq_covidbert.csv
// License: New BSD

"use strict";

// Paraphrases by Ken Kahn

LIFE.sentences_and_answers = () => {
    let group_of_questions = [];
    let answers = [];
group_of_questions.push([ // 0
'What is a novel coronavirus?',
'What is a new coronavirus?',
'What does novel coronavirus mean?',
]);
answers.push(
'<p>A novel coronavirus is a new coronavirus that has not been previously identified. The virus causing coronavirus disease 2019 (COVID-19), is not the same as the <a target="_blank" href="https://www.cdc.gov//coronavirus/types.html">coronaviruses that commonly circulate among humans</a> and cause mild illness, like the common cold.</p> <p>A diagnosis with coronavirus 229E, NL63, OC43, or HKU1 is not the same as a COVID-19 diagnosis. Patients with COVID-19 will be evaluated and cared for differently than patients with common coronavirus diagnosis.');
group_of_questions.push([ // 1
'Why is the disease being called coronavirus disease 2019, COVID-19?',
'Why is the name of the disease coronavirus disease 2019, COVID-19?',
'How did COVID-19 get its name?',
]);
answers.push(
'<p>On February 11, 2020 the World Health Organization <a target="_blank" href="https://twitter.com/DrTedros/status/1227297754499764230\">announced</a> an official name for the disease that is causing the 2019 novel coronavirus outbreak, first identified in Wuhan China. The new name of this disease is coronavirus disease 2019, abbreviated as COVID-19. In COVID-19, \'CO\' stands for \'corona,\' \'VI\' for \'virus,\' and \'D\' for disease. Formerly, this disease was referred to as \"2019 novel coronavirus\" or \"2019-nCoV\".          There are <a href="https://www.cdc.gov/coronavirus/index.html\">many types</a> of human coronaviruses including some that commonly cause mild upper-respiratory tract illnesses. COVID-19 is a new disease, caused be a novel (or new) coronavirus that has not previously been seen in humans. The name of this disease was selected following the World Health Organization (WHO) <a href="https://www.who.int/topics/infectious_diseases/naming-new-diseases/en/\">best practice</a> for naming of new human infectious diseases.</p>');
group_of_questions.push([ // 2
'Why might someone blame or avoid individuals and groups (create stigma) because of COVID-19?',
'What would be the reason to blame or avoid individuals and groups because of COVID-10?',
'Why do people accuse or keep away from individuals and groups because of corona?',
// 'Why are people blaming or insulting other because of Corona?',
// 'Why might somebody blame others because of Covid?',
]);
answers.push(
'<p>People in the U.S. may be worried or anxious about friends and relatives who are living in or visiting areas where COVID-19 is spreading. Some people are worried about the disease. Fear and anxiety can lead to social stigma, for example, towards Chinese or other Asian Americans or people who were in quarantine.</p> <p>Stigma is discrimination against an identifiable group of people, a place, or a nation. Stigma is associated with a lack of knowledge about how COVID-19 spreads, a need to blame someone, fears about disease and death, and gossip that spreads rumors and myths.</p> <p>Stigma hurts everyone by creating more fear or anger towards ordinary people instead of the disease that is causing the problem.</p>');
group_of_questions.push([ // 3
'How can people help stop stigma related to COVID-19?',
'What can be done to stop stigma related to COVID-19?',
'How can we destigmatize groups related to the corona virus?',
// 'What can I do to help others being blamed for Corona?',
// 'How should I react to covid related stigma?',
]);
answers.push(
'<p>People can fight stigma and help, not hurt, others by providing social support. Counter stigma by learning and sharing facts. Communicating the facts that viruses do not target specific racial or ethnic groups and how COVID-19 actually spreads can help stop stigma.</p>');
group_of_questions.push([ // 4
'What is the source of the virus?',
'Where does the virus come from?',
'What is the origin of the corona virus?',
]);
answers.push(
'<p>Coronaviruses are a large family of viruses. Some cause illness in people, and others, such as canine and feline coronaviruses, only infect animals. Rarely, animal coronaviruses that infect animals have emerged to infect people and can spread between people. This is suspected to have occurred for the virus that causes COVID-19. Middle East Respiratory Syndrome (MERS) and Severe Acute Respiratory Syndrome (SARS) are two other examples of coronaviruses that originated from animals and then spread to people. More information about the source and spread of COVID-19 is available on the <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/summary.html#anchor_1580079137454">Situation Summary: Source and Spread of the Virus</a>.</p>');
group_of_questions.push([ // 5
'How does the virus spread?',
'In which ways is the virus spread?',
'How does the virus diffuse?',
]);
answers.push(
'<p>This virus was first detected in Wuhan City, Hubei Province, China. The first infections were linked to a live animal market, but the virus is now spreading from person-to-person. It s important to note that person-to-person spread can happen on a continuum. Some viruses are highly contagious (like measles), while other viruses are less so.</p> <p>The virus that causes COVID-19 seems to be spreading easily and sustainably in the community ( community spread ) in <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/about/transmission.html#geographic">some affected geographic areas</a>. Community spread means people have been infected with the virus in an area, including some who are not sure how or where they became infected.</p> <p>Learn what is known about the <a href="https://www.cdc.gov/coronavirus/2019-ncov/about/transmission.html">spread of newly emerged coronaviruses</a>.</p>');
group_of_questions.push([ // 6
'Can someone who has had COVID-19 spread the illness to others?',
'Is it possible that someone who has had the corona virus spreads it to others?',
'Can the corona virus be transmitted by someone who has had it?',
]);
answers.push(
'<p>The virus that causes COVID-19 is <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/about/transmission.html">spreading from person-to-person</a>. Someone who is actively sick with COVID-19 can spread the illness to others. That is why CDC recommends that these patients be isolated either in the hospital or at home (depending on how sick they are) until they are better and no longer pose a risk of infecting others.</p> <p>How long someone is actively sick can vary so the decision on when to release someone from isolation is made on a case-by-case basis in consultation with doctors, infection prevention and control experts, and public health officials and involves considering specifics of each situation including disease severity, illness signs and symptoms, and results of laboratory testing for that patient.</p> <p>Current <a href="https://www.cdc.gov/coronavirus/2019-ncov/hcp/disposition-hospitalized-patients.html">CDC guidance for when it is OK to release someone from isolation</a> is made on a case by case basis and includes meeting all of the following requirements:</p> <ul> <li>The patient is free from fever without the use of fever-reducing medications.</li> <li>The patient is no longer showing symptoms, including cough.</li> <li>The patient has tested negative on at least two consecutive respiratory specimens collected at least 24 hours apart.</li> </ul> <p>Someone who has been released from isolation is not considered to pose a risk of infection to others.</p>');
group_of_questions.push([ // 7
'Can someone who has been quarantined for COVID-19 spread the illness to others?',
'Is it possible that someone who has been quarantined for the corona virus spreads the illnes?',
'Can the virus be transmittet by someone who has been in quarantine?',
]);
answers.push(
'<p>Quarantine means separating a person or group of people who have been exposed to a contagious disease but have not developed illness (symptoms) from others who have not been exposed, in order to prevent the possible spread of that disease. Quarantine is usually established for the incubation period of the communicable disease, which is the span of time during which people have developed illness after exposure. For COVID-19, the period of quarantine is 14 days from the last date of exposure, because 14 days is the longest incubation period seen for similar coronaviruses. Someone who has been released from COVID-19 quarantine is not considered a risk for spreading the virus to others because they have not developed illness during the incubation period.</p> </div></div></div>');
group_of_questions.push([ // 8
'Can the virus that causes COVID-19 be spread through food, including refrigerated or frozen food?',
'Is the virus that causes COVID-19 spreadable through food, including refrigerated or frozen food?',
'Is it possible that the virus diffuses through food, including chilled and frozen food?',
]);
answers.push(
'<p>Coronaviruses are generally thought to be spread from person-to-person through respiratory droplets. Currently there is no evidence to support transmission of COVID-19 associated with food. Before preparing or eating food it is important to always wash your hands with soap and water for 20 seconds for general food safety. Throughout the day wash your hands after blowing your nose, coughing or sneezing, or going to the bathroom.</p> <p>It may be possible that a person can get COVID-19 by touching a surface or object that has the virus on it and then touching their own mouth, nose, or possibly their eyes, but this is not thought to be the main way the virus spreads.</p> <p>In general, because of poor survivability of these coronaviruses on surfaces, there is likely very low risk of spread from food products or packaging that are shipped over a period of days or weeks at ambient, refrigerated, or frozen temperatures.</p> <p>Learn what is known about the <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/about/transmission.html">spread of COVID-19</a>.</p>');
group_of_questions.push([ // 9
'Will warm weather stop the outbreak of COVID-19?',
'Does warmer temperature stop the outbreak of COVID-19?',
'Will warm temperatures slow down the spread of corona?',
]);
answers.push(
'<p>It is not yet known whether weather and temperature impact the spread of COVID-19. Some other viruses, like the common cold and flu, spread more during cold weather months but that does not mean it is impossible to become sick with these viruses during other months.  At this time, it is not known whether the spread of COVID-19 will decrease when weather becomes warmer.  There is much more to learn about the transmissibility, severity, and other features associated with COVID-19 and investigations are ongoing.</p>');
group_of_questions.push([ // 10
'What is community spread?',
'What does community spread mean?',
'What can I understand by community spread?',
]);
answers.push(
'<p>Community spread means people have been infected with the virus in an area, including some who are not sure how or where they became infected.</p>');
group_of_questions.push([ // 11
'How can I help protect myself?',
'What can I do to protect myself?',
'What measures should I take to keep myself safe?',
]);
answers.push(
'<p>Visit the <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/about/prevention-treatment.html">COVID-19 Prevention and Treatment</a> page to learn about how to protect yourself from respiratory illnesses, like COVID-19.</p>');
group_of_questions.push([ // 12
'What should I do if I had close contact with someone who has COVID-19?',
'How should I act if I had close contact with someone who has COVID-19?',
'How should I act if I was near someone infected with the virus?',
]);
answers.push(
'<p>There is information for <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/hcp/guidance-prevent-spread.html">people who have had close contact</a> with a person confirmed to have, or being evaluated for, COVID-19 available online.</p>');
group_of_questions.push([ // 13
'Who is at higher risk for serious illness from COVID-19?',
'Which population group is at higher risk for severe illness from COVID-19?',
'Who might suffer severe illness from the corona virus?',
]);
answers.push(
'<p>Early information out of China, where COVID-19 first started, shows that <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/specific-groups/high-risk-complications.html">some people are at higher risk</a> of getting very sick from this illness including older adults, and people who have serious chronic medical conditions like heart disease, diabetes, and lung disease.</p>');
group_of_questions.push([ // 14
'What should people at higher risk of serious illness with COVID-19 do?',
'What should I do if I\'m at higher risk of severe illness with COVID-19?',
'What is recommended for people with higher risk of severe illness with the corona virus?',
]);
answers.push(
'<p>If you are at higher risk of getting very sick from COVID-19, you should: stock up on supplies; take everyday precautions to keep space between yourself and others; when you go out in public, keep away from others who are sick; limit close contact and wash your hands often; and avoid crowds, cruise travel, and non-essential travel. If there is an outbreak in your community, stay home as much as possible. Watch for symptoms and emergency signs. Watch for symptoms and emergency signs. If you get sick, stay home and call your doctor. More information on how to prepare, what to do if you get sick, and how communities and caregivers can support those at higher risk is available on <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/specific-groups/high-risk-complications.html">People at Risk for Serious Illness from COVID-19. </a></p>');
group_of_questions.push([ // 15
'Am I at risk for COVID-19 from a package or products shipping from China?',
'Can I get the corona virus from a package or products shipping from China?',
'Are products or packages from China contaminated with the corona virus?',
]);
answers.push(
' <p>There is still a lot that is unknown about the newly emerged COVID-19 and how it spreads. Two other coronaviruses have emerged previously to cause severe illness in people (MERS-CoV and SARS-CoV). The virus that causes COVID-19 is more genetically related to SARS-CoV than MERS-CoV, but both are betacoronaviruses with their origins in bats. While we don t know for sure that this virus will behave the same way as SARS-CoV and MERS-CoV, we can use the information gained from both of these earlier coronaviruses to guide us. In general, because of poor survivability of these coronaviruses on surfaces, there is likely very low risk of spread from products or packaging that are shipped over a period of days or weeks at ambient temperatures. Coronaviruses are generally thought to be spread most often by respiratory droplets. Currently there is no evidence to support transmission of COVID-19 associated with imported goods and there have not been any cases of COVID-19 in the United States associated with imported goods. Information will be provided on the <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/index.html">Coronavirus Disease 2019 (COVID-19) website</a> as it becomes available.</p>');
group_of_questions.push([ // 16
'What are the symptoms and complications that COVID-19 can cause?',
'Which symptoms and complications does COVID-19 cause?',
'What symptoms do I have if I\'m infected with the corona virus?',
]);
answers.push(
'<p>Current symptoms reported for patients with COVID-19 have included mild to severe respiratory illness with fever<a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/faq.html#footnote1"><sup>1</sup></a>, cough, and difficulty breathing. Read about <a href="https://www.cdc.gov/coronavirus/2019-ncov/about/symptoms.html">COVID-19 Symptoms</a>.</p>');
group_of_questions.push([ // 17
'Can a person test negative and later test positive for COVID-19?',
'Is it possible for the covid test to fail?',
'What is the false negative rate for covid tests?',
'Can the Corona test fail?',
]);
answers.push(
'<p>Using the CDC-developed diagnostic test, a negative result means that the virus that causes COVID-19 was not found in the person s sample. In the early stages of infection, it is possible the virus will not be detected.</p> <p>For COVID-19, a negative test result for a sample collected while a person has symptoms likely means that the COVID-19 virus is not causing their current illness.</p>');
group_of_questions.push([ // 18
'Am I at risk if I go to a funeral or visitation service for someone who died of COVID-19?',
'Can I infect myself with corona at a funeral?',
'How likely is an infection if I visit a funeral related to covid-19?',
]);
answers.push(
'<p>There is currently no known risk associated with being in the same room at a funeral or visitation service with the body of someone who died of COVID-19.</p>');
group_of_questions.push([ // 19
'Am I at risk if I touch someone who died of COVID-19 after they have passed away?',
'Can I get an infection from touching a person who died from corona?',
'What is the risk of being in contact with a corona infected corps?',
// 'Do dead people can spread the corona virus?',
]);
answers.push(
'<p style="margin-top: 0in;"><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: black;">COVID-19 is a new disease and <strong><span style="font-family: \'Segoe UI\',sans-serif;">we are still learning how it spreads</span></strong>. The virus that causes COVID-19 is thought to mainly spread from close contact (i.e., within about 6 feet) with a person who is currently sick with COVID-19. The virus likely spreads primarily through respiratory droplets produced when an infected person coughs or sneezes, similar to how influenza and other respiratory infections spread. These droplets can land in the mouths or noses of people who are nearby or possibly be inhaled into the lungs. This type of spread is not a concern after death.</span></p> <p style="margin-top: 0in;"><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: black;">It may be possible that a person can get COVID-19 by touching a surface or object that has the virus on it and then touching their own mouth, nose, or possibly their eyes, but this is not thought to be the main way the virus spreads.</span></p> <p style="margin-top: 0in;"><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: black;">People should consider not touching the body of someone who has died of COVID-19. Older people and people of all ages with severe underlying health conditions are at higher risk of developing serious COVID-19 illness. There may be less of a chance of the virus spreading from certain types of touching, such as holding the hand or hugging after the body has been prepared for viewing. Other activities, such as kissing, washing, and shrouding should be avoided before, during, and after the body has been prepared, if possible. If washing the body or shrouding are important religious or cultural practices, families are encouraged to work with their community cultural and religious leaders and funeral home staff on how to reduce their exposure as much as possible. At a minimum, people conducting these activities should wear disposable gloves. If splashing of fluids is expected, additional personal protective equipment (PPE) may be required (such as disposable gown, faceshield or goggles and facemask). </span></p> <p style="margin-top: 0in;"><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: black;">Cleaning should be conducted in accordance with manufacturer s instructions for all cleaning and disinfection products (e.g., concentration, application method and contact time, etc.). </span><a target="_blank" href="https://www.epa.gov/sites/production/files/2020-03/documents/sars-cov-2-list_03-03-2020.pdf" target="new" rel="noopener noreferrer" class="tp-link-policy" data-domain-ext="gov"><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: #075290;">Products with EPA-approved emerging viral pathogens claims</span><span class="sr-only">pdf icon</span><span class="fi cdc-icon-pdf x16 fill-pdf" aria-hidden="true"></span><span class="file-details"></span><span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: black;"> are expected to be effective against COVID-19 based on data for harder to kill viruses. After removal of PPE, perform </span><a href="https://www.cdc.gov/handwashing/when-how-handwashing.html"><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: #075290;">hand hygiene</span></a><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: black;"> by washing hands with soap and water for at least 20 seconds or using an alcohol-based hand sanitizer that contains at least 60% alcohol if soap and water are not available. Soap and water should be used if the hands are visibly soiled.</span></p>');
group_of_questions.push([ // 20
'What do Funeral Home Workers need to know about handling decedents who had COVID-19?',
'How should funeral workers handle people deceised from corona?',
'What do people handling decendants of Corona need to know?',
]);
answers.push(
'<p>A funeral or visitation service can be held for a person who has died of COVID-19. Funeral home workers should follow their routine infection prevention and control precautions when handling a decedent who died of COVID-19. If it is necessary to transfer a body to a bag, follow <a target="_blank" href="https://www.cdc.gov/infectioncontrol/basics/standard-precautions.html">Standard Precautions</a>, including additional personal protective equipment (PPE) if splashing of fluids is expected. For transporting a body after the body has been bagged, disinfect the outside of the bag with a <a href="https://www.epa.gov/sites/production/files/2020-03/documents/sars-cov-2-list_03-03-2020.pdf" target="new" class="tp-link-policy" data-domain-ext="gov">product with EPA-approved emerging viral pathogens claims<span class="sr-only">pdf icon</span><span class="fi cdc-icon-pdf x16 fill-pdf" aria-hidden="true"></span><span class="file-details"></span><span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a> expected to be effective against COVID-19 based on data for harder to kill viruses. Follow the manufacturer s instructions for all cleaning and disinfection products (e.g., concentration, application method and contact time, etc.). Wear disposable nitrile gloves when handling the body bag.</p> <p>Embalming can be conducted. During embalming, follow Standard Precautions including the use of additional PPE if splashing is expected (e.g. disposable gown, faceshield or goggles and facemask). Wear appropriate respiratory protection if any procedures will generate aerosols or if required for chemicals used in accordance with the manufacturer s label. Wear heavy-duty gloves over nitrile disposable gloves if there is a risk of cuts, puncture wounds, or other injuries that break the skin. Additional information on how to safely conduct aerosol-generating procedures is in the <a href="https://www.cdc.gov/coronavirus/2019-ncov/hcp/guidance-postmortem-specimens.html#autopsy">CDC s Postmortem Guidance</a>. Cleaning should be conducted in accordance with manufacturer s instructions. <a href="https://www.epa.gov/sites/production/files/2020-03/documents/sars-cov-2-list_03-03-2020.pdf" target="new" class="tp-link-policy" data-domain-ext="gov">Products with EPA-approved emerging viral pathogens claims<span class="sr-only">pdf icon</span><span class="fi cdc-icon-pdf x16 fill-pdf" aria-hidden="true"></span><span class="file-details"></span><span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a> are expected to be effective against COVID-19 based on data for harder to kill viruses. Follow the manufacturer s instructions for all cleaning and disinfection products (e.g., concentration, application method and contact time, etc.).</p> <p>After cleaning and removal of PPE, perform <a href="https://www.cdc.gov/handwashing/when-how-handwashing.html">hand hygiene</a> by washing hands with soap and water for at least 20 seconds or using an alcohol-based hand sanitizer that contains at least 60% alcohol if soap and water is not available. Soap and water should be used if the hands are visibly soiled.</p> <p>Decedents with COVID-19 can be buried or cremated, but check for any additional state and local requirements that may dictate the handling and disposition of the remains of individuals who have died of certain infectious diseases.</p>');
// group_of_questions.push([ // 21
// 'What about imported animals or animal products?',
// 'Are there regulations about importing animals or animal products?',
// ]);
// answers.push(
// '<p>CDC does not have any evidence to suggest that imported animals or animal products pose a risk for spreading COVID-19 in the United States. This is a rapidly evolving situation and information will be updated as it becomes available. The U.S. Centers for Disease Control and Prevention (CDC), the U. S. Department of Agriculture (USDA), and the U.S. Fish and Wildlife Service (FWS) play distinct but complementary roles in regulating the importation of live animals and animal products into the United States. <a target="_blank" href="https://www.cdc.gov/importation/index.html">CDC regulates</a> animals and animal products that pose a threat to human health, <a href="https://www.aphis.usda.gov/aphis/ourfocus/animalhealth/animal-and-animal-product-import-information/ct_animal_imports_home" class="tp-link-policy" data-domain-ext="gov">USDA regulates<span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a> animals and animal products that pose a threat to agriculture; and <a href="https://www.fws.gov/le/businesses.html" class="tp-link-policy" data-domain-ext="gov">FWS regulates<span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a> importation of endangered species and wildlife that can harm the health and welfare of humans, the interests of agriculture, horticulture, or forestry, and the welfare and survival of wildlife resources.</p>');
group_of_questions.push([ // 22
'Should I be concerned about pets or other animals and COVID-19?',
'Can pets transmit corona virus?',
'Can animals spread the corona virus?',
// 'Can pets or other animals be infected by Corona? ',
]);
answers.push(
'<p>While this virus seems to have emerged from an animal source, it is now spreading from person-to-person in China. There is no reason to think that any animals including pets in the United States might be a source of infection with this new coronavirus. To date, CDC has not received any reports of pets or other animals becoming sick with COVID-19. At this time, there is no evidence that companion animals including pets can spread COVID-19. However, since animals can spread other diseases to people, it s always a good idea to wash your hands after being around animals. For more information on the many benefits of pet ownership, as well as staying safe and healthy around animals including pets, livestock, and wildlife, visit CDC s <a target="_blank" href="https://www.cdc.gov/healthypets/index.html">Healthy Pets, Healthy People website</a>.</p> ');
group_of_questions.push([ // 23
'Should I avoid contact with pets or other animals if I am sick with COVID-19?',
'What should I do with my pets when I am infected with Corona?',
'What should happen to my pets now that I have COVID-19?' // Ken Kahn
]);
answers.push(
'<p>You should restrict contact with pets and other animals while you are sick with COVID-19, just like you would around other people. Although there have not been reports of pets or other animals becoming sick with COVID-19, it is still recommended that people sick with COVID-19 limit contact with animals until more information is known about the virus. When possible, have another member of your household care for your animals while you are sick. If you are sick with COVID-19, avoid contact with your pet, including petting, snuggling, being kissed or licked, and sharing food. If you must care for your pet or be around animals while you are sick, wash your hands before and after you interact with pets and wear a facemask.</p>');
group_of_questions.push([ // 24
'What precautions should be taken for animals that have recently been imported (for example, by shelters, rescue groups, or as personal pets) from China?',
'What are security measures for animals that just came out of China?',
'What are the risks adapting a pet now?' // Ken Kahn
]);
answers.push(
'<p>Animals imported from China will need to meet <a target="_blank" href="https://www.cdc.gov/importation/bringing-an-animal-into-the-united-states/index.html">CDC</a> and <a href="https://www.aphis.usda.gov/aphis/ourfocus/animalhealth/animal-and-animal-product-import-information/live-animal-imports/import-live-animals" class="tp-link-policy" data-domain-ext="gov">USDA<span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a> requirements for entering the United States. At this time, there is no evidence that companion animals including pets can spread COVID-19. As with any animal introduced to a new environment, animals recently imported from China should be observed daily for signs of illness. If an animal becomes ill, the animal should be examined by a veterinarian. Call your local veterinary clinic <u>before</u> bringing the animal into the clinic and let them know that the animal was recently in China.</p>');
group_of_questions.push([ // 25
'What is the risk of getting COVID-19 on an airplane?',
'Can I get Covid when I am on a plane?',
'How likely is transmission of Corona Virus in airplanes?',
]);
answers.push(
'<p>Because of how air circulates and is filtered on airplanes, most viruses and other germs do not spread easily. Although the risk of infection on an airplane is low, try to avoid contact with sick passengers and wash your hands often with soap and water for at least 20 seconds or use hand sanitizer that contains at least 60% alcohol.</p> <p>For more information: <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/php/risk-assessment.html">Exposure Risk During Travel</a></p>');
group_of_questions.push([ // 26
'What happens if there is a sick passenger on an international or domestic flight?',
'What do I need to do when I was with a sick person on the same flight?',
'What happens to sick people when they are on a flight?',
]);
answers.push(
'<p>Under current federal regulations, pilots must report all illnesses and deaths to CDC before arriving to a US destination. According to CDC disease protocols, if a sick traveler is considered to be a public health risk, CDC works with local and state health departments and international public health agencies to <a target="_blank" href="https://www.cdc.gov/quarantine/contact-investigation.html">contact passengers and crew</a> exposed to that sick traveler.</p> <p>Be sure to give the airline your current contact information when booking your ticket so you can be notified if you are exposed to a sick traveler on a flight.</p> <p>For more information: <a href="http://www.cdc.gov/quarantine/contact-investigation.html">Contact Investigation</a></p>');
group_of_questions.push([ // 27
'Should I go on a cruise?',
'Can I do holidays on a ship?',
'Is it safe to do a cruise in the next weeks?',
// 'Is it currently allowed to do a cruise?',
]);
answers.push(
'<p>CDC recommends all travelers, particularly older adults and people of any age with serious chronic medical conditions <a target="_blank" href="https://wwwnc.cdc.gov/travel/page/covid-19-cruise-ship">defer all cruise ship travel worldwide</a>. Recent reports of COVID-19 on cruise ships highlight the risk of infection to cruise ship passengers and crew. Like many other viruses, COVID-19 appears to spread more easily between people in close quarters aboard ships.</p>');
group_of_questions.push([ // 28
'Should travelers wear facemasks?',
'Should I wear a mask?',
'Should I use a mask when I travel?',
// 'Is it safer to travel with a mask?',
]);
answers.push(
'<p>CDC does not recommend that healthy travelers wear facemasks to protect themselves from COVID-19. Wear a facemask only if you are sick and coughing or sneezing to help prevent the spread of respiratory viruses to others. If you are well, it is more important to take these important steps to reduce your chances of getting sick:</p> <ul> <li>Avoid close contact with people who are sick.</li> <li>Avoid touching your eyes, nose, and mouth with unwashed hands.</li> <li>To the extent possible, avoid touching high-touch surfaces in public places   elevator buttons, door handles, handrails, handshaking with people, etc. <ul> <li>Use a tissue or your sleeve to cover your hand or finger if you must touch something.</li> <li>Wash your hands after touching surfaces in public places.</li> </ul> </li> <li><strong>Clean AND disinfect </strong><a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/community/home/cleaning-disinfection.html">frequently touched surfaces</a><strong> daily</strong>. This includes tables, doorknobs, light switches, countertops, handles, desks, phones, keyboards, toilets, faucets, and sinks.</li> <li>Wash your hands often with soap and water for at least 20 seconds, especially after going to the bathroom; before eating; and after blowing your nose, coughing, or sneezing.</li> <li>If soap and water aren t available, use a hand sanitizer that contains at least 60% alcohol.</li> </ul>');
group_of_questions.push([ // 29
'What can I expect when departing other countries?',
'Can I leave the country?',
'Can I travel to other countries?',
// 'What actions are taken at border control?',
]);
answers.push(
'<p>Be aware that some countries are conducting exit screening for all passengers leaving their country. Before being permitted to board a departing flight, you may have your temperature taken and be asked questions about your travel history and health.</p>');
group_of_questions.push([ // 30
'What if I recently traveled and get sick?',
'What do I need to do if I feel sick and came back from another country?',
'What shall I do if I feel sick after traveling?',
]);
answers.push(
'<p><a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/about/steps-when-sick.html">See CDC\'s website about what to do if you get sick</a>.</p>');
group_of_questions.push([ // 31
'How can my family and I prepare for COVID-19?',
'How can I prepare myself?',
// 'What can I do to reduce the risk for me and my family?', // duplicate with the following
'How can I prepare for corona?',
]);
answers.push(
'<p>Create a household plan of action to help protect your health and the health of those you care about in the event of an outbreak of COVID-19 in your community:</p> <ul> <li>Talk with the people who need to be included in your plan, and discuss <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-nCoV/summary.html">what to do if a COVID-19 outbreak occurs in your community</a>.</li> <li>Plan ways to care for those who might be at greater risk for serious complications, particularly <a href="https://www.cdc.gov/coronavirus/2019-ncov/specific-groups/high-risk-complications.html">older adults and those with severe chronic medical</a> conditions like heart, lung or kidney disease. <ul> <li>Make sure they have access to several weeks of medications and supplies in case you need to stay home for prolonged periods of time.</li> </ul> </li> <li>Get to know your neighbors and find out if your neighborhood has a website or social media page to stay connected.</li> <li>Create a list of local organizations that you and your household can contact in the event you need access to information, healthcare services, support, and resources.</li> <li>Create an emergency contact list of family, friends, neighbors, carpool drivers, health care providers, teachers, employers, the local public health department, and other community resources.</li> </ul>');
group_of_questions.push([ // 32
'What steps can my family take to reduce our risk of getting COVID-19?',
'What safety measures can I take?',
'What can I do to reduce the risk for me and my family?',
// 'What steps can my family take to reduce our risk of getting corona?',
]);
answers.push(
'<p>Practice everyday preventive actions to help reduce your risk of getting sick and remind everyone in your home to do the same. These actions are especially important for older adults and people who have severe chronic medical conditions:</p> <ul> <li>Avoid close contact with people who are sick.</li> <li>Stay home when you are sick, except to get medical care.</li> <li>Cover your coughs and sneezes with a tissue and throw the tissue in the trash.</li> <li>Wash your hands often with soap and water for at least 20 seconds, especially after blowing your nose, coughing, or sneezing; going to the bathroom; and before eating or preparing food.</li> <li>If soap and water are not readily available, use an alcohol-based hand sanitizer with at least 60% alcohol. Always wash hands with soap and water if hands are visibly dirty.</li> <li>Clean and disinfect frequently touched surfaces and objects<br> (e.g., tables, countertops, light switches, doorknobs, and cabinet handles).</li> </ul>');
group_of_questions.push([ // 33
'What should I do if someone in my house gets sick with COVID-19?',
'What to do if someone I know gets Corona?',
'How to act if one of my peers has COVID?',
// 'What to do if someone I know gets the virus?',
]);
answers.push(
'<p>Most people who get COVID-19 will be able to recover at home. <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/hcp/guidance-prevent-spread.html">CDC has directions</a> for people who are recovering at home and their caregivers, including:</p> <ul> <li>Stay home when you are sick, except to get medical care.</li> <li>If you develop emergency warning signs for COVID-19 get medical attention immediately. In adults, emergency warning signs<sup>*</sup>:</li> </ul> <ul> <li style="list-style-type: none;"> <ul> <li>Difficulty breathing or shortness of breath</li> <li>Persistent pain or pressure in the chest</li> <li>New confusion or inability to arouse</li> <li>Bluish lips or face</li> <li><sup>*</sup>This list is not all inclusive. Please consult your medical provider for any other symptom that is severe or concerning.</li> </ul> </li> </ul> <ul> <li>Use a separate room and bathroom for sick household members (if possible).</li> <li>Clean hands regularly by handwashing with soap and water or using an alcohol-based hand sanitizer with at least 60% alcohol.</li> <li>Provide your sick household member with clean disposable facemasks to wear at home, if available, to help prevent spreading COVID-19 to others.</li> <li><a href="https://www.cdc.gov/coronavirus/2019-ncov/community/home/cleaning-disinfection.html">Clean the sick room and bathroom</a>, as needed, to avoid unnecessary contact with the sick person.</li> <li>Avoid sharing personal items like utensils, food, and drinks.</li> </ul>');
group_of_questions.push([ // 34
'How can I prepare in case my child\'s school, childcare facility, or university is dismissed?',
'What can I do if the school of my child is closed?',
'How to deal with closes schools or kindergarten?',
// 'What if my kid can\'t go to school anymore?',
]);
answers.push(
'<p>Talk to the <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/specific-groups/guidance-for-schools.html">school or facility</a> about their emergency operations plan. Understand the plan for continuing education and social services (such as student meal programs) during school dismissals. If your child attends a <a href="https://www.cdc.gov/coronavirus/2019-ncov/community/colleges-universities.html">college or university</a>, encourage them to learn about the school s plan for a COVID-19 outbreak.</p>');
group_of_questions.push([ // 35
'How can I prepare for COVID-19 at work?',
'How to act at work in times of corona?',
'What to do at work with covid?',
]);
answers.push(
'<p>Plan for potential changes at your workplace. Talk to your employer about their emergency operations plan, including sick-leave policies and telework options. <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/specific-groups/guidance-business-response.html">Learn how businesses and employers can plan for and respond to COVID-19.</a></p>');
group_of_questions.push([ // 36
'Should I use soap and water or a hand sanitizer to protect against COVID-19?',
'Is soap helping against corona?',
'Can hand sanitizer protect against covid?',
// 'Can hand sanitizer protect against corona?',
]);
answers.push(
'<p>Handwashing is one of the best ways to protect yourself and your family from getting sick. Wash your hands often with soap and water for at least 20 seconds, especially after blowing your nose, coughing, or sneezing; going to the bathroom; and before eating or preparing food. If soap and water are not readily available, use an alcohol-based hand sanitizer with at least 60% alcohol.</p>');
group_of_questions.push([ // 37
'What cleaning products should I use to protect against COVID-19?',
'How can I disinfect my hands from corona?',
'What is effective for cleaning my hands?',
// 'What cleaning products should I use?',
]);
answers.push(
'<p>Clean and disinfect frequently touched surfaces such as tables, doorknobs, light switches, countertops, handles, desks, phones, keyboards, toilets, faucets, and sinks.  If surfaces are dirty, clean them using detergent or soap and water prior to disinfection. To disinfect, most common EPA-registered household disinfectants will work. See CDC s recommendations <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/community/home/cleaning-disinfection.html">for household cleaning and disinfection</a>.</p>');
group_of_questions.push([ // 38
'What should I do if there is an outbreak in my community?',
'What to do if people around me get infected?',
'What if others around me get the virus?',
// 'How to act if my neighbours get corona?',
]);
answers.push(
'<p>During an outbreak, stay calm and put your preparedness plan to work. Follow the steps below:</p> <p><strong><a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/about/prevention-treatment.html"><strong>Protect yourself and others</strong></a>.</strong></p> <ul> <li>Stay home if you are sick. Keep away from people who are sick. Limit close contact with others as much as possible (about 6 feet).</li> </ul> <p><strong>Put your household plan into action. </strong></p> <ul> <li><strong>Stay informed about the local COVID-19 situation</strong>. Be aware of temporary school dismissals in your area, as this may affect your household s daily routine.</li> </ul> <ul> <li><strong>Continue practicing everyday preventive actions. </strong>Cover coughs and sneezes with a tissue and wash your hands often with soap and water for at least 20 seconds. If soap and water are not available, use a hand sanitizer that contains 60% alcohol. Clean frequently touched surfaces and objects daily using a regular household detergent and water.</li> <li><strong>Notify your workplace as soon as possible if your regular work schedule changes.</strong> Ask to work from home or take leave if you or someone in your household gets sick with <a href="https://www.cdc.gov/coronavirus/2019-ncov/about/symptoms.html">COVID-19 symptoms</a>, or if your child s school is dismissed temporarily. <a href="https://www.cdc.gov/coronavirus/2019-ncov/specific-groups/guidance-business-response.html">Learn how businesses and employers can plan for and respond to COVID-19.</a></li> <li><strong>Stay in touch with others by phone or email. </strong>If you have a chronic medical condition and live alone, ask family, friends, and health care providers to check on you during an outbreak. Stay in touch with family and friends, especially those at increased risk of developing severe illness, such as older adults and people with severe chronic medical conditions.</li> </ul>');
group_of_questions.push([ // 39
'How do I prepare my children in case of COVID-19 outbreak in our community?',
'How can I explain my kids if there\'s a outbreak?',
'How to prepare my children when covid virus spreads around us?',
]);
answers.push(
'<p>Outbreaks can be stressful for adults and children. Talk with your children about the outbreak, try to stay calm, and reassure them that they are safe. If appropriate, explain to them that most illness from COVID-19 seems to be mild. <a target="_blank" href="https://www.cdc.gov/childrenindisasters/helping-children-cope.html">Children respond differently to stressful situations than adults</a>.</p>');
group_of_questions.push([ // 40
'What steps should parents take to protect children during a community outbreak?',
'How can I protect my children?',
'How can I protect my children from corona?',
// 'Is there something to protect my kids?',
]);
answers.push(
'<p>This is a new virus and we are still learning about it, but so far, there does not seem to be a lot of illness in children. Most illness, including serious illness, is happening in adults of working age and older adults. If there cases of COVID-19 that impact your child s school, the school may dismiss students. Keep track of school dismissals in your community. Read or watch local media sources that report school dismissals. If schools are dismissed temporarily, use alternative childcare arrangements, if needed.</p> <p>If your child/children become sick with COVID-19, notify their childcare facility or school. Talk with teachers about classroom assignments and activities they can do from home to keep up with their schoolwork.</p> <p>Discourage children and teens from gathering in other public places while school is dismissed to help slow the spread of COVID-19 in the community.</p>');
group_of_questions.push([ // 41
'Will schools be dismissed if there is an outbreak in my community?',
'Will schools be closed?',
'Are schools shut down?',
// 'Will schools be closed if the virus spreads further?',
]);
answers.push(
'<p>Depending on the situation, public health officials may recommend community actions to reduce exposures to COVID-19, such as school dismissals. Read or watch local media sources that report school dismissals or and watch for communication from your child s school. If schools are dismissed temporarily, discourage students and staff from gathering or socializing anywhere, like at a friend s house, a favorite restaurant, or the local shopping mall.</p>');
group_of_questions.push([ // 42
'Should I go to work if there is an outbreak in my community?',
'Should I still go to work?',
'Is it still safe to go to work?',
// 'Do I have to do my regular job?',
]);
answers.push(
'<p>Follow the advice of your local health officials. Stay home if you can. Talk to your employer to discuss working from home, taking leave if you or someone in your household gets sick with <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/about/symptoms.html">COVID-19 symptoms</a>, or if your child s school is dismissed temporarily. Employers should be aware that more employees may need to stay at home to care for sick children or other sick family members than is usual in case of a community outbreak.</p>');
group_of_questions.push([ // 43
'What is the risk of my child becoming sick with COVID-19?',
'Can children get corona?',
'Are kids at special risk?',
// 'Is there a higher risk for children?',
]);
answers.push(
'<p>A: Based on available evidence, children do not appear to be at higher risk for COVID-19 than adults. While some children and infants have been sick with COVID-19, adults make up most of the known cases to date. You can learn more about who is most at risk for health problems if they have COVID-19 infection on CDC s current <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/summary.html#risk-assessment">Risk Assessment</a> page.</p>');
group_of_questions.push([ // 44
'How can I protect my child from COVID-19 infection?',
'What can I do to protect my child from COVID-19?',
'How do I best protect my child against COVID-19?',
// 'What protects children from COVID-19?',
]);
answers.push(
'<p>You can encourage your child to help stop the spread of COVID-19 by teaching them to do the same things everyone should do to stay healthy.</p> <ul> <li>Clean hands often using soap and water or alcohol-based hand sanitizer</li> <li>Avoid people who are sick (coughing and sneezing)</li> <li>Clean and disinfect high-touch surfaces daily in household common areas (e.g. tables, hard-backed chairs, doorknobs, light switches, remotes, handles, desks, toilets, sinks)</li> <li>Launder items including washable plush toys as appropriate in accordance with the manufacturer s instructions. If possible, launder items using the warmest appropriate water setting for the items and dry items completely. Dirty laundry from an ill person can be washed with other people s items.</li> </ul> <p>You can find additional information on preventing COVID-19 at <a target="_blank" href="https://www.cdc.gov/coronavirus/about/prevention.html">Prevention for 2019 Novel Coronavirus</a> and at <a href="https://www.cdc.gov/coronavirus/2019-ncov/community/index.html">Preventing COVID-19 Spread in Communities</a>. Additional information on how COVID-19 is spread is available at <a href="https://www.cdc.gov/coronavirus/2019-ncov/about/transmission.html">How COVID-19 Spreads</a>.</p>');
group_of_questions.push([ // 45
'Are the symptoms of COVID-19 different in children than in adults?',
'Do COVID-19 symptoms differ between children and adults?',
'Is there a difference in COVID-19 symptoms between children and adults?',
// 'Do children exhibit different symptoms to adults?',
]);
answers.push(
'<p>A:  No. The symptoms of COVID-19 are similar in children and adults. However, children with confirmed COVID-19 have generally presented with mild symptoms. Reported symptoms in children include cold-like symptoms, such as fever, runny nose, and cough. Vomiting and diarrhea have also been reported. It s not known yet whether some children may be at higher risk for severe illness, for example, children with underlying medical conditions and special healthcare needs. There is much more to be learned about how the disease impacts children.</p>');
group_of_questions.push([ // 46
'Should children wear masks? ',
'What about masks for childen?', // Ken Kahn
'Do kids need masks?' // Ken Kahn
]);
answers.push(
'<p>A: No. If your child is healthy, there is no need for them to wear a facemask. Only people who have symptoms of illness or who are providing care to those who are ill should wear masks.</p>');
group_of_questions.push([ // 47
'What is the risk to pregnant women of getting COVID-19? Is it easier for pregnant women to become ill with the disease? If they become infected, will they be more sick than other people?',
'How does COVID-19 affect pregnant women?',
'Is COVID-19 particularly dangerous to pregnant women?',
// 'How dangerous is COVID-19 for pregnant women?',
]);
answers.push(
'<p>We do not currently know if pregnant women have a greater chance of getting sick from COVID-19 than the general public nor whether they are more likely to have serious illness as a result. Pregnant women experience changes in their bodies that may increase their risk of some infections. With viruses from the same family as COVID-19, and other viral respiratory infections, such as influenza, women have had a higher risk of developing severe illness. It is always important for pregnant women to protect themselves from illnesses.</p>');
group_of_questions.push([ // 48
'How can pregnant women protect themselves from getting COVID-19?',
'What should pregnant women do to avoid COVID-19?',
'What precautions can pregnant women take?',
// 'How can pregnant women ensure they do not get COVID-19?',
]);
answers.push(
'<p>Pregnant women should do the same things as the general public to avoid infection. You can help stop the spread of COVID-19 by taking these actions:</p> <ul> <li>Cover your cough (using your elbow is a good technique)</li> <li>Avoid people who are sick</li> <li>Clean your hands often using soap and water or alcohol-based hand sanitizer</li> </ul> <p>You can find additional information on preventing COVID-19 disease at CDC s (<a target="_blank" href="https://www.cdc.gov/coronavirus/about/prevention.html">Prevention for 2019 Novel Coronavirus</a>).</p>');
group_of_questions.push([ // 49
'Can COVID-19 cause problems for a pregnancy? ',
'Are there COVID risks during pregnancy?', // Ken Kahn
'Are there complications from Covid if one is pregnant?' // Ken Kahn
]);
answers.push(
'<p>We do not know at this time if COVID-19 would cause problems during pregnancy or affect the health of the baby after birth.</p>');

    return {group_of_questions, answers};

};
