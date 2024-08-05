import {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  RefObject,
} from 'react';
import { tracks } from '../assets/audioTracks';

export interface Track {
  title: string;
  src: string;
  author: string;
  thumbnail?: string;
}

interface AudioPlayerContextType {
  audioRef: RefObject<HTMLAudioElement>;
  progressBarRef: RefObject<HTMLInputElement>;
  currentTrack: Track;
  setCurrentTrack: Dispatch<SetStateAction<Track>>;
  timeProgress: number;
  setTimeProgress: Dispatch<SetStateAction<number>>;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
  setTrackIndex: Dispatch<SetStateAction<number>>;
  tracks: Track[];
  isShuffle: boolean;
  setIsShuffle: Dispatch<SetStateAction<boolean>>;
  isRepeat: boolean;
  setIsRepeat: Dispatch<SetStateAction<boolean>>;
}

const AudioPlayerContext = createContext<
  AudioPlayerContextType | undefined
>(undefined);

export const AudioPlayerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [currentTrack, setCurrentTrack] = useState<Track>(
    tracks[trackIndex]
  );
  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  const contextValue = {
    audioRef,
    progressBarRef,
    currentTrack,
    setCurrentTrack,
    timeProgress,
    setTimeProgress,
    duration,
    setDuration,
    setTrackIndex,
    tracks,
    isShuffle,
    setIsShuffle,
    isRepeat,
    setIsRepeat,
  };

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);

  if (context === undefined) {
    throw new Error(
      'useAudioPlayerContext must be used within an AudioPlayerProvider'
    );
  }

  return context;
};
