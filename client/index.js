const $ = (q) => document.querySelector(q);
const m = navigator.mediaDevices;

const main = $("main");

const streams = [{ audio: {} }, { video: {} }].map(async (constraint) => {
  try {
    const stream = m.getUserMedia(constraint);
    console.info("Got MediaStream:", stream, "for", constraint);
    return stream;
  } catch (e) {
    console.info("Error accessing device", e, "for", constraint);
  }
});

console.info("MediaStreams:", streams);

for (const promiseS of streams) {
  try {
    const s = await promiseS;
    $("li.media-streams").innerText = `MediaStream: ${s.id}`;
    const ul = document.createElement("ul");
    for (const t of s.getTracks()) {
      console.info("Got MediaStreamTrack:", t);
      ul.innerHTML += `
<li>
  MediaStreamTrack: ${t.label}
  <ul>kind: ${t.kind}</ul>
  <ul>muted: ${t.muted}</ul>
  <ul>reaadyState: ${t.readyState}</ul>
</li>
`;
    }
    $("li.media-streams").appendChild(ul);
    $("li.media-streams").removeAttribute("hidden");
  } catch (e) {}
}

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
