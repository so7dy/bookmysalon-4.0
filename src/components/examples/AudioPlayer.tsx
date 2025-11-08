import AudioPlayer from '../AudioPlayer';

export default function AudioPlayerExample() {
  return (
    <AudioPlayer 
      onDownloadDemo={(demoId) => console.log(`Download demo: ${demoId}`)}
    />
  );
}