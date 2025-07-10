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

  // Webページ内に表示
  for (const promiseS of streams) {
    try {
      const s = await promiseS;
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
    } catch (e) {
      console.debug(e);
    }
  }

  const stream = new MediaStream(
    (
      await Promise.all(
        streams.map(async (s) => {
          try {
            return (await s).getTracks();
          } catch (e) {
            console.info(e);
            return [];
          }
        }),
      )
    ).flat(),
  );
  console.info("Aggregated MediaStream:", await stream);

  const conn = new RTCPeerConnection();
  console.info("created RTCPeerConnection", conn);

  // conn.addTrack();
}

await main();
