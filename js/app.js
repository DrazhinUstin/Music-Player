import fetchData from "./modules/fetchData.js";
import setupMusicPlayer from "./modules/setupMusicPlayer.js";

document.addEventListener('DOMContentLoaded', async () => {
    const playlist = await fetchData();
    setupMusicPlayer(playlist);
});
