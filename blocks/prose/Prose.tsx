import styles from "./Prose.module.css";

// The loader runs only on the server, so `data.html` is the sanitized output.
// In the editor the loader does not run, so guard on `data` being absent.
export default function Prose({ data }: { data?: { html?: string } }) {
  if (!data?.html) return null;
  return (
    <div
      className={styles.prose}
      dangerouslySetInnerHTML={{ __html: data.html }}
    />
  );
}
