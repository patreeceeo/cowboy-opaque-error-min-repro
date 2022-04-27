// We import the CSS which is extracted to its own file by esbuild.
// Remove this line if you add a your own CSS build pipeline (e.g postcss).
import "../css/app.css"

// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
import {channel} from "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})
let socket = new Socket("/socket", {params: {token: window.userToken}})

let button         = document.querySelector("#button")
let paragraph         = document.querySelector("#paragraph")

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})

// connect if there are any LiveViews on the page
liveSocket.connect()
socket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

button.addEventListener("mousedown", downListener)
button.addEventListener("mouseup", upListener)

function downListener() {
  console.log("sending down msg")
  channel.push("button_down", {})
}
function upListener() {
  channel.push("button_up", {})
}
channel.on("button_down", _payload => {
  console.log("received down msg")
  paragraph.innerHTML = "button is pressed!"
})
channel.on("button_up", _payload => {
  paragraph.innerHTML = "button is NOT pressed"
})