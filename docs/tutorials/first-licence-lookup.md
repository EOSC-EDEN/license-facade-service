# First licence lookup

This tutorial uses the public DANS Labs instance to retrieve a licence, normalize a free-text licence reference, and inspect the preservation-relevant parts of the response. You need `curl` and Python 3.

## 1. Check the service

```bash
curl -fsS https://lfs.labs.dansdemo.nl/api/v1/health
```

A successful request returns a JSON health response. You now know that the process is reachable. Readiness, including configured dependencies, is available at `/api/v1/ready`.

## 2. Retrieve the MIT licence

```bash
curl -fsS \
  https://lfs.labs.dansdemo.nl/api/v1/licenses/MIT \
  -o mit-license.json
```

The base route returns JSON unless you request another supported representation.

## 3. Inspect the identity and representation status

```bash
python3 -c "import json; d=json.load(open('mit-license.json')); print('ID:', d['licenseId']); print('URI:', d['uri']); print('Conformant:', d['conformance']['conformant']); print('Representations:', d['representationStatus'])"
```

The output contains:

- `licenseId`, the SPDX-compatible identifier;
- `uri`, the LFS-generated persistent reference;
- `conformance`, which records missing mandatory representations instead of inventing them;
- `representationStatus`, which says which curated forms are available.

The MIT record on a given deployment may be non-conformant if the node lacks curated `original` or `machine` representations. That is useful preservation evidence: absence remains explicit.

## 4. Normalize `CC BY 4.0` to its SPDX identifier

Metadata received by an archive often contains a human-readable value such as `CC BY 4.0`. Keep that source value unchanged, then use a controlled mapping maintained by your repository or metadata profile to produce a candidate SPDX identifier:

Watch the complete terminal workflow, or [download the local asciicast recording](../assets/casts/normalize-cc-by-4.cast):

<div
  id="normalize-cc-by-4-cast"
  data-asciinema-cast="../../assets/casts/normalize-cc-by-4.cast"
  aria-label="Terminal recording that normalizes CC BY 4.0 with the DANS Labs LFS API"
></div>

```bash
SOURCE_LICENCE='CC BY 4.0'
SPDX_ID='CC-BY-4.0'

printf 'Source value: %s\nCandidate SPDX ID: %s\n' \
  "$SOURCE_LICENCE" "$SPDX_ID"
```

Ask LFS to validate and enrich the candidate:

```bash
curl -fsS \
  "https://lfs.labs.dansdemo.nl/api/v1/licenses/$SPDX_ID/json" \
  -o normalized-license.json

python3 -c "import json; d=json.load(open('normalized-license.json')); print('SPDX ID:', d['licenseId']); print('Official name:', d['name']); print('Canonical LFS URI:', d['uri']); print('Deprecated:', d['isDeprecatedLicenseId'])"
```

The result is similar to:

```console
SPDX ID: CC-BY-4.0
Official name: Creative Commons Attribution 4.0 International
Canonical LFS URI: https://lfs.labs.dansdemo.nl/api/v1/licenses/94898055-10c4-56fa-bb75-9cd0b1d6d7c3
Deprecated: False
```

The normalization record now contains both values:

- the submitted value, `CC BY 4.0`, as evidence of what the depositor supplied;
- the verified SPDX identifier, `CC-BY-4.0`, for interoperable metadata;
- an LFS URI that can be resolved without relying on the original spelling;
- the official licence name, deprecation state, cross-references, available representations, and conformance status returned by LFS.

This is more useful than replacing spaces with hyphens. A purely syntactic rewrite can produce an identifier that does not exist or can select the wrong licence. The controlled mapping proposes a candidate; LFS confirms that the record exists and supplies the metadata needed to document the normalization decision.

!!! note "Free-text normalization is a curated step"
    The current LFS source resolves exact licence IDs, LFS UUIDs and URIs, and aliases configured on a node. It does not infer every possible free-text spelling. Preserve the source value and maintain reviewed mappings for labels accepted by your ingest workflow.

## 5. Request a preservation-friendly RDF representation

```bash
curl -fsS \
  -H 'Accept: text/turtle' \
  https://lfs.labs.dansdemo.nl/api/v1/licenses/MIT \
  -o mit-license.ttl

head -n 12 mit-license.ttl
```

The same licence now appears as Turtle. The canonical route also supports `application/ld+json` and `application/rdf+xml`.

## 6. Record what you retrieved

```bash
python3 -c "import hashlib, pathlib; p=pathlib.Path('mit-license.json'); print(hashlib.sha256(p.read_bytes()).hexdigest(), p)"
```

You now have a licence response and a digest that an ingest or preservation workflow can store with the archived object. The digest is evidence for the exact response you received; it is not a substitute for storing that response.

## Next steps

- [Preserve licence evidence](../how-to/preserve-licence-evidence.md) in an ingest workflow.
- Look up endpoint details in the [REST API reference](../reference/rest-api.md).
- Read why representation gaps remain explicit in [Federation and preservation](../explanation/federation-and-preservation.md).
