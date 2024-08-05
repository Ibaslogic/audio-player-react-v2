// useAudioPlayerStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { tracks } from '../assets/audioTracks';

interface Track {
  title: string;
  src: string;
  author: string;
  thumbnail?: string;
}

interface AudioPlayerStore {
  currentTrack: Track;
  setCurrentTrack: (track: Track) => void;
  timeProgress: number;
  setTimeProgress: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  trackIndex: number;
  setTrackIndex: (
    indexOrFn: number | ((prevIndex: number) => number)
  ) => void;
  tracks: Track[];
  audioRef: React.RefObject<HTMLAudioElement> | null;
  progressBarRef: React.RefObject<HTMLInputElement> | null;
  setAudioRef: (
    ref: React.RefObject<HTMLAudioElement> | null
  ) => void;
  setProgressBarRef: (
    ref: React.RefObject<HTMLInputElement> | null
  ) => void;
}

export const useAudioPlayerStore = create<AudioPlayerStore>()(
  devtools(
    persist(
      (set) => ({
        currentTrack: tracks[0],
        trackIndex: 0,
        setCurrentTrack: (track) => set({ currentTrack: track }),
        timeProgress: 0,
        setTimeProgress: (time) => set({ timeProgress: time }),
        duration: 0,
        setDuration: (duration) => set({ duration }),
        setTrackIndex: (indexOrFn) => {
          set((state) => {
            const index =
              typeof indexOrFn === 'number'
                ? indexOrFn
                : indexOrFn(state.trackIndex);
            const track = tracks[index];
            return { currentTrack: track, trackIndex: index };
          });
        },
        tracks,
        audioRef: null, // Initialize as null
        progressBarRef: null, // Initialize as null
        setAudioRef: (ref) => set({ audioRef: ref }),
        setProgressBarRef: (ref) => set({ progressBarRef: ref }),
      }),
      { name: 'audio-player-store', version: 1 }
    )
  )
);
