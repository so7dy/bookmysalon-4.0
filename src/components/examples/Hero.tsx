import Hero from '../Hero';

export default function HeroExample() {
  return (
    <Hero 
      onCalculateROI={() => console.log('Calculate ROI clicked')}
      onHearCall={() => console.log('Hear Call clicked')}
    />
  );
}