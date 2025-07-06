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
    const li = document.createElement("li");
    li.innerText = `MediaStream: ${s.id}`;
    const ul = document.createElement("ul");
    li.appendChild(ul);
    var hasVideo = false;
    for (const t of s.getTracks()) {
      console.info("Got MediaStreamTrack:", t);
      ul.innerHTML += `
<li class="media-stream-track">
  MediaStreamTrack: ${t.label}
  <ul>kind: ${t.kind}</ul>
  <ul>muted: ${t.muted}</ul>
  <ul>reaadyState: ${t.readyState}</ul>
</li>
`;
      hasVideo ||= t.kind === "video";
    }
    if (hasVideo) {
      ul.innerHTML += '<video muted autoplay playsinline nocontrols></video>'
    } else {
      ul.innerHTML += '<audio controls></audio>'
    }
    ul.querySelector("video, audio").srcObject = s;
    $("ul.media-streams").appendChild(li);
    $("ul.media-streams").removeAttribute("hidden");
  } catch (e) {
    console.info(e);
  }
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
