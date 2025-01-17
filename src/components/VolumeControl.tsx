import { useState, ChangeEvent, useEffect } from 'react';
import { useAudioPlayerContext } from '../context/audio-player-context';

import {
  IoMdVolumeHigh,
  IoMdVolumeOff,
  IoMdVolumeLow,
} from 'react-icons/io';

export const VolumeControl = () => {
  const [volume, setVolume] = useState<number>(60);
  const { audioRef } = useAudioPlayerContext();
  const [muteVolume, setMuteVolume] = useState(false);

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);

  return (
    <div>
      <div className="flex items-center gap-3">
        <button onClick={() => setMuteVolume((prev) => !prev)}>
          {muteVolume || volume < 5 ? (
            <IoMdVolumeOff size={25} />
          ) : volume < 40 ? (
            <IoMdVolumeLow size={25} />
          ) : (
            <IoMdVolumeHigh size={25} />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={handleVolumeChange}
          style={{
            background: `linear-gradient(to right, #f50 ${volume}%, #ccc ${volume}%)`,
          }}
        />
      </div>
    </div>
  );
};
