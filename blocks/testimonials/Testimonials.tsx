import { fields, type BlockProps } from "@cmssy/react";
import styles from "./Testimonials.module.css";

export const testimonialsProps = {
  heading: fields.text({ label: "Heading", required: true }),
  testimonials: fields.relation({
    label: "Testimonials",
    model: "testimonial",
    mode: "all",
    sort: "order_asc",
  }),
};

const text = (value: unknown) => (typeof value === "string" ? value : "");

export default function Testimonials({
  content,
}: BlockProps<typeof testimonialsProps>) {
  const items = content.testimonials ?? [];
  if (items.length === 0) return null;

  return (
    <section className={styles.testimonials}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{content.heading}</h2>
        <ul className={styles.grid}>
          {items.map((item) => {
            const quote = text(item.data.quote);
            const author = text(item.data.author);
            const role = text(item.data.role);
            if (!quote) return null;
            return (
              <li key={item.id} className={styles.card}>
                <blockquote className={styles.quote}>{quote}</blockquote>
                {(author || role) && (
                  <footer className={styles.attribution}>
                    {author && <cite className={styles.author}>{author}</cite>}
                    {role && <span className={styles.role}>{role}</span>}
                  </footer>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
