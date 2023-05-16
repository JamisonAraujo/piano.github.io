var down = [];
var parar = false;
var tOut;
document.body.addEventListener('keydown', (event)=>{
    if (down.find(element => element == event.code.toLowerCase()) != null) {
        return;
    
    }
    down.push(event.code.toLowerCase());
    playSound(event.code.toLowerCase(), false);
});

document.body.addEventListener('keyup', (event)=>{
    down.splice(down.find(element => element == event.code.toLowerCase()));

    playSound(event.code.toLowerCase(), false);
});

document.body.addEventListener('mousedown', (event)=>{
    playSound(event.target.getAttribute("data-key"), true);
});

document.body.addEventListener('mouseup', (event)=>{
    playSound(event.target.getAttribute("data-key"), false);
});



// Composição
document.querySelector('.buttons :nth-child(1)').addEventListener('click', ()=>{
    let song = document.querySelector('#input').value;

    if(song !== ''){
        let songArray = song.split('');
        playComposition(songArray);
    }
});

//parar reprodução
document.querySelector('.buttons :nth-child(2)').addEventListener('click', ()=>{
    let audios = document.querySelectorAll('audio');
    parar = true;
    // playSound(audios, parar);
    clearInterval(tOut);
    audios.forEach(audio => {
        audio.pause();
        // audio.src = "";
        audio.currentTime = 0;
    });

});

//selecionar oitava
document.body.addEventListener('click', (event)=>{
    var tgt = event.target;
    if (tgt.classList.contains("active")){
        return;
    }
    var octaves = document.querySelectorAll('.octave-btn');

    if(tgt.id == 'octave1' && !tgt.classList.contains("active")){
        removeActive(octaves);
       
        octaveSelect(1);
        event.target.classList.add('active');

    }else if(tgt.id == 'octave2' && !tgt.classList.contains("active")){
        removeActive(octaves);
        
        octaveSelect(2); 
        event.target.classList.add('active');

    } else if(tgt.id == 'octave3' && !tgt.classList.contains("active")){
        removeActive(octaves);
        
        octaveSelect(3);
        event.target.classList.add('active');

    } else if(tgt.id == 'octave4' && !tgt.classList.contains("active")){
        removeActive(octaves);
        
        octaveSelect(4);
        event.target.classList.add('active');

    } 

});

//remove active
function removeActive(octaves){
    octaves.forEach(oct => { 
        oct.classList.remove('active');
    });
}

function octaveSelect(oct){
    var keys = document.querySelectorAll(".noteSound");
    var notes = ["C", "Db", "D","Eb", "E", "F", "Gb","G", "Ab", "A", "Bb", "B"];
    let i = 0;
    keys.forEach(key => {
        key.src = "Assets/" + notes[i%notes.length] + oct + ".mp3";
        i++;
        if (i == notes.length){
            oct++;
        }
    });

}

function playSound(sound, compose) {
    let keyElement = document.querySelector(`div[data-key="${sound}"]`); 
    if(keyElement == null || parar) {
        parar = false;
        return;
    }
    let audioElement = document.querySelector(`#s_${sound}`);
    if(down.find(element => element == sound) == null && !compose){
        if(sound != null){

            audioElement.pause();
            audioElement.currentTime = 0;
            keyElement.classList.remove('active');
        }
        return;
    }
    
    if(audioElement && !parar){
        audioElement.currentTime = 0;
        audioElement.play();
    }

    if(keyElement){
        keyElement.classList.add('active');
        
        setTimeout(()=>{
            keyElement.classList.remove('active');
        }, 300);
    } else{
        keyElement.classList.remove('active');
    }

}

function playComposition(songArray){
    let wait = 0;
    let onThis = "";
    let previous = [];
    let holdWait = false;
    let tOut = undefined;

    for(let songItem of songArray){
        if(parar){
            clearTimeout(tOut);
            return;
        }
        
        if(songItem == "/"){
            if (onThis == songItem){
                wait += 250;
            } else {
                wait -= 750;
                onThis = songItem;
            }
        } else if(songItem == ";"){
            if (onThis == songItem){
                wait += 500;
            } else{
                wait -= 500;
                onThis = songItem;
            }
        } else if(songItem == "."){
            if (onThis == songItem){
                wait += 2000;
            } else{
                wait += 1000;
                onThis = songItem;
            }
        } else if(songItem == "("){
            holdWait = true;
            console.log(holdWait);
        } else if(songItem == ")"){
            holdWait = false;
            wait += 1000;
            previous.forEach(item => {
                playSound(item, parar);
                previous.splice(item);
            });
        }else{

            if(!holdWait && wait > 0){
                previous.forEach(item => {
                    playSound(item, false);
                    if(parar) return;
                    previous.splice(item);
                });
            }

            if(isNaN(songItem)){
                previous.push(`key${songItem}`);
                tOut = setTimeout(()=>{
                    playSound(`key${songItem}`, true); 
                }, wait);
                if(parar) return;
                console.log(tOut);
                playSound(`key${songItem}`, false);
                if(parar) return;
            }
            else{
                previous.push(`digit${songItem}`);
                timeOut = setTimeout(()=>{
                    playSound(`digit${songItem}`, true);
                }, wait);
                if(parar) return;

            }
            if(!holdWait){
                wait += 1000;
            }
            onThis = "";
        }

        console.log("prev: " + previous);
    }
    previous.forEach(item => {
        playSound(item, false);
        if(parar) return;
        previous.splice(item);
    });
}