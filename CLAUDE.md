# ClarusWMS Documentation

Mintlify documentation site for ClarusWMS — warehouse management platform docs, AI architecture guides, and API reference.

## Quick Reference

- Dev server: `mintlify dev`
- Export draw.io to SVG: `/Applications/draw.io.app/Contents/MacOS/draw.io --export --format svg --output <output.drawio.svg> <input.drawio>`

## Directory Structure

```
architecture/       # Architecture documentation (MDX)
  ai/              # AI layer architecture pages
  deployment/      # CI/CD and deployment pages
api-reference/     # API docs and OpenAPI spec
essentials/        # Mintlify framework guide pages
images/            # Static images
  diagrams/        # Draw.io sources (.drawio) and SVG exports (.drawio.svg)
  knowledgebase/   # KB article screenshots (shared EN/NL)
integrations/      # Integration guides
knowledgebase/     # Support knowledgebase articles (English)
  getting-started/ # Login, password reset, booking diary
  users-and-roles/ # User creation, role guides, visibility
  accounts/        # Account setup, linking, dispatch strategies
  warehouse-setup/ # Sites, warehouses, locations, storage, pickfaces
  products-and-stock/ # Products, stock management, BOMs
  inbound/         # Goods in, receipts, putaway
  outbound/        # Sales orders, picking, packing, dispatch
  financial/       # Charges, invoices, suppliers
  reporting/       # Reports, data grids, scheduled reports
  integrations/    # SFTP, webhooks, DHL, ASN
  cloud-print/     # Cloud Print setup and usage
  hardware/        # HHD configuration
  advanced/        # Serial numbers, kits, works orders
  security/        # Subprocessors, backup
  troubleshooting/ # Error guides, diagnostic articles
  nl/              # Dutch translations (mirrors EN structure, same slugs)
drafts/            # Non-KB articles (announcements, policies) — NOT in navigation
snippets/          # Reusable MDX snippets
```

## Tech Stack

- **Framework**: Mintlify (MDX-based documentation)
- **Diagrams**: draw.io (XML format, exported as SVG)
- **Config**: `docs.json` (navigation, theme, API playground)

## Conventions

### Mintlify Components

Use Mintlify's built-in components for structured content:
- `<Tabs>` / `<Tab>` for parallel content paths
- `<Steps>` / `<Step>` for sequential flows
- `<Frame>` wrapping `<img>` for zoomable diagrams
- `<Accordion>` for collapsible detail sections
- `<Info>`, `<Tip>`, `<Warning>`, `<Note>` for callouts
- `<CardGroup>` / `<Card>` for navigation grids

### Diagram Embedding Pattern

Every draw.io diagram follows this pattern in MDX:

```mdx
<Frame>
  <img src="/images/diagrams/diagram-name.drawio.svg" alt="Descriptive alt text" zoom />
</Frame>

<sub><a href="/images/diagrams/diagram-name.drawio.svg" download="diagram-name.drawio.svg">Download SVG</a> · <a href="/images/diagrams/diagram-name.drawio" download="diagram-name.drawio">Download draw.io source</a></sub>
```

### File Naming

- MDX pages: kebab-case (`overview.mdx`, `ai-pipelines.mdx`)
- Draw.io sources: `description.drawio`
- Draw.io SVG exports: `description.drawio.svg` (include `.drawio` before `.svg`)
- Static images: kebab-case (`hero-dark.png`)

## Draw.io Practices

### Writing .drawio Files

- Write draw.io XML directly rather than using MCP draw.io tools for complex diagrams. The MCP `batch_insert_vertices` tool is unreliable — vertices may not persist to the saved file.
- **Never put XML comments (`<!-- ... -->`) in .drawio files.** They break the draw.io CLI exporter at scale. The export silently fails or produces corrupt output.
- Use `mxgraph.aws4.resourceIcon` with `resIcon` for AWS architecture icons (e.g., `resIcon=mxgraph.aws4.lambda`).
- Use `mxgraph.aws4.group` shapes for AWS grouping containers (VPCs, accounts, etc.).

### Sequence Diagrams in Draw.io

For sequence/flow diagrams (not architecture diagrams):
- Use invisible 4×4 ellipse anchor dots placed along lifelines as connection points.
- Connect edges between anchor dots with explicit `source` and `target` references.
- This gives precise control over where arrows start and end on vertical lifelines.

### Diagram Style Conventions

- Gray background boxes (`fillColor=#EFF0F3;strokeColor=none`) for component groups
- AWS icon fill colors follow the official AWS palette (Lambda=#D05C17, API Gateway=#E7157B, Bedrock=#01A88D, etc.)
- Dashed orange edges (`strokeColor=#ea580c;dashed=1`) for MCP/internal connections
- Solid dark edges (`strokeColor=#232F3E`) for standard request flows
- White font on dark icon backgrounds, dark font (#232F3E) on light backgrounds
- `labelBackgroundColor=#EFF0F3` on labels over gray group backgrounds

### Exporting

```bash
/Applications/draw.io.app/Contents/MacOS/draw.io --export --format svg --output images/diagrams/name.drawio.svg images/diagrams/name.drawio
```

The CLI sometimes reports "Error: Export failed" even on success — verify by checking the output file timestamp and content.

## Knowledgebase Articles

### Editorial Standards

- **Voice**: Second-person ("you"), active, concise
- **Structure**: Lead with key information (inverted pyramid). Don't bury the action behind lengthy introductions.
- **Titles**: Strip "Clarus WMS" / "in Clarus WMS" — the site context makes it obvious. Keep titles short and action-oriented.
- **Frontmatter**: Every page needs `title`, `description` (search-optimised, 1-2 sentences). Add `sidebarTitle` only when the title is too long for the sidebar.
- **Stale content**: Add `needs_review: true` to frontmatter if article content may be outdated

### Content Patterns

- Sequential instructions → `<Steps>` / `<Step>` components
- Supplementary Q&A that adds value beyond the main content → `<AccordionGroup>` / `<Accordion>` at the bottom
- Strip FAQ sections that merely restate what the main content already covers
- UI element references → `**bold**` (e.g., click **Save**)
- Screenshots → `<Frame><img src="/images/knowledgebase/descriptive-name.png" alt="Descriptive alt text" /></Frame>`
- Cross-references to other KB articles → `[link text](/knowledgebase/category/slug)`
- Don't repeat generic functionality on every page. Data grid customisation (columns, views, filters) is covered in the "Using Clarus" section — link to it rather than re-explaining it.

### Callout Usage

- `<Info>` — supplementary context the reader should be aware of
- `<Tip>` — helpful advice or best practice
- `<Warning>` — something that could cause problems if ignored
- `<Note>` — additional reference information

### i18n / Dutch Translations

- Dutch pages live in `knowledgebase/nl/{category}/` using the **same slug filenames** as English
- Dutch pages share the same images as English (images are language-agnostic)
- Light cleanup only for Dutch: fix spacing around bold tags, fix broken formatting. Do NOT rewrite for fluency.
- System terms (GIBAY, GOBAY, field names in the UI) stay in English in Dutch articles — they are not translated in the product
- Navigation uses `languages` array in `docs.json`: English has all tabs, Dutch only has "Kennisbank"
- Always update both EN and NL when making content changes

### Navigation Structure

- `docs.json` uses nested collapsible groups to keep the sidebar manageable
- Top-level groups: Getting Started, Using Clarus, System Setup, Products & Stock, Warehouse Operations, Financial, Reporting, Integrations & Tools, Advanced & Reference, Troubleshooting
- Sub-groups use `"expanded": false` to collapse by default
- Troubleshooting articles live exclusively in the troubleshooting section — feature pages link to them with cross-references
- New KB pages must be added to both the EN and NL navigation in `docs.json`

### Image Conventions

- Save to `images/knowledgebase/` with descriptive kebab-case names (e.g., `packing-desk-scan-barcode.png`)
- Naming is language-agnostic — shared between EN and NL pages
- Use the article slug as a prefix with a number suffix (e.g., `serial-number-tracking-1.png`, `serial-number-tracking-2.png`)

### MDX Gotchas

- Curly braces `{{ }}` in MDX are parsed as JSX expressions — wrap in backtick inline code or fenced code blocks to prevent parse errors
- Always use ````text` or ````liquid` for template syntax examples containing `{{ }}`

## What NOT to Do

- NEVER add XML comments to .drawio files
- NEVER trust MCP draw.io tools for batch vertex insertion — write XML directly
- NEVER use non-`.drawio.svg` naming for draw.io SVG exports
- NEVER edit docs.json navigation without understanding the tab/group/languages structure
- NEVER create new MDX pages without adding them to `docs.json` navigation (both EN and NL if applicable)
- NEVER repeat data grid customisation instructions on individual feature pages — link to the Using Clarus section instead
- NEVER translate system/UI terms (field names, location types like GIBAY/GOBAY) in Dutch articles
