//data save+ scroll guide in down right corner + wavelength.png dropdown for waveform
//bpm,reverb,and waveform are floating... assign it to the (will be created) list of projects and put all of em there in one column
//now make some rock music like SAIL and stairway to heaven and demo that shit
//handle drop tables thing, 1. google to continue when error, 2. idk

import React from "react";
import axios from "axios";
import "./styles.css";
import { soundEffect, sounds } from "./SoundEngine.js";
//--------------upload/load section------------------------------------
let nameOfProject = Math.random() * 100
let uploader = document.getElementById('uploadButton')
let loader = document.getElementById('loadButton')

let nameBox = document.getElementById("projectName")

nameBox.addEventListener('input', event => {
    nameOfProject = nameBox.value
})

uploader.addEventListener('click', () => {
    globalState.name = nameOfProject
    globalState.bpm = bpm
    uploadProject(globalState)
})

//req.body generated here(globalState.project)^^^


//query generated herre vvvv

// async function uploadProject(data) {
//     console.log('uploadproject function initiated')
//     // axios.post("/upload", { 'beep': 'boop' }).then((response) => {
//     //     console.log(response)
//     // })
//     await fetch('/upload', {
//         method: 'POST', // *GET, POST, PUT, DELETE, etc.
//         body: JSON.stringify({ a: 7, str: 'Some string: &=&' })//JSON.stringify(data)       // body data type must match "Content-Type" header
//     }).then(function (response) {
//         // The response is a Response instance.
//         // You parse the data into a useable format using `.json()`
//         return response.json();
//     }).then(function (data) {
//         // `data` is the parsed version of the JSON returned from the above endpoint.
//         console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
//     });
//     // console.log(response.json()); // parses JSON response into native JavaScript objects
// }

async function uploadProject(data) {
    const rawResponse = await fetch('/upload', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
    });
    const content = await rawResponse.json();

    console.log(content);
};

//---------------------------------sound.js api setup---------------------------------
sounds.load([
    "./samples/HiHat.mp3",
    "./samples/Kick.mp3",
    "./samples/Snare.mp3"
]);

sounds.onProgress = function (progress, res) {
    console.log('Total ' + progress + ' file(s) loaded.');
    console.log('File ' + res.url + ' just finished loading.');
};

sounds.whenLoaded = setup

let kick
// kickReverb,
let snare
// snareReverb,
let hihat
//, hihatReverb

function setup() {
    kick = sounds["./samples/Kick.mp3"]
    // kickReverb = sounds["./samples/Kick2.mp3"]

    snare = sounds["./samples/Snare.mp3"]
    // snareReverb = sounds["./samples/Snare2.mp3"]

    hihat = sounds["./samples/HiHat.mp3"]
    // hihatReverb = sounds["./samples/HiHat2.mp3"]

    // snare.setReverb(2, 40, false)



    // snareReverb.setReverb(2, 30, false);
    // kickReverb.setReverb(2, 30, false);
    // hihatReverb.setReverb(2, 30, false);
}
//==============================vvv=synth section=vvv==========================================================
let synthChoice = 'sawtooth'; //"sine", "triangle", "square", "sawtooth"
let reverbChoice = undefined//[1, 5, false];
let echoChoice = undefined;
let panChoice = 0;
//----------------------synth select------------------------------

let sawButton = document.getElementById('saw')
let sineButton = document.getElementById('sin')
let squareButton = document.getElementById('square')
let triangleButton = document.getElementById('triangle')

sawButton.addEventListener('click', () => {
    synthChoice = 'sawtooth'
})
sineButton.addEventListener('click', () => {
    synthChoice = 'sine'
})
squareButton.addEventListener('click', () => {
    synthChoice = 'square'
})
triangleButton.addEventListener('click', () => {
    synthChoice = 'triangle'
})
//----------------------synth select------------------------------


//-----------------reverb/echo sliders--------------------------
let reverbSlider = document.getElementById('reverbSlider')
reverbSlider.addEventListener('click', () => {
    if (reverbChoice === undefined) {
        reverbChoice = [1, 0.5, false]
    } else {
        reverbChoice = undefined
    }
})
let echoSlider = document.getElementById('echoSlider')
echoSlider.addEventListener('click', () => {
    if (echoChoice === undefined) {
        echoChoice = [(tpi * 3) / 1000, 0.5, 1000]
    } else {
        echoChoice = undefined
    }
})


//-----------------reverb slider--------------------------


function syntheronie(freq) {
    soundEffect(
        freq,           //frequency
        0,                //attack
        0.3,              //decay
        synthChoice,       //waveform
        0.3,                //Volume
        panChoice,             //pan
        0,                //wait before playing
        0,             //pitch bend amount
        false,            //reverse bend
        0,                //random pitch range
        0,               //dissonance
        echoChoice, //echo array: [delay, feedback, filter]
        reverbChoice// [2, 2, false]        //reverb array: [duration, decay, reverse?]
    );
}
let freqArray = [493.88, 466.16, 440, 415.3,
    392, 369.99, 349.23, 329.63,
    311.13, 293.66, 277.18, 261.63,
    246.94, 233.08, 220, 207.65,
    196, 185, 174.61, 164.81,
    155.56, 146.83, 138.59, 130.81]

//==============================^^^=synth section=^^^==========================================================
//-------------------------------------------------------------------------------------
let globalState = {};
let bpm = 130
let tpi = 115.3846153846154

//--------------------samples-------------------
// let kick = document.getElementById('sample-Kick')
// let snare = document.getElementById('sample-Snare')
// let hihat = document.getElementById('sample-HiHat')

//----------------------------------------------


export default class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            project: [],
            playPosition: 0
        };
    }
    componentDidMount() {
        axios.get("/YourProject").then((response) => {
            this.setState({ project: response.data });
        }).then(() => {
            globalState = JSON.parse(JSON.stringify(this.state))
        })
    }
    async update(inst, index, pianoIndex) {
        if (inst === 'piano') {
            syntheronie(freqArray[pianoIndex])
        } else {
            eval(inst).play();
        }

        // eval(inst + 'Reverb').play();
        // eval(inst).currentTime = 0;
        let updatedState = this.state
        const tiktok = async () => {
            if (inst === 'piano') {
                let frequency = freqArray[pianoIndex]
                if (updatedState.project[index].piano.includes(frequency)) {
                    updatedState.project[index].piano = updatedState.project[index].piano.filter(x => x !== frequency)
                } else {
                    updatedState.project[index].piano.push(frequency)
                }
                // updatedState.project[index][inst][pianoIndex] === 1 ?
                //     updatedState.project[index][inst][pianoIndex] = 0 :
                //     updatedState.project[index][inst][pianoIndex] = 1
            } else {
                updatedState.project[index][inst] === true ?
                    updatedState.project[index][inst] = false :
                    updatedState.project[index][inst] = true
            }
        }
        await tiktok()
        await this.setState(updatedState)
        globalState = JSON.parse(JSON.stringify(this.state))
    }
    // returnState = () => {
    //     return this.state
    // 
    loadProject() {
        let nameCache = nameOfProject
        console.log('in loadProject')
        axios.get("/load", { params: { name: nameOfProject } }).then((response) => {
            this.setState({ project: response.data });
        }).then(() => {
            globalState = JSON.parse(JSON.stringify(this.state))
        })
    }
    placer(index) {
        this.setState({ playPosition: index })
        globalState.playPosition = index
        stop = true;
        channelControl = 0;
        line.setAttribute("x1", index * 25 + 100);
        line.setAttribute("x2", index * 25 + 100);
    }
    colorCaster(inst, index, pianoIndex) {
        if (inst === 'kick') {
            return this.state.project[index][inst] === true ? 'rgba(90, 85, 170, 1)' : 'white'
        }
        if (inst === 'snare') {
            return this.state.project[index][inst] === true ? 'rgba(180, 230, 0, 1)' : 'white'
        }
        if (inst === 'hihat') {
            return this.state.project[index][inst] === true ? 'rgba(246, 76, 70, 1)' : 'white'
        } if (inst === 'piano') {
            return this.state.project[index].piano.includes(freqArray[pianoIndex]) ? 'rgba(46, 255, 199, 1) ' : 'white'
        }
    }
    render() {
        const { project } = this.state;
        const indicator = project.slice(0, 512).map((inst, xi) => {
            if (xi % 4 === 0) {
                return (<div className='indicatorOB' id={'indicator' + String(xi * 4)} onClick={() => this.placer(xi * 4)}>{'bar:'}<span className='barFont'>{(Math.floor(xi / 4) + 1)}</span>{' beat:'}<span className='beatFont'>{String((xi % 4) + 1)}</span></div>)
            }
            else {
                return (<div className='indicator' id={'indicator' + String(xi * 4)} onClick={() => this.placer(xi * 4)}>{'bar:'}<span className='barFont'>{(Math.floor(xi / 4) + 1)}</span>{' beat:'}<span className='beatFont'>{String((xi % 4) + 1)}</span></div>)
            }
        })
        const subIndicator = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='subIndicatorOB' id={'indicator' + String(xi)} onClick={() => this.placer(xi)}><span className='beatFont2'>{String((xi % 16) + 1) + '/16'}</span></div>)
            }
            else {
                return (<div className='subIndicator' id={'indicator' + String(xi)} onClick={() => this.placer(xi)}><span className='beatFont2'>{String((xi % 16) + 1) + '/16'}</span></div>)
            }
        })

        //for black boxes change background colors on click(reference tic tac toe and for setState, ajax assessment? or google)
        const kickRow = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='boxOB' id={'kick' + String(xi)} onClick={() => this.update('kick', xi)} style={{ backgroundColor: this.colorCaster.bind(this)('kick', xi) }}></div>)
            }
            else {
                return (<div className='box' id={'kick' + String(xi)} onClick={() => this.update('kick', xi)} style={{ backgroundColor: this.colorCaster.bind(this)('kick', xi) }}></div>)
            }
        })
        const snareRow = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='boxOB' id={'snare' + String(xi)} onClick={() => this.update('snare', xi)} style={{ backgroundColor: this.colorCaster.bind(this)('snare', xi) }}></div>)
            }
            else {
                return (<div className='box' id={'snare' + String(xi)} onClick={() => this.update('snare', xi)} style={{ backgroundColor: this.colorCaster.bind(this)('snare', xi) }}></div>)
            }
        })
        const hihatRow = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='boxOB' id={'hihat' + String(xi)} onClick={() => this.update('hihat', xi)} style={{ backgroundColor: this.colorCaster.bind(this)('hihat', xi) }}></div>)
            }
            else {
                return (<div className='box' id={'hihat' + String(xi)} onClick={() => this.update('hihat', xi)} style={{ backgroundColor: this.colorCaster.bind(this)('hihat', xi) }}></div>)
            }
        })
        //PIANO ROWS
        const pianoRow0 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 0)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 0), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 0)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 0), }}></div>)
            }
        })
        const pianoRow1 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 1)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 1), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 1)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 1), }}></div>)
            }
        })
        const pianoRow2 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 2)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 2), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 2)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 2), }}></div>)
            }
        })
        const pianoRow3 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 3)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 3), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 3)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 3), }}></div>)
            }
        })
        const pianoRow4 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 4)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 4), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 4)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 4), }}></div>)
            }
        })
        const pianoRow5 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 5)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 5), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 5)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 5), }}></div>)
            }
        })
        const pianoRow6 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 6)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 6), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 6)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 6), }}></div>)
            }
        })
        const pianoRow7 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 7)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 7), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 7)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 7), }}></div>)
            }
        })
        const pianoRow8 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 8)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 8), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 8)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 8), }}></div>)
            }
        })
        const pianoRow9 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 9)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 9), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 9)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 9), }}></div>)
            }
        })
        const pianoRow10 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 10)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 10), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 10)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 10), }}></div>)
            }
        })
        const pianoRow11 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 11)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 11), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 11)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 11), }}></div>)
            }
        })
        const pianoRow12 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 12)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 12), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 12)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 12), }}></div>)
            }
        })
        const pianoRow13 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 13)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 13), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 13)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 13), }}></div>)
            }
        })
        const pianoRow14 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 14)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 14), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 14)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 14), }}></div>)
            }
        })
        const pianoRow15 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 15)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 15), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 15)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 15), }}></div>)
            }
        })
        const pianoRow16 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 16)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 16), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 16)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 16), }}></div>)
            }
        })
        const pianoRow17 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 17)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 17), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 17)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 17), }}></div>)
            }
        })
        const pianoRow18 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 18)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 18), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 18)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 18), }}></div>)
            }
        })
        const pianoRow19 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 19)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 19), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 19)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 19), }}></div>)
            }
        })
        const pianoRow20 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 20)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 20), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 20)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 20), }}></div>)
            }
        })
        const pianoRow21 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 21)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 21), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 21)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 21), }}></div>)
            }
        })
        const pianoRow22 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 22)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 22), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 22)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 22), }}></div>)
            }
        })
        const pianoRow23 = project.map((inst, xi) => {
            if (xi % 16 === 0) {
                return (<div className='pianoOB' onClick={() => this.update('piano', xi, 23)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 23), }}></div>)
            }
            else {
                return (<div className='piano' onClick={() => this.update('piano', xi, 23)} style={{ backgroundColor: this.colorCaster.bind(this)('piano', xi, 23), }}></div>)
            }
        })

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        return (
            <div className="behind" style={{ zIndex: '0' }}>
                <button id='loadButton' onClick={() => this.loadProject()}>load</button>
                <ul id='grid'>
                    <li className='indiRows'>{indicator}</li>
                    <li className='indiRows'>{subIndicator}</li>
                    <li className='indiRows'>{pianoRow0}</li>
                    <li className='indiRows'>{pianoRow1}</li>
                    <li className='indiRows'>{pianoRow2}</li>
                    <li className='indiRows'>{pianoRow3}</li>
                    <li className='indiRows'>{pianoRow4}</li>
                    <li className='indiRows'>{pianoRow5}</li>
                    <li className='indiRows'>{pianoRow6}</li>
                    <li className='indiRows'>{pianoRow7}</li>
                    <li className='indiRows'>{pianoRow8}</li>
                    <li className='indiRows'>{pianoRow9}</li>
                    <li className='indiRows'>{pianoRow10}</li>
                    <li className='indiRows'>{pianoRow11}</li>
                    <li className='indiRows'>{pianoRow12}</li>
                    <li className='indiRows'>{pianoRow13}</li>
                    <li className='indiRows'>{pianoRow14}</li>
                    <li className='indiRows'>{pianoRow15}</li>
                    <li className='indiRows'>{pianoRow16}</li>
                    <li className='indiRows'>{pianoRow17}</li>
                    <li className='indiRows'>{pianoRow18}</li>
                    <li className='indiRows'>{pianoRow19}</li>
                    <li className='indiRows'>{pianoRow20}</li>
                    <li className='indiRows'>{pianoRow21}</li>
                    <li className='indiRows'>{pianoRow22}</li>
                    <li className='indiRows'>{pianoRow23}</li>
                    <li className='rows'>{kickRow}</li>
                    <li className='rows'>{snareRow}</li >
                    <li className='rows'>{hihatRow}</li >
                </ul >
            </div >
        );
    }
}


// lineDiv.style.zIndex = 10;
// for (var i = 0; i < buttonArray.length; i++) {
//     buttonArray[i].onclick = function () {
//         var localI = i;
//         return function () { clickHandler(orderArray.indexOf(localI)); };
//     }();
// }


// function clickHandler(divIndex) {
//     orderArray.push(orderArray.splice(divIndex, 1)[0]);
//     orderDivs();
// }

// function orderDivs() {
//     for (var i = 0; i < orderArray.length; i++) {
//         divArray[orderArray[i]].style.zIndex = i;
//     }
// }
//--------------------------------------

//SYICKY SECTION-------------------------------------------
let stickyPiano = document.getElementById('stickyPiano')
stickyPiano.style.top = '150px'
// position: absolute;
// top: 150px;
// left: 100px;
// z - index: 15;
window.addEventListener('scroll', () => {
    stickyPiano.style.left = window.scrollX + 'px'
})



//LINE RENDERR SECTION-------------------


let line = document.getElementById('line')
let lineBox = document.getElementById('svg')
let lineDiv = document.getElementById('up')
let grid = document.getElementById('grid')
window.addEventListener('load', () => {
    lineBox.setAttribute('width', document.documentElement.scrollWidth + 100)
    lineBox.setAttribute('height', document.documentElement.scrollHeight + 100)
    // line.setAttribute("y1", 0);
    // line.setAttribute("x2", 200);
    line.setAttribute("y2", String((document.documentElement.scrollHeight + 100)))
    lineDiv.setAttribute('height', String(document.documentElement.scrollHeight + 100))
});
window.addEventListener('resize', () => {
    lineBox.setAttribute('width', document.documentElement.scrollWidth + 100)
    lineBox.setAttribute('height', document.documentElement.scrollHeight + 100)
    // line.setAttribute("y1", 0);
    // line.setAttribute("x2", 200);
    line.setAttribute("y2", String((document.documentElement.scrollHeight + 100)))
    lineDiv.setAttribute('max-height', String(document.documentElement.scrollHeight + 100))
});

// let lineControl = 1;

function lineAnimate(pos, lifeSpan) {
    if (stop === false) {
        line.setAttribute("x1", pos);
        line.setAttribute("x2", pos);
    }
    // if (stop !== true && lifeSpan < 5) {
    //     console.log('L' + lifeSpan)
    //     line.setAttribute("x1", pos);
    //     line.setAttribute("x2", pos);
    //     // console.log(line.y2.baseVal.value) ********************************
    //     setTimeout(() => { lineAnimate(pos + 5, lifeSpan + 1) }, tpi / 5)
    // }
    // return
}
// function lineAnimate1(pos) {
//     if (stop !== true && pos < 51240) {
//         line.setAttribute("x1", pos + 5);
//         line.setAttribute("x2", pos + 5);
//         // console.log(line.y2.baseVal.value) ********************************
//         if (lineControl === 1) {
//             setTimeout(() => { lineAnimate1(pos + 5) }, tpi / 5)
//         }
//         return
//     }
// }
// function lineAnimate2(pos) {
//     if (stop !== true && pos < 51240) {
//         line.setAttribute("x1", pos + 5);
//         line.setAttribute("x2", pos + 5);
//         // console.log(line.y2.baseVal.value) ********************************
//         if (lineControl === 2) {
//             setTimeout(() => { lineAnimate2(pos + 5) }, tpi / 5)
//         }
//         return
//     }
// }


//-------------------------------------
//BPM SECTION---------------------------
let bpmBox = document.getElementById("bpmInput")
bpmBox.addEventListener('input', event => {
    bpm = bpmBox.value
    bpmToTpi(bpm)
})

function bpmToTpi(bpm) {
    tpi = 60000 / (bpm * 4)
}


//---------------------------------



//SOUND ENGINE SECTION----------------------------------

//----------------button section-------------------
const playBtn = document.getElementById("playButton");
const stopBtn = document.getElementById("stopButton");
const pauseBtn = document.getElementById("pauseButton");

let stop = false;
let pause = false;
let channelControl = 1;
let audioIndex = 0

// let kick = document.getElementById('sample-Kick')
// let snare = document.querySelector('sample-Snare')
//  ^ assigned at top so react can use


playBtn.addEventListener("click", event => {
    stop = false;
    if (channelControl === 1) {
        channelControl = 2;
        if (pause === true) {
            pause = false;
            playRecursion2(audioIndex, 0);
        } else {
            playRecursion2(globalState.playPosition, 0);
        }
    } else {
        channelControl = 1;
        if (pause === true) {
            pause = false;
            playRecursion1(audioIndex, 0);
        } else {
            playRecursion1(globalState.playPosition, 0);
        }
    }
    //line controll---------------------------------
    // if (lineControl === 1) {
    //     lineControl = 2;
    //     if (pause === true) {
    //         pause = false;
    //         lineAnimate2(Math.floor(audioIndex * 25) + 100)
    //     } else {
    //         lineAnimate2(globalState.playPosition + 100)
    //     }

    // } else {
    //     lineControl = 1;
    //     if (pause === true) {
    //         pause = false;
    //         lineAnimate1(Math.floor(audioIndex * 25) + 100)
    //     } else {
    //         lineAnimate1(globalState.playPosition + 100)
    //     }
    // }
    //line controll---------------------------------
});


stopBtn.addEventListener("click", event => {
    stop = true;
    line.setAttribute("x1", globalState.playPosition * 25 + 100);
    line.setAttribute("x2", globalState.playPosition * 25 + 100);
});
pauseBtn.addEventListener("click", event => {
    stop = true;
    pause = true;
    // globalState.playPosition + 100
});
//-----------------------------------------------------


function playRecursion1(pos, index) {
    audioIndex = pos + index
    lineAnimate(((pos + index) * 25) + 100, 0)
    if (channelControl === 1 && stop !== true && pos + index < 2048) {
        setTimeout(() => {
            playRecursion1(pos, index + 1)
        }, tpi)

        let sliceObj = globalState.project[pos + index]
        if (sliceObj.kick === true) {
            kick.play()
            // kickReverb.play()
            // kick.currentTime = 0;
        } if (sliceObj.snare === true) {
            snare.play()
            // snareReverb.play()
            // snare.currentTime = 0;
        } if (sliceObj.hihat === true) {
            hihat.play()
            // hihatReverb.play()
            // hihat.currentTime = 0;
        }
        //////////////////PIANO///////////////////
        sliceObj.piano.forEach((x) => {
            syntheronie(x)
        })
        //////////////////PIANO///////////////////

    }
}


function playRecursion2(pos, index) {
    if (channelControl === 2 && stop !== true && pos + index < 2048) {
        setTimeout(() => {
            playRecursion2(pos, index + 1)
        }, tpi)
        audioIndex = pos + index
        lineAnimate(((pos + index) * 25) + 100, 0)
        let sliceObj = globalState.project[pos + index]
        if (sliceObj.kick === true) {
            kick.play()
            // kickReverb.play()
            // kick.currentTime = 0;
        } if (sliceObj.snare === true) {
            snare.play()
            // snareReverb.play()
            // snare.currentTime = 0;
        } if (sliceObj.hihat === true) {
            hihat.play()
            // hihatReverb.play()
            // hihat.currentTime = 0;
        }
        //////////////////PIANO///////////////////
        sliceObj.piano.forEach((x) => {
            syntheronie(x)
        })
        //////////////////PIANO///////////////////
    }
}


//MAKE CHANGES SO THAT this.state.playPosition changes to the index of clicked indicators using set state
//************************************************************

//         time per increment
//                 |
//                 v

/***********************************************************
 
kick.play();
kick.currentTime = 0;
 
**********************************************************/

// window.onscroll = function () { navStick() };

// Get the navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position

// function navStick() {
//     if (window.pageXOffset >= sticky) {
//         navbar.classList.add("sticky")
//     } else {
//         navbar.classList.remove("sticky");
//     }
// }


// "dead" : {
//     url: "sounds/dead.wav"
// },
// "ping" : {
//     url: "sounds/ping.mp3",
//         volume : .5
// }