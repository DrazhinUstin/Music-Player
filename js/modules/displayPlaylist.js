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

const transformToMinSec = (time) => {
    const minutes = Math.floor(time/60);
    const seconds = Math.floor(time%60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

export {displayPlaylist, transformToMinSec};