var down = [];
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

// document.body.addEventListener('mouseup', (event)=>{
//     playSound(event.target.getAttribute("data-key"), false);
// });



// Composição
document.querySelector('.buttons :nth-child(1)').addEventListener('click', (event)=>{
    var tgt = event.target;
    document.querySelector('.buttons :nth-child(1)').setAttribute("style", "background-color: grey");    

    if(!tgt.classList.contains('active')){
        
        tgt.classList.add('active');
        let song = document.querySelector('#input').value;
    
        if(song !== ''){
            let songArray = song.split('');
            playComposition(songArray);
        }

    }
});

//parar reprodução
document.querySelector('.buttons :nth-child(2)').addEventListener('click', ()=>{
    tOut.forEach(tOut=>{
        clearTimeout(tOut);
    });
    document.querySelector('.buttons :nth-child(1)').classList.remove("active");
    document.querySelector('.buttons :nth-child(1)').setAttribute("style", "background-color: green");    
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
        tgt.classList.add('active');
        tgt.setAttribute("style", "background-color: purple");

    }else if(tgt.id == 'octave2' && !tgt.classList.contains("active")){
        removeActive(octaves);
        
        octaveSelect(2); 
        tgt.classList.add('active');
        tgt.setAttribute("style", "background-color: purple");

    } else if(tgt.id == 'octave3' && !tgt.classList.contains("active")){
        removeActive(octaves);
        
        octaveSelect(3);
        tgt.classList.add('active');
        tgt.setAttribute("style", "background-color: purple");

    } else if(tgt.id == 'octave4' && !tgt.classList.contains("active")){
        removeActive(octaves);
        
        octaveSelect(4);
        tgt.classList.add('active');
        tgt.setAttribute("style", "background-color: purple");

    } 

});

//remove active
function removeActive(octaves){
    octaves.forEach(oct => { 
        oct.classList.remove('active');
        oct.setAttribute("style", "background-color: rgb(31, 5, 43);");
    });
}

//aplica as src da respectiva oitava
function octaveSelect(oct){
    let x = oct-1;
    var keys = document.querySelectorAll(".noteSound");
    var notes = ["C", "Db", "D","Eb", "E", "F", "Gb","G", "Ab", "A", "Bb", "B"];
    let i = 0;
    keys.forEach(key => {
        if(i< keys.length-1){
            key.src = "Assets/" + notes[i%notes.length] + oct + ".mp3";
            i++;
        }
        if (i == notes.length){
            oct++;
        } 
    });
    oct++;
    
    keys.item(i).src = "Assets/B" + x + ".mp3";
}

//recebe a nota e reproduz o som
function playSound(sound, compose) {
    let keyElement = document.querySelector(`div[data-key="${sound}"]`); 
    if(keyElement == null) {
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
    
    if(audioElement){
        audioElement.currentTime = 0;
        audioElement.play();
    }

    if(keyElement){
        keyElement.classList.add('active');
        
        setTimeout(()=>{
            keyElement.classList.remove('active');
        }, 2000);
    }

}

// recebe o input e toca automaticamente
function playComposition(songArray){
    let wait = 0;
    let previous = [];
    let holdWait = false;
    tOut = [];

    for(let songItem of songArray){

        if(songItem == "/"){
            wait -= 875;
        } else if(songItem == ";"){
            wait -= 750;
        } else if(songItem == "."){
            wait -= 500;
        } else if(songItem == ","){
            wait += 1000;
        } else if(songItem == "("){
            holdWait = true;
        } else if(songItem == ")"){

            holdWait = false;
            wait += 1000;
            previous.forEach(item => {
                playSound(item, false);
                previous.splice(item);
            });

        } else{

            if(!holdWait && wait > 0){
                previous.forEach(item => {
                    playSound(item, false);
                    previous.splice(item);
                });
            }

            if(isNaN(songItem)){

                if(songItem != "´" && songItem != "["){

                    previous.push(`key${songItem}`);
                    tOut.push(setTimeout(()=>{
                        playSound(`key${songItem}`, true);
                    }, wait));
                    playSound(`key${songItem}`, false);

                } else if(songItem == "´" || songItem == "`"){

                    previous.push("bracketleft", true);
                    tOut.push(setTimeout(()=>{
                        playSound("bracketleft", true); 
                    }, wait));
                    playSound("bracketleft", false);

                } else if(songItem == "["){

                    previous.push("bracketright", true);
                    tOut.push(setTimeout(()=>{
                        playSound("bracketright", true); 
                    }, wait));
                    playSound("bracketright", false);
                    
                }
            } else{

                previous.push(`digit${songItem}`);
                timeOut = setTimeout(()=>{
                    playSound(`digit${songItem}`, true);
                }, wait);

            }
            if(!holdWait){
                wait += 1000;
            }
        }
    }
    
    tOut.push(setTimeout(()=>{
        document.querySelector('.buttons :nth-child(1)').classList.remove("active");
        document.querySelector('.buttons :nth-child(1)').setAttribute("style", "background-color: green");    

    }, wait));

    previous.forEach(item => {
        playSound(item, false);
        previous.splice(item);
    });
}