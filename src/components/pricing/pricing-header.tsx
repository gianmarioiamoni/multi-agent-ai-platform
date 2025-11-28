/**
 * Pricing Header
 * Header component for pricing page
 * Following SRP: Only UI presentation
 * SSR: Fully server-side rendered
 */

export const PricingHeader = () => {
  return (
    <div className="text-center space-y-4 mb-12">
      <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Start with a free 30-day trial, then choose the plan that fits your needs. All plans include
        our core features.
      </p>
    </div>
  );
};

