// The loader runs only on the server, so `data.html` is the sanitized output.
// In the editor the loader does not run, so guard on `data` being absent.
export default function Prose({ data }: { data?: { html?: string } }) {
  if (!data?.html) return null;
  return (
    <div
      className="prose mx-auto max-w-2xl px-6 py-12"
      dangerouslySetInnerHTML={{ __html: data.html }}
    />
  );
}
