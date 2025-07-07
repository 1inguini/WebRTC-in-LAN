[Element, Document, DocumentFragment].forEach((i) => {
  i.prototype.$ = i.prototype.querySelector;
});
const $ = Document.prototype.$.bind(document);

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
    const li = $("template.media-stream").content.children[0].cloneNode(true);
    console.info("media-stream", li);
    li.$(".media-stream.id").innerText = s.id;
    var hasVideo = false;
    const mediaTrackLi = li.$("template.media-track").content.children[0].cloneNode(true);
    for (const t of s.getTracks()) {
      console.info("Got MediaStreamTrack:", t);
      mediaTrackLi.$(".media-track.label").innerText = t.label;
      hasVideo ||= t.kind === "video";
      li.$("ul.media-tracks").appendChild(mediaTrackLi);
    }
    if (hasVideo) {
      li.$("audio").remove();
    } else {
      li.$("video").remove();
    }
    li.$("video, audio").srcObject = s;
    $("ul.media-streams").appendChild(li);
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
