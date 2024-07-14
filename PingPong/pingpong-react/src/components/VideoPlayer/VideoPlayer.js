import React from 'react';
import './Style/videoplayer.css';

const VideoPlayer = () => (
  <section id="video-player" className="aboutPage py-5">
    <div className="videoContainer">
      <video controls className="video" preload="metadata">
        <source src={`${process.env.PUBLIC_URL}/video/video.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="videoText">PONG - First documented Video Ping-Pong game - 1969 / YouTube - pongmuseum 14 Shkurt 2009</p>
    </div>
  </section>
);

export default VideoPlayer;
