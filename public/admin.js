document.addEventListener('DOMContentLoaded', () => {
    loadUsers();

    document.getElementById('addUserButton').addEventListener('click', addUser);
    document.getElementById('updateUserButton').addEventListener('click', updateUser);
    document.getElementById('runQueryButton').addEventListener('click', runQuery);
});

async function addUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/add-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.ok) {
        alert('User added successfully');
        loadUsers(); // Reload the user list after adding a user
    } else {
        alert('Error: ' + result.error);
    }
}

async function loadUsers() {
    const response = await fetch('/api/users');
    const users = await response.json();

    const table = document.getElementById('userTable');
    table.innerHTML = ''; // Clear existing rows

    // Create table headers
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Select</th>
        <th>Username</th>
        <th>Role</th>
        <th>Action</th>
    `;
    table.appendChild(headerRow);

    // Populate table with user data
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="userCheckbox" value="${user.id}"></td>
            <td>${user.username}</td>
            <td>${user.roles}</td>
            <td>
                <button onclick="editUser(${user.id}, '${user.username}', '${user.roles}')">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

async function deleteUser(userId) {
    const response = await fetch('/api/delete-users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: [userId] })
    });

    const result = await response.json();
    if (response.ok) {
        alert('User deleted successfully');
        loadUsers(); // Reload the user list after deleting a user
    } else {
        alert('Error: ' + result.error);
    }
}

async function editUser(userId, username, roles) {
    document.getElementById('editUserId').value = userId;
    document.getElementById('editUsername').value = username;
    document.getElementById('editRoles').value = roles;
    document.getElementById('editUserModal').style.display = 'block';
}

async function updateUser() {
    const id = document.getElementById('editUserId').value;
    const username = document.getElementById('editUsername').value;
    const roles = document.getElementById('editRoles').value;

    const response = await fetch('/api/update-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, username, roles })
    });

    const result = await response.json();
    if (response.ok) {
        alert('User updated successfully');
        loadUsers(); // Reload the user list after updating a user
        document.getElementById('editUserModal').style.display = 'none';
    } else {
        alert('Error: ' + result.error);
    }
}

async function runQuery() {
    const query = document.getElementById('sqlQuery').value;

    const response = await fetch('/api/run-query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    });

    const result = await response.json();
    if (response.ok) {
        document.getElementById('queryResult').innerText = JSON.stringify(result, null, 2);
    } else {
        document.getElementById('queryResult').innerText = 'Error: ' + result.error;
    }
}
