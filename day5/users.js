const loadButton = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const statusParagraph = document.getElementById('status');
const usersList = document.getElementById('users-list');

let allUsers = [];

function renderUsers(usersToRender) {
    usersList.innerHTML = '';

    if (usersToRender.length === 0) {
        usersList.innerHTML = '<li>No users match your filter.</li>';
        return;
    }

    usersToRender.forEach(user => {
        const li = document.createElement('li');
        
        const nameStrong = document.createElement('strong');
        nameStrong.textContent = user.name;
        
        const detailsText = document.createTextNode(` - ${user.email} (${user.address.city}) - ${user.company.name}`);
        
        li.appendChild(nameStrong);
        li.appendChild(detailsText);
        usersList.appendChild(li);
    });
}

async function loadUsers() {
    statusParagraph.textContent = 'Loading...';
    loadButton.disabled = true;

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        allUsers = await response.json();
        renderUsers(allUsers);
        statusParagraph.textContent = 'Success!';
    } catch (error) {
        statusParagraph.textContent = `Error: ${error.message}`;
    } finally {
        loadButton.disabled = false;
    }
}

loadButton.addEventListener('click', loadUsers);

filterInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );
    renderUsers(filteredUsers);
});
