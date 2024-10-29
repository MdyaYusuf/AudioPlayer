const container = document.querySelector(".container");
const cover = document.querySelector("#audio-cover");
const title = document.querySelector("#audio-details .title");
const creator = document.querySelector("#audio-details .creator");
const play = document.querySelector("#controls #play");
const prev = document.querySelector("#controls #prev");
const next = document.querySelector("#controls #next");
const audioElement = document.querySelector("#audio");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const playList = document.querySelector("#play-list");

const player = new AudioPlayer(audioList);

window.addEventListener("load", () => {
    let audio = player.getAudio();
    displayAudio(audio);
    displayAudioList(player.audioList);
    isPlayingNow();
});

function displayAudio(audio) {
    title.innerText = audio.title;
    creator.innerText = audio.creator;
    cover.src = "images/" + audio.cover;
    audioElement.src = "audios/" + audio.file;
}

play.addEventListener("click", () => {
    const isAudioPlay = container.classList.contains("playing");
    isAudioPlay ? pauseAudio() : playAudio();
});

prev.addEventListener("click", () => {
    prevAudio();
});

next.addEventListener("click", () => {
    nextAudio();
});

const prevAudio = () => {
    player.prev();
    let audio = player.getAudio();
    displayAudio(audio);
    playAudio();
    isPlayingNow();
}

const nextAudio = () => {
    player.next();
    let audio = player.getAudio();
    displayAudio(audio);
    playAudio();
    isPlayingNow();
}

const pauseAudio = () => {
    container.classList.remove("playing");
    play.querySelector("i").classList = "fa-solid fa-play";
    audio.pause();
}

const playAudio = () => {
    container.classList.add("playing");
    play.querySelector("i").classList = "fa-solid fa-pause";
    audio.play();
}

const calculateTime = (totalSecond) => {
    const minute = Math.floor(totalSecond / 60);
    const second = Math.floor(totalSecond % 60);
    const updatedSecond = second < 10 ? `0${second}` : `${second}`;
    const sonuc = `${minute}:${updatedSecond}`;
    return sonuc;
}

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
});

progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value;
});

let muteState = "unmuted";

volumeBar.addEventListener("input", (e) => {
    const value = e.target.value;
    audio.volume = value / 100;
    if (value == 0) {
        audio.muted = true;
        muteState = "muted";
        volume.classList = "fa-solid fa-volume-xmark";
    } else {
        audio.muted = false;
        muteState = "unmuted";
        volume.classList = "fa-solid fa-volume-high";
    }
});

volume.addEventListener("click", () => {
    if (muteState === "unmuted") {
        audio.muted = true;
        muteState = "muted";
        volume.classList = "fa-solid fa-volume-xmark";
        volumeBar.value = 0;
    } else {
        audio.muted = false;
        muteState = "unmuted";
        volume.classList = "fa-solid fa-volume-high";
        volumeBar.value = audio.volume * 100;
    }
});

const displayAudioList = (list) => {
    for (let i = 0; i < list.length; i++) {
        let liTag = `
            <li li-index='${i}' onclick="selectedAudio(this)" class="list-group-item d-flex justify-content-between align-items-center">
                <span>${list[i].title} - ${list[i].creator}</span>
                <span id="audio-${i}" class="badge bg-primary rounded-pill"></span>
                <audio class="audio-${i}" src="audios/${list[i].file}"></audio>
            </li> 
        `;

        playList.insertAdjacentHTML("beforeend", liTag);

        let liAudioDuration = playList.querySelector(`#audio-${i}`);
        let liAudioTag = playList.querySelector(`.audio-${i}`);

        liAudioTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = calculateTime(liAudioTag.duration);
        });
    }
}

const selectedAudio = (li) => {
    player.index = parseInt(li.getAttribute("li-index"));
    displayAudio(player.getAudio());
    playAudio();
    isPlayingNow();
}

const isPlayingNow = () => {
    for (let li of playList.querySelectorAll("li")) {
        if (li.classList.contains("playing")) {
            li.classList.remove("playing");
        }
        if (li.getAttribute("li-index") == player.index) {
            li.classList.add("playing");
        }
    }
}

audio.addEventListener("ended", () => {
    nextAudio();
})