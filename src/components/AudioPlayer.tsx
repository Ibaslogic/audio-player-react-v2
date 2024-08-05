import { AdditionalControls } from './AdditionalControls';
import { TrackInfo } from './TrackInfo';
import { Controls } from './Controls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { Playlist } from './Playlist';

// interface AudioPlayerProps {}

export const AudioPlayer = () => {
  console.log('AudioPlayer');
  return (
    <div>
      <div className="min-h-8 bg-[#2e2d2d] flex flex-col gap-9 lg:flex-row justify-between items-center text-white p-[0.5rem_10px]">
        <TrackInfo />
        <div className="w-full flex flex-col items-center gap-1 m-auto flex-1">
          <Controls />
          <ProgressBar />
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <VolumeControl />
          <AdditionalControls />
        </div>
      </div>

      <div>
        <Playlist />
      </div>
    </div>
  );
};
