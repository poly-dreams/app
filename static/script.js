import main from "./main.js";

async function init() {
    let status = await main();
    console.log(status);
}

window.onload = init;