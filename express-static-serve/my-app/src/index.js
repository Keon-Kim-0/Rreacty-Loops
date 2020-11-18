import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));

// const ourComponent = ReactDOM.render(<App />, document.getElementById("app"));
// const parentBtn = document.getElementById("playButton");
// parentBtn.addEventListener("click", event => {
//     console.log(ourComponent.returnState())
// });
// function play() {

// }

//----------------------------------

// ReactDOM.render(<Page ref={(pageComponent) => { window.pageComponent = pageComponent }} />, document.getElementById("app"));
// const parentBtn = document.getElementById("playButton");
// parentBtn.addEventListener("click", event => {
//     play()
// });
// function play() {

// }