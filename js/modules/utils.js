const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const getFromStorage = (key) => {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {};
};

const transformToMinSec = (time) => {
    const minutes = Math.floor(time/60);
    const seconds = Math.floor(time%60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const hidePreloader = () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => preloader.classList.add('hide'), 250);
};

export {saveToStorage, getFromStorage, transformToMinSec, hidePreloader};