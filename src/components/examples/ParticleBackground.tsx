import ParticleBackground from '../ParticleBackground';

export default function ParticleBackgroundExample() {
  return (
    <div className="relative h-96 bg-background overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10 flex items-center justify-center h-full">
        <p className="text-foreground">Particle Background Demo</p>
      </div>
    </div>
  );
}