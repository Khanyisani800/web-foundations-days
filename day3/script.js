let notes = [
    { id: 1, text: "Buy milk and bread", category: "personal" },
    { id: 2, text: "Finish the Day 3 assignment", category: "study" },
    { id: 3, text: "Email the project report to Grace", category: "work" },
    { id: 4, text: "Revise JavaScript arrays", category: "study" },
    { id: 5, text: "Call mum", category: "personal" }
];

function searchNotes(word) {
    return notes.filter(note => note.text.toLowerCase().includes(word.toLowerCase()));
}

function longestNote() {
    if (notes.length === 0) return null;
    let longest = notes[0];
    for (let i = 1; i < notes.length; i++) {
        if (notes[i].text.length > longest.text.length) {
            longest = notes[i];
        }
    }
    return longest;
}

function countByCategory() {
    let counts = {};
    for (let note of notes) {
        counts[note.category] = (counts[note.category] || 0) + 1;
    }
    return counts;
}

function getSummary() {
    let counts = countByCategory();
    let total = notes.length;
    let noteWord = total === 1 ? "note" : "notes";
    let parts = [];
    for (let category in counts) {
        parts.push(`${counts[category]} ${category}`);
    }
    return `${total} ${noteWord}: ${parts.join(", ")}.`;
}

function isDuplicate(text) {
    let trimmedInput = text.trim().toLowerCase();
    return notes.some(note => note.text.trim().toLowerCase() === trimmedInput);
}

function addNote(text, category) {
    let validCategories = ["personal", "work", "study"];
    if (typeof text !== "string" || text.length < 1 || text.length > 200) {
        console.log(`Failed to add note: text length must be between 1 and 200 characters.`);
        return false;
    }
    if (!validCategories.includes(category)) {
        console.log(`Failed to add note: invalid category '${category}'.`);
        return false;
    }
    if (isDuplicate(text)) {
        console.log(`Failed to add note: a note with the text "${text}" already exists.`);
        return false;
    }
    let newId = notes.length > 0 ? notes[notes.length - 1].id + 1 : 1;
    notes.push({ id: newId, text: text.trim(), category: category });
    return true;
}

// Tests
console.log(searchNotes("study")); 
// Expected output: [ { id: 2, text: 'Finish the Day 3 assignment', category: 'study' }, { id: 4, text: 'Revise JavaScript arrays', category: 'study' } ]
console.log(searchNotes("xyz")); 
// Expected output: []

console.log(longestNote()); 
// Expected output: { id: 3, text: 'Email the project report to Grace', category: 'work' }

console.log(countByCategory()); 
// Expected output: { personal: 2, work: 1, study: 2 }

console.log(getSummary()); 
// Expected output: 5 notes: personal: 2, work: 1, study: 2.

console.log(isDuplicate("Call mum")); 
// Expected output: true
console.log(isDuplicate("Clean the kitchen")); 
// Expected output: false

console.log(addNote("Submit timesheet", "work")); 
// Expected output: true
