//Podcast Array
let episodes = [];

//prod RSS Feed 
// const RSS_URL = `https://angelageorge.com/feed/podcast/voz-memos/`;

//         async function readRssFeed(episodes) {
//             try {
//                 const response = await fetch(RSS_URL);
//                 const str = await response.text();
//                 const data = new window.DOMParser().parseFromString(str, "text/xml");
                
//                 const episodes = data.querySelectorAll("item");
//                 episodes.forEach(el => {
//                     const title = el.querySelector("title")?.textContent;
//                     const link = el.querySelector("link")?.textContent;
//                     console.log(title, link);
//                 });
//         }   catch (error) {
//                 console.error("CORS or network error:", error);
//         }
//     }

// readRssFeed(episodes);

//localhost JSON read
import data from "./episodes.JSON" with { type: "json" };
episodes = data.items;

const iPod = document.querySelector('.podcast-container')
const playBtn = document.querySelector('#play')
const prevBtn = document.querySelector('#prev')
const nextBtn = document.querySelector('#next')
const audio = document.querySelector('#audio')
const progress = document.querySelector('#progress')
const progressContainer = document.querySelector('.progress-container')
const title = document.querySelector('#title')
const displayCurrentTime = document.querySelector('#current-time')
const displayRemainingTime = document.querySelector('#remaining-time')

let episodeIndex = 0;

loadEpsiode(episodes[episodeIndex]);

function formatTime(seconds){
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function loadEpsiode(episode) {
    title.innerText = episode.title;
    title.href = episode.link;
    audio.src = episode.enclosure.link;

    //reset everything
    displayCurrentTime.innerText = `00:00`
    const duration = formatTime(episode.enclosure.duration)
    displayRemainingTime.innerText = `-${duration}`
    audio.currentTime = 0
    progress.style.width = 0
}

function playEpisode() {
    iPod.classList.add('play')


    audio.play()
}

function pauseEpisode() {
    iPod.classList.remove('play')

    audio.pause()
}

playBtn.addEventListener('click', () => {
    const isPlaying = iPod.classList.contains('play') //need to add some logic here

    if (isPlaying) {
        pauseEpisode()
    }
    else {
        playEpisode()
    }
})

function prevEpisode() {
      
    
    episodeIndex--

    if(episodeIndex < 0) {
        episodeIndex = episodes.length - 1;
    }

    loadEpsiode(episodes[episodeIndex])

    const isPlaying = iPod.classList.contains('play') 

    if (isPlaying) {
        playEpisode()
    }

}

function nextEpisode(){

    
     episodeIndex++

    if(episodeIndex > episodes.length) {
        episodeIndex = 0;
    }

    loadEpsiode(episodes[episodeIndex])

    const isPlaying = iPod.classList.contains('play') //need to add some logic here

    if (isPlaying) {
        playEpisode()
    }
}

function updateProgess(e) {
    const {duration, currentTime} = e.srcElement
    const progressPercent = (currentTime / duration ) * 100
    progress.style.width = `${progressPercent}%`

    const totalSeconds = Math.floor(audio.currentTime);
    const timeRemaining = duration - totalSeconds;

    if (currentTime != 0) {
         displayCurrentTime.innerText = `${formatTime(totalSeconds)}`;
        displayRemainingTime.innerText = `-${formatTime(timeRemaining)}`
    }
   
}

function setProgress(e) {
    const width = this.clientWidth
    const clickX = e.offsetX
    const duration = audio.duration

    audio.currentTime = (clickX / width) * duration
}
//change episode events

prevBtn.addEventListener('click', prevEpisode);
nextBtn.addEventListener('click', nextEpisode);

audio.addEventListener('timeupdate', updateProgess);

progressContainer.addEventListener('click', setProgress);

audio.addEventListener('ended', nextEpisode);