/**
 * Contact Page Header Component
 * Header for contact page
 * Server Component (SSR)
 */

export const ContactPageHeader = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-[var(--color-foreground)]">Contact Us</h1>
      <p className="text-[var(--color-muted-foreground)] mt-2">
        Have a question or need assistance? We're here to help. Fill out the form below and we'll
        get back to you within 2 business days.
      </p>
    </div>
  );
};

