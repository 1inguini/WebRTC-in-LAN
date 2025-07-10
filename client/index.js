async function main() {
  [Element, Document, DocumentFragment].forEach((i) => {
    i.prototype.$ = i.prototype.querySelector;
  });
  const $ = Document.prototype.$.bind(document);
  const useTemplate = (q) =>
    document.importNode($(q.trimEnd() + ":is(template)").content, true);

  const m = navigator.mediaDevices;

  async function displayStream(stream) {
    const mediaStream = useTemplate(".media-stream");
    console.debug("media-stream", mediaStream);
    mediaStream.$(".media-stream.id").innerText = stream.id;
    let hasVideo = false;
    for (const t of stream.getTracks()) {
      const mediaTrack = useTemplate(".media-track");
      console.debug("media-track", mediaTrack);
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
    mediaStream.$("video, audio").srcObject = stream;
    $("ul.media-streams").appendChild(mediaStream);
  }

  // マイクとカメラを要求
  const streams = async function* () {
    for (const constraint of [{ audio: {} }, { video: {} }]) {
      try {
        const stream = await m.getUserMedia(constraint);
        console.info("Got MediaStream:", stream, "for", constraint);
        yield stream;
      } catch (e) {
        console.info("Accessing device rejected ", e, "for", constraint);
      }
    }
  };
  console.debug("MediaStreams:", streams);

  // // Webページ内に表示
  // for await (const s of streams()) {
  //   displayStream(s);
  // }

  // カメラとマイクからの入力を1つのストリームに
  const stream = new MediaStream();
  for await (const s of streams()) {
    for (const t of s.getTracks()) {
      stream.addTrack(t);
    }
  }
  console.info("Aggregated MediaStream:", stream);
  console.debug("Tracks:", stream.getTracks());
  displayStream(stream);

  const conn = new RTCPeerConnection();
  console.info("created RTCPeerConnection", conn);

  // Add MediaStream to Connection.
  for (const t of stream.getTracks()) {
    conn.addTrack(t, stream);
  }
  console.info("tracks added to RTCPeerConnection", conn.getTransceivers());

  // WHIP
  conn.onnegotiationneeded = async (_) => {
    const offer = conn.createOffer();
    await conn.setLocalDescription(offer);
    const fetched = await fetch($(".endpoint").value, {
      method: "POST",
      body: (await offer).sdp,
      headers: {
        "Content-Type": "application/sdp",
      },
    });
    const answer = await fetched.text();
    console.debug("sdp answer:", answer);
    try {
      await conn.setRemoteDescription({ type: "answer", sdp: answer });
    } catch (e) {
      console.debug(e);
      conn.onnegotiationneeded()
    }

    console.info("Connection Established", conn.currentRemoteDescription);
  };

   await conn.onnegotiationneeded();

  // WHIP
  // const fetched = await fetch($(".endpoint").value, {
  //   method: "POST",
  //   body: (await offer).sdp,
  //   headers: {
  //     "Content-Type": "application/sdp",
  //   },
  // });
  // const answer = await fetched.text();
  // console.debug("sdp answer:", answer);
  // await conn.setRemoteDescription({ type: "answer", sdp: answer });

  // console.info("Connection Established", conn.currentRemoteDescription);
}

await main();
