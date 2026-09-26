/**
 * Author information block — the E-E-A-T signal that pairs with the Person /
 * ProfilePage schema. Appears on every article and project page so authorship is
 * always one click from the content.
 */
import Link from "next/link";
import { Picture } from "./Picture";
import { PERSON, SAME_AS, SOCIALS, ANALYTICS } from "@/lib/site";

export function AuthorCard({ variant = "full" }: { variant?: "full" | "compact" }) {
  return (
    <aside className="author-card" aria-label="About the author">
      <Picture
        asset="profilePortrait"
        alt={`Portrait of ${PERSON.name}`}
        sizes="108px"
        width={108}
        height={108}
      />
      <div>
        <p className="byline-role" style={{ margin: "0 0 0.3rem" }}>
          {variant === "compact" ? "Author" : "Written and maintained by"}
        </p>
        <h2 style={{ fontSize: "1.05rem", margin: "0 0 0.5rem" }}>
          <Link href="/about/" className="card-title-link">
            {PERSON.name}
          </Link>
        </h2>
        <p className="small muted" style={{ margin: 0 }}>
          {PERSON.jobTitle} · {PERSON.address.addressLocality}, {PERSON.address.addressRegion}. I
          build and operate the systems described here, and I publish the parts that can be
          verified: <Link href="/work/thomu-lab/">THOMU LAB</Link>,{" "}
          <Link href="/work/apex-creator-os/">Apex Creator OS</Link> and{" "}
          <Link href="/work/my-ai-os/">My_AI_OS</Link>. Corrections and questions are welcome via
          the <Link href="/contact/">contact page</Link>.
        </p>
        <ul
          className="tag-row"
          style={{ listStyle: "none", padding: 0, marginTop: "0.9rem", marginBottom: 0 }}
        >
          {SOCIALS.map((social) => (
            <li key={social.key}>
              <a className="tag" href={social.href} rel="me noopener" target="_blank">
                {social.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="small muted" style={{ marginTop: "0.9rem", marginBottom: 0 }}>
          Editorially responsible for every page on this site. Where content was drafted with AI
          assistance, it is disclosed in the <Link href="/terms/">terms</Link>.
          {ANALYTICS.measurementId ? "" : ""}
        </p>
      </div>
    </aside>
  );
}

/** Machine-readable list of the author's public profiles (sameAs surface). */
export function SameAsList() {
  return (
    <ul className="small muted" style={{ listStyle: "none", padding: 0 }}>
      {SAME_AS.map((href) => (
        <li key={href} style={{ marginBottom: "0.35rem" }}>
          <a href={href} rel="me noopener" target="_blank">
            {href}
          </a>
        </li>
      ))}
    </ul>
  );
}
