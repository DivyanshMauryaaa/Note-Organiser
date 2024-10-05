const addNoteButton = document.getElementById('addNoteButton');
const searchInput = document.getElementById('search');
const noteContainer = document.getElementById('noteContainer');

let notes = [];

// Function to render notes
function renderNotes() {
    noteContainer.innerHTML = ''; // Clear the container
    notes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.innerHTML = `
            <span>${note}</span>
            <button onclick="deleteNote(${index})">Delete</button>
        `;
        noteContainer.appendChild(noteDiv);
    });
}

// Function to add a new note
function addNote() {
    const noteText = prompt('Enter your note:');
    if (noteText) {
        notes.push(noteText);
        renderNotes();
    }
}

// Function to delete a note
function deleteNote(index) {
    notes.splice(index, 1);
    renderNotes();
}

// Function to filter notes
function filterNotes() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredNotes = notes.filter(note => note.toLowerCase().includes(searchTerm));
    
    noteContainer.innerHTML = ''; // Clear the container
    filteredNotes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.innerHTML = `
            <span>${note}</span>
            <button onclick="deleteNote(${index})">Delete</button>
        `;
        noteContainer.appendChild(noteDiv);
    });
}

// Event listeners
addNoteButton.addEventListener('click', addNote);
searchInput.addEventListener('input', filterNotes);
