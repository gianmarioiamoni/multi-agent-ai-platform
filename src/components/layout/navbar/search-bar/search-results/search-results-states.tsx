/**
 * Search Results States Components
 * Different UI states for search results
 * Following SRP: Only handles state rendering
 */

export const SearchResultsLoading = () => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
      <div className="p-4 text-center text-[var(--color-muted-foreground)]">
        Searching...
      </div>
    </div>
  );
};

export const SearchResultsMinLength = () => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
      <div className="p-4 text-center text-[var(--color-muted-foreground)]">
        Type at least 2 characters to search
      </div>
    </div>
  );
};

export const SearchResultsEmpty = () => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
      <div className="p-6 text-center">
        <p className="text-[var(--color-muted-foreground)] mb-2">No results found</p>
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Try searching for agents or workflows
        </p>
      </div>
    </div>
  );
};

