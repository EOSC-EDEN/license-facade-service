# REST API

This reference describes the API implemented by the current source tree. The generated OpenAPI schema at `/openapi.json` and Swagger UI at `/docs` remain the exact machine-readable references for a running build.

## Base paths and aliases

- Canonical implementation path: `/api/v1/licenses`
- Federation and administration paths use `/api/v1/federation` and `/api/v1/admin/federation`


## Authentication

Public read endpoints require no credentials. Protected endpoints use:

```http
Authorization: Bearer <token>
```

Administrator tokens have the `admin` role. Curator tokens have the `curator` role. Missing or invalid credentials return `401`; a valid token with an insufficient role returns `403`.

## Service status

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Process liveness. |
| `GET` | `/api/v1/ping` | Lightweight service response. |
| `GET` | `/api/v1/ready` | Cache, Fuseki, and federation readiness as configured. |

## Licence inventory and maintenance

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/licenses` | Public | List the cached SPDX-compatible inventory with LFS URIs. |
| `GET` | `/api/v1/licenses/taxonomy` | Public | Return a static overview of common licence families. |
| `GET` | `/api/v1/licenses/cache/status` | Public | Report the active cache snapshot without exposing filesystem paths. |
| `POST` | `/api/v1/licenses/cache/update` | Curator or admin | Download and activate a newer SPDX snapshot when available. |
| `POST` | `/api/v1/licenses/cache/refresh` | Curator or admin | Force the cache refresh operation. |
| `POST` | `/api/v1/licenses/spdx3/minimal` | Curator or admin | Generate a minimal SPDX 3.0 JSON-LD document. |
| `POST` | `/api/v1/licenses/spdx3/complete/{license_id}` | Curator or admin | Generate a complete SPDX 3.0 JSON-LD document for one licence. |

## Licence lookup and representations

`{id}` accepts an SPDX identifier, an LFS UUID, a full LFS URI, or a configured alias. SPDX identifiers are case-sensitive.

| Method | Path | Media type or behavior |
|---|---|---|
| `GET` | `/api/v1/licenses/{id}` | Negotiated; defaults to `application/json`. |
| `GET` | `/api/v1/licenses/{id}/html` | `text/html` landing page. |
| `GET` | `/api/v1/licenses/{id}/json` | SPDX-compatible `application/json`. |
| `GET` | `/api/v1/licenses/{id}/json-ld` | `application/ld+json`. |
| `GET` | `/api/v1/licenses/{id}/turtle` | `text/turtle`. |
| `GET` | `/api/v1/licenses/{id}/rdfxml` | `application/rdf+xml`. |
| `GET` | `/api/v1/licenses/{id}/original` | Redirect to a curated original source, or `404`. |
| `GET` | `/api/v1/licenses/{id}/legal` | Curated legal content, or `404`. |
| `GET` | `/api/v1/licenses/{id}/machine` | Curated rights expression, or `404`. |
| `GET` | `/api/v1/licenses/{id}/encoding` | Redirect to a curated encoding reference, or `404`. |

The canonical route supports these `Accept` values:

- `application/json`
- `text/html`
- `application/ld+json`
- `text/turtle`
- `application/rdf+xml`

Unsupported media types return `406 application/problem+json`.

## Resolution and provenance

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/licenses/resolution?identifier=...` | Resolve an arbitrary identifier across local authority, imported records, and SPDX fallback. |
| `GET` | `/api/v1/licenses/provenance?identifier=...` | Return provenance and candidate history for an identifier. |

Use the query endpoints for identifiers containing reserved URL characters. Local authoritative records take precedence over imported candidates.

## Federation discovery and outbound feeds

These endpoints return `404` when federation is disabled.

| Method | Path | Description |
|---|---|---|
| `GET` | `/.well-known/lfs` | Node identity, protocol version, and endpoint discovery. |
| `GET` | `/.well-known/jwks.json` | Public Ed25519 verification keys. Never includes private material. |
| `GET` | `/api/v1/federation/catalog` | Page through locally authoritative published records. |
| `GET` | `/api/v1/federation/changes` | Page through signed, append-only change events. |
| `GET` | `/api/v1/federation/records/{encoded_id}` | Retrieve one signed authoritative record. |

Catalog and change cursors are opaque, versioned, signed tokens. Clients must replay them unchanged. Conditional requests support `ETag` and `If-None-Match`.

## Federation administration

Peer management, synchronization, status, and publication require the `admin` role.

| Method | Path | Description |
|---|---|---|
| `GET`, `POST` | `/api/v1/admin/federation/peers` | List or explicitly enroll trusted peers. |
| `GET`, `PATCH`, `DELETE` | `/api/v1/admin/federation/peers/{peer_id}` | Inspect, update, or archive a peer. |
| `GET` | `/api/v1/admin/federation/peers/{peer_id}/imports` | List non-authoritative records retained from the peer. |
| `POST` | `/api/v1/admin/federation/peers/{peer_id}/sync` | Run one bounded inbound synchronization. |
| `GET` | `/api/v1/admin/federation/status` | Inspect federation counters and worker settings. |
| `POST` | `/api/v1/admin/federation/publish` | Publish one locally authoritative record to the outbound feed. |

Enrollment pins the expected remote node ID and signing-key fingerprint. Production deployments require HTTPS and apply hostname, port, address, and response-size restrictions.

## Federation conflict review

The `curator` and `admin` roles can review and decide conflicts.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/admin/federation/conflicts` | List current conflicts. |
| `GET` | `/api/v1/admin/federation/conflicts/{conflict_id}` | Inspect candidates and the latest decision. |
| `POST` | `/api/v1/admin/federation/conflicts/{conflict_id}/decisions` | Append a decision using optimistic concurrency. |
| `POST` | `/api/v1/admin/federation/conflicts/{conflict_id}/reversals` | Append a reversal event. |

Decision history is append-only. Mutation requests include `expectedVersion`; stale writes return `409`.

<!-- ## Live-instance difference

The DANS Labs and RDA Demo deployments currently expose `/openrel/api/v0.4/*` routes. Those routes are not present in this checkout, so they are intentionally excluded from this code-derived reference. -->
