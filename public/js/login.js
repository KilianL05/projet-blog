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
        alert(result.message);
        // Stocker le token pour une utilisation future, par exemple:
        localStorage.setItem('authToken', result.token);
    } else {
        alert(result.error);
    }
});