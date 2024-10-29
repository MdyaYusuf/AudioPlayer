class AudioPlayer {
    constructor(audioList) {
        this.audioList = audioList;
        this.index = 0;
    }

    getAudio() {
        return this.audioList[this.index];
    }

    next() {
        if (this.index +1 < this.audioList.length) {
            this.index++;
        } else {
            this.index = 0;
        }
    }

    prev() {
        if (this.index != 0) {
            this.index--;
        } else {
            this.index = this.audioList.length - 1;
        }
    }
}