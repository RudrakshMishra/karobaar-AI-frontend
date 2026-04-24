"use client";

import React, { useEffect, useRef, memo } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer = memo(({ src }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.log("Autoplay prevented:", e));
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari and native HLS support
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch((e) => console.log("Autoplay prevented:", e));
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      muted
      loop
      playsInline
      autoPlay
    />
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
