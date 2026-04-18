const searchForm = document.getElementById('searchform');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const userInput = document.getElementById('wordinput').value.trim();

    if (userInput) {
        lookUpward(userInput);
    }
});


// Fetch Function which will obtain data from the API
async function lookUpward(term) {
    const loadingIndicator = document.getElementById('loading');
    const outputArea       = document.getElementById('results-contents');
    const placeholderText  = document.getElementById('placeholder');
    const outputBox        = document.getElementById('results-container');

    // Hide the placeholder and showcase loading
    placeholderText.style.display  = 'none';
    loadingIndicator.style.display = 'block';
    outputArea.innerHTML           = '';

    // Reset previous errors in styling
    outputBox.classList.remove('has-result', 'has-error');

    // Try and Catch Functions
    try {
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${term}`
        );

        if (!response.ok) {
            throw new Error('Word search shows no results');
        }

        const data = await response.json();
        renderDefinition(data, term);

    } catch (err) {
        renderError(err.message, term);

    } finally {
        loadingIndicator.style.display = 'none';
    }
}


// Loop so as to know the parts of speech and meaning of word
function renderDefinition(data, term) {
    const outputBox  = document.getElementById('results-container');
    const outputArea = document.getElementById('results-contents');

    const entry    = data[0];
    const phonetic = entry.phonetic || '';

    let html = `
        <div class="word-title">${entry.word}</div>
        <div class="phonetic mb-3">${phonetic}</div>
    `;

    entry.meanings.forEach(function (meaning) {
        html += `<span class="part-of-speech">${meaning.partOfSpeech}</span>`;

        // Show up to 3 definitions per meaning
        meaning.definitions.slice(0, 3).forEach(function (def, i) {
            html += `<p class="definition-text"><strong>${i + 1}.</strong> ${def.definition}</p>`;

            // Show an example sentence if one exists
            if (def.example) {
                html += `<p class="example-text">"${def.example}"</p>`;
            }
        });

        // Show up to 5 synonyms if available
        if (meaning.synonyms && meaning.synonyms.length > 0) {
            html += `<div class="mb-3"><strong>Synonyms: </strong>`;
            meaning.synonyms.slice(0, 5).forEach(function (synonym) {
                html += `<span class="synonym-badge">${synonym}</span>`;
            });
            html += `</div>`;
        }

        html += '<hr>';
    });

    outputArea.innerHTML = html;

    outputBox.classList.add('has-result');
}


// Displays a friendly error message when a word isn't found
function renderError(message, term) {
    const outputBox  = document.getElementById('results-container');
    const outputArea = document.getElementById('results-contents');

    outputArea.innerHTML = `
        <div class="text-center">
            <i class="bi bi-journal-x" style="font-size: 2rem; color: #dc3545;"></i>
            <p class="text-danger fw-bold mt-2">No results for "<em>${term}</em>"</p>
            <p class="text-muted">Double-check the spelling and give it another go.</p>
        </div>
    `;

    // Dynamically switch the box to an error style via CSS class
    outputBox.classList.add('has-error');
}