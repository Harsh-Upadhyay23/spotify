console.log('js starts here')
 let currentSong=new Audio();

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    let div =document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName('a')
    let songs=[];
    for(let index=0;index<as.length;index++){
        const element=as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
   

}
const playMusic=(track)=>{
    // console.log("/songs/"+track);
    // let audio=new Audio("/songs/"+track)
     currentSong.src="/songs/"+track
    currentSong.play();
    play.src="img/pause.svg"
    document.querySelector(".songinfo").innerHTML=track
     document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}
async function main() {
   
    // get the list of all songs
    let songs= await getSongs();
    // console.log(songs)  song 
   let songUL= document.querySelector(".songList").getElementsByTagName("ul")[0]
//    console.log(songUL) 
   for(const song of songs){
    songUL.innerHTML=songUL.innerHTML+ ` <li>
                                <img class="invert" src="img/music.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%20"," ")}</div>
                                    <div>Song Artist</div>
                                </div>
                                <div class="playnow">
                                    <span>Play now</span>
                                     <img class="invert" src="img/play.svg" alt="">
                                </div>  
                            </li>`;
   }
    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
      
    })

    //attach an event listener to play , next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="img/pause.svg";
        }
        else{
            currentSong.pause();
            play.src="img/play.svg";
        }

    })
    // listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(a.currentTime,a.duration)

    })
    

}
main(); 