import { useMemo, useState } from "react";
import paths from "./data/paths.json";

const categories = [
  "All",
  "Tools",
  "Learning",
  "Maps / Places",
  "Entertainment",
  "Utilities"
];

const themes = {
  dark: {
    page: "bg-slate-950 text-slate-100",
    panel: "border-slate-800 bg-slate-900",
    muted: "text-slate-400",
    subtle: "bg-slate-800 text-slate-300 hover:bg-slate-700",
    input:
      "border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500"
  },
  light: {
    page: "bg-slate-50 text-slate-900",
    panel: "border-slate-200 bg-white",
    muted: "text-slate-500",
    subtle: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    input:
      "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
  }
};

function App() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLight, setIsLight] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const [showSubmission, setShowSubmission] = useState(false);

  const theme = isLight ? themes.light : themes.dark;

  const filteredPaths = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return paths.filter((path) => {
      const matchesCategory =
        selectedCategory === "All" || path.category === selectedCategory;

      const searchableText = [
        path.title,
        path.category,
        path.description,
        ...path.tags
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      );
    });
  }, [query, selectedCategory]);

  function submitSuggestion(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");
    const link = formData.get("link");
    const category = formData.get("category");
    const details = formData.get("details");

    const issueUrl = new URL(
      "https://github.com/alvesdealbuquerquefilhobruno-lgtm/wayfinder-hub/issues/new"
    );
    issueUrl.searchParams.set("title", `Resource suggestion: ${title}`);
    issueUrl.searchParams.set(
      "body",
      [
        "## Suggested resource",
        `- **Name:** ${title}`,
        `- **Category:** ${category}`,
        `- **Link:** ${link}`,
        "",
        "## Details",
        details || "No additional details provided.",
        "",
        "Submitted through the Wayfinder website. Please review before adding."
      ].join("\n")
    );
    issueUrl.searchParams.set("labels", "resource-submission");

    window.open(issueUrl.toString(), "_blank", "noopener,noreferrer");
    setShowSubmission(false);
    event.currentTarget.reset();
  }

  return (
    <main className={`min-h-screen transition-colors ${theme.page}`}>
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-3" aria-label="Wayfinder home">
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-400 font-black text-slate-950">
              W
            </span>
            <span className="text-lg font-semibold tracking-tight">Wayfinder</span>
          </a>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSubmission(true)}
              className={`hidden rounded-lg px-4 py-2 text-sm font-medium sm:inline-flex ${theme.subtle}`}
            >
              Suggest a resource
            </button>
            <button
              type="button"
              onClick={() => setIsLight((current) => !current)}
              className={`rounded-lg px-3 py-2 text-sm ${theme.subtle}`}
              aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
            >
              {isLight ? "☾ Dark" : "☼ Light"}
            </button>
          </div>
        </header>

        <section className="mx-auto max-w-3xl pb-12 pt-20 text-center sm:pt-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Find your way
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Find what you’re looking for.
          </h1>
          <p className={`mx-auto mt-5 max-w-xl text-base sm:text-lg ${theme.muted}`}>
            Search useful tools, places, learning resources, and more — with a
            clear path to get there.
          </p>

          <label className="sr-only" htmlFor="resource-search">
            Search resources
          </label>
          <div className="relative mx-auto mt-9 max-w-2xl">
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl ${theme.muted}`}
            >
              ⌕
            </span>
            <input
              id="resource-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools, places, learning, entertainment..."
              className={`w-full rounded-2xl border py-5 pl-14 pr-5 text-base shadow-lg outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 ${theme.input}`}
            />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-cyan-400 text-slate-950"
                    : theme.subtle
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="resources-heading" className="pb-20">
          <div className="mb-5 flex items-center justify-between">
            <h2 id="resources-heading" className="text-xl font-semibold">
              {query ? "Search results" : "Curated paths"}
            </h2>
            <span className={`text-sm ${theme.muted}`}>
              {filteredPaths.length} {filteredPaths.length === 1 ? "resource" : "resources"}
            </span>
          </div>

          {filteredPaths.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredPaths.map((path) => (
                <article
                  key={path.id}
                  className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/60 ${theme.panel}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                        {path.category}
                      </span>
                      <h3 className="mt-2 text-lg font-semibold">{path.title}</h3>
                    </div>
                    <a
                      href={path.url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                    >
                      Visit ↗
                    </a>
                  </div>

                  <p className={`mt-3 text-sm leading-6 ${theme.muted}`}>
                    {path.description}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPath(selectedPath === path.id ? null : path.id)
                    }
                    aria-expanded={selectedPath === path.id}
                    className="mt-4 text-sm font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    {selectedPath === path.id ? "Hide steps ↑" : "Show me the way →"}
                  </button>

                  {selectedPath === path.id && (
                    <ol className={`mt-4 list-inside list-decimal space-y-2 text-sm ${theme.muted}`}>
                      {path.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {path.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-md px-2 py-1 text-xs ${theme.subtle}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={`rounded-2xl border p-10 text-center ${theme.panel}`}>
              <p className="font-medium">No matching resources yet.</p>
              <p className={`mt-2 text-sm ${theme.muted}`}>
                Try another search, or suggest a resource for the directory.
              </p>
              <button
                type="button"
                onClick={() => setShowSubmission(true)}
                className="mt-5 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Suggest a resource
              </button>
            </div>
          )}
        </section>

        <footer className={`border-t py-6 text-center text-sm ${theme.muted}`}>
          Wayfinder — useful paths, thoughtfully curated.
        </footer>
      </div>

      {showSubmission && (
        <div
          className="fixed inset-0 z-10 grid place-items-center bg-slate-950/75 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowSubmission(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="submission-title"
            className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="submission-title" className="text-xl font-semibold">
                Suggest a resource
              </h2>
              <button
                type="button"
                onClick={() => setShowSubmission(false)}
                aria-label="Close form"
                className="rounded-lg px-3 py-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="mb-5 text-sm text-slate-400">
              Suggestions open as a GitHub Issue for review. They won’t appear
              on the site automatically.
            </p>

            <form onSubmit={submitSuggestion} className="space-y-4">
              <label className="block text-sm">
                Resource name
                <input
                  required
                  name="title"
                  maxLength="100"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-cyan-400"
                />
              </label>

              <label className="block text-sm">
                Link
                <input
                  required
                  name="link"
                  type="url"
                  placeholder="https://example.com"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-cyan-400"
                />
              </label>

              <label className="block text-sm">
                Category
                <select
                  name="category"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-cyan-400"
                >
                  {categories.slice(1).map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                Why is it useful? <span className="text-slate-500">(optional)</span>
                <textarea
                  name="details"
                  rows="3"
                  maxLength="1000"
                  className="mt-1 w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-cyan-400"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Continue to GitHub for review
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;