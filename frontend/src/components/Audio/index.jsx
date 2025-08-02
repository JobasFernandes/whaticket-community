import { useRef, useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const LS_NAME = "audioMessageRate";

function AudioComponent({ url }) {
  const audioRef = useRef(null);
  const [audioRate, setAudioRate] = useState(
    parseFloat(localStorage.getItem(LS_NAME) || "1")
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = audioRate;
      localStorage.setItem(LS_NAME, audioRate);
    }
  }, [audioRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    const handlePlay = () => {
      setIsPlaying(true);
      setShowControls(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setShowControls(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = e => {
    const audio = audioRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  };

  const toogleRate = () => {
    let newRate = null;

    switch (audioRate) {
      case 0.5:
        newRate = 1;
        break;
      case 1:
        newRate = 1.5;
        break;
      case 1.5:
        newRate = 2;
        break;
      case 2:
        newRate = 0.5;
        break;
      default:
        newRate = 1;
        break;
    }

    setAudioRate(newRate);
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-72 max-w-full">
      <audio ref={audioRef} preload="metadata">
        <source src={url} type="audio/ogg" />
        <source src={url} type="audio/mpeg" />
        <source src={url} type="audio/wav" />
      </audio>

      {/* Player Controls */}
      <div className="flex items-center space-x-2">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="flex items-center justify-center w-8 h-8 bg-blue-700 hover:bg-blue-800 text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0"
        >
          {isPlaying ? (
            <Pause size={14} fill="currentColor" />
          ) : (
            <Play size={14} fill="currentColor" className="ml-0.5" />
          )}
        </button>

        {/* Progress Bar */}
        <div className="flex-1 flex items-center space-x-2">
          <span className="text-xs text-gray-300 dark:text-gray-400 font-mono min-w-[32px] text-center">
            {formatTime(currentTime)}
          </span>

          <div
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative overflow-hidden border border-gray-300 dark:border-gray-600"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-100"
              style={{
                width:
                  duration > 0 ? `${(currentTime / duration) * 100}%` : "0%"
              }}
            />
          </div>

          <span className="text-xs text-gray-300 dark:text-gray-400 font-mono min-w-[32px] text-center">
            {formatTime(duration)}
          </span>
        </div>

        {/* Speed Control */}
        {(showControls || duration > 0) && (
          <button
            onClick={toogleRate}
            className="px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-200 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-200/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors duration-200 min-w-[32px] flex-shrink-0"
          >
            {audioRate}x
          </button>
        )}

        {/* Volume Button */}
        <button
          onClick={toggleMute}
          className="p-1.5 text-gray-300 dark:text-gray-400 hover:text-blue-300 dark:hover:text-gray-200 transition-colors duration-200 flex-shrink-0"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}

export default AudioComponent;
