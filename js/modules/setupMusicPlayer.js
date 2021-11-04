import {saveToStorage, transformToMinSec} from "./utils.js";
import displayPlaylist from "./displayPlaylist.js";

const setupMusicPlayer = (playList, settings) => {
    const sidebar = document.querySelector('.sidebar');
    const progressBar = document.querySelector('.song-progress-bar');
    const menuOpenBtn = document.getElementById('menu-open-btn');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const playBtn = document.getElementById('play-btn');
    const playBtnIcon = playBtn.firstElementChild;
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const audioTrackDOM = document.querySelector('.main-audio-track');
    const audioDurationDOM = document.querySelector('.song-duration');
    const audioCurrentTimeDOM = document.querySelector('.song-current-time');
    const playListDOM = document.querySelector('.playlist');
    const playAnimationDOM = document.querySelector('.play-animation');
    
    const startPlayer = () => {
        if (settings.audioStep) audioStep = settings.audioStep;
        if (settings.repeatBtn) repeatBtn.textContent = settings.repeatBtn;
        loadAudio(playList[audioStep]);
        displayPlaylist(playList, playListDOM);
    };

    const loadAudio = (song) => {
        const songTitleDOM = document.querySelector('.song-description h4');
        const songArtistDOM = document.querySelector('.song-description p');
        const songImageDOM = document.querySelector('.image-wrapper img');
        songTitleDOM.textContent = song.title; 
        songArtistDOM.textContent = song.artist;
        songImageDOM.src = song.imageUrl;
        audioTrackDOM.src = song.audioUrl;
        if (playBtnIcon.textContent === 'pause') audioTrackDOM.play();
    };

    const checkAudioStep = () => {
        if (audioStep > playList.length - 1) audioStep = 0;
        if (audioStep < 0) audioStep = playList.length - 1;
    };

    const getRandomIndex = () => {
        let randomIndex;
        do randomIndex = Math.floor(Math.random() * playList.length);
        while (randomIndex === audioStep);
        return randomIndex;
    };

    const configPlaylist = () => {
        [...playListDOM.children].forEach((listItem, index) => {
            listItem.classList.remove('playing');
            if (index === audioStep) listItem.classList.add('playing');
        });
    };
    
    playBtn.addEventListener('click', () => {
        switch (playBtnIcon.textContent) {
            case 'play_arrow':
                playBtnIcon.textContent = 'pause';
                playAnimationDOM.classList.add('play');
                audioTrackDOM.play();      
                break;
            case 'pause':
                playBtnIcon.textContent = 'play_arrow';
                playAnimationDOM.classList.remove('play');
                audioTrackDOM.pause();      
                break;    
        }
    });

    repeatBtn.addEventListener('click', () => {
        switch (repeatBtn.textContent) {
            case 'repeat':
                repeatBtn.textContent = 'repeat_one';
                break;
            case 'repeat_one':
                repeatBtn.textContent = 'shuffle';
                break;
            case 'shuffle':
                repeatBtn.textContent = 'repeat';
                break;         
        }
    });
    
    nextBtn.addEventListener('click', () => {
        repeatBtn.textContent === 'shuffle' ? audioStep = getRandomIndex() : audioStep++;
        checkAudioStep();
        loadAudio(playList[audioStep]);
    });
    
    prevBtn.addEventListener('click', () => {
        repeatBtn.textContent === 'shuffle' ? audioStep = getRandomIndex() : audioStep--;
        checkAudioStep();
        loadAudio(playList[audioStep]);
    });

    audioTrackDOM.addEventListener('loadeddata', () => {
        const duration = audioTrackDOM.duration;
        if (settings.currentTime && initConfig) {
            audioTrackDOM.currentTime = settings.currentTime;
            initConfig = false;
        } else {
            progressBar.firstElementChild.style.width = '0%';
            audioCurrentTimeDOM.textContent = '0:00'; 
        }
        audioDurationDOM.textContent = transformToMinSec(duration);
        configPlaylist();  
    });

    audioTrackDOM.addEventListener('timeupdate', () => {
        const currentTime = audioTrackDOM.currentTime;
        const duration = audioTrackDOM.duration;
        progressBar.firstElementChild.style.width = `${currentTime/duration * 100}%`;
        audioCurrentTimeDOM.textContent = transformToMinSec(currentTime);
    });

    audioTrackDOM.addEventListener('ended', () => {
        switch (repeatBtn.textContent) {
            case 'repeat':
                audioStep++;
                checkAudioStep();
                loadAudio(playList[audioStep]);
                break;
            case 'repeat_one':
                audioTrackDOM.play();
                break;
            case 'shuffle':
                audioStep = getRandomIndex();
                loadAudio(playList[audioStep]);
                break;         
        }
    });

    progressBar.addEventListener('click', event => {
        const fullWidth = progressBar.offsetWidth;
        const x1 = progressBar.getBoundingClientRect().left;
        const x2 = event.clientX;
        const segmentWidth = x2 - x1;
        audioTrackDOM.currentTime = (segmentWidth/fullWidth) * audioTrackDOM.duration;
    });

    playListDOM.addEventListener('click', (event) => {
        const listItem = event.target.closest('.playlist-item');
        if (!listItem) return;
        const index = [...playListDOM.children].indexOf(listItem);
        audioStep = index;
        loadAudio(playList[audioStep]);
        sidebar.classList.remove('show');
    });

    menuOpenBtn.addEventListener('click', () => sidebar.classList.add('show'));
    menuCloseBtn.addEventListener('click', () => sidebar.classList.remove('show'));

    window.addEventListener('unload', () => {
        settings.audioStep = audioStep;
        settings.currentTime = audioTrackDOM.currentTime;
        settings.repeatBtn = repeatBtn.textContent;
        saveToStorage('settings', settings);
    });

    let audioStep = 0;
    let initConfig = true;
    startPlayer();
};

export default setupMusicPlayer;