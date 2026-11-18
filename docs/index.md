# License Facade Service

The License Facade Service (LFS) gives repositories, archives, preservation workflows, and data publishers a consistent way to identify a licence and retrieve its available representations. It combines SPDX-compatible metadata with curated human-readable, legal, and machine-readable representations, and can exchange authoritative records between trusted LFS nodes.

For digital preservation, LFS helps keep a licence reference resolvable and interpretable after the original deposit workflow has finished. A preservation system can record the LFS identifier, the representation it received, and the response provenance beside the archived object instead of retaining an ambiguous free-text label alone.

## Scope

LFS provides:

- SPDX-compatible licence inventory and detailed licence metadata;
- stable LFS URIs derived from licence identifiers;
- content negotiation for JSON, HTML, JSON-LD, Turtle, and RDF/XML;
- curated links or content for original, legal, machine-readable, and encoding representations when available;
- signed, explicitly trusted federation between independently operated nodes;
- provenance and conflict-review endpoints for federated resolution.

LFS does not decide whether a licence is legally appropriate for a dataset, replace legal advice, evaluate OpenREL policies, or preserve an archive's evidence on its behalf. The repository or archive remains responsible for recording the response it used and the decision made from it.

## Implementation status

!!! note "Specification and implementation"
    The supplied LFS specification is still in draft. The source code in this repository is authoritative when the specification and implementation differ. See the [implementation specification note](specification.md) for the implemented conformance decisions.

Federation is feature-gated and disabled by default. The public licence API continues to work without PostgreSQL, signing keys, or peer configuration.

## Public demonstration nodes

Two federated demonstration instances are currently available:

| Node | Interactive API | Federation discovery |
|---|---|---|
| DANS Labs | [Swagger UI](https://lfs.labs.dansdemo.nl/docs) | [Discovery document](https://lfs.labs.dansdemo.nl/.well-known/lfs) |
| RDA Demo | [Swagger UI](https://lfs.rda.dansdemo.nl/docs) | [Discovery document](https://lfs.rda.dansdemo.nl/.well-known/lfs) |

The deployed nodes may run a newer build than this checkout. They currently expose OpenREL vocabulary endpoints in addition to the LFS API. Those OpenREL routes are not implemented in this repository and therefore are not part of this site's REST API reference.

## Where to start

| You want to | Read |
|---|---|
| Try a licence lookup | [First licence lookup](tutorials/first-licence-lookup.md) |
| Run LFS locally | [Run with Docker Compose](how-to/run-with-docker-compose.md) |
| Capture evidence for an archived object | [Preserve licence evidence](how-to/preserve-licence-evidence.md) |
| Integrate with the API | [REST API](reference/rest-api.md) |
| Configure a node | [Configuration](reference/configuration.md) |
| Understand who uses LFS | [Actors and use cases](explanation/use-cases.md) |
| Understand federation choices | [Federation and preservation](explanation/federation-and-preservation.md) |
