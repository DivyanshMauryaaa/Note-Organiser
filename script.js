let notes = [
    { id: 1, title: "Welcome to Refined Note Manager", content: "This is your first note. You can edit, delete, or pin it!", category: "Personal", pinned: true, image: "" },
    { id: 2, title: "How to use", content: "Create new notes, categorize them, and use the search function to find them easily.", category: "Work", pinned: false, image: "" },
    { id: 3, title: "Ideas for improvement", content: "1. Add color coding<br>2. Implement note sharing<br>3. Create mobile app", category: "Ideas", pinned: false, image: "" }
];

let categories = ['All', 'Work', 'Personal', 'Ideas']; // Added 'All' category
let showPinnedOnly = false;
let currentFilter = 'All';
let quill;
let editingNoteId = null;

function renderNotes() {
    const notesContainer = $('#notes');
    notesContainer.empty();
    const searchTerm = $('#search').val().toLowerCase();

    notes.forEach((note) => {
        if ((showPinnedOnly && !note.pinned) || 
            (searchTerm && !note.title.toLowerCase().includes(searchTerm) && !note.content.toLowerCase().includes(searchTerm)) ||
            (currentFilter !== 'All' && note.category !== currentFilter && currentFilter !== 'All')) {
            return;
        }

        const noteElement = $('<div>').addClass('note').toggleClass('pinned', note.pinned);
        noteElement.append($('<h3>').text(note.title));
        noteElement.append($('<div>').html(note.content));

        if (note.image) {
            const img = $('<img>').attr('src', note.image).addClass('image-preview');
            noteElement.append(img);
        }

        noteElement.append($('<small>').text(`Category: ${note.category}`));
        
        const pinButton = $('<button>').text(note.pinned ? 'Unpin' : 'Pin').on('click', () => togglePin(note.id));
        const editButton = $('<button>').text('Edit').on('click', () => editNote(note.id));
        const deleteButton = $('<button>').text('Delete').on('click', () => deleteNote(note.id));
        
        noteElement.append(pinButton, editButton, deleteButton);
        notesContainer.append(noteElement);
    });
}

function renderCategories() {
    const categoriesContainer = $('#categories');
    categoriesContainer.empty();
    categories.forEach((category) => {
        const categoryElement = $('<div>').addClass('category-item').text(category);
        categoryElement.on('click', () => {
            currentFilter = category === 'All' ? 'All' : category; // Update filter logic
            renderNotes();
            $('.category-item').removeClass('active');
            categoryElement.addClass('active');
        });
        categoryElement.append($('<button>').text('Delete').on('click', (e) => { 
            e.stopPropagation(); 
            deleteCategory(category); 
        }));
        categoriesContainer.append(categoryElement);
    });

    $('#note-category').empty().append(categories.map(c => `<option value="${c}">${c}</option>`));
}

function addCategory() {
    const newCategory = $('#new-category').val();
    if (newCategory && !categories.includes(newCategory)) {
        categories.push(newCategory);
        $('#new-category').val('');
        renderCategories();
    }
}

function deleteCategory(category) {
    categories = categories.filter(c => c !== category && c !== 'All'); // Prevent deletion of 'All'
    notes.forEach(note => {
        if (note.category === category) note.category = 'General'; // Assign a default category
    });
    renderCategories();
    renderNotes();
}

function togglePinnedFilter() {
    showPinnedOnly = !showPinnedOnly;
    $('#search').val(''); // Clear search on filter change
    renderNotes();
}

function toggleDarkMode() {
    $('body').toggleClass('dark-mode');
}

function toggleNoteForm() {
    $('#note-form').toggleClass('hidden');
    if ($('#note-form').is(':visible')) {
        quill.setText('');
        $('#note-title').val('');
        $('#image-preview').hide();
        $('#image-upload').val('');
        editingNoteId = null;
    }
}

function saveNote() {
    const title = $('#note-title').val();
    const content = quill.root.innerHTML;
    const category = $('#note-category').val();
    const image = $('#image-upload').prop('files')[0];

    if (editingNoteId) {
        const index = notes.findIndex(note => note.id === editingNoteId);
        notes[index].title = title;
        notes[index].content = content;
        notes[index].category = category;
        if (image) {
            const reader = new FileReader();
            reader.onload = (e) => {
                notes[index].image = e.target.result;
                renderNotes();
            };
            reader.readAsDataURL(image);
        }
    } else {
        const newNote = { 
            id: notes.length + 1, 
            title, 
            content, 
            category, 
            pinned: false, 
            image: image ? URL.createObjectURL(image) : '' 
        };
        notes.push(newNote);
    }
    renderNotes();
    toggleNoteForm();
}

function editNote(id) {
    editingNoteId = id;
    const note = notes.find(note => note.id === id);
    $('#note-title').val(note.title);
    quill.setContents(quill.clipboard.convert(note.content));
    $('#note-category').val(note.category);
    $('#image-preview').attr('src', note.image).show();
    $('#image-upload').val('');
    toggleNoteForm();
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    renderNotes();
}

function togglePin(id) {
    const note = notes.find(note => note.id === id);
    if (note) {
        note.pinned = !note.pinned; // Toggle the pinned status
        renderNotes(); // Re-render notes to reflect the change
    }
}

$(document).ready(function() {
    quill = new Quill('#editor-container', {
        theme: 'snow'
    });
    renderNotes();
    renderCategories();

    $('#image-upload').on('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#image-preview').attr('src', e.target.result).show();
            };
            reader.readAsDataURL(file);
        } else {
            $('#image-preview').hide();
        }
    });
});
