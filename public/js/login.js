import {getCookie} from "./utils.js";


document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (response.ok) {
        localStorage.setItem('JWT', result.token);
        const redirectPath = getCookie('redirectPath');
        window.location.href = redirectPath ? redirectPath : '/';
    } else {
        alert(result.error);
    }
});