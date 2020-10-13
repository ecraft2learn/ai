// Questions and answers for Covid scenario for LIFE game
// Written by Ken Kahn 
// Many questions and answers from https://github.com/deepset-ai/COVID-QA/blob/master/data/faqs/faq_covidbert.csv
// License: New BSD

"use strict";

// Paraphrases by Ken Kahn

LIFE.sentences_and_answers = () => {
    let group_of_questions = [];
    let answers = [];
group_of_questions.push([ 
`In the strategies for effective infection prevention and control
(IPC), what does triage entail at hospitals?`,
`What triage practices are effective strategies for infection prevention and control in hospitals?`,
`What are effective triage practices in hospitals?`,
`What are best practices for hospital triage?`
]);

answers.push(
`Triage includes screening at the entrance, identification of cases
and isolation if necessary. There should be a triage (screening)
area where visitors to the hospital are interviewed using standard
questionnaires to identify symptoms, along with temperature
checks and documentation of contacts. Individuals who meet the
case definition for COVID-19 should be isolated immediately while
arrangement is being made for swab (sample) collection from the
patient. (See the WHO guidance on triage).`
);

group_of_questions.push([
`Should triage be carried out by nurses only?`,
'Are nurses the only hospital staff who should carry out triage?',
`Is it only nurses who should carry out triage?`,
`Are nurses the only ones that should handle triage?`
]);
answers.push(
`No, but it is easier to use nursing staff who have little or no training
but understand the COVID-19 case definition very well. However,
other healthcare workers such as laboratory scientists, pharmacists,
doctors and even medical record officers could handle triage if
they are trained to do so and if they are not needed at their station.
Identification of symptoms and temperature check are part of
nursing duties.`
);

group_of_questions.push([
`Where should triage be carried out in the health facility?`,
`Where in a health facility should we carry out triage?`,
`What is the best part of a hospital for carrying out triage?`,
`Where should triage of patient take place in a healthcare facility?`
]);

answers.push(
`Triage of visitors should be conducted before entry into the facility
e.g. at a parking lot or at the entrance to the facility. That is why a
single point-of-entry for all patients into the healthcare facility (HCF)
is recommended. No one should be exempted from triage.
Triage (or screening)`);

group_of_questions.push([
`Is a cloth mask sufficient for use during triage (screening)?`,
`For triage screening is a cloth mask enough?`,
`Are cloth masks enough for carrying out triage?`,
`Can we handle triage with only cloth masks?`
]);

answers.push(
`Linen/cloth mask is for community use and not for use in healthcare
settings, surgical masks should be used at healthcare facilities. If
there are no medical masks then it becomes critical to examine how
the cloth mask was made and how it is being cleaned, and it must
be changed every day. Do not touch the mask and perform hand
hygiene before wearing and after removing the mask. See Africa
CDC guidance on mitigating acute shortage of personal protective
equipment (PPE).`);

group_of_questions.push([
`What is the risk of getting infected through the eyes?`, // as little or no emphasis is placed on the eye cover?`,
`Is the risk high of getting infected through the eyes?`,
`Is infection through one's eyes a high risk?`,
`Are eyes a high risk becoming infected?`
]);

answers.push(
`The risk is also high if you touch your eyes while attending to patients
who are coughing or when you engage in high-risk procedures like
aerosol generating procedures (AGPs). It is, therefore, recommended
to use face shields or other equipment that protect the eyes, such
as goggles.`);

group_of_questions.push([
`How essential is the use of eye shield?`,
`Are eye shields essential?`,
`When must we use eye shields?`,
`Is the use of eye shi essential?`
]);

answers.push(
`It is very important to wear an eye shield when performing
procedures that could cause splashing whether for COVID-19 or not.
It is preferable to wear a face mask with the face shield because the
shield does not provide complete seal around the face and there is
a probability that splashes may cross to the face (e.g. from beneath
and sides of the face shield).`);

group_of_questions.push([
`Can the disease be transmitted through wounds or abrasions if they have contact with infected droplets?`,
`Can infected droplets contacting wounds or abrasions cause the disease?`,
`Are contacts with wounds and abrasions by infected droplets a transmission risk?`,
`Can one become infected if infected droplets contact a wound?`
]);

answers.push(
`There is currently no proof that infections can occur through wounds
or abrasions. Infection occurs when a person inhales the infected
droplet that falls on the skin, gloves or protective clothing, or if they
touch their mouth or nose with contaminated hands. The virus is
then transmitted through to the lungs.`);

group_of_questions.push([
`Are cloth masks effective to interrupt the transmission of COVID-19?`,
`Can cloth masks prevent the transmission of the disease?`,
`How effective are cloth masks?`,
`Do cloth masks protect against transmission?`
]);

answers.push(
`There is currently no evidence that cloth or linen masks significantly
interrupt the transmission of respiratory diseases such as COVID-19
in healthcare facility settings. If widespread wearing of cloth masks
is recommended in your country, it is very important to ensure that
all other hygiene measures are maintained and encouraged, and
they should be seen as additional measures, not alternatives.
Cloth masks should be used where physical distancing is not
possible. The mask should fit properly on the face, and you should
take care not to touch the surface with your hands. Cloth masks
should be made of at least three layers of fabric. They should be
washed daily and dried properly either in the sun or with electric
iron. If cared for correctly and worn appropriately, cloth masks can
prevent up to 50% of droplets from touching the face. Do not touch
the mask with unwashed hands and sanitize or wash your hands
after touching it. See <a href="https://africacdc.org/download/simple-instructions-on-how-to-use-a-face-mask/" target="_blank>how to use</a> and <a href="https://africacdc.org/download/simple-instructions-on-how-not-to-use-a-face-mask/" target="_blank">how not to use mask</a> from
Africa CDC and the <a href="https://www.who.int/publications/i/item/advice-on-the-use-of-masks-in-the-community-during-home-care-and-in-healthcare-settings-in-the-context-of-the-novel-coronavirus-(2019-ncov)-outbreak" target="_blank">WHO guideline on masks</a>. Find more information
on transmission <a href="https://africacdc.org/download/position-statement-on-transmission-of-sars-cov-2-by-pre-asymptomatic-and-asymptomatic-individuals/" target="_blank">here</a>.`);

group_of_questions.push([
`Can uninfected persons in the community use the surgical mask?`,
`Should surgical masks be used by uninfected community members?`,
`Should uninfected people use surgical masks?`,
`Are surgical masks recommended for uninfected persons?`
]);

answers.push(
`Healthcare supplies should be reserved for use by healthcare
workers, there is already a shortage of surgical masks globally.
If someone is not infected and they keep physical distance and
constantly hand-sanitize, they should be fine. They should wear a
cloth mask or disposable mask outside their homes or in groups
where physical distancing is not possible.`);

group_of_questions.push([
`How long should one wear a surgical mask?`,
`What is the maximum length of time one can wear a surgical mask?`,
`How long can we wear the same surgical mask?`,
`What is the longest time one should wear a surgical mask?`
]);

answers.push(
`Wear surgical masks for a maximum of six hours and change it as
soon as it gets wet or is soiled.`);

group_of_questions.push([
`Can respirators like N95 be re-used and for how long?`,
`Can we reuse N95 respirators and if so for how long?`,
`How can we reuse an N95 mask?`,
`Are respirators reusable?`
]);

answers.push(
`The issue of re-using N95 respirators is evolving very quickly. Studies
are currently being conducted to know how best to decontaminate reusable
masks without damaging the protective properties. Validated
methods for reprocessing masks require very high technology and
they are difficult to apply without expensive equipment. Until more
precise evidence is available it is advisable to dispose the mask if it
gets damaged, becomes difficult to breathe through, or if it has been
in contact with body fluid. There are decontamination guidelines for
N95 respirators here. See also the Africa CDC guidance on mitigating
acute shortage of PPE.`);

group_of_questions.push([
`How can you decontaminate a cloth mask for re-use?`,
'What can one do to decontaminate a cloth mask for re-use?',
`Is there a way to decontaminate a cloth mask?`,
`What can you do to reuse a cloth mask?`
]);

answers.push(
`Wash the cloth mask with soap and water and allow it to dry in the
sun, and if possible use an electric iron to keep it back in shape if the
material is loose.`);

group_of_questions.push([
`What materials are recommended for making cloth masks?`, //  e.g. wool, cotton, polyester
'What are the recommendations for making cloth masks?',
`What is the best way to make cloth masks?`,
`How can one make good cloth masks?`
]);

answers.push(
`Cloth masks should comprise at least three layers of linen and nonwoven
material (like interlining fabric) in-between, but it should not
make breathing difficult. Find out more <a href="https://www.who.int/publications/i/item/advice-on-the-use-of-masks-in-the-community-during-home-care-and-in-healthcare-settings-in-the-context-of-the-novel-coronavirus-(2019-ncov)-outbreak" target="_blank">here</a>.
`);

group_of_questions.push([
`What is the right way to wear a surgical mask?`,
'How should one wear a surgical mask?',
`What is the best way of wearing a surgical mask?`,
`Which way should one wear a surgical mask?`
]);

answers.push(
`Surgical masks must always be worn with the white side inside and
blue or green side on the outside, irrespective of one’s health status.
The mask should cover the mouth and nose and the metal strip
should be at the top and moulded to fit the nose. See Africa CDC
guidance <a href="https://africacdc.org/download/simple-instructions-on-how-to-use-a-face-mask/" target="_blank>How to wear and use a mask.</a>`);

group_of_questions.push([
`How should a used face mask be disposed?`,
`How should we dispose of used face masks?`,
`What should one do with used face masks?`,
`What should we do with medical or surgical masks after use?`
]);

answers.push(
`Single use medical or surgical masks must be destroyed like
medical waste, if possible, with fire in a bag. It is recommended to
cut them into two pieces each to prevent them from being re-used.
Remember to clean the scissors or the blade used in cutting them
with 70% alcohol or alcohol-based hand rub/sanitizer. See methods
of medical waste disposal <a href="https://www.who.int/news-room/fact-sheets/detail/health-care-waste" target="_blank">here</a>.`);

group_of_questions.push([
`Is it advisable to use alcohol spray on N95 masks after use, or to wash and allow it to dry and reuse?`, // , after ensuring proper hand hygiene and storage
`Can we reuse an N95 mask after spraying it with alcohol or washing and drying it?`,
`Is it OK to spray alcohol on N95 masks in order to reuse them?`,
`Can we wash and dry N95 masks?`
]);

answers.push(
`No. Do not spray or wash N95 masks, this will damage the materials
and ruin its protective capability.`);

group_of_questions.push([
`What is the ideal face mask for protecting oneself from COVID-19 infection?`,
`What face mask is ideal for COVID-19 protection?`,
`What is the best mask for protecting against infection?`,
`Which kind of face mask should we use for protection?`
]);

answers.push(
`Wear medical masks when working with patients or at the health
facility. If carrying out an aerosol-generating procedure, then use an
N95 mask. In the community, face covering like cloth mask can be
used if well-made and cleaned properly after each use.`);

group_of_questions.push([
`Is double masking (N95 mask and then a second surgical mask over the N95 mask) recommended?`,
`Is it recommended to wear an N95 mask and a surgical mask over it?`,
`Should we put a surgical mask over a N95 mask?`,
`Is it a good idea to cover an N95 mask with a surgical mask?`
]);

answers.push(
`No, this is not encouraged. You should use a face shield to prevent
splashing into eyes and face. It is one of the options offered to
conserve N95 mask but it places additional burden on surgical
masks which are also in short supply. It also increases breathing
difficulty.`);

group_of_questions.push([
`Do makeup and cream compromise the effectiveness of N95 masks?`,
`Can makeup and cream make N95 masks less effective?`,
`Is it OK to wear makeup and an N95 mask?`,
`Is the effectiveness of N95 masks affected by cream or makeup?`
]);

answers.push(
`If the mask is wet, its effectiveness will be compromised.
Contamination by makeup can damage the inner part of the mask
and make it less effective in protecting against infection. The N
means ‘Not resistant to oil’.`);

group_of_questions.push([
`How much protection does a surgical mask provide?`,
`Do surgical masks provide good protection?`,
`How good is the protection from surgical masks?`,
`Is a surgical mask a good way to provide protection?`
]);

answers.push(
`Surgical mask gives you good protection against droplets if it is fitted
properly, is not compromised and covers your nose and mouth. It
also protects others from your respiratory secretions.`);

group_of_questions.push([
`Why are children less than two years not allowed to wear masks?`,
`Is there a possibility of having special masks for children under two?`, // since they are equally at risk of infection?`
`Should young children wear masks?`,
`Are there masks suitable for very young children?`
]);

answers.push(
`The best way to protect children is to keep them away from hazards
that may put them at risk of getting infected. The risk is very high
when you allow children to use the mask. Children can harm
themselves with the mask or infect themselves with it.`);

group_of_questions.push([
`What kind of mask does the laundry worker require to be safe?`,
`What masks should hospital laundry workers wear?`,
`What PPE is recommended for laundry workers in a hospital?`,
`What equipment should be provided to laundry workers?`
]);

answers.push(
`Medical mask, aprons and heavy-duty gloves are recommended to
protect them from exposure to chemicals.`);

group_of_questions.push([
`Is there any risk of an adverse effect in using the face mask for a prolonged period?`,
`Are there adverse effects from wearing a face mask for a long time?`,
`Are there risks from wearing a mask over several hours?`,
`What risks are there from prolonged use of a mask?`
]);

answers.push(
`It depends on how the mask is worn. It is important to dispose a mask
when it is soiled or when it becomes difficult to breathe through
it. Young children (under two years) and people with breathing
difficulties should not be made to wear a mask. Medical masks and
N95 are tested to make sure that breathing resistance is not too
high.`);

group_of_questions.push([
`What should I do if I am wearing a mask and feel an urge to sneeze?`, // considering the current scarcity of masks?`,
`What if I have to sneeze while wearing a mask?`,
`Is it OK to sneeze into a mask?`,
'Can I sneeze while wearing a mask?'
]);

answers.push(
`The purpose of mask is to collect any droplet from the mouth and
nose and to protect the mouth and nose against droplets from the
outside environment. Sneezing into the mask (and into the elbow)
offer extra protection and is the best option. The mask continues to
be effective until it is soiled.`);

group_of_questions.push([
`How can healthcare workers protect themselves when there is little or no PPE available?`,
`What can health workers do for protection if there is no PPE?`,
`How can we protect healthcare workers when there isn't enough PPE?`,
'What should we do if there is no PPE available?'
]);

answers.push(
`It is a challenging situation when there is limited PPE to enable
compliance to recommendations. However, such situation can
be avoided by preparing and adapting how work is done. When
possible, use reusable PPE that can be decontaminated locally.
Strengthen stockpiling and procurement systems to plan for future
needs as much as possible. Adopt engineering controls such as
the use of plastic screens at reception desks or gates to maintain
physical distancing at entrances or visiting areas. Reusable face
shields and cotton surgical gowns may be decontaminated locally
using the laundry and detergent or disinfectant. This reduces the
need for constant resupply of expensive single use PPE. See the
<a href="https://apps.who.int/iris/handle/10665/331215" target="_blank">WHO rational use of PPE</a> and
<a href="https://africacdc.org/download/strategies-for-managing-acute-shortages-of-personal-protective-equipment-during-covid-19-pandemic/" target="_blank">Africa CDC strategies for managing
acute shortage of PPE</a> for further information.`);

group_of_questions.push([
`Is it advisable to use an additional hood to cover the neck?`, // Staff are not comfortable using a gown because it exposes the neck, 
`Can an additional hood that covers the neck provide more protection?`,
`Should we use a second hood to protect the neck?`,
`Is it recommended to protect the neck with another hood?`
]);

answers.push(
`This is not necessary. If you are working directly with patients and
engaging in aerosol-generating procedures (AGP), the most essential
PPE are the face shield or goggle, face mask and the coverall. We
understand that some people have worked at healthcare facilities
during Ebola outbreaks and are trying to handle COVID-19 the same
way they handled Ebola. However, COVID-19 is different.`);

group_of_questions.push([
`Are shoe covers necessary in isolation wards?`,
`Should one wear shoe covers in isolation wards?`,
`In isolation wards should we wear shoe covers?`,
`Are shoe covers recommended when in an isolation ward?`
]);

answers.push(
`No, they are not necessary, it is impossible to remove them
without flicking contaminants around. Instead of a shoe cover, it is
recommended to use washable-reusable boot or shoes, or a pair of
closed toe shoes that can be decontaminated.`);

group_of_questions.push([
`What are aerosol-generating procedures and what PPE are used?`,
`What PPE should be used with procedures can create aerosols?`,
`What protection is recommended when performing procedures that might generate aerosols?`,
`How can we protect ourselves when doing aerosol-generating procedures?`
]);

answers.push(
`AGP are procedures that allow droplets to be formed into much
smaller aerosols such as intubating or suctioning of patients, and
swab collection. PPE recommended for use during such procedures
are medical gloves, N95 masks, face shield or goggles, and gown or
coverall. See <a href"https://africacdc.org/download/covid-19-guidance-on-use-of-personal-protective-equipment-for-different-clinical-settings-and-activities/" target="_blank">Africa CDC PPE guidance for a detailed list of AGPs</a>.`);

group_of_questions.push([
`Can we use the same area for donning and doffing?`,
`Is it OK to don and doff in the same area?`,
`Is it safe to use the same area for donning and doffing?`,
`Can we don and doff in the same place?`
]);

answers.push(
`Yes, it depends on the design of the HCF and the type of assignment
that is required. However, donning and doffing should not be
performed by different healthcare workers at the same time if the
same area is used for both.`);

group_of_questions.push([
`What is the advice on use of gloves in the community?`,
`Are gloves recommended in the community?`,
`Should people in the community wear gloves?`,
`Is it recommended that community members wear gloves?`
]);

answers.push(
`No need to use gloves in community as this gives a false sense of
protection and it is a misuse of valuable resources. Community use
of gloves may heighten fear in people and, if not properly used, the
gloves can become a source of infection.`);

group_of_questions.push([
`Can healthcare workers change gloves in patients’ room?`,
`Is it ok to change gloves in a patient's room?`,
`Is it safe for healthcare workers to change gloves while in a patient's room?`,
`Can we change gloves while in patients’ room?`
]);

answers.push(
`Yes, just remove them carefully and place them in the medical waste
bin and make sure to have the new gloves close by. Wash your hands
as usual before and after using the glove.`);

group_of_questions.push([
`Is it necessary to always wear a coverall while taking care of COVID-19 patients?`,
`Should coveralls be worn when taking care of COVID-19 patients?`,
`When taking care of covid patients should one wear coveralls?`,
`Are coveralls recommended when taking care of patients?`
]);

answers.push(
`Coveralls are not recommended as body protection. Fluid resistant
gowns are preferred because they are more comfortable and safer
to remove without self-contamination. Coveralls may be used if that
is what is available but staff should be trained to use them properly.`);

group_of_questions.push([
`Is it good practice to change gloves in the period between attending to one patient and another in the isolation ward?`,
`Is it recommended that one changes gloves in the isolation ward when attending to different patients?`,
`When attending to different patients in the isolation ward should you change gloves?`,
`Should gloves be changed when attending to different patients in the isolation ward?`
]);

answers.push(
`Yes, it is always best practice to change gloves in the period
between attending to one patient and another if you have touched
the patient, and for proper hand hygiene as recommended by WHO
‘five moments’.`);

group_of_questions.push([
`Is double gloving indicated for dealing with COVID-19 patients?`,
`Is it recommended to wear double gloves when dealing with covid patients?`,
`Should you double glove when dealing with COVID-19 patients?`,
`Should we wear two pairs of gloves to protect ourselves from covid patients?`
]);

answers.push(
`No, one pair of gloves is sufficient. Remember that this is not Ebola.`);

group_of_questions.push([
`During doffing, when exactly am I expected to remove my respirator?`,
`When should I remove my respirator when doffing?`,
`What order should I remove items when doffing?`,
'During doffing, when should I remove the respirator?'
]);

answers.push(
`There is an order for doing this: first remove the glove and then the
gown, then clean your hands before touching your face to remove
the respirator or mask. Use the straps to remove the mask without
touching it. This principle is based on removing the most heavily
contaminated items first.`);

group_of_questions.push([
`What types of PPE are recommended for use in the community?`,
`What PPE should be used in the community?`,
`What protection should be used in the community?`,
`What is PPE is recommended for use in the community?`
]);

answers.push(
`Cloth mask is enough if there is possibility of being exposed to
infection. However, if the task in the community involves homebased
care, swab taking or evacuation of a COVID-19 positive case,
full PPE as used in HCFs is recommended.
See <a href="https://africacdc.org/download/covid-19-guidance-on-use-of-personal-protective-equipment-for-different-clinical-settings-and-activities/" target="_blank">Africa CDC guidance note for PPE for more info</a>.`);

group_of_questions.push([
`What is the minimum PPE that personnel at the triage area should have?`,
`What is the least PPE that workers should wear in the triage area?`,
`In the triage area, what is the minimum protective equipment?`,
`How little PPE can provide protection in the triage area?`
]);

answers.push(
`Screening involves mostly question and answer, therefore, hand
hygiene and surgical mask should be enough if practised with
physical distancing. When there is need to conduct more testing and
screening with more patients, the use of gown, gloves and possibly
goggles may be necessary depending on the risk assessment. See
<a href="https://africacdc.org/download/covid-19-guidance-on-use-of-personal-protective-equipment-for-different-clinical-settings-and-activities/" target="_blank">Africa CDC PPE guidance for more info</a>.`);

group_of_questions.push([
`How long can one wear the complete PPE for effective protection?`,
`What is the maximum time we can wear complete PPE for good protection?`,
`How long can one wear complete PPE and still be protected?`,
`What is the longest time one can wear complete PPE and stay protected?`
]);

answers.push(
`This depends on many factors, including the climate, the health and
fitness of the healthcare worker, how heavy the workload is, and
many others. The risk of heat illness is real and should be minimised
by carefully planning the workload, supporting healthcare workers
with food and clean water, and providing rest and recuperation areas.`
);

group_of_questions.push([
`Are the Ebola PPE adequate for working in COVID-19 treatment centres?`,
`Can we use Ebola PPE in COVID treatment areas?`,
`Is Ebola PPE OK when treating covid patients?`,
'When treating COVID-19 patients can we use Ebola PPE?'
]);

answers.push(
`Ebola PPE can be used if there is a suspicion for Ebola as some
countries still record suspected viral haemorrhagic fever cases
during the COVID-19 pandemic.`);

group_of_questions.push([
`Is it necessary to change PPE in the period between attending to one patient and another?`, // given that they may be carriers of other pathogens like multi-drug resistant organisms, which can be transmitted through contaminated PPE?`
`Should one change PPE between attending one patient and another?`,
`Is changing PPE recommended before attending to a second patient?`,
`When switching between patients do we need to change PPE?`
]);

answers.push(
`Gloves should be changed before attending to each patient, but
it is not necessary to change the mask and other PPE unless they
have become contaminated with body fluids. Please see the WHO
guidelines for rational use of PPE and Africa CDC guidelines for the
use of PPE for more information.`);

group_of_questions.push([
`How do we handle tea and lunch break, do we need new PPE when coming from break?`,
`Do we need new PPE after taking a tea or meal break?`,
`After taking a meal do we need to use new PPE?`,
'Must we put on new PPE after a lunch break?'
]);

answers.push(
`Yes, please remove ALL PPE when leaving the isolation area and
wash your hands before eating. You must put on a new set of PPE
when returning to the isolation area.`);

group_of_questions.push([
`Should we disinfect gumboots after doffing?`,
`After doffing should we disinfect gumboots?`,
`Do we need to disinfect gumboots after doffing?`,
`Is it necessary to disinfect gumboots after doffing?`
]);

answers.push(
`Yes, but gumboot is not recommended as part of the required PPE
for clinicians for COVID-19 response. It may be used by maintenance
or WASH staff working in COVID-19 treatment centres. It can be
washed with soap and water and dried appropriately after if used.`);

group_of_questions.push([
`What type of disinfectant is effective for COVID-19 prevention?`,
`What disinfectants are good at preventing covid?`,
`What kinds of disinfectant is recommended for neutralising SARS-CoV-2?`,
'To make the coronavirus incapable of infecting what disinfectant should I use?'
]);

answers.push(
`SARS-COV-2 is an enveloped virus; to render it incapable of infecting
others the outer lipid membrane needs to be ruptured. This can be
done by washing thoroughly with soap and water and all classes of
disinfectants as long as they are used in the right concentration and
for the right contact time.`);

group_of_questions.push([
`Is there an added benefit of adding mild disinfectant to water provided for handwashing?`,
`Should we add a disinfectant to water for handwashing?`,
`Is it recommended to add a mild disinfectant to handwashing water?`,
`Is it a good idea to add a disinfectant to water for washing hands?`
]);

answers.push(
`No. Soap and clean water is enough for handwashing. Mild
disinfectants can dry and irritate the hands if used for this purpose,
and this is not required.`);

group_of_questions.push([
`Can PVP-Iodine be used in handwash and hand rub products or even as nasal spray and gargle mouthwash?`,
`Is it recommended to add PVP-Iodine to handwash or hand rub products?`,
`Should we add PVP-Iodine to nasal spray or mouthwash?`,
'Can we use PVP-Iodine in handwash or nasal spray products?'
]);

answers.push(
`No. No study has recommended the use of polyvinylpyrrolidone
(PVP-Iodine) as a hand disinfectant against COVID-19. Also, nasal
spray or any form of mouth wash has not been recommended as
part of the preventive measures. We strongly recommend the usual
handwashing with soap and water or the use of alcohol-based hand
sanitizers.`);

group_of_questions.push([
`How frequently should health facilities be disinfected?`,
`How often should one disinfect health facilities?`,
`What are the recommendations regarding disinfecting health facilities?`,
`What frequency should health facilities be disinfected?`
]);

answers.push(
`Clean the healthcare facility every day and disinfect high-risk areas
once a day or more often than once as the case may be. Specific
areas within health facilities should be cleaned more or less
frequently according to the risk they pose. Please see the <a href="(https://apps.who.int/iris/bitstream/handle/10665/331695/WHO-2019-nCov-IPC_PPE_use-2020.3-eng.pdf" target="_blank">WHO
guidelines on cleaning and disinfection</a>, and <a href="https://africacdc.org/download/guidance-on-environmental-decontamination/" target="_blank">Africa CDC guidance
on environmental decontamination</a> for more precise information.`);

group_of_questions.push([
`How can we disinfect door handles and wall tiles within the hospital setting?`,
`How should hospital door handles and wall tiles be disinfected?`,
`What are the recommendations for disinfecting walls and door handles in hospitals?`,
`What is recommended to disinfect hospital door handles?`
]);

answers.push(
`Door handles are high touch surfaces and should be cleaned
and disinfected regularly. Tiles and walls should also be cleaned
according to a regular programme of environmental hygiene.
Please see the <a href="(https://apps.who.int/iris/bitstream/handle/10665/331846/WHO-2019-nCoV-IPC_WASH-2020.3-eng.pdf?ua=1" target="_blank">WHO guidelines on cleaning and disinfection</a>, and
<a href="https://africacdc.org/download/guidance-on-environmental-decontamination/" target="_blank">
Africa CDC guidance on environmental decontamination</a>0.1 for further
information.`);

group_of_questions.push([
`Does handwashing with soap kill the virus?`, // or does it only help get rid of the virus from hands?`
`Does soap inactivate the virus?`,
`Can we deactivate the virus by washing our hands with soap?`,
`Does washing hands with soap destroy the virus?`
]);

answers.push(
`Yes, handwashing deactivates the virus by disrupting the outer
membrane or the viron and flushes out any remaining virus during
rinsing. Soap and water and 70% alcohol are the most effective
in killing the virus but alcohol-based hand rub should be used on
visibly clean hands.
In areas with limited access to clean water for handwashing,`);

group_of_questions.push([
`What other alternatives can be prescribed for hand hygiene?`,
`What alternatives are there to washing hands with soap?`,
`How can one sanitize hands without soap?`,
`What options are there for hand hygiene other than soap?`
]);

answers.push(
`Seventy percent alcohol or hand sanitizer is the best option but the
hands should not be visibly soiled or dirty.`);

group_of_questions.push([
`What comes first cleaning or disinfection?`,
'Should one clean or disinfect first?',
'What order should one clean and disinfect?',
'Does it matter whether you clean or disinfect first?'
]);

answers.push(
`Cleaning the environment first to remove dirt and then disinfect.`);

group_of_questions.push([
`What kind of disinfectants can be used to clean and disinfect public places?`,
`What can one use to clean and disinfect public places?`,
`What is recommended for cleaning and disinfecting?`,
'How should we clean and disinfect surfaces?'
]);

answers.push(
`Thorough cleaning with soap and water is adequate in most
circumstances. For high touch surfaces and healthcare settings this
may be followed by the use of a disinfectant such as Dettol, GQPlus,
Cleanline, etc. Chlorine solution (0.1%) can also be used. Please
see <a href="https://africacdc.org/download/guidance-on-environmental-decontamination/" target="_blank">Africa CDC guidance on environmental decontamination for
more information</a>.`);

group_of_questions.push([
`What concentration of sodium hypochlorite is recommended for hospital use with the current pandemic?`,
`How much should we dilute sodium hypochlorite for hospital use?`,
`What is the recommended level of dilution for sodium hypochlorite in a hospital?`,
`In a hospital setting what concentration of chlorine high test hypochlorite is recommended?`
]);

answers.push(
`Chlorine high test hypochlorite or chlorine bleach solution should
be diluted to 0.1% concentration for surface disinfection and 0.05%
for soaking clean laundry if needed. Solution of 0.5% should only be
used for body fluid spills (<a href="https://africacdc.org/download/guidance-on-environmental-decontamination/" target="_blank">as per usual recommendations</a>).`);

group_of_questions.push([
`How do we clean computer keyboards?`, //  if keyboard covers are not available
`What is the recommendation for keeping keyboards clean?`,
`How should we clean the computer keyboards?`,
`What is the best way to keep keyboards clean?`
]);

answers.push(
`Wipe down with a damp cloth or tissue slightly soaked with 70%
alcohol or other non-corrosive disinfectant.`);

group_of_questions.push([
`How can we disinfect commonly used items like mobile phones, money, wallets, etc?`,
`What is a good method for disinfecting phones?`,
`What is recommended for disinfecting money?`,
`How should we disinfect phones, wallets, and other common items?`
]);

answers.push(
`Same as computer. Wipe down with a damp cloth or tissue slightly
soaked with 70% alcohol or other non-corrosive detergent or
disinfectant mix.`);

group_of_questions.push([
`Which are the low-touch and which are the high-touch areas in the hospitals?`,
`What is the difference between high-touch and low-touch hospital areas?`,
`Which areas in a hospital are low-touch and which are high-touch?`,
`What hospital areas are considered high-touch versus low-touch?`
]);

answers.push(
`Low-touch areas include areas like walls, top of cupboards and areas
we normally do not touch every time. High-touch areas are beds,
bedsides, tables, cell-phones, door handles, objects that are close
to us like taps, glasses, etc. High-touch surfaces vary in different
settings but include surfaces like door handles, bed rails, computer
keyboards, and elevator buttons, that are touched frequently by
different people. Look at your facility to identify all the high-touch
surfaces and make sure they are cleaned frequently.`);

group_of_questions.push([
`Is there guidance on cleaning of airports and seaports?`, // as we begin to ease country lockdowns
`What is recommended for cleaning ports?`,
`How should one clean an airport?`,
`What is the best way of cleaning air and sea ports?`
]);

answers.push(
`It is recommended to clean everywhere thoroughly and regular
with detergent and water and disinfect high-touch areas (see the
high-touch areas above). Make sure there is a clear programme for
cleaning all areas of the facility and that cleaners have been well-trained
and equipped. There should be proper supervision and audit
to maintain standards. There should be a clear line of accountability
for cleaning so that everyone in the cleaning team understands their
responsibilities.`);

group_of_questions.push([
`What method is recommended for environmental cleaning in COVID-19 setting, floor cloth or mopping?`,
`Is there guidance about the best way to clean floors?`,
`Is it better to use a mop or floor cloth for environmental cleaning?`,
`Which method is best for cleaning floors in a covid setting?`
]);

answers.push(
`Either method can be used but the floor cloth or mop should be
properly cleaned after use. It is best practice to use different cleaning
equipment for different areas such as toilet, kitchen, isolation ward,
and general wards.
Mop head: This can be decontaminated by laundering it with
detergent and water above 600C or laundering at a lower temperature
and followed by soaking for 10 minutes in 0.5% chlorine solution.
Floor cloth: Laundry could be done with hot water (60°C) using
regular laundry detergent or normal water (at room temperature)
and chlorine solution (0.05%).`);

group_of_questions.push([
`How should screening instruments such as stethoscopes and blood pressure machine cuffs be disinfected?`,
`What guidance is there regarding disinfecting screening instruments?`,
`How should you disinfect stethoscopes?`,
`How should one disinfect the cuffs on blood pressure machines?`
]);

answers.push(
`Wipe down the instrument with damp cloth or tissue paper slightly
soaked with 70% alcohol solution. Chlorine or other oxidising
disinfectant is not ideal for sensitive medical equipment because it
is corrosive and may irritate patients’ skin.`);

group_of_questions.push([
`Is there any need for special cleaning of bathrooms or restrooms?`,
`Do bathrooms need any special cleaning?`,
`What is recommended for cleaning restrooms?`,
`Is there anything special we should do to clean restrooms?`
]);

answers.push(
`Normal regular cleaning with soap and water. Disinfect the door
handles, taps, toilet seats, flush button, etc. with virucidal disinfectant
such as Dettol, GQ-Plus, Cleanline, etc. or with 0.1% chlorine solution.`);

group_of_questions.push([
`How should medical waste from isolation facilities be treated?`,
`How should we handle medical waste from isolation areas?`,
`What is recommended for disposal of isolation facility medical waste?`,
`What is the best practice for disposing of medical waste from the isolation wards?`
]);

answers.push(
`Guidelines for waste management of medical waste could be found
<a href="https://www.who.int/news-room/fact-sheets/detail/healthcare-waste" target="_blank">here</a>.`);

group_of_questions.push([
`What about chlorine handwashing?`,
`Should we clean hands with chlorine?`,
`Is chlorine is agood way to disinfect hands?`,
`What is the recommendation regarding chlorine for washing hands?`
]);

answers.push(
`This is a poor third choice to alcohol-based hand rub and soap and
water. It should only be used in emergency when none of these
products is available. The chlorine concentration for hand rinsing
is 0.05% and this should be prepared fresh every day. The chlorine
concentration diminishes quickly if the water used is not clear, if it is
kept without a lid, or if exposed to sunlight.
Instructions for making the solution can be found <a href="https://www.cdc.gov/coronavirus/2019-ncov/global-covid-19/makehandwashing-
solution.html" target="_blank">here</a>.`);

group_of_questions.push([
`What is the recommended disinfectant for terminal cleaning?`,
`How should we disinfect terminals?`,
`What is the recommendation for disinfecting terminals?`,
'What should we use to disinfect terminals?'
]);

answers.push(
`If you use chlorine as a surface disinfectant after cleaning with
detergent and water, use 0.1% solution a recommended by WHO,
ICAN and US-CDC.`);

group_of_questions.push([
`How long should the staff wait before using a room after chlorine disinfection?`,
`How soon after disinfecting a room with chlorine can it be used?`,
`When we use a room after using chlorine disinfection?`,
`How long does it take for a room to be useable after disinfected with chlorine?`
]);

answers.push(
`It takes about one minute to deactivate SARS-CoV2 after disinfection
with 0.1% chlorine. It is best to wait until the surfaces have dried
naturally before reusing furniture and equipment. Spraying of chlorine
solution is not recommended.`);

group_of_questions.push([
`Does routine laundry and air-drying sufficiently decontaminate linens?`,
`Are linens decontaminated after washing and drying in the air?`,
`Is laundry and air-drying enough to disinfect linens?`,
'Can ordinary laundry decontaminate lines?'
]);

answers.push(
`Yes. Laundry could be done with hot water (60°C) using regular
laundry detergent or at a lower temperature, followed by ironing with
a hot iron, or soaking in a solution of 0.05% chlorine for 10 minutes
and then rinsing with water.`);

group_of_questions.push([
`How effective is fumigating surfaces like beds and mattresses?`, // in the control of COVID-19
`Should we fumigate beds and mattresses?`,
`Is fumigating beds recommended?`,
`How should we disinfect mattresses?`
]);

answers.push(
`Clean surfaces with soap and water, then wipe with any common
virucidal disinfectant such as Dettol, or 0.05% chlorine solution.
Spraying of chlorine solution is not recommended.`);

group_of_questions.push([
`In the management of COVID-19 patients, is it recommended to spray healthcare workers with disinfectant before doffing full PPE?`,
`Should healthcare workers be sprayed before doffing?`,
`What is the recommendation regarding spraying with a disinfectant before doffing the PPE?`,
`Should we spray workers before they doff the PPE with a chlorine solution?`
]);

answers.push(
`Spraying of chlorine solution on the healthcare worker is not
recommended. It is unacceptable practise. WHO, Africa CDC and
ICAN strongly advise against spraying of individuals or environment
under any circumstance. Spraying with chemical disinfectants is
physically harmful and does not limit the spread of COVID-19.`);

group_of_questions.push([
`I see videos from many countries of spraying streets with disinfectant, is this something we should do to control the spread of COVID-19?`,
`Should streets be sprayed with disinfectant?`,
`Is it a good idea to spray streets with disinfectants?`,
'Is it recommended that streets be sprayed with disinfectants?'
]);

answers.push(
`Spraying chemicals into the environment is not an effective way
of controlling COVID-19. Human beings should not be sprayed to
decontaminate them because many chemical disinfectants are toxic
and can cause irritation of the respiratory tract or environmental
pollution.
The key point to remember is that respiratory droplets may settle on
horizontal surfaces and on high-touch surfaces such as door handles
and handrails. These surfaces should be cleaned regularly with
detergent and water to remove physical dirt, after which they should
be disinfected by wiping with disinfectant. Surfaces like street floors,
pavements or walls in open areas do not contribute significantly to
COVID-19 transmission. Keeping a physical distance of at least 1 m
and performing respiratory and hand hygiene are more effective
than spraying disinfectants to limit the spread of COVID-19 in public
places.`);

group_of_questions.push([
`Is it advisable to repurpose places like stadiums, hostels and schools to serve as COVID-19 treatment centres?`,
`What are the recommendations regarding using public buildings as covid treatment centres?`,
`Is it a good idea to repurpose stadiums as treatment centres?`,
`Should public buildings be used as treatment centres?`
]);

answers.push(
`Because of the need for more space, such areas can be used if they
are prepared properly with adequate spacing, enough PPE and
proper cleaning is guaranteed. There are guidelines and standards
to follow in doing this.`);

group_of_questions.push([
`Can air-conditioners be used in COVID-19 treatment centres?`,
`Is it safe to use air conditioners in treatment centres?`,
`Is it OK for treatment centres to run air conditioners?`,
`Is the running of air conditioners in treatment areas safe?`
]);

answers.push(
`Yes, but in a specialised way to prevent blowing of air across the
lower area of the room which could help transport droplets from
one patient to the other. In many treatment centres where air conditioners
are used, the air outlet is often directed into the ceiling
chamber of the room and the cool air circulates from the ceiling
area into the room. If used incorrectly air-conditioners may become
vectors for COVID-19 transmission.`);

group_of_questions.push([
`What is the recommended way to cool isolation units?`, //  in the tropics
`How should we keep isolation units cool?`,
`What is recommended about keeping isolation wards cool?`,
`What are good ways of cooling the isolation units?`
]);

answers.push(
`A desk fan which is directed towards the window in a way that it does
not carry droplets from one patient to the other is recommended.
The use of surgical masks while working in HCFs is highly
recommended. Natural ventilation such as opening windows may
be the best option if that is possible and provides enough air. If not,
using air-conditioners in a way that prevents blowing of air across the
lower area of the room may be a better option.`);

group_of_questions.push([
`Is there a need for HEPA filter in isolation rooms, triage areas, swapping rooms and care areas of COVID-19 patients?`,
`Should we use HEPA filters in treatment centres?`,
`Are HEPA filters recommended in isolation areas?`,
`Should triage areas use HEPA filters?`
]);

answers.push(
`Not necessarily. This will disrupt the natural ventilation that is used
in most room layouts. In some high-income settings with specialist
or handling units, HEPA filters are used in positive and negative
pressure isolation rooms.`);

group_of_questions.push([
`Can a toilet be shared in a quarantine facility?`, // If yes, what is the ratio of toilet to persons in this situation?`
`In a quarantine area can toilets be shared?`,
`Is it OK to share toilet facilities in quarantine?`,
`What is recommended regarding sharing of toilets in quarantine?`
]);

answers.push(
`In ideal circumstances, each person or household should have ensuite
facilities during quarantine or isolation. This is because families
in quarantine may have other diseases than COVID-19. However,
toilets can be shared if necessary but there must be hand hygiene
facility and the toilets should be cleaned frequently. Patients should
be educated on how to protect themselves against infection within
the area. <a href="https://wash.unhcr.org/download/covid-19-wash-technical-brief/" target="_blank">WHO and UNICEF jointly recommend one toilet for a
maximum of 20 patients.</a>`);

group_of_questions.push([
`Should visitors be allowed to visit the isolation facilities?`,
`Should visits to isolation areas be allowed?`,
`What is recommended about visitors to isolation facilities?`,
`Should isolation areas be off-limits to visitors?`
]);

answers.push(
`Visits to isolation centres should be restricted. If visitors must enter
the wards, they should be trained and supervised to keep themselves
and the patients safe. Provide areas for them to wear PPE. If they are
just visiting to see a family member in the isolation area and they can
see each other without getting close or touching anything, and they
can maintain physical distancing, they should only wear the face
mask and perform hand hygiene.
Engineering controls such as the use of Perspex screens and visiting
areas with 2 metre distance from the patient may facilitate hospital
visiting. We should also consider the risk of the family members
travelling via shared public transport and existing travel restrictions.`);

group_of_questions.push([
`Can opening windows during transportation help prevent the spread of COVID-19?`, // by bus, taxi, train, etc. 
`During transport do open windows help prevent transmission of covid?`,
`What is recommended regarding open windows in public transport?`,
'Should windows be open to prevent transmission while in a bus or train?'
]);

answers.push(
`Opening windows will ensure ventilation, but if the people cannot
maintain physical distancing, cloth masks should be used for the
period they are in the bus or taxi. Hand hygiene and cleaning of
face mask must be done afterwards and the passengers should
avoid touching their faces. Clear public health messaging should
be created for people who use the public transport. Please refer to
<a href="https://africacdc.org/download/covid-19-guidance-for-transportation-sector/" target="_blank">
Africa CDC guidance for transportation sector</a>.`);

group_of_questions.push([
`What is the recommendation for homecare for confirmed mild cases of COVID-19?`, // Is this effective in our setting?
`What is recommended regarding homecare for mild cases?`,
`Is homecare ok for confirmed mild cases of covid?`,
`For mild cases is homecare safe?`
]);

answers.push(
`If we adhere to the guidelines given by WHO, homecare of confirmed
mild COVID-19 cases can be effective. Ensure regular hand hygiene
and cough etiquette with reduced closed contact with the infected
person. Conduct follow-up consultation with the doctor via phone if
anything happens or changes.`);

group_of_questions.push([
`How do we address staffing problems in settings with high HIV infection rates where healthcare workers are affected and fall within the vulnerable group that should not work in COVID-19 isolation facilities?`,
`What is the recommendation for vulnerable healthcare workers?`,
`What should staff with underlying conditions do?`,
`Should vulnerable staff work with covid patients?`
]);

answers.push(
`Allow staff with underlying conditions to look after non-COVID-19
patients or ensure that they wear the correct PPE and perform hand
hygiene often for their safety.`);

group_of_questions.push([
`What extra precautions do you advise healthcare workers to observe when they arrive home from their workstations to protect their families against COVID-19 infection?`,
`What can healthcare workers do when they come home?`,
`What are best practices to protect the families of staff?`,
`What can staff do to protect their families when they return home?`
]);

answers.push(
`It is recommended that healthcare workers should not have direct
contact with family members when working at isolation or treatment
centres. If the family is staying within the hospital premises as is the
case in some countries, the HCW should use a separate room, practise
hand hygiene, and maintain physical distance whenever there is a
need to see a family member. They should clean their clothes and the
areas where they stay properly.`);

group_of_questions.push([
`How often or at what stage should frontline workers be advised to go for test while caring for COVID-19 patients?`,
`When and how often should frontline workers be tested while caring for covid patients?`,
`What is recommended about testing of frontline workers caring for COVID-19 patients?`,
`When should an HCW get tested and how often?`
]);

answers.push(
`Quarantine is recommended when an HCW completes a round of
shift before reuniting with family. This varies from country to country.
A round of shift may be a week in some countries and 2-3 weeks in
other countries. Laboratory test is recommended at the end of the
quarantine period even if there is no sign or symptom of COVID-19.
If a healthcare worker shows any signs or symptoms of COVID-19
they should be tested and should remain isolated until the results are
known. Regular health surveillance of HCWs is important to detect
symptoms early.`);

group_of_questions.push([
`Is it possible for health workers to contract COVID-19 through their clothes after leaving the isolation centre?`,
`Is there a risk of transmission to healthcare workers from their clothes after leaving an isolation area?`,
`Can a health worker contract covid after leaving an isolation centre from their clothing?`,
`Might a healthcare worker's clothes transmit covid after working in an isolation area?`
]);

answers.push(
`No, unless they have physical contact with mucous membranes. The
virus can last on surfaces, but does not have good stability on soft dry
surfaces like clothing. Regular washing of clothes is recommended.`);

group_of_questions.push([
`What are the most common risk factors for contracting COVID-19 by healthcare workers?`,
`What are the risks to healthcare workers of COVID-19?`,
`What are the common risks to health workers from covid?`,
`How might healthcare workers contract covid?`
]);

answers.push(
`Studies have identified lack of IPC knowledge, sometimes because
of inadequate IPC training, fear (anxiety) while on duty, insufficient
or inappropriate use of PPE, and ignoring standard and other
precautions. Others include long-term exposure to a large number
of infected patients, using substandard PPE, recurrent activities
and engagement in high-risk roles such as aerosol-generating
procedures like intubating patients, and handling coughing and
restless patients without adequate and correct PPE. HCWs are
also at risk of being infected outside work, especially when there is
widespread community transmission e.g. on public transport. There
could also be transmission to and from colleagues (if they have mild
or asymptomatic infection). Therefore, healthcare workers should
prioritise hand hygiene and physical distancing during handovers
and when taking meal breaks (especially as masks cannot be worn
while eating).`);

group_of_questions.push([
`What are the IPC recommendations for handling COVID-19 corpses?`,
`How should covid corpses be handled?`,
`What are the recommendations regarding COVID-19 corpses?`,
`What are the best ways of handling covid corpses?`
]);

answers.push(
`There is no evidence that COVID-19 corpses are still infectious. The
corpse can be handled normally, especially if you have plugged
all openings. Ensure that handlers of corpses use PPE. There is a
theoretical risk of droplet transmission during movement of bodies as
air may be mechanically exhaled. If aerosol-generating procedures
have been performed in the room before the patient died, the room
must be well ventilated before airborne precautions (N95) can be
removed.`);

group_of_questions.push([
`Is it safe to care for corpses of family members who died of COVID-19?`,
`Is it risk of transmission from corpses of family members who died of covid`,
`Does the corpse of a family member who died of covid provide risks of transmission?`,
`Can covid be transmitted from the corpse of a family member?`
]);

answers.push(
`COVID-19 is not commonly transmitted through contact with
dead bodies. SARS-CoV-2 is a respiratory pathogen so when
an infected person dies and stops breathing or coughing the risk
of transmission reduces. However, transmission may still occur in
some circumstances. During movement of the body, e.g. washing or
wrapping in a shroud may pose a risk of respiratory droplets being
expelled from the mouth or nose. There is also a risk of contact
with surfaces contaminated around the body when the person was
breathing and coughing.
If AGPs have been conducted, the room should be well ventilated for
at least one hour before anyone accesses it (airborne precautions
are not needed). If family members are involved in the preparation of
the body, they should wear appropriate PPE to protect their skin and
mucous membranes from contact with any respiratory droplets or
environmental contamination. Once the body has been prepared and
the room cleaned and well ventilated it is safe for family members to
approach the body to view it and say prayers. It is not recommended
to allow family to kiss the body or the shroud, but they may touch
it (i.e. holding the hand) if hand hygiene is performed immediately
afterwards.
It is important for authorities to support families in saying goodbye to
their loved ones and this should be facilitated through education and
supervision of physical distancing at funerals, as well as provision of
hand hygiene materials and PPE if required. Messages about hand
hygiene and avoiding face touching should be reinforced at every
opportunity during the funeral arrangement.`);

group_of_questions.push([
`Why is there inconsistency and divergent views about physical distancing, 1 meter, 1.5 meter, 6 feet and 2 meter?`,
`What distance should be maintained for physical distancing?`,
`What is the definition of physical distancing?`,
`Is physical distancing 1 or 2 meters?`
]);

answers.push(
`The aim of physical distancing is to reduce the chance of droplets
from a person speaking, coughing or sneezing from dropping on
another person. Most droplets are heavy and will fall to the ground
within 1 meter, but smaller droplets can travel further, up to 2 meter. Very few
droplets can travel even further than that, they are very few that the
risk of transmission is very small. It is important to maintain physical
distance of 1 meter as a minimum. In some areas it is possible to maintain
physical distance of 2 meter and a more precautionary approach is
advised. It is important to comply with the recommendations in
your area as this will take into consideration your specific local
circumstances.`);

group_of_questions.push([
`Among internally displaced persons setting where overcrowding is inevitable, how do we ensure IPC measures?`,
`What is recommended when overcrowding cannot be avoided?`,
`What should be done to to reduce transmission when overcrowding is unavoidable?`,
`How should unavoidable overcrowding be safely handled?`
]);

answers.push(
`Wearing masks and hand hygiene are strongly recommended,
regular cleaning of the environment with soap and water should
be considered. Spraying of disinfectant should be avoided. Perform
hand hygiene after touching the masks and ensure that the masks
(cloth masks) are washed every day. If a person is sick, others should
keep distance from them, wear mask and seek medical attention
immediately if the health condition does not improve. Healthy eating
and physical exercise are recommended because this can help the
body to fight diseases. Exposure to sunlight for some hours every
day can also help.`);

group_of_questions.push([
`What are the IPC considerations for pharmacies and patent medicine vendors who attend to ill patients?`,
`What is recommended for pharmacists who interact with ill patients?`,
`What should medicine vendors do who are in contact with patients?`,
`How can pharmacists reduce their risks of transmission from their patients?`
]);

answers.push(
`Wearing masks and regular hand hygiene are strongly recommended
after every transaction. Regular cleaning of the highly touched
areas with disinfectant should be encouraged. Physical distancing
between the patient, other customers and the person dispensing is
recommended as well.`);

group_of_questions.push([
`What is the most effective protective measure for the community in African context?`,
`What is the best way to protect communities in Africa?`,
`What are the recommendations for protecting African communities?`,
`What are the best practices for communities in Africa to reduce transmission?`
]);

answers.push(
`Based on current evidence, physical distancing, hand washing or
sanitising, wearing a mask and cleaning of the environment with
soap and water is recommended. Social gathering and cultural
ceremonies should be avoided or reduced. All the cultural norms
such as kissing children or the elderly should be avoided. As our
knowledge of the virus improves, this advice may be tailored more
precisely.`);

group_of_questions.push([
`What are the important precautions during and after shopping?`,
`How can one reduce the risk of shopping?`,
`What are the recommendations for safer shopping?`,
`How can shopping be made safer?`
]);

answers.push(
`Wearing masks and regular hand hygiene are recommended.
Regular cleaning of the highly touched area with disinfectants should
be considered too. Physical distancing between the shoppers and
between the cashiers and the shoppers is recommended.`);

group_of_questions.push([
`What is the difference between quarantine and isolation?`,
`How does quarantine and isolation differ?`,
`Are isolation and quarantine the same thing?`,
`Is there a difference between quarantining and isolating?`
]);

answers.push(
`Quarantine and isolation are public health practices used to protect
the public by limiting people’s exposure to people who have or may
have a contagious disease such as COVID-19. Isolation separates
sick people with a contagious disease from people who are not sick
while quarantine separates and restricts the movement of people
who have been exposed to an infectious disease such as COVID-19
to see if they become sick. These people may have been exposed
to an infectious disease without knowing it, or they may have the
disease but do not show symptoms as at the time.`);

Math.seedrandom(259); // so the paraphrases are shuffled in exactly the same way each time this is run

group_of_questions.forEach((group) => {
    tf.util.shuffle(group);
});

return {group_of_questions, answers};

};
