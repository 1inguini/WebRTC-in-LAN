async function main() {
  [Element, Document, DocumentFragment].forEach((i) => {
    i.prototype.$ = i.prototype.querySelector;
  });
  const $ = Document.prototype.$.bind(document);
  const useTemplate = (q) =>
    document.importNode($(q.trimEnd() + ":is(template)").content, true);

  const m = navigator.mediaDevices;
  const main = $("main");

  // マイクとカメラを要求
  const streams = (async function* () {
    for (const constraint of [{ audio: {} }, { video: {} }]) {
      try {
        const stream = await m.getUserMedia(constraint);
        console.info("Got MediaStream:", stream, "for", constraint);
        yield stream;
      } catch (e) {
        console.info("Accessing device rejected ", e, "for", constraint);
      }
    }
  })();
  console.debug("MediaStreams:", streams);

  // Webページ内に表示
  for await (const s of streams) {
    const mediaStream = useTemplate(".media-stream");
    console.debug("media-stream", mediaStream);
    mediaStream.$(".media-stream.id").innerText = s.id;
    let hasVideo = false;
    const mediaTrack = useTemplate(".media-track");
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
  }

  const stream = new MediaStream(
    (await Array.fromAsync(streams))
      .map((s) => {
        try {
          return s.getTracks();
        } catch (e) {
          console.debug(e);
        }
      })
      .flat(),
  );
  console.info("Aggregated MediaStream:", stream);

  const conn = new RTCPeerConnection();
  console.info("created RTCPeerConnection", conn);

  // conn.addTrack();
}

await main();
