# Responses and errors

## Licence detail

The detailed JSON response combines SPDX-compatible data with LFS extensions.

| Field | Meaning |
|---|---|
| `uri` | LFS-generated URI for the licence. |
| `referenceNumber` | SPDX reference UUID when available. |
| `licenseId`, `licenseID`, `licenceID` | Compatible identifier spellings. |
| `name` | Licence name. |
| `detailsURL` | Local JSON details route. |
| `spdxDetailsURL` | Upstream SPDX JSON URL. |
| `reference`, `seeAlso`, `crossRef` | Upstream or curated references with provenance where available. |
| `licenseText`, `licenseTextHtml` | Human-readable SPDX text forms. |
| `standardLicenseTemplate` | SPDX matching template. |
| `representations` | Curated original, legal, machine, or encoding descriptors. |
| `representationStatus` | Availability and mandatory status for each curated form. |
| `conformance` | Requirement-level conformance and missing mandatory data. |
| `_links` | Local routes for all supported representations. |

LFS does not fabricate missing representations. A detailed record may return `200` while `conformance.conformant` is `false` and a specific optional or mandatory representation route returns `404`.

## Successful content types

| Content type | Use |
|---|---|
| `application/json` | Default metadata and administration payloads. |
| `text/html` | Human-facing licence landing page. |
| `application/ld+json` | Linked-data representation. |
| `text/turtle` | RDF in Turtle. |
| `application/rdf+xml` | RDF/XML. |

Responses from the canonical route include `Vary: Accept`, `Content-Location`, a canonical `Link`, and cache-control metadata.

## Problem details

Errors use `application/problem+json`, following the RFC 9457 problem-details structure:

```json
{
  "type": "https://eosc-eden.eu/problems/resolution-not-found",
  "title": "Resolution Not Found",
  "status": 404,
  "detail": "No record or candidate exists for the identifier.",
  "instance": "https://example.org/api/v1/licenses/resolution?identifier=example"
}
```

Additional context can appear in fields such as `availableRepresentations`, `licenseMetadata`, or `resolutionContext`.

## Status codes

| Status | Meaning |
|---|---|
| `200` | Successful lookup or operation. |
| `304` | Federation resource unchanged for `If-None-Match`. |
| `400` | Invalid identifier, request body, or peer data. |
| `401` | Missing or invalid bearer token. |
| `403` | Authenticated role lacks permission. |
| `404` | Licence, representation, peer, conflict, or feature not found. Federation-disabled endpoints also use `404`. |
| `406` | Unsupported `Accept` media type. |
| `409` | Ambiguous/conflicted resolution, stale decision version, or synchronization lock conflict. |
| `410` | A resolved federation record is tombstoned. |
| `422` | FastAPI request validation failure. |
| `500` | Internal operation failed. |
| `502` | Remote peer returned invalid or unexpected data. |
| `503` | Dependency, federation runtime, or remote peer unavailable. |

## Preservation handling

Preservation workflows should store the body of non-success responses as evidence instead of reducing every failure to “licence unavailable.” A `404` for `/machine` means the node has no curated machine-readable rights expression; a `409` from resolution means competing candidates require review; a `410` records a lifecycle decision; and `503` indicates an operational state that may justify retry.
