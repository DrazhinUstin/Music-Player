import {saveToStorage} from "./utils.js";

const setThemeSwitcher = (settings) => {
    const themeSwitchBtn = document.getElementById('theme-switch-btn');
    const themes = ['theme-1', 'theme-2', 'theme-3', 'theme-4'];

    let step = settings.themeMode ? themes.indexOf(settings.themeMode) : 0;
    document.body.className = `${themes[step]}`;

    themeSwitchBtn.addEventListener('click', () => {
        step++;
        if (step > themes.length - 1) step = 0;
        document.body.className = `${themes[step]}`;
        settings.themeMode = themes[step];
        saveToStorage('settings', settings);
    });
};

export default setThemeSwitcher;