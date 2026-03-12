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
images/            # Diagrams (.drawio, .drawio.svg) and static images
integrations/      # Integration guides
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
  <img src="/images/diagram-name.drawio.svg" alt="Descriptive alt text" zoom />
</Frame>

<sub><a href="/images/diagram-name.drawio.svg" download="diagram-name.drawio.svg">Download SVG</a> · <a href="/images/diagram-name.drawio" download="diagram-name.drawio">Download draw.io source</a></sub>
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
/Applications/draw.io.app/Contents/MacOS/draw.io --export --format svg --output images/name.drawio.svg images/name.drawio
```

The CLI sometimes reports "Error: Export failed" even on success — verify by checking the output file timestamp and content.

## What NOT to Do

- NEVER add XML comments to .drawio files
- NEVER trust MCP draw.io tools for batch vertex insertion — write XML directly
- NEVER use non-`.drawio.svg` naming for draw.io SVG exports
- NEVER edit docs.json navigation without understanding the tab/group structure
- NEVER create new MDX pages without adding them to `docs.json` navigation
