# Preserve licence evidence

Use this guide when an ingest or preservation workflow must retain evidence of the licence metadata it relied on.

## 1. Keep the original identifier

Record the identifier supplied with the object exactly as received. Do not replace it before resolution. The original value may be needed to explain later normalization or conflict decisions.

## 2. Retrieve the canonical JSON response

For a simple SPDX identifier:

```bash
LFS_BASE=https://lfs.labs.dansdemo.nl
curl -fsS \
  -H 'Accept: application/json' \
  "$LFS_BASE/api/v1/licenses/CC-BY-4.0" \
  -D cc-by-4.0.headers \
  -o cc-by-4.0.json
```

For identifiers that contain `/`, `:`, `#`, `?`, or other characters that are awkward in a path, use the resolution query endpoint of your configured node:

```bash
curl -fsS --get \
  --data-urlencode 'identifier=<identifier-from-the-deposit>' \
  "$LFS_BASE/api/v1/licenses/resolution" \
  -o resolution.json
```

Treat `404`, `409`, `410`, and `503` as explicit workflow outcomes. See [Responses and errors](../reference/responses-and-errors.md).

## 3. Retrieve provenance when federation is involved

```bash
curl -fsS --get \
  --data-urlencode 'identifier=<identifier-from-the-deposit>' \
  "$LFS_BASE/api/v1/licenses/provenance" \
  -o provenance.json
```

The provenance response distinguishes local authority, imported candidates, source peers, and recorded decisions. Store it beside the resolved metadata when the endpoint returns it.

## 4. Capture an interoperable representation

Choose the representation your preservation system can validate and retain:

```bash
curl -fsS \
  -H 'Accept: application/ld+json' \
  "$LFS_BASE/api/v1/licenses/CC-BY-4.0" \
  -o cc-by-4.0.jsonld
```

Do not treat `/machine` as equivalent to the JSON metadata route. `/machine` requires a curated rights-expression representation and can correctly return `404` when none exists.

## 5. Hash the evidence files

```bash
sha256sum cc-by-4.0.json cc-by-4.0.headers cc-by-4.0.jsonld
```

On macOS, use `shasum -a 256` instead.

## 6. Store a preservation event

Record at least:

- the original identifier;
- the request URL and `Accept` header;
- retrieval time in UTC;
- HTTP status, `Content-Type`, `ETag`, and `Content-Location` when present;
- the response bytes and SHA-256 digest;
- the LFS node identity from `/.well-known/lfs` when federation is enabled;
- the workflow decision, including any manual review triggered by an unavailable or conflicted result.

This evidence lets a later reviewer distinguish what the node returned at ingest time from what the same identifier resolves to in the future.
