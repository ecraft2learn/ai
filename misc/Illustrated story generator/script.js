const apiForm = document.getElementById('api-form');
const apiKeyInput = document.getElementById('api-key');
const storyPromptLabel = document.getElementById('story-prompt-label');
const storyPromptInput = document.getElementById('story-prompt');
const content = document.getElementById('content');

const popup = document.createElement("div");
popup.classList.add("popup");

// Display a popup with instructions
function showInstructionsPopup() {
  popup.innerHTML = `
    <h2>Instructions</h2>
    <p>To generate a story, enter a brief description of the story you want in the text area below, and set the desired number of paragraphs (default is 3). Then click "Generate Story." The AI will create a story with corresponding illustration descriptions for each paragraph.</p>
    <p>Once the story is generated, you can click on any paragraph to receive a list of constructive criticisms from the AI. Each criticism will appear as a button above the paragraph. Click on a criticism button to rewrite the paragraph following the chosen criticism. The criticism button will be removed after rewriting.</p>
    <p>If you prefer to provide your own criticism, click on the "Add your own criticism" button. A text input field will appear, where you can type your criticism. After entering your criticism, click "Submit," and the AI will rewrite the paragraph following your input.</p>
    <p>To close the list of criticism buttons, click on the "Close" button that appears alongside them.</p>
    <p>You can click on an image to replace it with another one. The AI will generate a new illustration based on the corresponding illustration description.</p>
    <button>x</button>
  `;
  document.body.appendChild(popup);
  popup.querySelector("button").addEventListener("click", () => popup.classList.add("hidden"));
}

// Function to generate story paragraphs and illustration descriptions using the GPT-4 Chat API
async function generateStoryAndDescriptions(apiKey, prompt, numberOfParagraphs) {

  const url = 'https://api.openai.com/v1/chat/completions';

  const promptWithSeparators = `Create a ${numberOfParagraphs}-paragraph long story about ${prompt}. For each paragraph, also provide a short description for an illustration that corresponds to the paragraph's content, including the kind of medium, artistic style, mood, point of view, lighting, and the like. Use the format [PARAGRAPH] for story paragraphs and [ILLUSTRATION_DESCRIPTION] for illustration descriptions.\n\n[PARAGRAPH]`;

  const requestBody = {
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: promptWithSeparators,
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorMessage = `Error: ${response.status} ${response.statusText}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const responseData = await response.json();
  const storyAndDescriptions = responseData.choices[0].message.content.trim().split(/(\[PARAGRAPH\]|\[ILLUSTRATION_DESCRIPTION\])/).filter(item => item.trim() !== '' && item !== '[PARAGRAPH]' && item !== '[ILLUSTRATION_DESCRIPTION]');

  recordPromptAndCompletion(promptWithSeparators, responseData.choices[0].message.content.trim()); // added manually
  
  const paragraphs = [];
  const illustrationDescriptions = [];

  for (let i = 0; i < storyAndDescriptions.length; i++) {
    if (i % 2 === 0) {
      paragraphs.push(storyAndDescriptions[i]);
    } else {
      illustrationDescriptions.push(storyAndDescriptions[i]);
    }
  }
  
  // // Additional request for font suggestion
  // const fontSuggestionRequest = {
  //   model: "gpt-4",
  //   messages: [
  //     {
  //       role: "user",
  //       content: promptWithSeparators,
  //     },
  //     {
  //       role: "user",
  //       content: "Please suggest a single font name that matches the style and mood of the story without any additional explanation.",
  //     },
  //   ],
  // };

  // const fontSuggestionResponse = await fetch(url, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${apiKey}`,
  //   },
  //   body: JSON.stringify(fontSuggestionRequest),
  // });

  // // Extract the first font name
  // const fontRegex = /([\w\s-]+)(?=,)/;
  // const fontSuggestionMatch = responseData.choices[0].message.content.match(fontRegex);
  // const fontSuggestion = fontSuggestionMatch ? fontSuggestionMatch[0] : 'Garamond';

  return [paragraphs, illustrationDescriptions]; //, fontSuggestion];
}

async function handleImageClick(img, apiKey, descriptions) {
  const index = img.dataset.index;
  const alternativeImageURL = await generateImage(`${descriptions[index]} - Unique ID: ${Date.now()}${index}`, apiKey);

  img.src = alternativeImageURL;
}

async function generateImage(description, apiKey) {
  showLoadingIndicator('Generating image...'); // didn't bother GPT-4 to insert this
  const url = 'https://api.openai.com/v1/images/generations';
  const requestBody = {
    prompt: description,
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorMessage = `Error: ${response.status} ${response.statusText}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const responseData = await response.json();
  
  hideLoadingIndicator();

  recordPromptAndCompletion(description, responseData.data[0].url); // added manually
  
  return responseData.data[0].url;
}

// Function to display GPT-4 responses in a dismissable popup
function displayPopup(content) {
  const popup = document.getElementById('response-popup');
  const contentElement = document.getElementById('response-content');
  const closeButton = document.querySelector('.close-popup');

  contentElement.textContent = content;

  popup.style.display = 'block';

  closeButton.onclick = () => {
    popup.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target === popup) {
      popup.style.display = 'none';
    }
  };
}

// Function to display the story and images on the page
async function displayStoryAndImages(apiKey, storyPrompt) {
  try {
    // Show the loading message
    const loadingMessage = document.getElementById('loading-message');
    loadingMessage.style.display = 'block';

    const numberOfParagraphs = parseInt(document.querySelector('#number-of-paragraphs').value) || 3;
    const [storyParagraphs, descriptions] = await generateStoryAndDescriptions(apiKey, storyPrompt, numberOfParagraphs); // , fontSuggestion

    // Hide the loading message
    loadingMessage.style.display = 'none';

    content.innerHTML = '';

    // I only copied the following 3 lines from a longer not very good definition
    // Get the user's input from the textarea
    const userInput = document.querySelector('#story-prompt').value;

    document.querySelector('h1').textContent = userInput;
    document.title = `${userInput} - Illustrated Story Generator`;

    for (let i = 0; i < storyParagraphs.length; i++) {
      const paragraph = document.createElement('p');
      paragraph.classList.add('story-paragraph');
      paragraph.addEventListener('click', (event) => {
        getConstructiveCriticisms(apiKey, event.target, storyParagraphs.indexOf(event.target.textContent), storyParagraphs); // was paragraphs
      });
      paragraph.textContent = storyParagraphs[i];
      // paragraph.classList.add(fontSuggestion); // Apply the font style suggested by GPT-4
      content.appendChild(paragraph);

      if (descriptions[i]) {
        const imageUrl = await generateImage(descriptions[i], apiKey);
        const img = document.createElement('img');
        img.src = imageUrl;
        img.dataset.index = i;
        img.title = descriptions[i]; // Set the illustration description as the title attribute
        img.addEventListener('click', () => handleImageClick(img, apiKey, descriptions));
        content.appendChild(img);
      }
    }

    // following added manually
    const howGenerated = document.createElement('p');
    howGenerated.innerHTML = 'This story was generated by <a href="https://ecraft2learn.github.io/ai/misc/Illustrated%20story%20generator/index.html" target="_blank">this app</a>';
    document.body.appendChild(howGenerated);
  } catch (error) {
    console.error(error);

    // Hide the loading message in case of an error
    const loadingMessageElement = document.getElementById('loading-message');
    loadingMessageElement.style.display = 'none';
    
    displayPopup('Error', 'Error generating story and images.');
  }
}

async function getConstructiveCriticisms(apiKey, paragraphElement, paragraphIndex, paragraphs) {
  showLoadingIndicator('Generating criticism...'); // Show the loading indicator with custom text

  const url = 'https://api.openai.com/v1/chat/completions';

  const currentStory = Array.from(document.querySelectorAll('.story-paragraph')).map(paragraph => paragraph.textContent).join('\n');
  const prompt = `The current story is:\n\n${currentStory}\n\nCan you generate a numbered list of constructive criticisms of paragraph number ${paragraphIndex + 1}`;
 
  const requestBody = {
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorMessage = `Error: ${response.status} ${response.statusText}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const responseData = await response.json();
  const criticisms = responseData.choices[0].message.content.trim().split('\n');

  recordPromptAndCompletion(prompt, responseData.choices[0].message.content);

  hideLoadingIndicator();

  displayCriticismsButtons(apiKey, paragraphElement, criticisms);
}

function displayCriticismsButtons(apiKey, paragraphElement, criticisms) {
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('criticisms-container');

  // Close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.classList.add('close-button');
  closeButton.addEventListener('click', () => {
    buttonContainer.remove();
  });
  buttonContainer.appendChild(closeButton);

  // User input criticism button
  const userInputButton = document.createElement('button');
  userInputButton.textContent = 'Add your own criticism';
  userInputButton.classList.add('user-input-button');
  userInputButton.addEventListener('click', () => {
    const userCriticism = prompt('Enter your own criticism:');
    if (userCriticism && userCriticism.trim() !== '') {
      rewriteParagraph(apiKey, null, paragraphElement, userCriticism);
    }
  });
  buttonContainer.appendChild(userInputButton);

  criticisms.forEach((criticism) => {
    if (criticism.trim() === "") {
      return;
    }

    const button = document.createElement('button');
    button.textContent = criticism;
    button.classList.add('criticism-button');
    button.addEventListener('click', (event) => {
      rewriteParagraph(apiKey, event.target, paragraphElement, criticism);
    });
    buttonContainer.appendChild(button);
  });

  paragraphElement.parentNode.insertBefore(buttonContainer, paragraphElement);
}

async function rewriteParagraph(apiKey, buttonElement, paragraphElement, criticism) {
  // Show the loading indicator
  showLoadingIndicator('Rewriting paragraph...');

  const currentStory = Array.from(document.querySelectorAll('.story-paragraph')).map(paragraph => paragraph.textContent).join('\n');
  const paragraphIndex = Array.from(document.querySelectorAll('.story-paragraph')).indexOf(paragraphElement);

  const url = 'https://api.openai.com/v1/chat/completions';
  // added "only" manually
  const prompt = `Here is a story:\n\n${currentStory}\n\nRewrite only paragraph number ${paragraphIndex + 1} following this criticism: ${criticism}`;

  const requestBody = {
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorMessage = `Error: ${response.status} ${response.statusText}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const responseData = await response.json();
  const rewrittenParagraph = responseData.choices[0].message.content.trim();
  recordPromptAndCompletion(prompt, responseData.choices[0].message.content);

  // Replace the current paragraph with the rewritten one
  paragraphElement.textContent = rewrittenParagraph;

  // this was removed by GPT-4 in an update and when asked to fix it broke some of the above
  // so I didn't copy the new version of this function just the header and the next line
  if (buttonElement) {
    buttonElement.remove();
  }

  // Hide the loading indicator
  hideLoadingIndicator();
}

function showLoadingIndicator(text) {
  const loadingIndicator = document.createElement('div');
  loadingIndicator.classList.add('loading-indicator');
  loadingIndicator.textContent = text; // Set the custom text
  document.body.appendChild(loadingIndicator);
}

function hideLoadingIndicator() {
  const loadingIndicator = document.querySelector('.loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

document.getElementById("api-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const apiKey = document.getElementById("api-key").value;
  const storyPrompt = document.getElementById("story-prompt").value;

  if (apiKey && storyPrompt) {
    document.getElementById("api-form").style.display = "none";
    await displayStoryAndImages(apiKey, storyPrompt);
  }
});

document.getElementById('toggle-prompts-completions').addEventListener('click', () => {
  const promptsCompletionsContainer = document.getElementById('prompts-completions');
  promptsCompletionsContainer.classList.toggle('hidden');
});

function recordPromptAndCompletion(prompt, completion) {
  const promptsCompletionsContainer = document.getElementById('prompts-completions');
  const promptCompletionPair = document.createElement('div');

  promptCompletionPair.innerHTML = `
    <h3>Prompt</h3>
    <p>${prompt}</p>
    <h3>Completion</h3>
    <p>${completion}</p>
    <hr>
  `;

  promptsCompletionsContainer.appendChild(promptCompletionPair);
}

if (document.getElementById('content').textContent.trim() === '') {
  // conditional added so the instructions don't popup on a saved story
  document.addEventListener('DOMContentLoaded', showInstructionsPopup);
}


