import Pricing from '../Pricing';

export default function PricingExample() {
  return (
    <Pricing 
      onSelectPlan={(planName) => console.log(`Selected plan: ${planName}`)}
    />
  );
}