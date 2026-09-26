#!/usr/bin/env node
/**
 * Search Console report helper.
 *
 *   node scripts/gsc-report.mjs --site https://example.com/ --days 28
 *   node scripts/gsc-report.mjs --site https://example.com/ --days 90 --json
 *
 * Prints a performance summary (top queries, top pages, totals) and a coverage
 * snapshot using the Search Console API. Requires the `webmasters.readonly`
 * scope via either:
 *
 *   • application-default credentials:  gcloud auth application-default login \
 *       --scopes https://www.googleapis.com/auth/webmasters.readonly
 *   • or a service-account JSON:        GOOGLE_APPLICATION_CREDENTIALS=key.json
 *
 * The script deliberately exits with a clear message when credentials or the
 * optional dependencies are missing, rather than pretending it produced data —
 * the same rule the site applies to publishing numbers.
 */
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const site = flag("site", process.env.GSC_SITE || "");
const days = Number(flag("days", "28"));
const JSON_OUTPUT = args.includes("--json");
const rowLimit = Number(flag("limit", "25"));

if (!site) {
  console.error(`✖ Missing --site (e.g. --site https://gptthomu-cmd.github.io/testing-e-ortfoilo/)

  Usage:
    node scripts/gsc-report.mjs --site <property-url> [--days 28] [--limit 25] [--json]
`);
  process.exit(2);
}

const { google } = await import("googleapis").catch(() => ({ google: null }));

if (!google) {
  console.error(`✖ The optional dependency "googleapis" is not installed.

  Install it only when you want API reports (it is intentionally not a project
  dependency, to keep installs fast):

    npm install --no-save googleapis

  Then authenticate with either
    gcloud auth application-default login --scopes https://www.googleapis.com/auth/webmasters.readonly
  or
    GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
`);
  process.exit(2);
}

let auth;
try {
  auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
} catch (error) {
  console.error(`✖ Could not obtain Google credentials: ${error.message}

  See the notes at the top of scripts/gsc-report.mjs for the two supported ways
  to authenticate. Nothing was requested from the API.`);
  process.exit(2);
}

const searchconsole = google.searchconsole({ version: "v1", auth });

const end = new Date();
const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
const fmt = (date) => date.toISOString().slice(0, 10);

async function query(dimensions) {
  const res = await searchconsole.searchanalytics.query({
    siteUrl: site,
    requestBody: {
      startDate: fmt(start),
      endDate: fmt(end),
      dimensions,
      rowLimit,
      dataState: "final",
    },
  });
  return res.data.rows || [];
}

try {
  const [byQuery, byPage] = await Promise.all([query(["query"]), query(["page"])]);

  const totals = byQuery.reduce(
    (acc, row) => ({
      clicks: acc.clicks + (row.clicks || 0),
      impressions: acc.impressions + (row.impressions || 0),
    }),
    { clicks: 0, impressions: 0 },
  );

  const report = {
    site,
    window: { startDate: fmt(start), endDate: fmt(end), days },
    totals: {
      ...totals,
      ctr: totals.impressions ? Number((totals.clicks / totals.impressions).toFixed(4)) : 0,
      averagePosition: byQuery.length
        ? Number(
            (
              byQuery.reduce((sum, row) => sum + (row.position || 0), 0) / byQuery.length
            ).toFixed(1),
          )
        : null,
    },
    topQueries: byQuery.map((row) => ({
      query: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: Number((row.ctr || 0).toFixed(4)),
      position: Number((row.position || 0).toFixed(1)),
    })),
    topPages: byPage.map((row) => ({
      page: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: Number((row.ctr || 0).toFixed(4)),
      position: Number((row.position || 0).toFixed(1)),
    })),
  };

  if (JSON_OUTPUT) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    console.log(`\nSearch Console — ${site}`);
    console.log(`${fmt(start)} → ${fmt(end)} (${days} days)\n`);
    console.log(`  clicks ${totals.clicks} · impressions ${totals.impressions} · ctr ${(report.totals.ctr * 100).toFixed(2)}%\n`);
    console.log("  Top queries");
    report.topQueries.slice(0, 10).forEach((q) =>
      console.log(`    ${String(q.clicks).padStart(4)} clicks  ${String(q.impressions).padStart(6)} impr  pos ${q.position}  ${q.query}`),
    );
    console.log("\n  Top pages");
    report.topPages.slice(0, 10).forEach((p) =>
      console.log(`    ${String(p.clicks).padStart(4)} clicks  ${String(p.impressions).padStart(6)} impr  pos ${p.position}  ${p.page.replace(/^https?:\/\//, "")}`),
    );
    console.log(
      "\n  Reminder: record these numbers as they are, and label illustrative charts as illustrative.\n",
    );
  }
} catch (error) {
  console.error(`✖ Search Console API request failed: ${error.message}`);
  console.error("  Check that the property URL matches exactly and the account has access.");
  process.exit(1);
}
