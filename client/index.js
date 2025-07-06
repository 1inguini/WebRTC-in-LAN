const $ = (q) => document.querySelector(q);
const m = navigator.mediaDevices;

const main = $("main");

//   const devices = await m.enumerateDevices();
//   console.log(devices);
//   main.appendChild(
//     devices.reduce((li, dev) => {
//       li.innerHTML += /* html */ `
// <ul>
//   <li>
//     <ul>deviceId: ${dev.deviceId}</ul>
//     <ul>kind: ${dev.kind}</ul>
//     <ul>label: ${dev.label}</ul>
//   </li>
// </ul>`;
//       return li;
//     }, document.createElement("li")),
//   );

async function getShowUserMedia(constraint) {
  try {
    const stream = await m.getUserMedia(constraint);
    console.info("Got MediaStream for", constraint, " : ", stream);
    $("li.media-streams").innerHTML += `
<ul>
  <li class="media-stream-id-${stream.id.match(/[a-z,A-Z,0-9,-]+/)[0]}">
    <ul>id: ${stream.id}</ul>
    <ul>active: ${stream.active}</ul>
    <ul>label: ${stream.label}</ul>
  </li>
</ul>
`;
    return stream;
  } catch (e) {
    console.info("Error accessing media devices.", e);
  }
}

const micStream = getShowUserMedia({ audio: {} });
const cameraStream = getShowUserMedia({ video: {} });
