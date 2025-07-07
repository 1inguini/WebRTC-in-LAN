async function main() {
  [Element, Document, DocumentFragment].forEach((i) => {
    i.prototype.$ = i.prototype.querySelector;
  });
  const $ = Document.prototype.$.bind(document);

  const m = navigator.mediaDevices;
  const main = $("main");

  const streams = [{ audio: {} }, { video: {} }].map(async (constraint) => {
    try {
      const stream = m.getUserMedia(constraint);
      console.debug("Got MediaStream:", stream, "for", constraint);
      return stream;
    } catch (e) {
      console.debug("Rejected accessing device", e, "for", constraint);
    }
  });

  console.debug("MediaStreams:", streams);

  for (const promiseS of streams) {
    try {
      const s = await promiseS;
      const mediaStream = $("#template > .media-stream").cloneNode(true);
      console.debug("media-stream", mediaStream);
      mediaStream.$(".media-stream.id").innerText = s.id;
      var hasVideo = false;
      const mediaTrack = $("#template > .media-track").cloneNode(true);
      for (const t of s.getTracks()) {
        console.debug("Got MediaStreamTrack:", t);
        mediaTrack.$(".media-track.label").innerText = t.label;
        hasVideo ||= t.kind === "video";
        mediaStream.$("ul.media-tracks").appendChild(mediaTrack);
      }
      if (hasVideo) {
        mediaStream.$("audio").remove();
      } else {
        mediaStream.$("video").remove();
      }
      mediaStream.$("video, audio").srcObject = s;
      $("ul.media-streams").appendChild(mediaStream);
    } catch (e) {
      console.debug(e);
    }
  }
}

await main();
