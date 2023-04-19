document.getElementById('apiKeyForm').addEventListener('submit', async (event) => {

  event.preventDefault();

  const apiKey = document.getElementById('api-key').value;

  if (!apiKey) {
    alert('Please enter your OpenAI API Key.');
    return;
  }

  const descriptions = [
    "A picturesque scene of a quaint little town with cobblestone streets and blooming flower gardens, featuring Theodore sitting at a wooden table in his cozy art gallery, surrounded by the warm glow of sunlight filtering through the windows, as he carefully crafts the paper doll, Eliza.",
    "An impressionistic painting of Theodore in his art studio, completely absorbed in the process of creating Eliza's fantastical world, with lush forests and majestic mountains in the background, as vibrant natural light dances on the canvas, reflecting his emotional state.",
    "A magical realism style illustration capturing the pivotal moment when Theodore performs the ancient spell to bring Eliza to life, set in a dimly lit room, featuring Theodore surrounded by flickering candles, with a large window revealing the full moon casting ethereal light upon the scene, and Eliza's transformation shown in the center."
  ];

  const storyParagraphs = [
    "Theodore, a skilled artist in a picturesque town, was known for creating exquisite paper dolls. One fateful day, in his cozy art gallery, he crafted a doll that captured his heart. He named her Eliza. She boasted a beautifully detailed paper dress and eyes so expressive that they seemed to hold a soul within.",
    "As days turned into weeks, Theodore found himself growing more attached to Eliza. He began to envision a fantastical world where she could truly exist. Spending hours on end, he painted lush forests and towering mountains that were nothing short of breathtaking, all inspired by Eliza. With each brushstroke, Theodore felt his love for her intensify.",
    "Fueled by his desire to bring Eliza to life, Theodore delved into the arcane knowledge of ancient spells and mystical concoctions. His research led him to an incantation with the power to transform Eliza from a mere paper doll into a living being. On a moonlit night, Theodore performed the enchanting ritual, and to his amazement, Eliza began to shimmer and come alive. As she drew her first breath, Theodore knew that he had achieved the unimaginable."
  ];

  const content = document.getElementById('content');
  content.innerHTML = '';

  for (let i = 0; i < descriptions.length; i++) {
    const storyParagraph = document.createElement('p');
    storyParagraph.innerText = storyParagraphs[i];
    content.appendChild(storyParagraph);

    const uniqueDescription = `${descriptions[i]} - Unique ID: ${Date.now()}${i}`;
    const imageURL = await generateImage(uniqueDescription, apiKey);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    const img = document.createElement('img');
    img.src = imageURL;
    img.dataset.index = i; // Add a data-index attribute
    img.addEventListener('click', async () => await handleImageClick(img, apiKey, descriptions));

    imgContainer.appendChild(img);

    const tooltip = document.createElement('span');
    tooltip.classList.add('tooltip');
    tooltip.innerText = descriptions[i];
    imgContainer.appendChild(tooltip);

    content.appendChild(imgContainer);
  }

  // Remove the API key interface after displaying the story and images
  const apiKeyForm = document.getElementById('apiKeyForm');
  if (apiKeyForm) {
    apiKeyForm.classList.add('hidden');
  }

});

async function handleImageClick(img, apiKey, descriptions) {
  const index = img.dataset.index;
  const alternativeImageURL = await generateImage(`${descriptions[index]} - Unique ID: ${Date.now()}${index}`, apiKey);

  img.src = alternativeImageURL;
}

async function generateImage(description, apiKey) {
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
  return responseData.data[0].url;
}
