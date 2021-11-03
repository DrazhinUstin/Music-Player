import {transformToMinSec} from "./utils.js";

const displayPlaylist = (playList, playListDOM) => {
    playListDOM.innerHTML = playList.map(listItem => {
        return `<li class="playlist-item">
                    <div>
                        <div class="title">
                            <i class="material-icons">audiotrack</i>
                            <h4>${listItem.title}</h4>
                        </div>
                        <span>3:40</span>
                        <audio src="${listItem.audioUrl}" preload="metadata"></audio>
                    </div>
                    <p>${listItem.artist}</p>
                </li>`;
    }).join('');

    [...playListDOM.children].forEach(elem => {
        const audio = elem.querySelector('audio');
        audio.addEventListener('loadeddata', () => audio.previousElementSibling.textContent = transformToMinSec(audio.duration));
    });
};

export default displayPlaylist;