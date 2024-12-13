import { getCookie, deleteCookie } from '../utils.js';

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