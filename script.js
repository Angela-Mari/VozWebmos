//Podcast Array
let episodes = [];

//prod RSS Feed 
const RSS_URL = `https://angelageorge.com/feed/podcast/voz-memos/`;

async function readRssFeed(episodes) {
            try {
                const response = await fetch(RSS_URL);
                const str = await response.text();
                const data = new window.DOMParser().parseFromString(str, "text/xml");
                
                const episodesXML = data.querySelectorAll("item");
                episodesXML.forEach(el => {

                    console.log(el)
                    let episode = {
                        title: el.querySelector("title")?.textContent, 
                        link: el.querySelector("link")?.textContent, 
                        audio_link: el.querySelector("enclosure")?.getAttribute('url'), 
                        duration: el.getElementsByTagNameNS(
                            "http://www.itunes.com/dtds/podcast-1.0.dtd",
                            "duration"
                            )[0]?.textContent?.split(":")
                                .slice(-2)
                                .join(":")
                        }
                    episodes.push(episode)
                   
                });
                
        }   catch (error) {
                console.error("CORS or network error:", error);
        }
}



//localhost JSON read
// import data from "./episodes.JSON" with { type: "json" };
// episodes = data.items;

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
const menuBtn = document.querySelector('#menu');
const iPodScreenPlayer = document.querySelector('#player-screen');
const iPodScreenMenu = document.querySelector('#menu-screen');
const list = document.querySelector('#menu-list');
let episodeIndex = 0;


function formatTime(seconds){
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function loadEpsiode(episode) {
    title.innerText = episode.title;
    title.href = episode.link;
    audio.src = episode.audio_link;

    //reset everything
    displayCurrentTime.innerText = `00:00`
    displayRemainingTime.innerText = `-${episode.duration}`
    audio.currentTime = 0
    progress.style.width = 0
}

function playEpisode() {
    if (iPodScreenPlayer.classList.contains('hidden')){
        return;
    }
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

function loadMenu() {
    pauseEpisode()
    
    iPodScreenPlayer.classList.add('hidden')
    iPodScreenMenu.classList.remove('hidden')

    let id = 0;
    episodes.forEach(episode => {
        const div = document.createElement("div");
        div.classList.add('menu-item')
        div.id = (id);
        div.textContent = episode.title;
        div.addEventListener('click', (e) => {
            iPodScreenPlayer.classList.remove('hidden')
            iPodScreenMenu.classList.add('hidden')
            episodeIndex=e.currentTarget.id
            loadEpsiode(episodes[e.currentTarget.id])
        })
        list.appendChild(div);
        id ++;
    });

}

//events

prevBtn.addEventListener('click', prevEpisode);
nextBtn.addEventListener('click', nextEpisode);
menuBtn.addEventListener('click', loadMenu);

audio.addEventListener('timeupdate', updateProgess);

progressContainer.addEventListener('click', setProgress);

audio.addEventListener('ended', nextEpisode);

//execute

readRssFeed(episodes).then(() => loadEpsiode(episodes[episodeIndex]));
