es tests
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
