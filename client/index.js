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

try {
  const stream = await m.getUserMedia({
    audio: $("input[type=checkbox].permit.microphone").checked,
    video: $("input[type=checkbox].permit.camera").checked,
  });
  console.log("Got MediaStream:", stream);
} catch (error) {
  console.error("Error accessing media devices.", error);
}
