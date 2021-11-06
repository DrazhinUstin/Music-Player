import {saveToStorage} from "./utils.js";

const setThemeSwitcher = (settings) => {
    const switchBtn = document.getElementById('theme-switch-btn');
    const themes = ['theme-1', 'theme-2', 'theme-3', 'theme-4', 'theme-5', 'theme-6', 'theme-7', 'theme-8', 'theme-9', 'theme-10'];

    let step = settings.themeMode ? themes.indexOf(settings.themeMode) : 0;
    document.body.className = `${themes[step]}`;

    switchBtn.addEventListener('click', () => {
        step++;
        if (step > themes.length - 1) step = 0;
        document.body.className = `${themes[step]}`;
        settings.themeMode = themes[step];
        saveToStorage('settings', settings);
    });
};

export default setThemeSwitcher;