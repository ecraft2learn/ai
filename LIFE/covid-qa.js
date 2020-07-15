// Questions and answers for Covid scenario for LIFE game
// Written by Ken Kahn 
// Many questions and answers from https://github.com/deepset-ai/COVID-QA/blob/master/data/faqs/faq_covidbert.csv
// License: New BSD

"use strict";

// Most paraphrases by Ken Kahn
// a few from https://quillbot.com/

LIFE.sentences_and_answers = () => {
    let group_of_questions = [];
    let answers = [];
group_of_questions.push([ // 0
'What is a novel coronavirus?',
'What is a new coronavirus?',
'What does novel coronavirus mean?',
]);
answers.push(
'<p>A novel coronavirus is a new coronavirus that has not been previously identified. The virus causing coronavirus disease 2019 (COVID-19), is not the same as the <a target="_blank" href="/coronavirus/types.html">coronaviruses that commonly circulate among humans</a> and cause mild illness, like the common cold.</p> <p>A diagnosis with coronavirus 229E, NL63, OC43, or HKU1 is not the same as a COVID-19 diagnosis. Patients with COVID-19 will be evaluated and cared for differently than patients with common coronavirus diagnosis.');
group_of_questions.push([ // 1
'Why is the disease being called coronavirus disease 2019, COVID-19?',
'Why is the name of the disease coronavirus disease 2019, COVID-19?',
'How did COVID-19 get its name?',
]);
answers.push(
'<p>On February 11, 2020 the World Health Organization <a target="_blank" href=\"https://twitter.com/DrTedros/status/1227297754499764230\">announced</a> an official name for the disease that is causing the 2019 novel coronavirus outbreak, first identified in Wuhan China. The new name of this disease is coronavirus disease 2019, abbreviated as COVID-19. In COVID-19, \'CO\' stands for \'corona,\' \'VI\' for \'virus,\' and \'D\' for disease. Formerly, this disease was referred to as \"2019 novel coronavirus\" or \"2019-nCoV\".          There are <a href=\"https://www.cdc.gov/coronavirus/index.html\">many types</a> of human coronaviruses including some that commonly cause mild upper-respiratory tract illnesses. COVID-19 is a new disease, caused be a novel (or new) coronavirus that has not previously been seen in humans. The name of this disease was selected following the World Health Organization (WHO) <a href=\"https://www.who.int/topics/infectious_diseases/naming-new-diseases/en/\">best practice</a> for naming of new human infectious diseases.</p>');
group_of_questions.push([ // 2
'Why might someone blame or avoid individuals and groups (create stigma) because of COVID-19?',
'What would be the reason to blame or avoid individuals and groups because of COVID-10?',
'Why do people accuse or keep away from individuals and groups because of corona?',
'Why are people blaming or insulting other because of Corona?',
'Why might somebody blame others because of Covid?',
]);
answers.push(
'<p>People in the U.S. may be worried or anxious about friends and relatives who are living in or visiting areas where COVID-19 is spreading. Some people are worried about the disease. Fear and anxiety can lead to social stigma, for example, towards Chinese or other Asian Americans or people who were in quarantine.</p> <p>Stigma is discrimination against an identifiable group of people, a place, or a nation. Stigma is associated with a lack of knowledge about how COVID-19 spreads, a need to blame someone, fears about disease and death, and gossip that spreads rumors and myths.</p> <p>Stigma hurts everyone by creating more fear or anger towards ordinary people instead of the disease that is causing the problem.</p>');
group_of_questions.push([ // 3
'How can people help stop stigma related to COVID-19?',
'What can be done to stop stigma related to COVID-19?',
'How can we destigmatize groups related to the corona virus?',
'What can I do to help others being blamed for Corona?',
'How should I react to covid related stigma?',
]);
answers.push(
'<p>People can fight stigma and help, not hurt, others by providing social support. Counter stigma by learning and sharing facts. Communicating the facts that viruses do not target specific racial or ethnic groups and how COVID-19 actually spreads can help stop stigma.</p>');
group_of_questions.push([ // 4
'What is the source of the virus?',
'Where does the virus come from?',
'What is the origin of the corona virus?',
]);
answers.push(
'<p>Coronaviruses are a large family of viruses. Some cause illness in people, and others, such as canine and feline coronaviruses, only infect animals. Rarely, animal coronaviruses that infect animals have emerged to infect people and can spread between people. This is suspected to have occurred for the virus that causes COVID-19. Middle East Respiratory Syndrome (MERS) and Severe Acute Respiratory Syndrome (SARS) are two other examples of coronaviruses that originated from animals and then spread to people. More information about the source and spread of COVID-19 is available on the <a target="_blank" href="/coronavirus/2019-nCoV/summary.html#anchor_1580079137454">Situation Summary: Source and Spread of the Virus</a>.</p>');
group_of_questions.push([ // 5
'How does the virus spread?',
'In which ways is the virus spread?',
'How does the virus diffuse?',
]);
answers.push(
'<p>This virus was first detected in Wuhan City, Hubei Province, China. The first infections were linked to a live animal market, but the virus is now spreading from person-to-person. It s important to note that person-to-person spread can happen on a continuum. Some viruses are highly contagious (like measles), while other viruses are less so.</p> <p>The virus that causes COVID-19 seems to be spreading easily and sustainably in the community ( community spread ) in <a target="_blank" href="/coronavirus/2019-ncov/about/transmission.html#geographic">some affected geographic areas</a>. Community spread means people have been infected with the virus in an area, including some who are not sure how or where they became infected.</p> <p>Learn what is known about the <a href="/coronavirus/2019-ncov/about/transmission.html">spread of newly emerged coronaviruses</a>.</p>');
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
'<p>Coronaviruses are generally thought to be spread from person-to-person through respiratory droplets. Currently there is no evidence to support transmission of COVID-19 associated with food. Before preparing or eating food it is important to always wash your hands with soap and water for 20 seconds for general food safety. Throughout the day wash your hands after blowing your nose, coughing or sneezing, or going to the bathroom.</p> <p>It may be possible that a person can get COVID-19 by touching a surface or object that has the virus on it and then touching their own mouth, nose, or possibly their eyes, but this is not thought to be the main way the virus spreads.</p> <p>In general, because of poor survivability of these coronaviruses on surfaces, there is likely very low risk of spread from food products or packaging that are shipped over a period of days or weeks at ambient, refrigerated, or frozen temperatures.</p> <p>Learn what is known about the <a target="_blank" href="/coronavirus/2019-ncov/about/transmission.html">spread of COVID-19</a>.</p>');
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
'p>Visit the <a target="_blank" href="/coronavirus/2019-ncov/about/prevention-treatment.html">COVID-19 Prevention and Treatment</a> page to learn about how to protect yourself from respiratory illnesses, like COVID-19.</p>');
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
'<p>Early information out of China, where COVID-19 first started, shows that <a target="_blank" href="/coronavirus/2019-ncov/specific-groups/high-risk-complications.html">some people are at higher risk</a> of getting very sick from this illness including older adults, and people who have serious chronic medical conditions like heart disease, diabetes, and lung disease.</p>');
group_of_questions.push([ // 14
'What should people at higher risk of serious illness with COVID-19 do?',
'What should I do if I\'m at higher risk of severe illness with COVID-19?',
'What is recommended for people with higher risk of severe illness with the corona virus?',
]);
answers.push(
'<p>If you are at higher risk of getting very sick from COVID-19, you should: stock up on supplies; take everyday precautions to keep space between yourself and others; when you go out in public, keep away from others who are sick; limit close contact and wash your hands often; and avoid crowds, cruise travel, and non-essential travel. If there is an outbreak in your community, stay home as much as possible. Watch for symptoms and emergency signs. Watch for symptoms and emergency signs. If you get sick, stay home and call your doctor. More information on how to prepare, what to do if you get sick, and how communities and caregivers can support those at higher risk is available on <a target="_blank" href="/coronavirus/2019-ncov/specific-groups/high-risk-complications.html">People at Risk for Serious Illness from COVID-19. </a></p>');
group_of_questions.push([ // 15
'Am I at risk for COVID-19 from a package or products shipping from China?',
'Can I get the corona virus from a package or products shipping from China?',
'Are products or packages from China contaminated with the corona virus?',
]);
answers.push(
' <p>There is still a lot that is unknown about the newly emerged COVID-19 and how it spreads. Two other coronaviruses have emerged previously to cause severe illness in people (MERS-CoV and SARS-CoV). The virus that causes COVID-19 is more genetically related to SARS-CoV than MERS-CoV, but both are betacoronaviruses with their origins in bats. While we don t know for sure that this virus will behave the same way as SARS-CoV and MERS-CoV, we can use the information gained from both of these earlier coronaviruses to guide us. In general, because of poor survivability of these coronaviruses on surfaces, there is likely very low risk of spread from products or packaging that are shipped over a period of days or weeks at ambient temperatures. Coronaviruses are generally thought to be spread most often by respiratory droplets. Currently there is no evidence to support transmission of COVID-19 associated with imported goods and there have not been any cases of COVID-19 in the United States associated with imported goods. Information will be provided on the <a target="_blank" href="/coronavirus/2019-nCoV/index.html">Coronavirus Disease 2019 (COVID-19) website</a> as it becomes available.</p>');
group_of_questions.push([ // 16
'What are the symptoms and complications that COVID-19 can cause?',
'Which symptoms and complications does COVID-19 cause?',
'What symptoms do I have if I\'m infected with the corona virus?',
]);
answers.push(
'<p>Current symptoms reported for patients with COVID-19 have included mild to severe respiratory illness with fever<a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/faq.html#footnote1"><sup>1</sup></a>, cough, and difficulty breathing. Read about <a href="/coronavirus/2019-ncov/about/symptoms.html">COVID-19 Symptoms</a>.</p>');
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
'Do dead people can spread the corona virus?',
]);
answers.push(
'<p style="margin-top: 0in;"><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: black;">COVID-19 is a new disease and <strong><span style="font-family: \'Segoe UI\',sans-serif;">we are still learning how it spreads</span></strong>. The virus that causes COVID-19 is thought to mainly spread from close contact (i.e., within about 6 feet) with a person who is currently sick with COVID-19. The virus likely spreads primarily through respiratory droplets produced when an infected person coughs or sneezes, similar to how influenza and other respiratory infections spread. These droplets can land in the mouths or noses of people who are nearby or possibly be inhaled into the lungs. This type of spread is not a concern after death.</span></p> <p style="margin-top: 0in;"><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: black;">It may be possible that a person can get COVID-19 by touching a surface or object that has the virus on it and then touching their own mouth, nose, or possibly their eyes, but this is not thought to be the main way the virus spreads.</span></p> <p style="margin-top: 0in;"><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: black;">People should consider not touching the body of someone who has died of COVID-19. Older people and people of all ages with severe underlying health conditions are at higher risk of developing serious COVID-19 illness. There may be less of a chance of the virus spreading from certain types of touching, such as holding the hand or hugging after the body has been prepared for viewing. Other activities, such as kissing, washing, and shrouding should be avoided before, during, and after the body has been prepared, if possible. If washing the body or shrouding are important religious or cultural practices, families are encouraged to work with their community cultural and religious leaders and funeral home staff on how to reduce their exposure as much as possible. At a minimum, people conducting these activities should wear disposable gloves. If splashing of fluids is expected, additional personal protective equipment (PPE) may be required (such as disposable gown, faceshield or goggles and facemask). </span></p> <p style="margin-top: 0in;"><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: black;">Cleaning should be conducted in accordance with manufacturer s instructions for all cleaning and disinfection products (e.g., concentration, application method and contact time, etc.). </span><a target="_blank" href="https://www.epa.gov/sites/production/files/2020-03/documents/sars-cov-2-list_03-03-2020.pdf" target="new" rel="noopener noreferrer" class="tp-link-policy" data-domain-ext="gov"><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: #075290;">Products with EPA-approved emerging viral pathogens claims</span><span class="sr-only">pdf icon</span><span class="fi cdc-icon-pdf x16 fill-pdf" aria-hidden="true"></span><span class="file-details"></span><span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: black;"> are expected to be effective against COVID-19 based on data for harder to kill viruses. After removal of PPE, perform </span><a href="https://www.cdc.gov/handwashing/when-how-handwashing.html"><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: #075290;">hand hygiene</span></a><span style="font-size: 13.0pt; font-family: \'Segoe UI\',sans-serif; color: black;"> by washing hands with soap and water for at least 20 seconds or using an alcohol-based hand sanitizer that contains at least 60% alcohol if soap and water are not available. Soap and water should be used if the hands are visibly soiled.</span></p>');
group_of_questions.push([ // 20
'What do Funeral Home Workers need to know about handling decedents who had COVID-19?',
'How should funeral workers handle people deceised from corona?',
'What do people handling decendants of Corona need to know?',
]);
answers.push(
'<p>A funeral or visitation service can be held for a person who has died of COVID-19. Funeral home workers should follow their routine infection prevention and control precautions when handling a decedent who died of COVID-19. If it is necessary to transfer a body to a bag, follow <a target="_blank" href="https://www.cdc.gov/infectioncontrol/basics/standard-precautions.html">Standard Precautions</a>, including additional personal protective equipment (PPE) if splashing of fluids is expected. For transporting a body after the body has been bagged, disinfect the outside of the bag with a <a href="https://www.epa.gov/sites/production/files/2020-03/documents/sars-cov-2-list_03-03-2020.pdf" target="new" class="tp-link-policy" data-domain-ext="gov">product with EPA-approved emerging viral pathogens claims<span class="sr-only">pdf icon</span><span class="fi cdc-icon-pdf x16 fill-pdf" aria-hidden="true"></span><span class="file-details"></span><span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a> expected to be effective against COVID-19 based on data for harder to kill viruses. Follow the manufacturer s instructions for all cleaning and disinfection products (e.g., concentration, application method and contact time, etc.). Wear disposable nitrile gloves when handling the body bag.</p> <p>Embalming can be conducted. During embalming, follow Standard Precautions including the use of additional PPE if splashing is expected (e.g. disposable gown, faceshield or goggles and facemask). Wear appropriate respiratory protection if any procedures will generate aerosols or if required for chemicals used in accordance with the manufacturer s label. Wear heavy-duty gloves over nitrile disposable gloves if there is a risk of cuts, puncture wounds, or other injuries that break the skin. Additional information on how to safely conduct aerosol-generating procedures is in the <a href="/coronavirus/2019-ncov/hcp/guidance-postmortem-specimens.html#autopsy">CDC s Postmortem Guidance</a>. Cleaning should be conducted in accordance with manufacturer s instructions. <a href="https://www.epa.gov/sites/production/files/2020-03/documents/sars-cov-2-list_03-03-2020.pdf" target="new" class="tp-link-policy" data-domain-ext="gov">Products with EPA-approved emerging viral pathogens claims<span class="sr-only">pdf icon</span><span class="fi cdc-icon-pdf x16 fill-pdf" aria-hidden="true"></span><span class="file-details"></span><span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a> are expected to be effective against COVID-19 based on data for harder to kill viruses. Follow the manufacturer s instructions for all cleaning and disinfection products (e.g., concentration, application method and contact time, etc.).</p> <p>After cleaning and removal of PPE, perform <a href="https://www.cdc.gov/handwashing/when-how-handwashing.html">hand hygiene</a> by washing hands with soap and water for at least 20 seconds or using an alcohol-based hand sanitizer that contains at least 60% alcohol if soap and water is not available. Soap and water should be used if the hands are visibly soiled.</p> <p>Decedents with COVID-19 can be buried or cremated, but check for any additional state and local requirements that may dictate the handling and disposition of the remains of individuals who have died of certain infectious diseases.</p>');
group_of_questions.push([ // 21
'What about imported animals or animal products?',
'Are there regulations about importing animals or animal products?',
]);
answers.push(
'<p>CDC does not have any evidence to suggest that imported animals or animal products pose a risk for spreading COVID-19 in the United States. This is a rapidly evolving situation and information will be updated as it becomes available. The U.S. Centers for Disease Control and Prevention (CDC), the U. S. Department of Agriculture (USDA), and the U.S. Fish and Wildlife Service (FWS) play distinct but complementary roles in regulating the importation of live animals and animal products into the United States. <a target="_blank" href="https://www.cdc.gov/importation/index.html">CDC regulates</a> animals and animal products that pose a threat to human health, <a href="https://www.aphis.usda.gov/aphis/ourfocus/animalhealth/animal-and-animal-product-import-information/ct_animal_imports_home" class="tp-link-policy" data-domain-ext="gov">USDA regulates<span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a> animals and animal products that pose a threat to agriculture; and <a href="https://www.fws.gov/le/businesses.html" class="tp-link-policy" data-domain-ext="gov">FWS regulates<span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a> importation of endangered species and wildlife that can harm the health and welfare of humans, the interests of agriculture, horticulture, or forestry, and the welfare and survival of wildlife resources.</p>');
group_of_questions.push([ // 22
'Should I be concerned about pets or other animals and COVID-19?',
'Can pets transmit corona virus?',
'Can animals spread the corona virus?',
'Can pets or other animals be infected by Corona? ',
]);
answers.push(
'<p>While this virus seems to have emerged from an animal source, it is now spreading from person-to-person in China. There is no reason to think that any animals including pets in the United States might be a source of infection with this new coronavirus. To date, CDC has not received any reports of pets or other animals becoming sick with COVID-19. At this time, there is no evidence that companion animals including pets can spread COVID-19. However, since animals can spread other diseases to people, it s always a good idea to wash your hands after being around animals. For more information on the many benefits of pet ownership, as well as staying safe and healthy around animals including pets, livestock, and wildlife, visit CDC s <a target="_blank" href="https://www.cdc.gov/healthypets/index.html">Healthy Pets, Healthy People website</a>.</p> ');
group_of_questions.push([ // 23
'Should I avoid contact with pets or other animals if I am sick with COVID-19?',
'What should I do with my pets when I am infected with Corona?',
]);
answers.push(
'<p>You should restrict contact with pets and other animals while you are sick with COVID-19, just like you would around other people. Although there have not been reports of pets or other animals becoming sick with COVID-19, it is still recommended that people sick with COVID-19 limit contact with animals until more information is known about the virus. When possible, have another member of your household care for your animals while you are sick. If you are sick with COVID-19, avoid contact with your pet, including petting, snuggling, being kissed or licked, and sharing food. If you must care for your pet or be around animals while you are sick, wash your hands before and after you interact with pets and wear a facemask.</p>');
group_of_questions.push([ // 24
'What precautions should be taken for animals that have recently been imported (for example, by shelters, rescue groups, or as personal pets) from China?',
'What are security measures for animals that just came out of China?',
]);
answers.push(
'<p>Animals imported from China will need to meet <a target="_blank" href="/importation/bringing-an-animal-into-the-united-states/index.html">CDC</a> and <a href="https://www.aphis.usda.gov/aphis/ourfocus/animalhealth/animal-and-animal-product-import-information/live-animal-imports/import-live-animals" class="tp-link-policy" data-domain-ext="gov">USDA<span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a> requirements for entering the United States. At this time, there is no evidence that companion animals including pets can spread COVID-19. As with any animal introduced to a new environment, animals recently imported from China should be observed daily for signs of illness. If an animal becomes ill, the animal should be examined by a veterinarian. Call your local veterinary clinic <u>before</u> bringing the animal into the clinic and let them know that the animal was recently in China.</p>');
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
'Is it currently allowed to do a cruise?',
]);
answers.push(
'<p>CDC recommends all travelers, particularly older adults and people of any age with serious chronic medical conditions <a target="_blank" href="https://wwwnc.cdc.gov/travel/page/covid-19-cruise-ship">defer all cruise ship travel worldwide</a>. Recent reports of COVID-19 on cruise ships highlight the risk of infection to cruise ship passengers and crew. Like many other viruses, COVID-19 appears to spread more easily between people in close quarters aboard ships.</p>');
group_of_questions.push([ // 28
'Should travelers wear facemasks?',
'Should I wear a mask?',
'Should I use a mask when I travel?',
'Is it safer to travel with a mask?',
]);
answers.push(
'<p>CDC does not recommend that healthy travelers wear facemasks to protect themselves from COVID-19. Wear a facemask only if you are sick and coughing or sneezing to help prevent the spread of respiratory viruses to others. If you are well, it is more important to take these important steps to reduce your chances of getting sick:</p> <ul> <li>Avoid close contact with people who are sick.</li> <li>Avoid touching your eyes, nose, and mouth with unwashed hands.</li> <li>To the extent possible, avoid touching high-touch surfaces in public places   elevator buttons, door handles, handrails, handshaking with people, etc. <ul> <li>Use a tissue or your sleeve to cover your hand or finger if you must touch something.</li> <li>Wash your hands after touching surfaces in public places.</li> </ul> </li> <li><strong>Clean AND disinfect </strong><a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/community/home/cleaning-disinfection.html">frequently touched surfaces</a><strong> daily</strong>. This includes tables, doorknobs, light switches, countertops, handles, desks, phones, keyboards, toilets, faucets, and sinks.</li> <li>Wash your hands often with soap and water for at least 20 seconds, especially after going to the bathroom; before eating; and after blowing your nose, coughing, or sneezing.</li> <li>If soap and water aren t available, use a hand sanitizer that contains at least 60% alcohol.</li> </ul>');
group_of_questions.push([ // 29
'What can I expect when departing other countries?',
'Can I leave the country?',
'Can I travel to other countries?',
'What actions are taken at border control?',
]);
answers.push(
'<p>Be aware that some countries are conducting exit screening for all passengers leaving their country. Before being permitted to board a departing flight, you may have your temperature taken and be asked questions about your travel history and health.</p>');
group_of_questions.push([ // 30
'What if I recently traveled and get sick?',
'What do I need to do if I feel sick and came back from another country?',
'What shall I do if I feel sick after traveling?',
]);
answers.push(
'<p><a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/about/steps-when-sick.html">See CDC s website about what to do if you get sick</a>.</p>');
group_of_questions.push([ // 31
'How can my family and I prepare for COVID-19?',
'How can I prepare myself?',
'What can I do to reduce the risk for me and my family?',
'How can I prepare for corona?',
]);
answers.push(
'<p>Create a household plan of action to help protect your health and the health of those you care about in the event of an outbreak of COVID-19 in your community:</p> <ul> <li>Talk with the people who need to be included in your plan, and discuss <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-nCoV/summary.html">what to do if a COVID-19 outbreak occurs in your community</a>.</li> <li>Plan ways to care for those who might be at greater risk for serious complications, particularly <a href="https://www.cdc.gov/coronavirus/2019-ncov/specific-groups/high-risk-complications.html">older adults and those with severe chronic medical</a> conditions like heart, lung or kidney disease. <ul> <li>Make sure they have access to several weeks of medications and supplies in case you need to stay home for prolonged periods of time.</li> </ul> </li> <li>Get to know your neighbors and find out if your neighborhood has a website or social media page to stay connected.</li> <li>Create a list of local organizations that you and your household can contact in the event you need access to information, healthcare services, support, and resources.</li> <li>Create an emergency contact list of family, friends, neighbors, carpool drivers, health care providers, teachers, employers, the local public health department, and other community resources.</li> </ul>');
group_of_questions.push([ // 32
'What steps can my family take to reduce our risk of getting COVID-19?',
'What safety measures can I take?',
'What can I do to reduce the risk for me and my family?',
'What steps can my family take to reduce our risk of getting corona?',
]);
answers.push(
'<p>Practice everyday preventive actions to help reduce your risk of getting sick and remind everyone in your home to do the same. These actions are especially important for older adults and people who have severe chronic medical conditions:</p> <ul> <li>Avoid close contact with people who are sick.</li> <li>Stay home when you are sick, except to get medical care.</li> <li>Cover your coughs and sneezes with a tissue and throw the tissue in the trash.</li> <li>Wash your hands often with soap and water for at least 20 seconds, especially after blowing your nose, coughing, or sneezing; going to the bathroom; and before eating or preparing food.</li> <li>If soap and water are not readily available, use an alcohol-based hand sanitizer with at least 60% alcohol. Always wash hands with soap and water if hands are visibly dirty.</li> <li>Clean and disinfect frequently touched surfaces and objects<br> (e.g., tables, countertops, light switches, doorknobs, and cabinet handles).</li> </ul>');
group_of_questions.push([ // 33
'What should I do if someone in my house gets sick with COVID-19?',
'What to do if someone I know gets Corona?',
'How to act if one of my peers has COVID?',
'What to do if someone I know gets the virus?',
]);
answers.push(
'<p>Most people who get COVID-19 will be able to recover at home. <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/hcp/guidance-prevent-spread.html">CDC has directions</a> for people who are recovering at home and their caregivers, including:</p> <ul> <li>Stay home when you are sick, except to get medical care.</li> <li>If you develop emergency warning signs for COVID-19 get medical attention immediately. In adults, emergency warning signs<sup>*</sup>:</li> </ul> <ul> <li style="list-style-type: none;"> <ul> <li>Difficulty breathing or shortness of breath</li> <li>Persistent pain or pressure in the chest</li> <li>New confusion or inability to arouse</li> <li>Bluish lips or face</li> <li><sup>*</sup>This list is not all inclusive. Please consult your medical provider for any other symptom that is severe or concerning.</li> </ul> </li> </ul> <ul> <li>Use a separate room and bathroom for sick household members (if possible).</li> <li>Clean hands regularly by handwashing with soap and water or using an alcohol-based hand sanitizer with at least 60% alcohol.</li> <li>Provide your sick household member with clean disposable facemasks to wear at home, if available, to help prevent spreading COVID-19 to others.</li> <li><a href="https://www.cdc.gov/coronavirus/2019-ncov/community/home/cleaning-disinfection.html">Clean the sick room and bathroom</a>, as needed, to avoid unnecessary contact with the sick person.</li> <li>Avoid sharing personal items like utensils, food, and drinks.</li> </ul>');
group_of_questions.push([ // 34
'How can I prepare in case my child\'s school, childcare facility, or university is dismissed?',
'What can I do if the school of my child is closed?',
'How to deal with closes schools or kindergarten?',
'What if my kid can\'t go to school anymore?',
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
'Can hand sanitizer protect against corona?',
]);
answers.push(
'<p>Handwashing is one of the best ways to protect yourself and your family from getting sick. Wash your hands often with soap and water for at least 20 seconds, especially after blowing your nose, coughing, or sneezing; going to the bathroom; and before eating or preparing food. If soap and water are not readily available, use an alcohol-based hand sanitizer with at least 60% alcohol.</p>');
group_of_questions.push([ // 37
'What cleaning products should I use to protect against COVID-19?',
'How can I disinfect my hands from corona?',
'What is effective for cleaning my hands?',
'What cleaning products should I use?',
]);
answers.push(
'<p>Clean and disinfect frequently touched surfaces such as tables, doorknobs, light switches, countertops, handles, desks, phones, keyboards, toilets, faucets, and sinks.  If surfaces are dirty, clean them using detergent or soap and water prior to disinfection. To disinfect, most common EPA-registered household disinfectants will work. See CDC s recommendations <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/community/home/cleaning-disinfection.html">for household cleaning and disinfection</a>.</p>');
group_of_questions.push([ // 38
'What should I do if there is an outbreak in my community?',
'What to do if people around me get infected?',
'What if others around me get the virus?',
'How to act if my neighbours get corona?',
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
'Is there something to protect my kids?',
]);
answers.push(
'<p>This is a new virus and we are still learning about it, but so far, there does not seem to be a lot of illness in children. Most illness, including serious illness, is happening in adults of working age and older adults. If there cases of COVID-19 that impact your child s school, the school may dismiss students. Keep track of school dismissals in your community. Read or watch local media sources that report school dismissals. If schools are dismissed temporarily, use alternative childcare arrangements, if needed.</p> <p>If your child/children become sick with COVID-19, notify their childcare facility or school. Talk with teachers about classroom assignments and activities they can do from home to keep up with their schoolwork.</p> <p>Discourage children and teens from gathering in other public places while school is dismissed to help slow the spread of COVID-19 in the community.</p>');
group_of_questions.push([ // 41
'Will schools be dismissed if there is an outbreak in my community?',
'Will schools be closed?',
'Are schools shut down?',
'Will schools be closed if the virus spreads further?',
]);
answers.push(
'<p>Depending on the situation, public health officials may recommend community actions to reduce exposures to COVID-19, such as school dismissals. Read or watch local media sources that report school dismissals or and watch for communication from your child s school. If schools are dismissed temporarily, discourage students and staff from gathering or socializing anywhere, like at a friend s house, a favorite restaurant, or the local shopping mall.</p>');
group_of_questions.push([ // 42
'Should I go to work if there is an outbreak in my community?',
'Should I still go to work?',
'Is it still safe to go to work?',
'Do I have to do my regular job?',
]);
answers.push(
'<p>Follow the advice of your local health officials. Stay home if you can. Talk to your employer to discuss working from home, taking leave if you or someone in your household gets sick with <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/about/symptoms.html">COVID-19 symptoms</a>, or if your child s school is dismissed temporarily. Employers should be aware that more employees may need to stay at home to care for sick children or other sick family members than is usual in case of a community outbreak.</p>');
group_of_questions.push([ // 43
'What is the risk of my child becoming sick with COVID-19?',
'Can children get corona?',
'Are kids at special risk?',
'Is there a higher risk for children?',
]);
answers.push(
'<p>A: Based on available evidence, children do not appear to be at higher risk for COVID-19 than adults. While some children and infants have been sick with COVID-19, adults make up most of the known cases to date. You can learn more about who is most at risk for health problems if they have COVID-19 infection on CDC s current <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/summary.html#risk-assessment">Risk Assessment</a> page.</p>');
group_of_questions.push([ // 44
'How can I protect my child from COVID-19 infection?',
'What can I do to protect my child from COVID-19?',
'How do I best protect my child against COVID-19?',
'What protects children from COVID-19?',
]);
answers.push(
'<p>You can encourage your child to help stop the spread of COVID-19 by teaching them to do the same things everyone should do to stay healthy.</p> <ul> <li>Clean hands often using soap and water or alcohol-based hand sanitizer</li> <li>Avoid people who are sick (coughing and sneezing)</li> <li>Clean and disinfect high-touch surfaces daily in household common areas (e.g. tables, hard-backed chairs, doorknobs, light switches, remotes, handles, desks, toilets, sinks)</li> <li>Launder items including washable plush toys as appropriate in accordance with the manufacturer s instructions. If possible, launder items using the warmest appropriate water setting for the items and dry items completely. Dirty laundry from an ill person can be washed with other people s items.</li> </ul> <p>You can find additional information on preventing COVID-19 at <a target="_blank" href="https://www.cdc.gov/coronavirus/about/prevention.html">Prevention for 2019 Novel Coronavirus</a> and at <a href="https://www.cdc.gov/coronavirus/2019-ncov/community/index.html">Preventing COVID-19 Spread in Communities</a>. Additional information on how COVID-19 is spread is available at <a href="https://www.cdc.gov/coronavirus/2019-ncov/about/transmission.html">How COVID-19 Spreads</a>.</p>');
group_of_questions.push([ // 45
'Are the symptoms of COVID-19 different in children than in adults?',
'Do COVID-19 symptoms differ between children and adults?',
'Is there a difference in COVID-19 symptoms between children and adults?',
'Do children exhibit different symptoms to adults?',
]);
answers.push(
'<p>A:  No. The symptoms of COVID-19 are similar in children and adults. However, children with confirmed COVID-19 have generally presented with mild symptoms. Reported symptoms in children include cold-like symptoms, such as fever, runny nose, and cough. Vomiting and diarrhea have also been reported. It s not known yet whether some children may be at higher risk for severe illness, for example, children with underlying medical conditions and special healthcare needs. There is much more to be learned about how the disease impacts children.</p>');
group_of_questions.push([ // 46
'Should children wear masks? ',
]);
answers.push(
'<p>A: No. If your child is healthy, there is no need for them to wear a facemask. Only people who have symptoms of illness or who are providing care to those who are ill should wear masks.</p>');
group_of_questions.push([ // 47
'What is the risk to pregnant women of getting COVID-19? Is it easier for pregnant women to become ill with the disease? If they become infected, will they be more sick than other people?',
'How does COVID-19 affect pregnant women?',
'Is COVID-19 particularly dangerous to pregnant women?',
'How dangerous is COVID-19 for pregnant women?',
]);
answers.push(
'<p>We do not currently know if pregnant women have a greater chance of getting sick from COVID-19 than the general public nor whether they are more likely to have serious illness as a result. Pregnant women experience changes in their bodies that may increase their risk of some infections. With viruses from the same family as COVID-19, and other viral respiratory infections, such as influenza, women have had a higher risk of developing severe illness. It is always important for pregnant women to protect themselves from illnesses.</p>');
group_of_questions.push([ // 48
'How can pregnant women protect themselves from getting COVID-19?',
'What should pregnant women do to avoid COVID-19?',
'What precautions can pregnant women take?',
'How can pregnant women ensure they do not get COVID-19?',
]);
answers.push(
'<p>Pregnant women should do the same things as the general public to avoid infection. You can help stop the spread of COVID-19 by taking these actions:</p> <ul> <li>Cover your cough (using your elbow is a good technique)</li> <li>Avoid people who are sick</li> <li>Clean your hands often using soap and water or alcohol-based hand sanitizer</li> </ul> <p>You can find additional information on preventing COVID-19 disease at CDC s (<a target="_blank" href="https://www.cdc.gov/coronavirus/about/prevention.html">Prevention for 2019 Novel Coronavirus</a>).</p>');
group_of_questions.push([ // 49
'Can COVID-19 cause problems for a pregnancy? ',
]);
answers.push(
'<p>We do not know at this time if COVID-19 would cause problems during pregnancy or affect the health of the baby after birth.</p>');
group_of_questions.push([ // 50
'Can COVID-19 be passed from a pregnant woman to the fetus or newborn?',
'Do pregnant women pass COVID-19 to their newborn?',
'Can a fetus be infected with COVID-19 from their mother?',
'Can newborns catch COVID-19 from their mother?',
]);
answers.push(
'<p>We still do not know if a pregnant woman with COVID-19 can pass the virus that causes COVID-19 to her fetus or baby during pregnancy or delivery. No infants born to mothers with COVID-19 have tested positive for the COVID-19 virus. In these cases, which are a small number, the virus was not found in samples of amniotic fluid or breastmilk.</p>');
group_of_questions.push([ // 51
'If a pregnant woman has COVID-19 during pregnancy, will it hurt the baby? ',
]);
answers.push(
'<p>We do not know at this time what if any risk is posed to infants of a pregnant woman who has COVID-19. There have been a small number of reported problems with pregnancy or delivery (e.g. preterm birth) in babies born to mothers who tested positive for COVID-19 during their pregnancy. However, it is not clear that these outcomes were related to maternal infection.</p>');
group_of_questions.push([ // 52
'Can the COVID-19 virus spread through drinking water?',
'Is water a vector for COVID-19?',
'Can water carry COVID-19?',
'Does COVID-19 survive in water?',
]);
answers.push(
'<p>The COVID-19 virus has not been detected in drinking water. Conventional water treatment methods that use filtration and disinfection, such as those in most municipal drinking water systems, should remove or inactivate the virus that causes COVID-19.</p>');
group_of_questions.push([ // 53
'Is the COVID-19 virus found in feces?',
'Can feces carry COVID-19?',
'Does COVID-19 survive in feces?',
'Are feces a vector for COVID-19?',
]);
answers.push(
'<p>The virus that causes COVID-19 has been detected in the feces of some patients diagnosed with COVID-19. The amount of virus released from the body (shed) in stool, how long the virus is shed, and whether the virus in stool is infectious are not known.</p> <p>The risk of transmission of COVID-19 from the feces of an infected person is also unknown. However, the risk is expected to be low based on data from previous outbreaks of related coronaviruses, such as severe acute respiratory syndrome (SARS) and Middle East respiratory syndrome (MERS). There have been no reports of fecal-oral transmission of COVID-19 to date.</p>');
group_of_questions.push([ // 54
'Can the COVID-19 virus spread through pools and hot tubs?',
'Am I likely to catch COVID-19 in a hot tub?',
'Can I catch COVID-19 from swimming in a pool?',
'Can pools and hot tubs spread COVID-19?',
]);
answers.push(
'<p>There is no evidence that COVID-19 can be spread to humans through the use of pools and hot tubs. Proper operation, maintenance, and disinfection (e.g., with chlorine and bromine) of pools and hot tubs should remove or inactivate the virus that causes COVID-19.</p>');
group_of_questions.push([ // 55
'Can the COVID-19 virus spread through sewerage systems?',
'Can COVID-19 be carried in the sewers?',
'Does COVID-19 survive in the sewers?',
'Can COVID-19 be transmitted through the sewage systems?',
]);
answers.push(
'<p>CDC is reviewing all data on COVID-19 transmission as information becomes available. At this time, the risk of transmission of the virus that causes COVID-19 through sewerage systems is thought to be low. Although transmission of COVID-19 through sewage may be possible, there is no evidence to date that this has occurred. This guidance will be updated as necessary as new evidence is assessed.</p> <p>SARS, a similar coronavirus, has been detected in untreated sewage for up to 2 to 14 days. In the 2003 SARS outbreak, there was documented transmission associated with sewage aerosols. Data suggest that standard municipal wastewater system chlorination practices may be sufficient to inactivate coronaviruses, as long as utilities monitor free available chlorine during treatment to ensure it has not been depleted.</p> <p>Wastewater and sewage workers should use standard practices, practice basic hygiene precautions, and wear personal protective equipment (<a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/hcp/faq.html">PPE</a>) as prescribed for current work tasks.</p>');
group_of_questions.push([ // 56
'Should wastewater workers take extra precautions to protect themselves from the COVID-19 virus?',
'What should wastewater workers do to protect themselves from COVID-19?',
'Are there any precautions wastewater workers can take against COVID-19?',
'How can wastewater workers protect themselves against COVID-19?',
]);
answers.push(
'<p>Wastewater treatment plant operations should ensure workers follow routine practices to prevent exposure to wastewater. These include using engineering and administrative controls, safe work practices, and<a target="_blank" href="https://www.cdc.gov/healthywater/global/sanitation/workers_handlingwaste.html"> PPE</a> normally required for work tasks when handling untreated wastewater. No additional COVID-19 specific protections are recommended for employees involved in wastewater management operations, including those at wastewater treatment facilities.</p>');
group_of_questions.push([ // 57
'What are the clinical features of COVID-19?',
'How does COVID-19 present?',
'What are the tell tale symptoms of COVID-19?',
'What are the signs that someone has COVID-19?',
]);
answers.push(
'<p>A: The clinical spectrum of COVID-19 ranges from mild disease with non-specific signs and symptoms of acute respiratory illness, to severe pneumonia with respiratory failure and septic shock. There have also been reports of asymptomatic infection with COVID-19. See also <a target="_blank" href="/coronavirus/2019-ncov/hcp/clinical-guidance-management-patients.html">Interim Clinical Guidance for Management of Patients with Confirmed Coronavirus Disease 2019 (COVID-19)</a></p>');
group_of_questions.push([ // 58
'Who is at risk for COVID-19? ',
]);
answers.push(
'<p>A: Currently, those at greatest risk of infection are persons who have had prolonged, unprotected close contact with a patient with symptomatic, confirmed COVID-19 and those who live in or have recently been to areas with sustained transmission.</p>');
group_of_questions.push([ // 59
'Who is at risk for severe disease from COVID-19?',
'Who is likely to develop COVID-19 symptoms?',
'Who is most likely to have severe COVID-19 symptoms?',
'Who will COVID-19 affect most?',
]);
answers.push(
'<p>The available data are currently insufficient to identify risk factors for severe clinical outcomes. From the limited data that are available for COVID-19 infected patients, and for data from related coronaviruses such as SARS-CoV and MERS-CoV, it is possible that older adults, and persons who have underlying chronic medical conditions, such as immunocompromising conditions, may be at risk for more severe outcomes. See also See also <a target="_blank" href="/coronavirus/2019-ncov/hcp/clinical-guidance-management-patients.html">Interim Clinical Guidance for Management of Patients with Confirmed Coronavirus Disease 2019 (COVID-19)</a>.</p>');
group_of_questions.push([ // 60
'When is someone infectious?',
'How long is someone infectious?',
'How do I know if I am infectious?',
'How long is the infectious period?',
]);
answers.push(
'<p>A: The onset and duration of viral shedding and period of infectiousness for COVID-19 are not yet known. It is possible that SARS-CoV-2 RNA may be detectable in the upper or lower respiratory tract for weeks after illness onset, similar to infection with MERS-CoV and SARS-CoV. However, detection of viral RNA does not necessarily mean that infectious virus is present. Asymptomatic infection with SARS-CoV-2 has been reported, but it is not yet known what role asymptomatic infection plays in transmission. Similarly, the role of pre-symptomatic transmission (infection detection during the incubation period prior to illness onset) is unknown. Existing literature regarding SARS-CoV-2 and other coronaviruses (e.g. MERS-CoV, SARS-CoV) suggest that the incubation period may range from 2 14 days.</p>');
group_of_questions.push([ // 61
'Which body fluids can spread infection? ',
]);
answers.push(
'<p>A: Very limited data are available about detection of SARS-CoV-2 and infectious virus in clinical specimens. SARS-CoV-2 RNA has been detected from upper and lower respiratory tract specimens, and SARS-CoV-2 has been isolated from upper respiratory tract specimens and bronchoalveolar lavage fluid. SARS-CoV-2 RNA has been detected in blood and stool specimens, but whether infectious virus is present in extrapulmonary specimens is currently unknown. The duration of SARS-CoV-2 RNA detection in upper and lower respiratory tract specimens and in extrapulmonary specimens is not yet known but may be several weeks or longer, which has been observed in cases of MERS-CoV or SARS-CoV infection. While viable, infectious SARS-CoV has been isolated from respiratory, blood, urine, and stool specimens, in contrast   viable, infectious MERS-CoV has only been isolated from respiratory tract specimens. It is not yet known whether other non-respiratory body fluids from an infected person including vomit, urine, breast milk, or semen can contain viable, infectious SARS-CoV-2.</p>');
group_of_questions.push([ // 62
'Can people who recover from COVID-19 be infected again?',
'What are the chances of getting COVID-19 twice?',
'After recovering COVID-19, am I immune? ',
'Can one be immune to COVID-19?',
]);
answers.push(
'The immune response to COVID-19 is not yet understood. Patients with MERS-CoV infection are unlikely to be re-infected shortly after they recover, but it is not yet known whether similar immune protection will be observed for patients with COVID-19.</p>');
group_of_questions.push([ // 63
'How should healthcare personnel protect themselves when evaluating a patient who may have COVID-19?',
'What should doctors and nurses do to protect themselves?',
'What safety precautions should healthcare personnel take?',
'How should healthcare professionals avoid being infected by patients?',
]);
answers.push(
'<p>A: Although the transmission dynamics have yet to be determined, CDC currently recommends a cautious approach to persons under investigation (PUI) for COVID-19. Healthcare personnel evaluating PUI or providing care for patients with confirmed COVID-19 should use, Standard  Transmission-based Precautions. See the Interim Infection Prevention and Control Recommendations for Patients with Known or Patients Under Investigation for Coronavirus Disease 2019 (COVID-19) in Healthcare Settings.</p>');
group_of_questions.push([ // 64
'Are pregnant healthcare personnel at increased risk for adverse outcomes if they care for patients with COVID-19?',
'Is it more risky as pregnant healthcare personnel to suffer from adverse effects of COVID-19?',
'Should pregnant healthcare personnel take care about COVID-19 patients?',
'Is there a danger for pregnant healthcare personnel to work with COVID-19 patients?',
]);
answers.push(
'<p>A: Pregnant healthcare personnel (HCP) should follow risk assessment and infection control guidelines for HCP exposed to patients with suspected or confirmed COVID-19. Adherence to recommended infection prevention and control practices is an important part of protecting all HCP in healthcare settings. Information on COVID-19 in pregnancy is very limited; facilities may want to consider limiting exposure of pregnant HCP to patients with confirmed or suspected COVID-19, especially during higher risk procedures (e.g., aerosol-generating procedures) if feasible based on staffing availability.</p>');
group_of_questions.push([ // 65
'Should any diagnostic or therapeutic interventions be withheld due to concerns about transmission of COVID-19?',
]);
answers.push(
'p>A: Patients should receive any interventions they would normally receive as standard of care. Patients with suspected or confirmed COVID-19 should be asked to wear a surgical mask as soon as they are identified and be evaluated in a private room with the door closed. Healthcare personnel entering the room should use <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/infection-control/control-recommendations.html">Standard and Transmission-based Precautions</a>.</p>');
group_of_questions.push([ // 66
'How do you test a patient for SARS-CoV-2, the virus that causes COVID-19?',
'How can I test a patient for SARS-CoV-2?',
'How to find out if a patient has COVID-19?',
'What are ways to test patients for coronavirus disease?',
]);
answers.push(
'<p>A: See recommendations for reporting, testing, and specimen collection at <a target="_blank" href="/coronavirus/2019-nCoV/clinical-criteria.html#criteria-evaluation-pui">Interim Guidance for Healthcare Professionals</a>.</p> ');
group_of_questions.push([ // 67
'Will existing respiratory virus panels, such as those manufactured by Biofire or Genmark, detect SARS-CoV-2, the virus that causes COVID-19?',
'Can virus panels detect coronavirus disease?',
'Can virus panels be used for detection of COVID-19?',
'Can Biofire virus panels detect coronavirus?',
]);
answers.push(
'<p>A: No. These multi-pathogen molecular assays can detect a number of human respiratory viruses, including other coronaviruses that can cause acute respiratory illness, but they do not detect COVID-19.</p>');
group_of_questions.push([ // 68
'How is COVID-19 treated?',
'How to treat patients with COVID-19?',
'What is the treatment for COVID-19?',
'What are ways to provide treatment for COVID-19?',
]);
answers.push(
'<p>Not all patients with COVID-19 will require medical supportive care. Clinical management for hospitalized patients with COVID-19 is focused on supportive care of complications, including advanced organ support for respiratory failure, septic shock, and multi-organ failure. Empiric testing and treatment for other viral or bacterial etiologies may be warranted.</p> <p>Corticosteroids are not routinely recommended for viral pneumonia or ARDS and should be avoided unless they are indicated for another reason (e.g., COPD exacerbation, refractory septic shock following Surviving Sepsis Campaign Guidelines).</p> <p>There are currently no antiviral drugs licensed by the U.S. Food and Drug Administration (FDA) to treat COVID-19. Some <em>in-vitro</em> or <em>in-vivo</em> studies suggest potential therapeutic activity of some agents against related coronaviruses, but there are no available data from observational studies or randomized controlled trials in humans to support recommending any investigational therapeutics for patients with confirmed or suspected COVID-19 at this time. Remdesivir, an investigational antiviral drug, was reported to have in-vitro activity against COVID-19. A small number of patients with COVID-19 have received intravenous remdesivir for compassionate use outside of a clinical trial setting<a target="_blank" href="https://clinicaltrials.gov/ct2/show/NCT04257656?cond=remdesivir&draw=2&rank=1" class="tp-link-policy" data-domain-ext="gov">. A randomized placebo-controlled clinical trial of remdesivir<span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a> for treatment of hospitalized patients with COVID-19 respiratory disease has been implemented in China. <a href="https://clinicaltrials.gov/ct2/show/NCT04252885?cond=coronavirus&draw=2&rank=4" class="tp-link-policy" data-domain-ext="gov">A randomized open label trial<span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a> of combination lopinavir-ritonavir treatment has been also been conducted in patients with COVID-19 in China, but no results are available to date. trials of other potential therapeutics for COVID-19 are being planned. For information on specific clinical trials underway for treatment of patients with COVID-19 infection, see <a href="https://clinicaltrials.gov" class="tp-link-policy" data-domain-ext="gov">clinicaltrials.gov<span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a>.</p> <p>See <a class="noDecoration" href="/coronavirus/2019-ncov/hcp/clinical-guidance-management-patients.html">Interim Clinical Guidance for Management of Patients with Confirmed Coronavirus Disease 2019 (COVID-19)</a></p>');
group_of_questions.push([ // 69
'Should post-exposure prophylaxis be used for people who may have been exposed to COVID-19?',
'Is post-exposure prophylaxis appropriate for people who had COVID-19?',
'Should COVID-19 patients undergo post-exposure prophylaxis?',
]);
answers.push(
'<p>A: There is currently no FDA-approved post-exposure prophylaxis for people who may have been exposed to COVID-19. For more information on movement restrictions, monitoring for symptoms, and evaluation after possible exposure to COVID-19 See <a target="_blank" href="/coronavirus/2019-ncov/php/risk-assessment.html">Interim US Guidance for Risk Assessment and Public Health Management of Persons with Potential Coronavirus Disease 2019 (COVID-19) Exposure in Travel-associated or Community Settings</a> and <a href="/coronavirus/2019-ncov/hcp/guidance-risk-assesment-hcp.html">Interim U.S Guidance for Risk Assessment and Public Health Management of Healthcare Personnel with Potential Exposure in a Healthcare Setting to Patients with Coronavirus Disease 2019 (COVID-19).</a></p>');
group_of_questions.push([ // 70
'Do patients with confirmed or suspected COVID-19 need to be admitted to the hospital?',
'Must hospitals admit COVID-19 patients?',
'Needs a hospital to admit COVID-19 patients?',
'Do patients with COVID-19 need to go to the hospital?',
]);
answers.push(
'<p>A: Not all patients with COVID-19 require hospital admission. Patients whose clinical presentation warrants in-patient clinical management for supportive medical care should be admitted to the hospital under appropriate isolation precautions. Some patients with an initial mild clinical presentation may worsen in the second week of illness. The decision to monitor these patients in the inpatient or outpatient setting should be made on a case-by-case basis. This decision will depend not only on the clinical presentation, but also on the patient s ability to engage in monitoring, the ability for safe isolation at home, and the risk of transmission in the patient s home environment. For more information, see <a target="_blank" href="/coronavirus/2019-ncov/hcp/infection-control.html">Interim Infection Prevention and Control Recommendations for Patients with Known or Patients Under Investigation for Coronavirus Disease 2019 (COVID-19) in a Healthcare Setting</a> and <a href="/coronavirus/2019-ncov/hcp/guidance-home-care.html">Interim Guidance for Implementing Home Care of People Not Requiring Hospitalization for Coronavirus Disease 2019 (COVID-19)</a>.</p>');
group_of_questions.push([ // 71
'When can patients with confirmed COVID-19 be discharged from the hospital?',
'Under which circumstances a patient with COVID-19 can leave hospital?',
'When is a patient with COVID-19 allowed to leave the hospital?',
'When is a patient allowed to leave the hospital',
]);
answers.push(
'<p>A: Patients can be discharged from the healthcare facility whenever clinically indicated. Isolation should be maintained at home if the patient returns home before the time period recommended for discontinuation of hospital Transmission-Based Precautions described below.</p> <p>Decisions to discontinue Transmission-Based Precautions or in-home isolation can be made on a case-by-case basis in consultation with clinicians, infection prevention and control specialists, and public health based upon multiple factors, including disease severity, illness signs and symptoms, and results of laboratory testing for COVID-19 in respiratory specimens.</p> <p>Criteria to discontinue Transmission-Based Precautions can be found in: <a target="_blank" href="/coronavirus/2019-ncov/hcp/disposition-hospitalized-patients.html">Interim Considerations for Disposition of Hospitalized Patients with COVID-19</a></p>');
group_of_questions.push([ // 72
'Are pregnant healthcare personnel at increased risk for adverse outcomes if they care for patients with COVID-19?',
'Is it more risky as pregnant healthcare personnel to suffer from adverse effects of COVID-19?',
'Should pregnant healthcare personnel take care about COVID-19 patients?',
'Is there a danger for pregnant healthcare personnel to work with COVID-19 patients?',
]);
answers.push(
'<p>A: Pregnant healthcare personnel (HCP) should follow risk assessment and infection control guidelines for HCP exposed to patients with suspected or confirmed COVID-19. Adherence to recommended infection prevention and control practices is an important part of protecting all HCP in healthcare settings. Information on COVID-19 in pregnancy is very limited; facilities may want to consider limiting exposure of pregnant HCP to patients with confirmed or suspected COVID-19, especially during higher risk procedures (e.g., aerosol-generating procedures) if feasible based on staffing availability.</p>');
group_of_questions.push([ // 73
'What do I need to know if a patient with confirmed or suspected COVID-19 asks about having a pet or other animal in the home?',
'Is a patient diagnosed with COVID 19 allowed to have a pet at home?',
'Should patients with COVID 19 stay away from pets?',
'Are pets allowed for COVID 19 patients?',
]);
answers.push(
'p>A: See <a target="_blank" href="/coronavirus/2019-ncov/faq.html#2019-nCoV-and-animals">COVID-19 and Animals</a>.</p>');
group_of_questions.push([ // 74
'What do waste management companies need to know about wastewater and sewage coming from a healthcare facility or community setting with either a known COVID-19 patient or person under investigation (PUI)?',
'Can wastewater of corona patients be disinfected?',
'How to deal with the wastewater of COVID 19 patients=',
'Is there anything to consider regarding the wastewater of COVID 19 patients?',
]);
answers.push(
'<p>A: Waste generated in the care of PUIs or patients with confirmed COVID-19 does not present additional considerations for wastewater disinfection in the United States. Coronaviruses are susceptible to the same disinfection conditions in community and healthcare settings as other viruses, so current disinfection conditions in wastewater treatment facilities are expected to be sufficient. This includes conditions for practices such as oxidation with hypochlorite (i.e., chlorine bleach) and peracetic acid, as well as inactivation using UV irradiation.</p>');
group_of_questions.push([ // 75
'Do wastewater and sewage workers need any additional protection when handling untreated waste from healthcare or community setting with either a known COVID-19 patient or PUI?',
'What do wastewater workers need to consider when working with wastewater from hospitals where COVID 19 patients were in?',
'How should wastewater workers protect themselves against wastewater from COVID 19 patients?',
]);
answers.push(
'<p>A: Wastewater workers should use standard practices including <a target="_blank" href="/healthywater/global/sanitation/workers_handlingwaste.html">basic hygiene precautions</a> and wear the recommended <a href="/healthywater/global/sanitation/workers_handlingwaste.html">PPE</a> as prescribed for their current work tasks when handling untreated waste. There is no evidence to suggest that employees of wastewater plants need any additional protections in relation to COVID-19.</p>');
group_of_questions.push([ // 76
'Should medical waste or general waste from healthcare facilities treating PUIs and patients with confirmed COVID-19 be handled any differently or need any additional disinfection?',
'How should medical waste from COVID 19 patients be treated?',
'Are there any special ways to deal with medical waste from COVID 19 patients?',
'Is medical waste from COVID 19 patients dangerous?',
]);
answers.push(
'<p>A: Medical waste (trash) coming from healthcare facilities treating COVID-2019 patients is no different than waste coming from facilities without COVID-19 patients. CDC s guidance states that management of laundry, food service utensils, and medical waste should be performed in accordance with routine procedures. There is no evidence to suggest that facility waste needs any additional disinfection.</p> <p>More guidance about environmental infection control is available in section 7 of CDC s <a target="_blank" href="/coronavirus/2019-nCoV/hcp/infection-control.html">Interim Infection Prevention and Control Recommendations</a> for Patients with Confirmed COVID-19 or Persons Under Investigation for COVID-19 in Healthcare Settings.</p>');
group_of_questions.push([ // 77
'What personal protective equipment (PPE) should be worn by individuals transporting patients who are confirmed with or under investigation for COVID-19 within a healthcare facility? For example, what PPE should be worn when transporting a patient to radiology for imaging that cannot be performed in the patient room?',
'What should be worn by personnel transporting COVID 19 patients?',
'What equipment to use to transport COVID 19 patients?',
'What to consider when transporting COVID 19 patients?',
]);
answers.push(
'<p>In general, transport and movement of the patient outside of  their room should be limited to medically essential purposes. If being transported outside of the room, such as to radiology, healthcare personnel (HCP) in the receiving area should be notified in advance of transporting the patient. For transport, the patient should wear a facemask to contain secretions and be covered with a clean sheet.</p> <p>If transport personnel must prepare the patient for transport (e.g., transfer them to the wheelchair or gurney), transport personnel should wear <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/infection-control/control-recommendations.html">all recommended PPE</a> (gloves, a gown, respiratory protection that is at least as protective as a fit-tested NIOSH-certified disposable N95 filtering facepiece respirator or facemask if a respirator is not available and eye protection [i.e., goggles or disposable face shield that covers the front and sides of the face]). This recommendation is needed because these interactions typically involve close, often face-to-face, contact with the patient in an enclosed space (e.g., patient room). Once the patient has been transferred to the wheelchair or gurney (and prior to exiting the room), transporters should remove their gown, gloves, and eye protection and perform hand hygiene.</p> <p>If the patient is wearing a facemask, no recommendation for PPE is made typically for HCP transporting patients with a respiratory infection from the patient s room to the destination. However, given current limitations in knowledge regarding COVID-19 and following the currently cautious approach for <a href="https://www.cdc.gov/coronavirus/2019-ncov/hcp/guidance-risk-assesment-hcp.html">risk stratification and monitoring of healthcare personnel caring for patients with COVID-19</a>, use of a facemask by the transporter is recommended for anything more than brief encounters with COVID-19 patients. Additional PPE should not be required unless there is an anticipated need to provide medical assistance during transport (e.g., helping the patient replace a dislodged facemask).</p> <p>After arrival at their destination, receiving personnel (e.g., in radiology) and the transporter (if assisting with transfer) should perform hand hygiene and wear <a href="https://www.cdc.gov/coronavirus/2019-ncov/infection-control/control-recommendations.html">all recommended PPE</a>. If still wearing their original respirator or facemask, the transporter should take care to avoid self-contamination when donning the remainder of the recommended PPE. This cautious approach will be refined and updated as more information becomes available and as response needs change in the United States.</p> <p>Interim guidance for EMS personnel transporting patients with confirmed or suspected COVID-19 is <a href="https://www.cdc.gov/coronavirus/2019-ncov/hcp/guidance-for-ems.html">available here</a>. EMS personnel should wear all recommended PPE because they are providing direct medical care and in close contact with the patient for longer periods of time.</p>');
group_of_questions.push([ // 78
'What PPE should be worn by HCP providing care to asymptomatic patients with a history of exposure to COVID-19 who are being evaluated for a non-infectious complaint (e.g., hypertension or hyperglycemia)?',
]);
answers.push(
'<p>Standard Precautions should be followed when caring for any patient, regardless of suspected or confirmed COVID-19. If the patient is afebrile (temperature is less than 100.0<sup>o</sup>F) and otherwise without even mild symptoms* that might be consistent with COVID-19 (e.g., cough, sore throat, shortness of breath), then precautions specific to COVID-19 are not required. However, until the patient is determined to be without such symptoms, HCP should wear all recommended PPE for the patient encounter. If the primary evaluation confirms the patient is without symptoms, management and need for any Transmission-Based Precautions should be based with the condition for which they are being evaluated (e.g., patient colonized with a drug-resistant organism), rather than potential exposure to COVID-19.</p> <p>This public health response is an important opportunity to reinforce the importance of strict adherence to Standard Precautions during all patient encounters. Standard Precautions are based on the principles that all blood, body fluids, secretions, excretions except sweat, nonintact skin, and mucous membranes may contain transmissible infectious agents. The application of Standard Precautions is determined by the nature of the HCP-patient interaction and the extent of anticipated blood, body fluids, and pathogen exposure. For example, a facemask and eye protection should be worn during the care of any patient if splashes, sprays, or coughs could occur during the patient encounter. Similarly, gloves should be worn if contact with body fluids, mucous membranes, or nonintact skin are anticipated.</p> <p>*Note: In addition to cough and shortness of breath, nonspecific symptoms such as sore throat, myalgia, fatigue, nausea, and diarrhea have been noted as initial symptoms in some cases of COVID-19. These symptoms can have several alternative explanations; however, failure to identify and implement proper precautions in a healthcare setting for persons infected with COVID-19 can contribute to widespread transmission in that facility due to the presence of susceptible patients and close interactions with healthcare personnel. For this reason, a lower temperature of 100.0<sup>o</sup>F and the inclusion of mild and non-specific symptoms should be used by healthcare settings evaluating these patients to increase the ability to detect even mild cases of COVID-19.</p>');
group_of_questions.push([ // 79
'What personal protective equipment (PPE) should be worn by environmental services (EVS) personnel who clean and disinfect rooms of hospitalized patients with COVID-19?',
'What should be worn by personnel cleaning hospital rooms with COVID 19 patients?',
'What equipment to use to clean rooms in hospitals with COVID 19 patients?',
'What to consider when cleaning rooms with COVID 19 patients?',
]);
answers.push(
'<p>In general, only essential personnel should enter the room of patients with COVID-19. Healthcare facilities should consider assigning daily cleaning and disinfection of high-touch surfaces to nursing personnel who will already be in the room providing care to the patient. If this responsibility is assigned to EVS personnel, they should wear all recommended PPE when in the room. PPE should be removed upon leaving the room, immediately followed by performance of hand hygiene.</p> <p>After discharge, terminal cleaning may be performed by EVS personnel. They should delay entry into the room until a <a target="_blank" href="https://www.cdc.gov/infectioncontrol/guidelines/environmental/appendix/air.html#tableb1">sufficient time has elapsed</a> for enough air changes to remove potentially infectious particles. We do not yet know how long SARS-CoV-2 remains infectious in the air. Regardless, EVS personnel should refrain from entering the vacated room until sufficient time has elapsed for enough air changes to remove potentially infectious particles (more information on <a href="https://www.cdc.gov/infectioncontrol/guidelines/environmental/appendix/air.html#tableb1">clearance rates under differing ventilation conditions</a> is available). After this time has elapsed, EVS personnel may enter the room and should wear a gown and gloves when performing terminal cleaning. A facemask and eye protection should be added if splashes or sprays during cleaning and disinfection activities are anticipated or otherwise required based on the selected cleaning products. Shoe covers are not recommended at this time for personnel caring for patients with COVID-19.</p>');
group_of_questions.push([ // 80
' What actions should school and childcare program administrators take to plan for an outbreak?',
]);
answers.push(
'<p>Administrators of childcare programs and K-12 schools should take the following actions to plan and prepare for COVID-19:</p> <ul> <li>Review, update, and implement school emergency operation plans, particularly for infectious disease outbreaks.</li> <li>Emphasize actions for students and staff to take such as staying home when sick; appropriately covering coughs and sneezes; and washing hands often.</li> <li>Cleaning frequently touched surfaces.</li> <li>Monitor and plan for absenteeism. <ul> <li>Review the usual absenteeism patterns at your school among both students and staff.</li> <li>Review attendance and sick leave policies. Encourage students and staff to stay home when sick. Use flexibility, when possible, to allow staff to stay home to care for sick family members.</li> <li>Alert local health officials about increases in absences, particularly those that appear due to respiratory illnesses.</li> </ul> </li> <li>Monitor and plan for addressing fear and bullying related to COVID-19.</li> <li>Communicate early and repeatedly with parents directly what the policies and procedures will be to allow parents to assure proper guardianship and care of children.</li> </ul>');
group_of_questions.push([ // 81
'What actions can staff and students take to prevent the spread of COVID-19 in my school/childcare program?',
'How should school staff behave to prevent a COVID 19 outbreak?',
'What actions to take to prevent a school from a COVID 19 outbreak?',
'How to act to overcome the risk of an outbreak in a school?',
]);
answers.push(
'<p>Encourage students and staff to take <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/about/prevention-treatment.html">everyday preventive actions</a> to prevent the spread of respiratory illnesses, such as staying home when sick; appropriately covering coughs and sneezes; cleaning frequently touched surfaces; and washing hands often with soap and water. If soap and water are not readily available, use an alcohol-based hand sanitizer with at least 60% alcohol. Always wash hands with soap and water if hands are visibly dirty. Remember to supervise young children when they use hand sanitizer to prevent swallowing alcohol, especially in childcare facilities.</p>');
group_of_questions.push([ // 82
'What steps should my school take if a student or staff member shows symptoms of COVID-19?',
'How to act as a school when staff shows COVID 19 symptoms?',
'How to act as a school when a student shows COVID 19 symptoms?',
'What to do when staff or student show signs of COVID 19?',
]);
answers.push(
'<p>You should establish procedures to ensure students and staff who become sick at school or who arrive at school sick are sent home as soon as possible. Keep sick students and staff separate from well students and staff until sick students and staff can be sent home.</p>');
group_of_questions.push([ // 83
'Should my school screen students for cases of COVID-19?',
]);
answers.push(
'<p>Schools and childcare programs are <strong>not expected </strong>to screen children, students, or staff to identify cases of COVID-19. The majority of respiratory illnesses are not COVID-19. If a community or school has cases of COVID-19, local health officials will help identify those individuals and will follow up on next steps.</p>');
group_of_questions.push([ // 84
'What environmental cleaning procedures should my school take to keep staff and students healthy?',
]);
answers.push(
'<p>Perform routine environmental cleaning. Routinely clean frequently touched surfaces (e.g., doorknobs, light switches, countertops) with cleaners that you typically use. Use all cleaning products according to the directions on the label. Provide disposable wipes so that commonly used surfaces (e.g., keyboards, desks, remote controls) can be wiped down by students and staff before each use.</p>');
group_of_questions.push([ // 85
'What actions should my school take if a sick student or staff member attended school before being confirmed as a COVID-19 case?',
]);
answers.push(
'<ul> <li><strong>Local health officials may recommend temporary school dismissals.</strong> Local health officials  recommendations for the scope (e.g., a single school, a full district) and duration of school dismissals will be made on a case-by-case basis based on the most up-to-date information about COVID-19 and the specific cases in the impacted community. Dismissals may be 14 days or longer, depending on the situation in your community.</li> <li><strong>Schools should work with the local health department and other relevant leadership to communicate the possible COVID-19 exposure to the school community</strong>. This communication to the school community should align with the communication plan in the school s emergency operations plan. In such a circumstance, it is critical to maintain confidentiality of the student or staff member as required by the Americans with Disabilities Act and the Family Education Rights and Privacy Act.</li> <li><strong>If a child or staff member has been identified with COVID-19, school and program administrators should seek guidance from local health officials to determine when students and staff should return to schools and what additional steps are needed for the school community. </strong>In addition, students and staff who are well but are taking care of or share a home with someone with a case of COVID-19 should follow instructions from local health officials to determine when to return to school.</li> </ul>');
group_of_questions.push([ // 86
'What should I do if my school experiences increased rates of absenteeism?',
]);
answers.push(
'<p>If your school notices a substantial increase in the number of students or staff missing school due to illness, report this to your local health officials.</p>');
group_of_questions.push([ // 87
'Should I close our school/childcare program if there\'s been COVID-19 cases in my school?',
]);
answers.push(
'<p>You may need to use temporary school dismissals of 14 days, or possibly longer, if a student or staff member attended school before being confirmed as having COVID-19. Any decision about school dismissal or cancellation of school events should be made in coordination with your local health officials. Schools are not expected to make decisions about dismissal and event cancellation independent of their local health officials. Dismissal and event cancellation decisions should be considered on a case-by-case basis using information from health officials about the local conditions.</p>');
group_of_questions.push([ // 88
'If our school is dismissed, how long should we dismiss school for?',
]);
answers.push(
'<p>The length (duration), geographic scope, and public health objective of school dismissals may be reassessed and changed as the local outbreak situation evolves. At this time, the recommendation is for at least 14 days. This recommendation may be updated as the situation evolves.</p>');
group_of_questions.push([ // 89
'Are there ways for students to keep learning if we decide to dismiss schools?',
]);
answers.push(
'><p>Yes, many schools may use e-learning plans and distance learning options for continuity of education, if available. Your school or district s emergency operations plan should have recommended strategies for ensuring continuity of education and may provide guidance on how to proceed during a school dismissal. In addition, you may be able to use and/or scale up approaches used in other situations when students have not been able to attend school (e.g. inclement weather, facility damage, power outages).</p>');
group_of_questions.push([ // 90
'If I make the decision for a school dismissal, what else should I consider?',
]);
answers.push(
'<p>In the event of a school dismissal, extracurricular group activities and large events, such as performances, field trips, and sporting events should also be cancelled. This may require close coordination with other partners and organizations (e.g., high school athletics associations, music associations). In addition, discourage students and staff from gathering or socializing anywhere, like at a friend s house, a favorite restaurant, or the local shopping mall.</p> <p>Ensure continuity of meal programs for your students. Consider ways to distribute food to students who receive free or reduced cost meals. Check with the US Department of Agriculture   Food and Nutrition Service for additional information: <a target="_blank" href="https://www.fns.usda.gov/disaster/USDAfoodsPandemicSchools" class="tp-link-policy" data-domain-ext="gov">https://www.fns.usda.gov/disaster/USDAfoodsPandemicSchools.<span class="sr-only">external icon</span><span class="fi cdc-icon-external x16 fill-external" aria-hidden="true"></span></a> If there is community spread of COVID-19, design strategies to avoid distribution in settings where people might gather in a group or crowd. Consider options such as  grab-and-go  bagged lunches or meal delivery.</p> <p>Consider alternatives for providing essential medical and social services for students. Continue providing necessary services for children with special healthcare needs, or work with the state Title V Children and Youth with Special Health Care Needs (CYSHCN) Program.</p>');
group_of_questions.push([ // 91
'If we dismiss school, what do we need to consider when re-opening the building to students?',
]);
answers.push(
'<p>CDC is currently working on additional guidance to help schools determine when and how to re-open their buildings to students. If you need immediate assistance with this, consult local health officials for guidance.</p>');
group_of_questions.push([ // 92
'What should we do if a child, student, or staff member has recently traveled to an area with COVID-19 or has a family member who has traveled to an area with COVID-19?',
]);
answers.push(
'<p>Review updated <a target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/travelers/index.html">CDC information for travelers</a>, including <a href="https://www.cdc.gov/coronavirus/2019-ncov/travelers/faqs.html">FAQ for travelers</a>, and consult with state and local health officials. Health officials may use CDC s Interim US Guidance for Risk Assessment and Public Health Management of Persons with Potential Coronavirus Disease 2019 (COVID-19) Exposure in Travel-associated or Community Settings to make recommendations. Individuals returning from travel to areas with community spread of COVID-19 must follow guidance they have received from health officials.</p>');
group_of_questions.push([ // 93
'What is a coronavirus?',
]);
answers.push(
'<p>Coronaviruses are a large family of viruses which may cause illness in animals or humans.  In humans, several coronaviruses are known to cause respiratory infections ranging from the common cold to more severe diseases such as Middle East Respiratory Syndrome (MERS) and Severe Acute Respiratory Syndrome (SARS). The most recently discovered coronavirus causes coronavirus disease COVID-19.</p>');
group_of_questions.push([ // 94
'What is COVID-19?',
]);
answers.push(
'<p>COVID-19 is the infectious disease caused by the most recently discovered coronavirus. This new virus and disease were unknown before the outbreak began in Wuhan, China, in December 2019. </p> ');
group_of_questions.push([ // 95
'What are the symptoms of COVID-19?',
]);
answers.push(
'  <p>The most common symptoms of COVID-19 are fever, tiredness, and dry cough. Some patients may have aches and pains, nasal congestion, runny nose, sore throat or diarrhea. These symptoms are usually mild and begin gradually. Some people become infected but don t develop any symptoms and don\'t feel unwell. Most people (about 80%) recover from the disease without needing special treatment. Around 1 out of every 6 people who gets COVID-19 becomes seriously ill and develops difficulty breathing. Older people, and those with underlying medical problems like high blood pressure, heart problems or diabetes, are more likely to develop serious illness. People with fever, cough and difficulty breathing should seek medical attention.</p>');
group_of_questions.push([ // 96
'How does COVID-19 spread?',
]);
answers.push(
'<p>People can catch COVID-19 from others who have the virus. The disease can spread from person to person through small droplets from the nose or mouth which are spread when a person with COVID-19 coughs or exhales. These droplets land on objects and surfaces around the person. Other people then catch COVID-19 by touching these objects or surfaces, then touching their eyes, nose or mouth. People can also catch COVID-19 if they breathe in droplets from a person with COVID-19 who coughs out or exhales droplets. This is why it is important to stay more than 1 meter (3 feet) away from a person who is sick. </p><p>WHO is assessing ongoing research on the ways COVID-19 is spread and will continue to share updated findings.    </p>');
group_of_questions.push([ // 97
'Can the virus that causes COVID-19 be transmitted through the air?',
]);
answers.push(
'<p>Studies to date suggest that the virus that causes COVID-19 is mainly transmitted through contact with respiratory droplets rather than through the air.  See previous answer on  How does COVID-19 spread? </p>');
group_of_questions.push([ // 98
'Can CoVID-19 be caught from a person who has no symptoms?',
]);
answers.push(
'<p>The main way the disease spreads is through respiratory droplets expelled by someone who is coughing. The risk of catching COVID-19 from someone with no symptoms at all is very low. However, many people with COVID-19 experience only mild symptoms. This is particularly true at the early stages of the disease. It is therefore possible to catch COVID-19 from someone who has, for example, just a mild cough and does not feel ill.  WHO is assessing ongoing research on the period of transmission of COVID-19 and will continue to share updated findings.    </p>');
group_of_questions.push([ // 99
'Can I catch COVID-19 from the feces of someone with the disease?',
]);
answers.push(
'<p>The risk of catching COVID-19 from the feces of an infected person appears to be low. While initial investigations suggest the virus may be present in feces in some cases, spread through this route is not a main feature of the outbreak. WHO is assessing ongoing research on the ways COVID-19 is spread and will continue to share new findings. Because this is a risk, however, it is another reason to clean hands regularly, after using the bathroom and before eating. </p>');
group_of_questions.push([ // 100
'What can I do to protect myself and prevent the spread of disease?',
]);
answers.push(
'<p class="sf-accordion__summary">                                 <h3>Protection measures for everyone</h3><p></p><p>Stay aware of the latest information on the COVID-19 outbreak, available on the WHO website and through your national and local public health authority. Many countries around the world have seen cases of COVID-19 and several have seen outbreaks. Authorities in China and some other countries have succeeded in slowing or stopping their outbreaks. However, the situation is unpredictable so check regularly for the latest news.</p><p>You can reduce your chances of being infected or spreading COVID-19 by taking some simple precautions:</p><p></p><ul type="disc"><li>Regularly and thoroughly clean your hands with an alcohol-based hand rub or wash them with soap and water.<br />Why? Washing your hands with soap and water or using alcohol-based hand rub kills viruses that may be on your hands.</li><li>Maintain at least 1 metre (3 feet) distance between yourself and anyone who is coughing or sneezing.<br />Why? When someone coughs or sneezes they spray small liquid droplets from their nose or mouth which may contain virus. If you are too close, you can breathe in the droplets, including the COVID-19 virus if the person coughing has the disease.</li><li>Avoid touching eyes, nose and mouth.<br />Why? Hands touch many surfaces and can pick up viruses. Once contaminated, hands can transfer the virus to your eyes, nose or mouth. From there, the virus can enter your body and can make you sick.</li><li>Make sure you, and the people around you, follow good respiratory hygiene. This means covering your mouth and nose with your bent elbow or tissue when you cough or sneeze. Then dispose of the used tissue immediately.<br />Why? Droplets spread virus. By following good respiratory hygiene you protect the people around you from viruses such as cold, flu and COVID-19.</li><li>Stay home if you feel unwell. If you have a fever, cough and difficulty breathing, seek medical attention and call in advance. Follow the directions of your local health authority.<br />Why? National and local authorities will have the most up to date information on the situation in your area. Calling in advance will allow your health care provider to quickly direct you to the right health facility. This will also protect you and help prevent spread of viruses and other infections.</li><li>Keep up to date on the      latest COVID-19 hotspots (cities or local areas where COVID-19 is      spreading widely). If possible, avoid traveling to places    especially if you are an older person      or have diabetes, heart or lung disease.<br />Why? You have a higher chance of catching COVID-19 in one of these areas.</li></ul><p> </p><p style="margin-left:30px;"><br /></p><h3>Protection measures for persons who are in or have recently visited (past 14 days) areas where COVID-19 is spreading</h3><ul type="circle"><li>Follow the guidance      outlined above (Protection      measures for everyone) </li><li>Self-isolate by staying at home if you begin to feel unwell, even with mild symptoms such as headache, low grade fever (37.3 C or above) and slight runny nose, until you recover. If it is essential for you to have someone bring you supplies or to go out, e.g. to buy food, then wear a mask to avoid infecting other people.<br />Why? Avoiding contact       with others and visits to medical facilities will allow these facilities       to operate more effectively and help protect you and others from possible       COVID-19 and other viruses.</li><li>If you develop fever, cough      and difficulty breathing, seek medical advice promptly as this may be due      to a respiratory infection or other serious condition. Call in advance and      tell your provider of any recent      travel or contact with travelers.<br />Why? Calling in advance will allow your       health care provider to quickly direct you to the right health facility.       This will also help to prevent possible spread of COVID-19 and other viruses.</li></ul><p> </p><p> </p><p> </p><p> </p><div><div><p> </p></div></div>                             </p>');
group_of_questions.push([ // 101
'How likely am I to catch COVID-19?',
]);
answers.push(
'<p>The risk depends on where you  are - and more specifically, whether there is a COVID-19 outbreak unfolding there. </p><p>For most people in most locations the risk of catching COVID-19 is still low. However, there are now places around the world (cities or areas) where the disease is spreading. For people living in, or visiting, these areas the risk of catching COVID-19 is higher. Governments and health authorities are taking vigorous action every time a new case of COVID-19 is identified. Be sure to comply with any local restrictions on travel, movement or large gatherings. Cooperating with disease control efforts will reduce your risk of catching or spreading COVID-19.</p><p>COVID-19 outbreaks can be contained and transmission stopped, as has been shown in China and some other countries. Unfortunately, new outbreaks can emerge rapidly. It s important to be aware of the situation where you are or intend to go. WHO publishes daily updates on the COVID-19 situation worldwide. <br /></p><p>You can see these at <a target="_blank" href="/emergencies/diseases/novel-coronavirus-2019/situation-reports">https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports/</a> </p>');
group_of_questions.push([ // 102
'Should I worry about COVID-19?',
]);
answers.push(
'<p><p>Illness due to COVID-19 infection is generally mild, especially for children and young adults. However, it can cause serious illness: about 1 in every 5 people who catch it need hospital care. It is therefore quite normal for people to worry about how the COVID-19 outbreak will affect them and their loved ones. </p>We can channel our concerns into actions to protect ourselves, our loved ones and our communities. First and foremost among these actions is regular and thorough hand-washing and good respiratory hygiene. Secondly, keep informed and follow the advice of the local health authorities including any restrictions put in place on travel, movement and gatherings. <p>Learn more about how to protect yourself at <a target="_blank" href="/emergencies/diseases/novel-coronavirus-2019/advice-for-public" style="text-align:inherit;text-transform:inherit;white-space:inherit;word-spacing:normal;">https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public</a></p></p>');
group_of_questions.push([ // 103
'Who is at risk of developing severe illness?',
]);
answers.push(
'<p>While we are still learning about how COVID-2019 affects people, older persons and persons with pre-existing medical conditions (such as high blood pressure, heart disease, lung disease, cancer or diabetes)  appear to develop serious illness more often than others. </p>');
group_of_questions.push([ // 104
'Are antibiotics effective in preventing or treating the COVID-19?',
]);
answers.push(
'<p>No. Antibiotics do not work against viruses, they only work on bacterial infections. COVID-19 is caused by a virus, so antibiotics do not work. Antibiotics should not be used as a means of prevention or treatment of COVID-19. They should only be used as directed by a physician to treat a bacterial infection. </p>');
group_of_questions.push([ // 105
'Are there any medicines or therapies that can prevent or cure COVID-19?',
]);
answers.push(
'<p>While some western, traditional or home remedies may provide comfort and alleviate symptoms of COVID-19, there is no evidence that current medicine can prevent or cure the disease. WHO does not recommend self-medication with any medicines, including antibiotics, as a prevention or cure for COVID-19. However, there are several ongoing clinical trials that include both western and traditional medicines. WHO will continue to provide updated information as soon as clinical findings are available.</p><p> </p>');
group_of_questions.push([ // 106
'Is there a vaccine, drug or treatment for COVID-19?',
]);
answers.push(
'<p>Not yet. To date, there is no vaccine and no specific antiviral medicine to prevent or treat COVID-2019. However, those affected should receive care to relieve symptoms. People with serious illness should be hospitalized. Most patients recover thanks to supportive care. </p><p>Possible vaccines and some specific drug treatments are under investigation. They are being tested through clinical trials. WHO is coordinating efforts to develop vaccines and medicines to prevent and treat COVID-19. </p>The most effective ways to protect yourself and others against COVID-19 are to frequently clean your hands, cover your cough with the bend of elbow or tissue, and maintain a distance of at least 1 meter (3 feet) from people who are coughing or sneezing. <span style="background-color:transparent;color:#3c4245;font-family:Arial, Helvetica, sans-serif;font-size:16px;text-align:inherit;text-transform:inherit;white-space:inherit;word-spacing:normal;caret-color:auto;">(See </span><a target="_blank" href="/emergencies/diseases/novel-coronavirus-2019/advice-for-public/when-and-how-to-use-masks" style="font-family:Arial, Helvetica, sans-serif;font-size:16px;text-align:inherit;text-transform:inherit;white-space:inherit;word-spacing:normal;">Basic protective measures against the new coronavirus</a><span style="background-color:transparent;color:#3c4245;font-family:Arial, Helvetica, sans-serif;font-size:16px;text-align:inherit;text-transform:inherit;white-space:inherit;word-spacing:normal;caret-color:auto;">).</span><p> </p>');
group_of_questions.push([ // 107
'Is COVID-19 the same as SARS?',
]);
answers.push(
'<p>No. The virus that causes COVID-19 and the one that caused the outbreak of Severe Acute Respiratory Syndrome (SARS) in 2003 are related to each other genetically, but the diseases they cause are quite different. </p><p>SARS was more deadly but much less infectious than COVID-19. There have been no outbreaks of SARS anywhere in the world since 2003.</p>');
group_of_questions.push([ // 108
'Should I wear a mask to protect myself?',
]);
answers.push(
'<p>Only wear a mask if you are ill with COVID-19 symptoms (especially coughing) or looking after someone who may have COVID-19. Disposable face mask can only be used once. If you are not ill or looking after someone who is ill then you are wasting a mask. There is a world-wide shortage of masks, so WHO urges people to use masks wisely.</p><p>WHO advises rational use of medical masks to avoid unnecessary wastage of precious resources and mis-use of masks  (<a target="_blank" href="/emergencies/diseases/novel-coronavirus-2019/advice-for-public/when-and-how-to-use-masks">see Advice on the use of masks</a>). </p><p>The most effective ways to protect yourself and others against COVID-19 are to frequently clean your hands, cover your cough with the bend of elbow or tissue and maintain a distance of at least 1 meter (3 feet) from people who are coughing or sneezing. See  <a href="/emergencies/diseases/novel-coronavirus-2019/advice-for-public/when-and-how-to-use-masks">basic protective measures against the new coronavirus</a> for more information.</p><p><br /></p><p> </p> ');
group_of_questions.push([ // 109
'How to put on, use, take off and dispose of a mask?',
]);
answers.push(
'<ol><li><span style="background-color:transparent;font-family:inherit;text-align:inherit;text-transform:inherit;white-space:inherit;word-spacing:normal;caret-color:auto;font-size:inherit;">Remember, a mask should only be used by health workers, care takers, and individuals with respiratory symptoms, such as fever and cough.</span></li><li>Before touching the mask, clean hands with an alcohol-based hand rub or soap and water</li><li>Take the mask and inspect it for tears or holes.</li><li>Orient which side is the top side (where the metal strip is).</li><li>Ensure the proper side of the mask faces outwards (the coloured side).</li><li>Place the mask to your face. Pinch the metal strip or stiff edge of the mask so it moulds to the shape of your nose.</li><li>Pull down the mask s bottom so it covers your mouth and your chin.</li><li>After use, take off the mask; remove the elastic loops from behind the ears while keeping the mask away from your face and clothes, to avoid touching potentially contaminated surfaces of the mask. </li><li>Discard the mask in a closed bin immediately after use.</li><li>Perform hand hygiene after touching or discarding the mask   Use alcohol-based hand rub or, if visibly soiled, wash your hands with soap and water.</li></ol>');
group_of_questions.push([ // 110
'How long is the incubation period for COVID-19?',
]);
answers.push(
'<p>The  incubation period  means the time between catching the virus and beginning to have symptoms of the disease. Most estimates of the incubation period for COVID-19 range from 1-14 days, most commonly around five days. These estimates will be updated as more data become available.</p>');
group_of_questions.push([ // 111
'Can humans become infected with the COVID-19 from an animal source?',
]);
answers.push(
'<p></p><p>Coronaviruses are a large family of viruses that are common in animals. Occasionally, people get infected with these viruses which may then spread to other people. For example, SARS-CoV was associated with civet cats and MERS-CoV is transmitted by dromedary camels. Possible animal sources of COVID-19 have not yet been confirmed.  </p><p>To protect yourself, such as when visiting live animal markets, avoid direct contact with animals and surfaces in contact with animals. Ensure good food safety practices at all times. Handle raw meat, milk or animal organs with care to avoid contamination of uncooked foods and avoid consuming raw or undercooked animal products.</p><p></p>');
group_of_questions.push([ // 112
'Can I catch COVID-19 from my pet?',
]);
answers.push(
'<p>While there has been one instance of a dog being infected in Hong Kong, to date, there is no evidence that a dog, cat or any pet can transmit COVID-19. COVID-19 is mainly spread through droplets produced when an infected person coughs, sneezes, or speaks. To protect yourself, clean your hands frequently and thoroughly. <br /></p><p>WHO continues to monitor the latest research on this and other COVID-19 topics and will update as new findings are available.</p><p> </p><p></p>');
group_of_questions.push([ // 113
'How long does the virus survive on surfaces?',
]);
answers.push(
'<p>It is not certain how long the virus that causes COVID-19 survives on surfaces, but it seems to behave like other coronaviruses. Studies suggest that coronaviruses (including preliminary information on the COVID-19 virus) may persist on surfaces for a few hours or up to several days. This may vary under different conditions (e.g. type of surface, temperature or humidity of the environment).</p><p>If you think a surface may be infected, clean it with simple disinfectant to kill the virus and protect yourself and others. Clean your hands with an alcohol-based hand rub or wash them with soap and water. Avoid touching your eyes, mouth, or nose.</p>');
group_of_questions.push([ // 114
'Is it safe to receive a package from any area where COVID-19 has been reported?',
]);
answers.push(
'<p>Yes. The likelihood of an infected person contaminating commercial goods is low and the risk of catching the virus that causes COVID-19 from a package that has been moved, travelled, and exposed to different conditions and temperature is also low. </p>');
group_of_questions.push([ // 115
'Is there anything I should not do?',
]);
answers.push(
'<p>The following measures <strong><span style="text-decoration:underline;">ARE NOT</span></strong> effective against COVID-2019 and can be harmful:</p><ul><li>Smoking</li><li>Wearing multiple masks</li><li>Taking antibiotics (See question 10 "<em>Are there any medicines of therapies that can prevent or cure COVID-19?</em>")</li></ul><p><strong>In any case, if you have fever, cough and difficulty breathing seek medical care early</strong> to reduce the risk of developing a more severe infection and be sure to share your recent travel history with your health care provider.</p>');
group_of_questions.push([ // 116
'What should I do if I have symptoms or have been exposed?',
]);
answers.push(
'<ul class="linklist">  <li>Call  your healthcare provider, or call before going to the emergency room.</li>  <li>We have guidance available for people who have or think they may have COVID-19:  <ul class="linklist">   <li><u><a target="_blank" href="/Portals/1/Documents/1600/coronavirus/COVIDcasepositive_3.15.20.pdf">What to do if you have confirmed or suspected coronavirus disease (COVID-19) (PDF)</a></u> </li>   <li><u><a href="/Portals/1/Documents/1600/coronavirus/COVIDexposed.pdf">What to do if you were potentially exposed to someone with confirmed coronavirus disease (COVID-19) (PDF)</a></u></li>   <li><u><a href="/Portals/1/Documents/1600/coronavirus/COVIDconcerned_3.15.20.pdf">What to do if you have symptoms of coronavirus disease 2019 (COVID-19) and have not been around anyone who has been diagnosed with COVID-19 (PDF)</a></u></li>  </ul>  </li> </ul>');
group_of_questions.push([ // 117
'How do I get tested?',
]);
answers.push(
'<ul class="linklist">  <li>If you have symptoms, call your healthcare provider.</li>  <li><a target="_blank" href="/Emergencies/NovelCoronavirusOutbreak2020/TestingforCOVID19">Learn more about testing</a>.</li> </ul>');
group_of_questions.push([ // 118
'What\'s the current risk?',
]);
answers.push(
'<p>The risk posed by a virus outbreak depends on factors including how well it spreads between people, the severity of the illness it causes, and the medical or other measures we have to control the impact of the virus (for example, vaccine or treatment medications).</p>  <ul class="condensed">  <li>COVID-19 is spreading in several communities in Washington, the risk of exposure is increasing for people who live in our state.</li>  <li>Healthcare workers caring for patients with COVID-19 are at elevated risk of exposure.</li>  <li>Those who have had close contact with persons with COVID-19 are at elevated risk of exposure.</li>  <li>Travelers returning from affected international locations where community spread is occurring are at elevated risk of exposure.</li> </ul>  <p>Our knowledge of COVID-19 is still rapidly evolving. The risk assessment will be updated as needed.</p>');
group_of_questions.push([ // 119
'How can people protect themselves?',
]);
answers.push(
'There is currently no vaccine to prevent COVID-19. The best way to prevent illness is to avoid being exposed to this virus. The virus is thought to spread mainly from person-to-person between people who are in close contact with one another (within about 6 feet). This occurs through respiratory droplets produced when an infected person coughs or sneezes. These droplets can land in the mouths or noses of people who are nearby or possibly be inhaled into the lungs. Older adults and people who have severe underlying chronic medical conditions like heart or lung disease or diabetes seem to be at higher risk for developing more serious complications from COVID-19 illness. Every person has a role to play. So much of protecting yourself and your family comes down to common sense: </p><ul style="list-style-type: disc;"><li>Washing hands with soap and water.<br/></li><li>Clean and disinfect frequently touched surfaces daily. If surfaces are dirty, clean them using detergent or soap and water prior to disinfection.<br/></li><li>Avoiding touching eyes, nose or mouth with unwashed hands.</li><li>Cover your cough or sneeze with a tissue or your elbow.<br/></li><li>Avoiding close contact with people who are sick.</li><li>Staying away from work, school or other people if you become sick with respiratory symptoms like fever and cough.</li><li>Following guidance from public health officials.<br/></li></ul><div>Please consult with your health care provider about additional steps you may be able to take to protect yourself.');
group_of_questions.push([ // 120
'Who is at Higher Risk for Serious Illness from COVID-19?',
]);
answers.push(
'<p>Early information out of China, where COVID-19 first started, shows that some people are at higher risk of getting very sick from this illness. This includes:</p><ul style="list-style-type: disc;"><li>Older adults (65+)<br/></li><li>Individuals with compromised immune systems</li><li>Individuals who have serious chronic medical conditions like:</li><ul style="list-style-type: disc;"><li>Heart disease</li><li>Diabetes<br/></li><li>Lung disease</li></ul></ul><p>If you are at higher risk for serious illness from COVID-19 because of your age or health condition, it is important for you to take actions to reduce your risk of getting sick with the disease, including: </p><ul style="list-style-type: disc;"><ul style="list-style-type: disc;"><li>Isolate at home and practice social distancing.<br/></li><li>Wash your hands often with soap and water for at least 20 seconds, especially after blowing your nose, coughing, or sneezing, or having been in a public place.</li><li>Avoiding touching eyes, nose or mouth with unwashed hands.</li><li>Avoid close contact with people who are sick, and stay away from large gatherings and crowds.</li><li>Consider ways of getting food brought to your house through family, social, or commercial networks.</li></ul></ul><p>It is also important that you listen to public health officials who may recommend community actions to reduce potential exposure to COVID-19, especially if COVID-19 is spreading in your community.</p><p>For more information visit the <a target="_blank" title="Centers for Disease Control and Prevention (CDC) Coronavirus Disease 2019 (COVID-19) People at Risk for Serious Illness web page" href="https://urldefense.proofpoint.com/v2/url?u=https-3A__gcc01.safelinks.protection.outlook.com_-3Furl-3Dhttps-253A-252F-252Furldefense.proofpoint.com-252Fv2-252Furl-253Fu-253Dhttps-2D3A-5F-5Fwww.cdc.gov-5Fcoronavirus-5F2019-2D2Dncov-5Fspecific-2D2Dgroups-5Fhigh-2D2Drisk-2D2Dcomplications.html-2526d-253DDwMFAg-2526c-253DLr0a7ed3egkbwePCNW4ROg-2526r-253Dlxj9wEtqoEBAma-2DTvya2HHzMHlIs09hc7DK0RmkepS4-2526m-253DV2EVxRMTi5FAHDCdmRHFtUjpfIcsPoV9Gr6n20dAmwM-2526s-253DjPgSs8PrxNImeRpRsS6ThZG41cHTT68xerAZhgShHYw-2526e-253D-26data-3D02-257C01-257CRodger.Butler-2540CHHS.CA.GOV-257C333b0df2a3b04298b3ff08d7c475a830-257C265c2dcd2a6e43aab2e826421a8c8526-257C0-257C0-257C637193881931550319-26sdata-3D1ZpwgACOG4mLCcu92UIEQa3evk2-252BsdS7xf97w03pIc4-253D-26reserved-3D0&d=DwMFAg&c=Lr0a7ed3egkbwePCNW4ROg&r=A8VAk1UqlhJEq2Og-b-nDxDHMjfghjmh7lKv268JP9I&m=8Faq2TFd13Q6GR3KgFju2VLsozgp8W9V8OBM9FIG4Y4&s=HQvG44tZ46a0QqG4yAJ-3XCE02YE9VANU3uOJjb6ci0&e=">CDC\'s website</a>.<br/></p>');
group_of_questions.push([ // 121
'What should you do if you think you\'re sick?',
]);
answers.push(
'<p><strong>Call ahead:</strong> If you are experiencing symptoms of COVID-19, and may have had contact with a person with COVID-19 or recently traveled to countries with apparent community spread, call your health care provider or local public health department first before seeking medical care so that appropriate precautions can be taken.</p>');
group_of_questions.push([ // 122
'What is Novel Coronavirus (COVID-19)? ',
]);
answers.push(
'<p>Coronaviruses are a large group of viruses that are common among animals and humans. This novel coronavirus that causes COVID-19 is a newly discovered coronavirus that has not been previously detected in animals or humans. The source of this virus is not yet known.</p>');
group_of_questions.push([ // 123
'What are the symptoms of COVID-19? ',
]);
answers.push(
'<p>Typically, human coronaviruses cause mild-to-moderate respiratory illness. Symptoms are very similar to the flu, including:</p><ul style="list-style-type: disc;"><li>Fever</li><li>Cough</li><li>Shortness of breath</li></ul><p>COVID-19 can cause more severe respiratory illness.</p>');
group_of_questions.push([ // 124
'What is the treatment for COVID-19? ',
]);
answers.push(
'<p>From the international data we have, of those who have tested positive for COVID-19, approximately 80 percent do not exhibit symptoms that would require hospitalization. For patients who are more severely ill, hospitals can provide supportive care. We are continuing to learn more about this novel coronavirus and treatment may change over time. </p>');
group_of_questions.push([ // 125
'How is it decided whether a person with a confirmed case of COVID-19 can self-isolate at home or must be confined to a hospital or elsewhere? ',
]);
answers.push(
'<p>Local health departments are working in partnership with the California Department of Public Health and the CDC, and making determinations on whether a person ill with COVID-19 requires hospitalization or if home isolation is appropriate. That decision may be based on multiple factors including severity of illness, need for testing, and appropriateness of home for isolation purposes.</p>');
group_of_questions.push([ // 126
'What is the difference between COVID-19 and other coronaviruses? ',
]);
answers.push(
'<p>Coronaviruses are a large family of viruses. There are some coronaviruses that commonly circulate in humans. These viruses cause mild to moderate respiratory illness, although rarely they can cause severe disease. COVID-19 is closely related to two other animal coronaviruses that have caused outbreaks in people—the SARS coronavirus and the MERS (middle east respiratory syndrome) coronavirus. </p>');
group_of_questions.push([ // 127
'Is California able to test for COVID-19? ',
]);
answers.push(
'<p>Eighteen public health labs in California are testing for COVID-19. These labs include the California Department of Public Health\'s Laboratory in Richmond, Alameda, Contra Costa, Humboldt, Los Angeles, Monterey, Napa-Solano-Yolo-Marin (located in Solano), Orange, Sacramento, San Bernardino, San Diego, San Francisco, San Luis Obispo, Santa Clara, Shasta, Sonoma, Tulare and Ventura County public health laboratories. The Richmond Laboratory will provide diagnostic testing within a 48-hour turnaround time. More public health labs will soon be able to test for COVID-19. This means California public health officials will get test results sooner, so that patients will get the best care. <br/></p>');
group_of_questions.push([ // 128
'Should public events be cancelled? ',
]);
answers.push(
'<p>The California Department of Public Health has determined that gatherings should be postponed or canceled across the state until at least the end of March. Non-essential gatherings must be limited to no more than 250 people, while smaller events can proceed only if the organizers can implement social distancing of 6 feet per person. Gatherings of individuals who are at higher risk for severe illness from COVID-19 should be limited to no more than 10 people, while also following social distancing guidelines.</p><p>The<a target="_blank" href="/Programs/CID/DCDC/CDPH%20Document%20Library/Gathering_Guidance_03.11.20.pdf" target="_blank"> updated PDF guidance</a> is available.<br/></p>');
group_of_questions.push([ // 129
'Is it safe to go to restaurants and bars? ',
]);
answers.push(
'<p>California public health officials have directed bars, night clubs, breweries and wine tasting rooms to close. Restaurants should focus on food delivery and takeout while maximizing social distancing for those who are inside their restaurant.</p><p><a target="_blank" href="/Programs/CID/DCDC/CDPH%20Document%20Library/COVID-19/Coronavirus%20Disease%202019%20and%20Food%20Beverage%20Other%20Services%20-%20AOL.pdf" target="_blank">Food, Beverage and Other Services Guidance  (PDF)</a>.<br/></p>');
group_of_questions.push([ // 130
'What is Social Distancing?  ',
]);
answers.push(
'<p>Social distancing is a practice recommended by public health officials to stop or slow down the spread of contagious diseases. It requires the creation of physical space between individuals who may spread certain infectious diseases. The key is to minimize the number of gatherings as much as possible and to achieve space between individuals when events or activities cannot be modified, postponed, or canceled. Although the Department of Public Health expects most events with more than 250 attendees to be postponed or canceled, we emphasize that the venue space does matter. Achieving space between individuals of approximately six feet is advisable. Additionally, there is a particular focus on creating space between individuals who have come together on a one-time or rare basis and who have very different travel patterns such as those coming from multiple countries, states or counties.<br/></p>');
group_of_questions.push([ // 131
'Should I wear a mask? ',
]);
answers.push(
'<p>The California Department of Public Health, along with the CDC, does not recommend that healthy people wear masks at this time. However, masks are recommended to limit the spread of disease for people who are exhibiting respiratory symptoms.<br/></p>');
group_of_questions.push([ // 132
'What if I have symptoms? ',
]);
answers.push(
'<span style="font-weight: 700; text-decoration-line: underline;">Patient:</span> If a person develops symptoms of COVID-19 including fever, cough or shortness of breath, and has reason to believe they may have been exposed, they should call their health care provider before seeking care. Contacting them in advance will make sure that people can get the care they need without putting others at risk. Please be sure to tell your health care provider about your travel history. You can also take the following precautionary measures: avoid contact with sick individuals, wash hands often with soap and warm water for at least 20 seconds.</div><div class="NewsItemContent" style="font-size: 18px;"><span style="text-decoration-line: underline;"><span style="font-weight: 700;">Health Care Provider</span></span>: Patients who may have infection with this novel coronavirus should wear a surgical mask and be placed in an airborne infection isolation room. If an airborne infection isolation room is not available, the patient should be placed in a private room with the door closed. Health care providers should use standard, contact and airborne precautions and use eye protection. Please see <a target="_blank" href="https://emergency.cdc.gov/han/han00426.asp" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable">Update and Interim Guidance on Outbreak of 2019 Novel Coronavirus (2019-nCoV) in Wuhan, China</a> for more information about infection control. The Public Health Department will issue All Facility Letters to regulated healthcare facilities within California with updated information and guidance; these can be found on the <a href="/Programs/CHCQ/LCP/Pages/LNCAFL20.aspx">AFL webpage</a>');
group_of_questions.push([ // 133
'What should I do if I am unable to work after being exposed to COVID-19? ',
]);
answers.push(
'<p>Individuals who are unable to work due to having or being exposed to COVID-19 (certified by a medical professional) can <a target="_blank" title="file a Disability Insurance (DI) claim." href="https://edd.ca.gov/Disability/How_to_File_a_DI_Claim_in_SDI_Online.htm/t_blank" target="_blank"><span lang="EN">file a Disability Insurance (DI) claim</span></a><span lang="EN">.</span></p> <p>Disability Insurance provides short-term benefit payments to eligible workers who have full or partial loss of wages due to a non-work-related illness, injury, or pregnancy. Benefit amounts are approximately 60-70 percent of wages (depending on income) and range from $50 - $1,300 a week.</p> <p>Californians who are unable to work because they are caring for an ill or quarantined family member with COVID-19 (certified by a medical professional) can <a title="file a Paid Family Leave (PFL) claim." href="https://edd.ca.gov/Disability/How_to_File_a_PFL_Claim_in_SDI_Online.htm/t_blank" target="_blank"><span lang="EN">file a Paid Family Leave (PFL) claim</span></a><span lang="EN">.</span></p><p><span lang="EN">Paid Family Leave provides up to six weeks of benefit payments to eligibile workers who have a full or partial loss of wages because they need time off work to care for a seriously ill family member or to bond with a new child. Benefit amounts are approximately 60-70 percent of wages (depending on income) and range from $50-$1,300 a week.<font size="4" face="Arial" color="#202020"></font></span></p><p><span lang="EN">For more information related to resources for California\'s Employers and Workers, please visit this <a title="Labor and Workforce Agency" href="https://www.labor.ca.gov/coronavirus2019/">Labor and Workforce Development Agency webpage. </a><br/></span></p>');
group_of_questions.push([ // 134
'What is SARS-CoV-2? What is COVID-19?',
]);
answers.push(
'<p>Severe Acute Respiratory Syndrome Coronavirus-2 (SARS-CoV-2) is the name given to the 2019 novel coronavirus. COVID-19 is the name given to the disease associated with the virus. SARS-CoV-2 is a new strain of coronavirus that has not been previously identified in humans.</p>');
group_of_questions.push([ // 135
'Where do coronaviruses come from?',
]);
answers.push(
'<p>Coronaviruses are viruses that circulate among animals with some of them also known to infect humans.</p> <p>Bats are considered as natural hosts of these viruses yet several other species of animals are also known to be a source. For instance, the Middle East Respiratory Syndrome Coronavirus (MERS-CoV) is transmitted to humans from camels, and the Severe Acute Respiratory Syndrome Coronavirus-1 (SARS-CoV-1) is transmitted to humans from civet cats. More information on coronaviruses can be found on the ECDC factsheet.</p>');
group_of_questions.push([ // 136
'Is this virus comparable to SARS or to the seasonal flu?',
]);
answers.push(
'<p>The novel coronavirus detected in China is genetically closely related to the SARS-CoV-1 virus. SARS emerged at the end of 2002 in China, and it caused more than 8 000 cases in 33 countries over a period of eight months. Around one in ten of the people who developed SARS died.</p> <p>The current COVID-19 outbreak caused around 7 000 reported cases in China during the first month after initial reports (January 2020), with a further 80 000 cases reported globally during the second month (February 2020). Of these first 87 000 cases, about 3 000 died. Cases are now being detected in Europe and across the globe. See the situation updates for the latest available information. </p> <p>While the viruses that cause both COVID-19 and seasonal influenza are transmitted from person-to-person and may cause similar symptoms, the two viruses are very different and do not behave in the same way. ECDC estimates that between 15 000 and 75 000 people die prematurely due to causes associated with seasonal influenza each year in the EU, the UK, Norway, Iceland and Liechtenstein. This is approximately 1 in every 1 000 people who are infected. By comparison, the current estimated mortality rate for COVID-19 is 20-30 per 1 000 people.</p> <p>Despite the relatively low mortality rate for seasonal influenza, many people die from the disease due to the large number of people who contract it each year. The concern about COVID-19 is that, unlike influenza, there is no vaccine and no specific treatment for the disease. It also appears to be as transmissible as influenza if not more so. As it is a new virus, nobody has prior immunity which in theory means that the entire human population is potentially susceptible to COVID-19 infection.</p>');
group_of_questions.push([ // 137
'How severe is COVID-19 infection?',
]);
answers.push(
'<p>Preliminary findings indicate that the mortality rate for COVID-19 is 20-30 per thousand people diagnosed. This is significantly less than the 2003 SARS outbreak. However, it is much higher than the mortality rate for seasonal influenza.</p>');
group_of_questions.push([ // 138
'What is the mode of transmission? How (easily) does it spread?',
]);
answers.push(
'<p>While animals are the original source of the virus, it is now spreading from person to person (human-to-human transmission). There is not enough epidemiological information at this time to determine how easily and sustainably this virus spreads between people, but it is currently estimated that, on average, one infected person will infect between two and three more. The virus seems to be transmitted mainly via respiratory droplets that people sneeze, cough, or exhale. The virus can also survive for several hours on surfaces such as tables and door handles.</p> <p>The incubation period for COVID-19 (i.e. the time between exposure to the virus and onset of symptoms) is currently estimated at between two and 14 days. At this stage, we know that the virus can be transmitted when people who are infected show flu-like symptoms such as coughing.  There is evidence suggesting that transmission can occur from an infected person with no symptoms; however, uncertainties remain about the effect of transmission by non symptomatic persons on the epidemic.</p>');
group_of_questions.push([ // 139
'What are the symptoms of COVID-19 infection',
]);
answers.push(
'<p>The virus can cause mild, flu-like symptoms such as:</p> <ul><li>fever</li> <li>cough</li> <li>difficulty breathing</li> <li>muscle pain</li> <li>tiredness</li> </ul><p>More serious cases develop severe pneumonia, acute respiratory distress syndrome, sepsis and septic shock that can lead to death. </p>');
group_of_questions.push([ // 140
'Are some people more at risk than others?',
]);
answers.push(
'<p>Generally elderly people and those with underlying health conditions (e.g. hypertension, diabetes, cardiovascular disease, chronic respiratory disease and cancer) are considered to be more at risk of developing severe symptoms.</p>');
group_of_questions.push([ // 141
'Are children also at risk of infection?',
]);
answers.push(
'<p>Disease in children appears to be relatively rare and mild. A large study from China suggested that just over 2% of cases were under 18 years of age. Of these, fewer than 3% developed severe or critical disease.</p>');
group_of_questions.push([ // 142
'What about pregnant women?',
]);
answers.push(
'There is limited scientific evidence on the severity of illness in pregnant women after COVID-19 infection. That said, current evidence suggests that severity of illness among pregnant women after COVID-19 infection is similar to that in non-pregnant adult COVID-19 cases, and there is no data that suggests infection with COVID-19 during pregnancy has a negative effect on the foetus. At present, there is no evidence of transmission of COVID-19 from mother to baby occurring during pregnancy. ECDC will continue to monitor the emerging scientific literature on this question, and suggests that all pregnant women follow the same precautions for the prevention of COVID-19, including regular handwashing, avoiding individuals who are sick, and self-isolating in case of any symptoms, while consulting a healthcare provider by telephone for advice.');
group_of_questions.push([ // 143
'Is there a treatment for the COVID-19 disease?',
]);
answers.push(
'<p>There is no specific treatment for this disease, so healthcare providers treat the clinical symptoms (e.g. fever, difficulty breathing) of patients. Supportive care (e.g. fluid management, oxygen therapy etc.) can be highly effective for patients with symptoms.</p>');
group_of_questions.push([ // 144
'When should I be tested for COVID-19?',
]);
answers.push(
'<p>Current advice for testing depends on the stage of the outbreak in the country or area where you live. Countries across the EU/EEA might be in different scenarios, even within the same country, and testing approaches will be adapted to the situation at national and local level.</p> <p>National authorities may decide to only test subgroups of suspected cases based on the national capacity to test, the availability of necessary equipment for testing, the level of community transmission of COVID-19, or any other criteria. As a rational approach, national authorities may consider prioritising testing in the following groups:</p> <ul><li>hospitalised patients with severe respiratory infections;</li> <li>cases with acute respiratory infections in hospital or long-term care facilities;</li> <li>patients with acute respiratory infections or influenza-like illness in certain outpatient clinics or hospitals in order to assess the extent of virus circulation in the population;</li> <li>elderly people with underlying chronic medical conditions such as lung disease, cancer, heart failure, cerebrovascular disease, renal disease, liver disease, diabetes, and immunocompromising conditions</li> </ul>');
group_of_questions.push([ // 145
'Where can I get tested?',
]);
answers.push(
'<p>If you are feeling ill with COVID-19 symptoms (such as fever, cough, difficulty breathing, muscle pain or tiredness) it is recommended that you contact healthcare services by telephone or online. If your healthcare provider believes there is a need for a laboratory test for the virus that causes COVID-19, he/she will inform you of the procedure to follow and advise where and how the test can be performed.</p>');
group_of_questions.push([ // 146
'How can I avoid getting infected?',
]);
answers.push(
'<p>The virus enters your body via your eyes, nose and/or mouth, so it is important to avoid touching your face with unwashed hands.</p> <p>Washing of hands with soap and water for at least 20 seconds, or cleaning hands with alcohol-based solutions, gels or tissues is recommended in all settings.</p> <p>It is also recommended to stay 1 metre or more away from people infected with COVID-19 who are showing symptoms, to reduce the risk of infection through respiratory droplets.</p>');
group_of_questions.push([ // 147
'What should I do if I have had close contact with someone who has COVID-19?',
]);
answers.push(
'<p>Notify public health authorities in your area who will provide guidance on further steps to take. If you develop any symptoms, you should immediately call your healthcare provider for advice, mentioning that you have been in contact with someone with COVID-19.</p>');
group_of_questions.push([ // 148
'Are face masks effective in protecting against COVID-19?',
]);
answers.push(
'p>If you are infected, the use of surgical face masks may reduce the risk of you infecting other people, but there is <em>no evidence</em> that face masks will effectively prevent you from being infected with the virus. In fact, it is possible that the use of face masks may even increase the risk of infection due to a false sense of security and increased contact between hands, mouth and eyes.</p>');
group_of_questions.push([ // 149
'Is there a vaccine against the virus? How long will it take to develop a vaccine?',
]);
answers.push(
'There are currently no vaccines against human coronaviruses, including the virus that causes COVID-19. This is why it is very important to prevent infection and to contain further spread of the virus.');
group_of_questions.push([ // 150
'Am I protected against COVID-19 if I had the influenza vaccine this year?',
]);
answers.push(
'<p>Influenza and the virus that causes COVID-19 are two very different viruses and the seasonal influenza vaccine will not protect against COVID-19.  </p> ');
group_of_questions.push([ // 151
'How prepared is Europe for COVID-19 and what is the EU doing?',
]);
answers.push(
'<p>The European Centre for Disease Prevention and Control (ECDC) is in continuous contact with the European Commission and the World Health Organization regarding the assessment of this outbreak. To inform the European Commission and the public health authorities in Member States of the ongoing situation, ECDC publishes daily summaries and continuously assesses the risk for EU citizens. ECDC and WHO have developed technical guidance to support the EU Member States in their response. The European Commission is ensuring the coordination of risk management activities at EU level.</p>');
group_of_questions.push([ // 152
'Am I at risk of contracting COVID-19 infection in the EU?',
]);
answers.push(
'<p>This outbreak is evolving rapidly and the risk assessment is changing accordingly. ECDC is continuously assessing the risk for EU citizens and you can find the latest information in the daily updated ECDC risk assessment.</p>');
group_of_questions.push([ // 153
'How many people have been infected in the EU/EEA?',
]);
answers.push(
'<p>See the ECDC daily situation update for the latest available information. Given the extensive movement of people and the fact that the virus is transmitted from person to person, further cases are expected in Europe.</p> ');
group_of_questions.push([ // 154
'How long will this outbreak last?',
]);
answers.push(
'<p>Unfortunately, it is not possible to predict how long the outbreak will last and how the epidemic will unfold. We are dealing with a new virus and therefore a lot of uncertainty remains. For instance, it is not known whether transmission within the EU/EEA will naturally decrease during the northern hemisphere summer, as is observed for seasonal influenza.</p>');
group_of_questions.push([ // 155
'Should schools and day centres be closed?',
]);
answers.push(
'<p>The evidence we have to date indicates that COVID-19 does not affect children nearly as much as it affects adults. However, the extent to which children play a role in the transmission of the virus is still unknown. Due to this uncertainty, it is especially important to encourage children to wash their hands carefully to reduce any possible risk of them becoming infected themselves, and then of passing on the virus. If children do become ill, they should be strictly isolated at home.</p> <p>Depending on local circumstances, local authorities may decide to temporarily close schools and daycare centres to reduce transmission. Wherever this happens, it is important that parents and caregivers are supported, for example by their employers, so they can stay at home and take care of their children.</p>');
group_of_questions.push([ // 156
'What precautions should I take if I am visiting an area of local or community transmission?',
]);
answers.push(
'<p>Travellers visiting areas of local or community COVID-19 transmission should adhere to strict hygiene measures, wash hands with soap and water regularly, and/or use alcohol-based hand sanitisers. Touching the face with unwashed hands should be avoided. Travellers should avoid contact with sick persons, in particular those with respiratory symptoms and fever. It should be emphasised that older people and those with underlying health conditions should take these precautionary measures very seriously.</p>');
group_of_questions.push([ // 157
'What if I have recently been in an area of local or community transmission?',
]);
answers.push(
'<p>Travellers returning from areas of local or community transmission should monitor their health for 14 days. People with symptoms should contact their healthcare specialist via telephone first, and indicate their exposure and travel history before seeking medical attention in person. Symptomatic people should avoid contact with others until they have received advice from a healthcare specialist.</p>');
group_of_questions.push([ // 158
'What is the risk of infection when travelling by plane?',
]);
answers.push(
'<p>If it is established that a COVID-19 case has been on an airplane, other passengers who were at risk (as defined by how near they were seated to the infected passenger) will be contacted by public health authorities. Should you have questions about a flight you have taken, please contact your local health authority for advice. The risk of being infected on an airplane cannot be excluded, but is currently considered to be low for an individual traveller. The risk of being infected in an airport is similar to that of any other place where many people gather.</p>');
group_of_questions.push([ // 159
'What is the risk of COVID-19 infection from animals or animal products imported from affected areas?',
]);
answers.push(
'<p>There is no evidence that any of the animals or animal products authorised for entry into the European Union pose a risk to the health of EU citizens as a result of the presence of COVID-19.</p>');
group_of_questions.push([ // 160
'What is the risk of COVID-19 infection from food products imported from affected areas?',
]);
answers.push(
'<p>There has been no report of transmission of COVID-19 via food and therefore there is no evidence that food items imported into the European Union in accordance with the applicable animal and public health regulations pose a risk for the health of EU citizens in relation to COVID-19. The main mode of transmission is from person to person.</p> ');
group_of_questions.push([ // 161
'What is the risk of COVID-19 infection from contact with pets and other animals in the EU?',
]);
answers.push(
'<p>Current research links COVID-19 to certain types of bat as the original source, but does not exclude the involvement of other animals. Several types of coronaviruses can infect animals and can be transmitted to other animals and people. There is no evidence that companion animals (e.g. dogs or cats) pose a risk of infection to humans. As a general precaution, it is always wise to observe basic principles of hygiene when in contact with animals.</p> ');
group_of_questions.push([ // 162
'How can I protect myself from the coronavirus? ',
]);
answers.push(
'<p>You should behave in <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> same way you do to protect yourself from a flu virus: <a target="_blank" href="https://www.infektionsschutz.de/haendewaschen/" target="_blank">regular and thorough hand washing</a>, <a href="https://www.infektionsschutz.de/hygienetipps/hygiene-beim-husten-und-niesen/" target="_blank">proper coughing and sneezing</a> as well as keeping your distance from sick persons – these are <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> most effective protective measures in everyday life. You should also refrain from shaking hands.</p></div><a class="anchor" id="c17576"></a><div><div class="tx-dce-pi1">      <div class="infobox">     <div class="panel-heading">                                  <h2>Available downloads</h2>          </div>     <div class="panel-body">                <h3>How can I protect myself from infection? </h3> <p>Download in <a href="/fileadmin/Dateien/3_Downloads/C/Coronavirus/BMGS_Coronavirus2_DE.pdf" title="Download file" target="_blank">German</a> | <a href="/fileadmin/Dateien/3_Downloads/C/Coronavirus/BMGS_Coronavirus2_EN.pdf" title="Download file" target="_blank">English</a> | <a href="/fileadmin/Dateien/3_Downloads/C/Coronavirus/BMGS_Coronavirus2_TR.pdf" title="Download file" target="_blank">Turkish</a> (accessible <abbr  data-toggle="popover"  tabindex="0" class="glossaryentry" title="Portable Document Format">PDF</abbr>-Files)</p>            </div>                   <!-- Kein Link vorhanden! -->          </div>  </div></div><a class="anchor" id="c17577"></a><div>         <p>If possible, avoid going on trips, using public transport and instead work from home. </p> <p>Generally, all contact with others should be reduced to <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> bare minimum and <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> attendance <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> events with crowds <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> people should be avoided.  </p> <p>Citizens who are older than 70 years <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> age should obtain a vaccine against pneumococcal infection.</p>');
group_of_questions.push([ // 163
'What should be done if a coronavirus infection is suspected? What are the symptoms?',
]);
answers.push(
'<p>Persons who have had personal contact with someone confirmed as carrying SARS-CoV-2 should immediately, and irrespective <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> symptoms, contact their <a target="_blank" href="https://tools.rki.de/plztool" title="External link in new window" target="_blank">competent health office</a>, get in touch with <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> doctor or call 116117 – and stay at home. </p> <p>A coronavirus infection causes flu-like symptoms such as dry cough, fever, a runny nose and fatigue. There have also been reports <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> difficulties breathing, an itchy throat, headaches, joint pains, nausea, diarrhoea and shivering.</p>');
group_of_questions.push([ // 164
'What precautions must be taken at large-scale events?',
]);
answers.push(
'<p>The cancellation <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> events and <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> closure <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> schools and kindergartens fall within <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> responsibility <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> Federal Laender and/or <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> local authorities. In <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> meantime, all <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> Federal Laender have cancelled events and closed schools and kindergartens. Only in a very few exceptional cases may an event be allowed. </p> <p>The Robert Koch Institute has published <a target="_blank" href="https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Risiko_Grossveranstaltungen.pdf" title="Externer Link im neuen Fenster" target="_blank">“General Principles <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> Risk Assessment and Recommendations <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">for</span> Action with respect to Large-Scale Events”</a> (PDF-File) to support local authorities in deciding on whether to cancel an event.</p>');
group_of_questions.push([ // 165
'Is there a danger that a person can become infected with the novel coronavirus (SARS-CoV-2) through foodstuffs or objects? ',
]);
answers.push(
'<p>According to <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> Federal Institute <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">for</span> Risk Assessment, no proven case has been reported to date <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> a person being infected by consuming contaminated foodstuffs or through contact with objects contaminated with <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> SARS-CoV-2 virus. Nor have there been any reports <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> other coronaviruses causing infection through foodstuffs or contact with dry surfaces. However, virus transmission by way <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> smear infection is considered possible from surfaces contaminated shortly before contact. Owing to <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> relatively poor stability demonstrated by coronaviruses in <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> environment, it is likely that <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> window <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> contamination only exists <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">for</span> a short period. </p> <p>The risk assessment <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> foods or objects falls within <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> remit <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> <a target="_blank" href="https://www.bfr.bund.de/de/kann_das_neuartige_coronavirus_ueber_lebensmittel_und_spielzeug_uebertragen_werden_-244062.html" title="Externer Link im neuen Fenster" target="_blank">Federal Institute <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">for</span> Risk Assessment (<abbr  lang="de" xml:lang="de" data-toggle="popover"  tabindex="0" class="glossaryentry" title="Bundesinstitut für Risikobewertung">BfR</abbr>)</a>; <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> <a href="https://www.baua.de/DE/Angebote/Aktuelles/Meldungen/2020/2020-01-30-Coronavirus.html" title="Externer Link im neuen Fenster" target="_blank">Federal Institute <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">for</span> Occupational Safety and Health (<abbr  data-toggle="popover"  tabindex="0" class="glossaryentry" title="Bundesanstalt für Arbeitsschutz und Arbeitsmedizin">BAuA</abbr>)</a> is responsible <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">for</span> occupational safety and health.</p>');
group_of_questions.push([ // 166
'Is water a possible source of infection in the transmission of SARS-CoV-2? ',
]);
answers.push(
'<p>SARS-CoV-2 is similar to other coronaviruses <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">for</span> which water does not constitute a relevant route <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> transmission. The direct transmission <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> coronaviruses via <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> stools <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> infected persons also appears negligible; to date, no case <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> a faecal-oral transmission <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> virus has been reported. </p> <p>The German Environment Agency has published a detailed statement on coronavirus and drinking water.</p>');
group_of_questions.push([ // 167
'Where can doctors and clinics obtain additional information? ',
]);
answers.push(
'<p>The Robert Koch Institute posts <a target="_blank" href="https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/nCoV.html" title="Externer Link im neuen Fenster" target="_blank">information <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">for</span> professionals</a> (in German) <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">online</span>. Here you can find, among other things, a <a href="https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Massnahmen_Verdachtsfall_Infografik_Tab.html" title="Externer Link im neuen Fenster" target="_blank">flowchart <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">for</span> doctors</a> (in German) to assist them in clarifying suspected cases and deciding on <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> measures to be taken as well as Recommendations on hygienic measures when treating patients with a SARS-CoV-2 infection.</p></');
group_of_questions.push([ // 168
'When was the first information about the outbreak received?',
]);
answers.push(
'<p>On 31 December 2019, China’s WHO country office was informed <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> a cluster <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> patients with pneumonia <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> unknown cause in Wuhan, a city <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> 90 million inhabitants in <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> province <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> Hubei, China.</p>');
group_of_questions.push([ // 169
'Where did the outbreak start? ',
]);
answers.push(
'<p>According to information from <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> Chinese authorities in Wuhan, some patients worked as traders or vendors at <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> Huanan Seafood Market in Wuhan. It is <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> largest seafood market in Wuhan with over 600 stalls and 1,500 workers. It has been reported that wild animals and/or organs <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> other animals and reptiles were also offered <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">for</span> sale at <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> market. It is currently assumed that SARS-CoV-2 was spread to human beings from bats.</p>');
group_of_questions.push([ // 170
'Have there been similar outbreaks in the past? ',
]);
answers.push(
'<p>This new virus is a pathogen belonging to <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> coronavirus family, which is <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">the</span> same family as SARS (severe acute respiratory syndrome) and <abbr  data-toggle="popover"  tabindex="0" class="glossaryentry" title="Middle East Respiratory Syndrome">MERS</abbr>-CoV (Middle East respiratory syndrome coronavirus).  </p> <p>In 2003, Germany recorded a small number <span  lang="en" xml:lang="en" data-toggle="popover"  tabindex="0" class="glossaryentry" title="">of</span> SARS cases. The disease did not spread further within Germany.</p>');

    return {group_of_questions, answers};

};
