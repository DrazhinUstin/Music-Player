import {getFromStorage, hidePreloader} from "./modules/utils.js";
import setThemeSwitcher from "./modules/setThemeSwitcher.js";
import fetchData from "./modules/fetchData.js";
import setupMusicPlayer from "./modules/setupMusicPlayer.js";

document.addEventListener('DOMContentLoaded', async () => {
    const settings = getFromStorage('settings');
    setThemeSwitcher(settings);
    const playlist = await fetchData();
    setupMusicPlayer(playlist, settings);
});

window.addEventListener('load', hidePreloader);
