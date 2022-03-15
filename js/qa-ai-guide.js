
window.create_paragraphs = () => {
    window.paragraphs = Array.from(document.getElementsByTagName('p')).map(x => x.innerText);
    paragraphs = paragraphs.filter(paragraph => paragraph.length > 100);
};

window.create_sentences = () => {
    const sentences_in_a_paragraph = paragraphs.map(paragraph => 
                                        paragraph.split(/[.?] /) // including ! causes problems due to Snap!
                                        .filter(sentence => (sentence.length > 25 && sentence.trim()[0] !== '(')) // remove short or parenthetical sentences
                                        .map(sentence => sentence.replaceAll('\n',' ').trim()));
    const join_fragments = (fragments) => {
        let new_sentences = [];
        for (let i = 0; i < fragments.length; i++) {
           const fragment = fragments[i];
            const suffix = i === fragments.length-1 ? '' : '. '; // don't add period to last sentence
            if (fragment.lastIndexOf('e.g') === fragment.length-'e.g'.length ||
                fragment.lastIndexOf('..') === fragment.length-'..'.length) {
                new_sentences.push(fragment + suffix + fragments[i+1] + suffix.trim()); // shouldn't been broken
                i++;
            } else {
                new_sentences.push(fragment + suffix.trim());
            }
        }
        return new_sentences;
    };
    window.sentences = sentences_in_a_paragraph.map(join_fragments);
};

window.create_use_model = (continuation) => {
    use.load().then(model => {
        window.use_model = model;
        continuation();
    });
};

window.create_embeddings = () => {
    create_paragraphs();
    create_sentences();
    window.embeddings = [];
    const embed_a_paragraph = (index) => {
        if (index < sentences.length) {
            use_model.embed(sentences[index]).then(embeddings_tensor => {
                embeddings.push(embeddings_tensor.arraySync());
                embeddings_tensor.dispose();
                console.log(embeddings);
                embed_a_paragraph(index+1);
            })
        }
    }
    embed_a_paragraph(0);   
};

window.create_classifier = () => {
    window.classifier = knnClassifier.create();
    embeddings.forEach((paragraph_of_sentences, paragraph_number) => {
        paragraph_of_sentences.forEach(sentence => {
            classifier.addExample(tf.tensor(sentence), paragraph_number);
        });
    });
};

window.test = () => {
    const questions = 
        ['What are word embeddings?',
         'How are embeddings made?',
         'How can I create a sentence embedding?',
         'What is the sentence features block?'];
    const k = 5;
    window.classifications = [];
    const classify = (index) => {
        if (index < questions.length) {
            use_model.embed(questions[index]).then(question_tensor => {
                classifier.predictClass(question_tensor, k).then(classification => {
                    const results = [questions[index]];
                    let confidences = Object.entries(classification.confidences).filter(([index, confidence]) => confidence > 0);
                    confidences.sort((a, b) => b[1] - a[1]);
                    confidences.forEach(([index, confidence]) => {
                                          results.push(paragraphs[index]);
                                          results.push(confidence);
                    });
                    classifications.push(results);
                    question_tensor.dispose();
                    classify(index+1);
                });
            });
        } else {
            console.log(classifications);
        }
    };
    classify(0);
};

create_paragraphs();
create_classifier();
create_use_model(test);
