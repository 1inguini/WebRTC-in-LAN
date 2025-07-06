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

const streams = [{ audio: {} }, { video: {} }].map(async (constraint) => {
  try {
    const stream = await m.getUserMedia(constraint);
    console.info("Got MediaStream:", stream, "for", constraint);
    return { [type]: stream };
  } catch (e) {
    console.info("Error accessing device", e, "for", constraint);
  }
});

console.info(streams);
