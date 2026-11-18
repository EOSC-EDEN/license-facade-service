# Federation and preservation

An LFS federation lets several organizations maintain licence records without pretending that one registry owns every custom licence or policy. This matters in research data stewardship because local agreements and community-specific licences may never enter SPDX, while their identity and provenance still need long-term management.

## Authority stays with the publishing node

Each record names an authority node, local identifier, and version. A receiving node stores imported snapshots as non-authoritative and never republishes them in its own authoritative feed. This avoids a common provenance failure in replicated registries: a copy must not appear to be a new statement by the copier.

Local authoritative records take precedence during resolution. Imported candidates participate only when no local authority wins. Ambiguous candidates become conflicts rather than arbitrary selections.

## Trust is explicit

Administrators enroll peers. Enrollment checks the expected node UUID and pins an Ed25519 key identifier and fingerprint. Normal production operation rejects unknown or revoked keys and requires HTTPS. Network policy also restricts peer destinations, response sizes, timeouts, and allowed ports.

This design favors accountable exchange over open harvesting. A preservation institution can explain which organizations it trusted, which keys authenticated a record, and when it accepted each event.

## History is append-only

Outbound changes and curator decisions are append-only events. Deprecation and tombstoning remain part of the history. Conflict reversals add a new decision rather than editing the previous one.

That structure supports later audit: the current resolution can change while the evidence behind earlier preservation decisions remains intelligible.

## Synchronization is resumable

Change feeds use signed opaque cursors. A receiving node commits imports one page at a time and advances its stored cursor only after the page commits. Replaying an accepted page is idempotent. A later failure therefore does not invalidate earlier committed evidence, and retry does not require guessing a record position.

Catalog pagination also uses a stable watermark so records published during a traversal do not cause unexplained gaps or duplicates.

## PostgreSQL and RDF have different responsibilities

PostgreSQL is the operational source of truth for resolution, authority, imports, decisions, and outbox state. Fuseki holds RDF graphs for interoperability and query. An outbox separates the database transaction from RDF publication.

If Fuseki is unavailable, resolution continues from PostgreSQL. RDF jobs retry with bounded leases and backoff, and can become dead-lettered for operator review. Rebuild and reconciliation commands operate only on graphs owned by LFS.

## OpenREL boundary

OpenREL provides a vocabulary and information model for machine-actionable permissions, prohibitions, duties, context, and policy evaluation. LFS focuses on identifying, registering, resolving, and exchanging licence or policy records and their representations.

The two can work together: an LFS record can point to a curated OpenREL encoding, and a repository can resolve that encoding before a separate evaluator applies it. LFS itself does not decide access, validate legal suitability, or perform policy enforcement. The public demo nodes currently expose additional OpenREL vocabulary APIs, but that code is outside this repository.

## Preservation boundary

LFS keeps registry and federation state; it does not write evidence into an archival information package. The preservation system must retain the identifier it received, the representation it used, the node and retrieval time, response headers, exact bytes, digests, and any curator decision.

This boundary prevents a later registry update from silently rewriting the historical basis for an access or reuse decision.
