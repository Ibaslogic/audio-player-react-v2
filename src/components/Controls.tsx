import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BsFillFastForwardFill,
  BsFillPauseFill,
  BsFillPlayFill,
  BsFillRewindFill,
  BsSkipEndFill,
  BsSkipStartFill,
  BsShuffle,
  BsRepeat,
} from 'react-icons/bs';
import { useAudioPlayerContext } from '../context/audio-player-context';

export const Controls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const {
    audioRef,
    currentTrack,
    duration,
    setTimeProgress,
    setDuration,
    progressBarRef,
    tracks,
    setTrackIndex,
    setCurrentTrack,
    isShuffle,
    setIsShuffle,
    isRepeat,
    setIsRepeat,
  } = useAudioPlayerContext();

  const playAnimationRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);

      progressBarRef.current.value = currentTime.toString();
      progressBarRef.current.style.setProperty(
        '--range-progress',
        `${(currentTime / duration) * 100}%`
      );
    }
  }, [duration, setTimeProgress, audioRef, progressBarRef]);

  const startAnimation = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const animate = () => {
        updateProgress();
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration, audioRef, progressBarRef]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startAnimation();
    } else {
      audioRef.current?.pause();
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
    }

    return () => {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    };
  }, [isPlaying, startAnimation]);

  useEffect(() => {
    if (!isPlaying) {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
      updateProgress();
    }
  }, [updateProgress, isPlaying]);

  const skipForward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime += 15;
      updateProgress();
    }
  }, [updateProgress, audioRef]);

  const skipBackward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 15;
      updateProgress();
    }
  }, [updateProgress, audioRef]);

  const handlePrevious = useCallback(() => {
    setTrackIndex((prev) => {
      const newIndex = prev === 0 ? tracks.length - 1 : prev - 1;
      setCurrentTrack(tracks[newIndex]);
      return newIndex;
    });
  }, [tracks, setCurrentTrack, setTrackIndex]);

  const handleNext = useCallback(() => {
    setTrackIndex((prev) => {
      const newIndex = isShuffle
        ? Math.floor(Math.random() * tracks.length)
        : prev >= tracks.length - 1
        ? 0
        : prev + 1;
      setCurrentTrack(tracks[newIndex]);
      return newIndex;
    });
  }, [isShuffle, setCurrentTrack, setTrackIndex, tracks]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        if (isRepeat) {
          audioRef.current?.play();
        } else {
          handleNext();
        }
      };
    }
  }, [isRepeat, handleNext, audioRef]);

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="auto"
        onLoadedMetadata={onLoadedMetadata}
      />
      <button onClick={handlePrevious}>
        <BsSkipStartFill size={20} />
      </button>
      <button onClick={skipBackward}>
        <BsFillRewindFill size={20} />
      </button>
      <button onClick={() => setIsPlaying((prev) => !prev)}>
        {isPlaying ? (
          <BsFillPauseFill size={30} />
        ) : (
          <BsFillPlayFill size={30} />
        )}
      </button>
      <button onClick={skipForward}>
        <BsFillFastForwardFill size={20} />
      </button>
      <button onClick={handleNext}>
        <BsSkipEndFill size={20} />
      </button>
      <button onClick={() => setIsShuffle((prev) => !prev)}>
        <BsShuffle
          size={20}
          className={isShuffle ? 'text-[#f50]' : ''}
        />
      </button>
      <button onClick={() => setIsRepeat((prev) => !prev)}>
        <BsRepeat
          size={20}
          className={isRepeat ? 'text-[#f50]' : ''}
        />
      </button>
    </div>
  );
};
