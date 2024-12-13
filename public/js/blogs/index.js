import { getCookie, deleteCookie, createCookie } from '../utils.js';


document.addEventListener('DOMContentLoaded', function () {
    let token = sessionStorage.getItem('token');
    let cookie = getCookie('jwt');
    if (cookie && (token !== cookie)) {
        console.log('Updating token from cookie');
        token = cookie;
        deleteCookie('jwt');
        sessionStorage.setItem('token', token);
    }
});

document.getElementById('setup2FAButton').addEventListener('click', () => {
    const token = sessionStorage.getItem('token');
    const oneDayInSeconds = 24 * 60 * 60;
    createCookie('token', token, oneDayInSeconds);

    window.location.href = '/2fa';
});

document.getElementById('accessPrivateBlog').addEventListener('click', () => {
    const token = sessionStorage.getItem('token');
    createCookie('token', token, 86400); // 1 day expiration
    window.location.href = '/blogs/private';
});

const twoFactorAuth = document.getElementById('setup2FAButton');
twoFactorAuth.addEventListener("click", () => {
    let token = sessionStorage.getItem('token');
    let cookie = getCookie('jwt');
    if (!token && cookie) {
        token = cookie;
        deleteCookie('jwt');
        sessionStorage.setItem('token', token);
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

