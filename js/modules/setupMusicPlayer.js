import {saveToStorage, transformToMinSec} from "./utils.js";
import displayPlaylist from "./displayPlaylist.js";

const setupMusicPlayer = (playList, settings) => {

    //////////////////////////////////// DOM ELEMENTS ////////////////////////////////////

    // control buttons
    const playBtn = document.getElementById('play-btn');
    const playBtnIcon = playBtn.firstElementChild;
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const volumeBtn = document.querySelector('#volume-btn i');
    // audiotrack
    const audioTrackDOM = document.querySelector('.main-audio-track');
    const audioDurationDOM = document.querySelector('.song-duration');
    const audioCurrentTimeDOM = document.querySelector('.song-current-time');
    // progress bar
    const progressBar = document.querySelector('.song-progress-bar');
    const thumb = progressBar.querySelector('.thumb');
    // volume bar
    const volumeBar = document.querySelector('.volume-bar');
    // sidebar
    const menuOpenBtn = document.getElementById('menu-open-btn');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const sidebar = document.querySelector('.sidebar');
    const playListDOM = sidebar.querySelector('.playlist');
    // header animation
    const playAnimationDOM = document.querySelector('.play-animation');

    //////////////////////////////////// ARROW FUNCTIONS ////////////////////////////////////

    const startPlayer = () => {
        if (settings.audioStep) audioStep = settings.audioStep;
        if (settings.repeatBtn) {
            repeatBtn.textContent = settings.repeatBtn;
            repeatBtn.title = settings.repeatBtnTitle;
        }
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

    //////////////////////////////////// CONTROL BUTTONS EVENTS ////////////////////////////////////
    
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
                repeatBtn.title = 'Song looped';
                break;
            case 'repeat_one':
                repeatBtn.textContent = 'shuffle';
                repeatBtn.title = 'Playback shuffled';
                break;
            case 'shuffle':
                repeatBtn.textContent = 'repeat';
                repeatBtn.title = 'Playlist looped';
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

    volumeBtn.addEventListener('click', () => {
        volumeBar.classList.toggle('show');
    });

    //////////////////////////////////// AUDIOTRACK EVENTS ////////////////////////////////////

    audioTrackDOM.addEventListener('loadeddata', () => {
        const duration = audioTrackDOM.duration;
        if (initConfig) {
            if (settings.currentTime) audioTrackDOM.currentTime = settings.currentTime;
            if (settings.volume || settings.volume === 0) audioTrackDOM.volume = settings.volume;
            initConfig = false;
        } else {
            progressBar.firstElementChild.style.width = '0%';
            audioCurrentTimeDOM.textContent = '0:00'; 
        }
        audioDurationDOM.textContent = transformToMinSec(duration);
        configPlaylist();  
    });

    audioTrackDOM.addEventListener('timeupdate', () => {
        if (isDragging) return;
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

    audioTrackDOM.addEventListener('volumechange', () => {
        const volume = audioTrackDOM.volume;
        volumeBar.firstElementChild.style.height = `${volume/1 * 100}%`;
        if (volume === 0) volumeBtn.textContent = 'volume_off';
        else volumeBtn.textContent = 'volume_up';
    });

    //////////////////////////////////// PROGRESS BAR EVENTS ////////////////////////////////////

    progressBar.addEventListener('click', event => {
        const fullWidth = progressBar.offsetWidth;
        const x1 = progressBar.getBoundingClientRect().left;
        const x2 = event.clientX;
        const segmentWidth = x2 - x1;
        audioTrackDOM.currentTime = (segmentWidth/fullWidth) * audioTrackDOM.duration;
    });

    thumb.addEventListener('pointerdown', event => {
        event.preventDefault();
        const fullWidth = progressBar.offsetWidth;
        const x1 = progressBar.getBoundingClientRect().left;
        let segmentWidth;
        
        const getWidth = () => (segmentWidth/fullWidth) * 100;
        const getCurrentTime = () => (segmentWidth/fullWidth) * audioTrackDOM.duration;
        
        const pointerMove = (event) =>  {
            isDragging = true;
            const x2 = event.clientX;
            segmentWidth = x2 - x1;
            if (segmentWidth < 0) segmentWidth = 0;
            if (segmentWidth > fullWidth) segmentWidth = fullWidth;
            progressBar.firstElementChild.style.width = `${getWidth()}%`;
            audioCurrentTimeDOM.textContent = transformToMinSec(getCurrentTime());
        };

        const pointerUp = () => {
            audioTrackDOM.currentTime = getCurrentTime();
            isDragging = false;
            document.removeEventListener('pointermove', pointerMove);
            document.removeEventListener('pointerup', pointerUp);
        };

        document.addEventListener('pointermove', pointerMove);
        document.addEventListener('pointerup', pointerUp);
    });

    //////////////////////////////////// VOLUME BAR EVENTS ////////////////////////////////////

    volumeBar.addEventListener('pointerdown', event => {
        event.preventDefault();
        const fullHeight = volumeBar.offsetHeight;
        const y1 = volumeBar.getBoundingClientRect().bottom;

        const setVolume = (event) => {
            const y2 = event.clientY;
            let segmentHeight = y1 - y2;
            if (segmentHeight < 0) segmentHeight = 0;
            if (segmentHeight > fullHeight) segmentHeight = fullHeight;
            audioTrackDOM.volume = segmentHeight/fullHeight;
        }

        const pointerMove = (event) => {
            setVolume(event);
        };

        const pointerUp = () => {
            document.removeEventListener('pointermove', pointerMove);
            document.removeEventListener('pointerup', pointerUp);
        };

        setVolume(event);
        document.addEventListener('pointermove', pointerMove);
        document.addEventListener('pointerup', pointerUp);
    });

    //////////////////////////////////// SIDEBAR EVENTS ////////////////////////////////////

    menuOpenBtn.addEventListener('click', () => sidebar.classList.add('show'));
    menuCloseBtn.addEventListener('click', () => sidebar.classList.remove('show'));

    playListDOM.addEventListener('click', event => {
        const listItem = event.target.closest('.playlist-item');
        if (!listItem) return;
        const index = [...playListDOM.children].indexOf(listItem);
        audioStep = index;
        loadAudio(playList[audioStep]);
        sidebar.classList.remove('show');
    });

    //////////////////////////////////// WINDOW UNLOAD EVENT ////////////////////////////////////

    window.addEventListener('unload', () => {
        settings.audioStep = audioStep;
        settings.currentTime = audioTrackDOM.currentTime;
        settings.repeatBtn = repeatBtn.textContent;
        settings.repeatBtnTitle = repeatBtn.title;
        settings.volume = audioTrackDOM.volume;
        saveToStorage('settings', settings);
    });

    //////////////////////////////////// INITIAL SETUP ////////////////////////////////////

    let audioStep = 0;
    let initConfig = true;
    let isDragging = false;
    startPlayer();
};

export default setupMusicPlayer;