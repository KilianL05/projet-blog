// public/js/2fa.js
document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token'); // Retrieve the token from sessionStorage

    if (!token) {
        console.error('No token found in sessionStorage');
        window.location.href = '/login';
        return;
    }

    fetch('/qrcode', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('qrcode-container').innerHTML = html;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

document.getElementById('logoutAllButton').addEventListener('click', async () => {
    const token = sessionStorage.getItem('token');
    const twoFactorCode = prompt('Veuillez entrer votre code 2FA:');
    if (!twoFactorCode) {
        return;
    }
    console.log('Token:', token);
    console.log('2FA code:', twoFactorCode);
    const response = await fetch('/logout-all', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: twoFactorCode })
    });

    if (response.ok) {
        sessionStorage.removeItem('token');
        window.location.href = '/login';
    } else {
        const errorText = await response.text();
        alert(errorText);
    }
});