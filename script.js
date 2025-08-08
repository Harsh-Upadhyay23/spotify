console.log('js starts here')
let currentSong = new Audio();

let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    // console.log(response);
    let as = div.getElementsByTagName('a')
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    //    console.log(songUL) 
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li>
                                <img class="invert" src="img/music.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ")}</div>
                                    <div>Song Artist</div>
                                </div>
                                <div class="playnow">
                                    <span>Play now</span>
                                     <img class="invert" src="img/play.svg" alt="">
                                </div>  
                            </li>`;
    }
    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
    return songs


}
const playMusic = (track, pause = false) => {
    // console.log("/songs/"+track);
    // let audio=new Audio("/songs/"+track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg"
    }


    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchor = div.getElementsByTagName("a");
    let cardContainer=document.querySelector(".cardContainer");
   let array= Array.from(anchor)
    for(let index=0;index<array.length;index++) {
        const e=array[index];
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-2)[1];
            // console.log(folder);
            //get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML=cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="49.9" height="49.9">
                                <!-- Green filled circle -->
                                <circle cx="12" cy="12" r="10" fill="#1fdf64" />

                                <!-- Black filled play shape -->
                                <path
                                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                    fill="black" />
                            </svg>
                        </div>

                        <img src="/songs/${folder}/cover.jpeg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }

    }
    
    //load the library whener card is clicked......
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0]);
        })
    })


}
async function main() {

    // get the list of all songs
    await getSongs();
    playMusic(songs[0], true)
    // console.log(songs)  song 

    // display all the album on the page
    await displayAlbums()

    //attach an event listener to play , next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "img/play.svg";
        }

    })
    // listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })
    // Add an event Listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        // percent = Math.min(Math.max(percent, 0), 100); // Clamp between 0 and 100

        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // Add an event Listener for Hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    //Add an event lister for close button

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //add an event listener for previous 
    previous.addEventListener("click", () => {
        currentSong.pause();
        // console.log(currentSong.src.split("/").slice(-1)[0])
        let a = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (a == 0) a = songs.length;
        playMusic(songs[a - 1]);
    })

    //add an event listener for p next
    next.addEventListener("click", () => {
        currentSong.pause();
        let a = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (a == songs.length - 1) a = -1;
        playMusic(songs[a + 1]);


    })
    //add an event to volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to :", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100
        if(currentSong.volume>0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("icons/mute.svg", "icons/volume.svg");
        } 
    })

    // add event listener to mute the volume
    // document.querySelector(".volume img").addEventListener("click",(e)=>{
    //     console.log(e.target)
    //     if(e.target.src=="img/volume.svg"){
    //         e.target.src ="img/mute.svg"
    //         console.log(e.target)
    //     }else if(e.target.src ="img/mute.svg"){
    //         e.target.src="img/volume.svg"
    //         console.log(e.target)
    //     }
    // })
   
    document.querySelector(".volume img").addEventListener("click", (e) => {
    const src = e.target.src;
       
    if (src.includes("volume.svg")) {
        e.target.src = "img/mute.svg";
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    } else if (src.includes("mute.svg")) {
        e.target.src = "img/volume.svg";
          currentSong.volume=0.1;
          document.querySelector(".range").getElementsByTagName("input")[0].value=10;
    }

    console.log("Current image:", e.target.src);
});





}
main(); 