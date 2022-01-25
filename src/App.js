import React, { useState, useEffect } from "react";
import "./App.css";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [audio, setaudio] = useState();
  const [image, setImage] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    // Write the file to memory
    ffmpeg.FS("writeFile", "epi.png", await fetchFile(image));
    ffmpeg.FS("writeFile", "epi.wav", await fetchFile(audio));

    // Run the FFMpeg command
    
    
// ffmpeg -i ep1.png -i ep1.wav ep1.flv
    
    await ffmpeg.run("-i", "epi.png", "-i", "epi.wav", "ep1.mp4");

    // Read the result
    const data = ffmpeg.FS("readFile", "ep1.mp4");

    // Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
    setGif(url);
  };

  return ready ? (
    <div className="App">
      {video && (
        <video controls width="250" src={URL.createObjectURL(video)}></video>
      )}

      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

      <input type="file" onChange={(e) => setaudio(e.target.files?.item(0))} />

      <input type="file" onChange={(e) => setImage(e.target.files?.item(0))} />

      <button onClick={convertToGif}>Convert</button>

      {gif && <video controls width="250" src={gif}></video>}
      <a href={gif} download>
        Click to download
      </a>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
