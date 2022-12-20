const spanElement = document.querySelector('#output');
const selectElement = document.querySelector('#selection');
const title = document.querySelector('#title');
const submitButton = document.querySelector('.btn');

// English Corrector
function onSubmit(e) {
  e.preventDefault();

  const selectValue = selectElement.value;

  const prompt = document.querySelector('#prompt').value;
  const editedPrompt =
    selectValue === 'translate'
      ? 'Translate this code to python ' + prompt
      : 'Explain what this code does step by step:  ' +
        prompt;

  if (prompt === '') {
    alert('Please provide code');
    return;
  }

  generateCorrectEnglish(editedPrompt);
}

async function generateCorrectEnglish(editedPrompt) {
  try {
    showSpinner();

    const response = await fetch('/openai/generateimage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        editedPrompt,
      }),
    });

    if (!response.ok) {
      removeSpinner();
      throw new Error('prompt could not be generated');
    }

    const data = await response.json();

    const aiOutput = data.data;
    document.querySelector('#output').textContent = aiOutput;

    removeSpinner();
  } catch (error) {
    console.log(error);
  }
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function removeSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

function copyToClipboard() {
  const promptValue = document.getElementById('output').innerText;

  navigator.clipboard.writeText(promptValue);
}

function handleSelectChange() {
  const selectValue = selectElement.value;
  selectValue === 'translate'
    ? (title.textContent = 'Translate Code')
    : (title.textContent = 'Explain Code 🦜');

  selectValue === 'translate'
    ? (submitButton.textContent = 'Translate')
    : (submitButton.textContent = 'Explain');
}

document.querySelector('#image-form').addEventListener('submit', onSubmit);

spanElement.addEventListener('click', copyToClipboard);

selectElement.addEventListener('change', handleSelectChange);
