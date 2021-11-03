import fetchData from "./modules/fetchData.js";
import setupMusicPlayer from "./modules/setupMusicPlayer.js";
import {getFromStorage} from "./modules/utils.js";

document.addEventListener('DOMContentLoaded', async () => {
    const playlist = await fetchData();
    const settings = getFromStorage('settings');
    setupMusicPlayer(playlist, settings);
});
