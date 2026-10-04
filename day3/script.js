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

// ==========================================
// Tests (Normal cases and Edge cases)
// ==========================================

// 1. searchNotes tests
console.log(searchNotes("study")); 
console.log(searchNotes("xyz")); // Edge case: no match

// 2. longestNote tests
console.log(longestNote()); 
let tempNotes = notes;
notes = [];
console.log(longestNote()); // Edge case: empty array returns null
notes = tempNotes; 

// 3. countByCategory tests
console.log(countByCategory()); 
notes = [];
console.log(countByCategory()); // Edge case: empty array returns empty object
notes = tempNotes; 

// 4. getSummary tests
console.log(getSummary()); 
notes = [{ id: 1, text: "Single note", category: "personal" }];
console.log(getSummary()); // Edge case: singular note word
notes = tempNotes; 

// 5. isDuplicate tests
console.log(isDuplicate("Call mum")); 
console.log(isDuplicate("Clean the kitchen")); // Edge case: non-duplicate

// 6. addNote tests
console.log(addNote("Submit timesheet", "work")); 
console.log(addNote("Buy milk and bread", "personal")); // Edge case: duplicate
console.log(addNote("Invalid category test", "fitness")); // Edge case: invalid category
