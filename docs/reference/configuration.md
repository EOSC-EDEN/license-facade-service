# Configuration

LFS reads configuration from environment variables. Values in `docker-compose.yaml` show the supported development arrangement; production secrets should come from the deployment platform or mounted secret files.

## Application

| Variable | Default | Purpose |
|---|---|---|
| `APP_NAME` | `License Facade Service` | Display name. |
| `EXPOSE_PORT` | `12104` | Uvicorn listening port. |
| `BASE_DIR` | Current working directory | Root for project metadata, resources, and cached snapshots. |
| `URL_BASE` | DANS Labs licence API URL | Base used to generate LFS licence URIs. Set this to the public node URL. |
| `RELOAD_ENABLE` | `false` | Enable Uvicorn reload for development. |
| `CORS_ORIGINS` | Empty | Comma-separated allowed origins. Empty denies cross-origin browser access. |
| `CORS_ALLOW_CREDENTIALS` | `false` | Allow credentials in CORS requests. |

## Authentication

| Variable | Purpose |
|---|---|
| `LFS_ADMIN_TOKEN` | Inline administrator bearer token. |
| `LFS_ADMIN_TOKEN_FILE` | File containing the administrator token. |
| `LFS_CURATOR_TOKEN` | Inline curator bearer token. |
| `LFS_CURATOR_TOKEN_FILE` | File containing the curator token. |

The inline value takes precedence over the file. Prefer secret files or a secrets manager in production.

## SPDX cache

| Variable | Default | Purpose |
|---|---|---|
| `SPDX_TIMEOUT_SECONDS` | `10` | Timeout for SPDX requests. |
| `SPDX_RETRIES` | `3` | Retry count. |
| `SPDX_RETRY_BACKOFF_SECONDS` | `0.5` | Initial retry backoff. |

Snapshot activation is atomic. If refresh fails, the last valid snapshot remains active.

## Fuseki

| Variable | Default | Purpose |
|---|---|---|
| `FUSEKI_ENABLE` | `true` | Include Fuseki in readiness checks and RDF processing. |
| `FUSEKI_URL` | `http://localhost:3030` | Fuseki base URL. Compose uses `http://fuseki:3030`. |
| `FUSEKI_DATASET` | `licenses` | Dataset name. |
| `FUSEKI_USER` | Empty | Fuseki user. |
| `FUSEKI_PASSWORD` | Empty | Fuseki password. |

The Compose file also uses `FUSEKI_ADMIN_PASSWORD` and `FUSEKI_JVM_ARGS` to configure the Fuseki container.

## Federation identity and storage

Federation remains off unless `FEDERATION_ENABLED=true`.

| Variable | Required when enabled | Purpose |
|---|---|---|
| `FEDERATION_ENABLED` | No | Enable federation runtime. Default `false`. |
| `FEDERATION_INBOUND_ENABLED` | No | Enable inbound synchronization. Defaults to the federation setting. |
| `FEDERATION_NODE_ID` | Yes | Stable node UUID. |
| `FEDERATION_PUBLIC_BASE_URL` | Yes | Public absolute HTTPS base URL. |
| `FEDERATION_NODE_NAME` | Yes | Human-readable node name. |
| `FEDERATION_OPERATOR` | Yes | Operator name. |
| `FEDERATION_DATABASE_URL` | Yes | PostgreSQL SQLAlchemy URL. |
| `FEDERATION_ACTIVE_KID` | Yes | Active signing-key identifier. |
| `FEDERATION_SIGNING_KEY_PATH` or `FEDERATION_SIGNING_KEY_SECRET_PATH` | Yes | Ed25519 private-key file. |
| `FEDERATION_JWKS_ENABLED` | No | Publish public keys. Defaults to `true` when federation is enabled. |

Node identity is configuration-driven. Changing it can break the continuity of persistent references, signatures, and federation provenance.

## Synchronization policy

| Variable | Default | Purpose |
|---|---|---|
| `FEDERATION_ADMIN_SYNC_TIMEOUT_SECONDS` | `60` | Bound for an administrator-triggered sync. |
| `FEDERATION_WORKER_INTERVAL_SECONDS` | `60` | Background polling interval. |
| `FEDERATION_WORKER_MAX_SYNC_SECONDS` | `120` | Bound for a worker sync run. |
| `FEDERATION_SYNC_CONNECT_TIMEOUT_SECONDS` | `5` | Outbound connection timeout. |
| `FEDERATION_SYNC_READ_TIMEOUT_SECONDS` | `10` | Outbound read timeout. |
| `FEDERATION_SYNC_WRITE_TIMEOUT_SECONDS` | `10` | Outbound write timeout. |
| `FEDERATION_SYNC_POOL_TIMEOUT_SECONDS` | `5` | Connection-pool timeout. |
| `FEDERATION_SYNC_RETRY_ATTEMPTS` | `3` | Retry count. |
| `FEDERATION_SYNC_ALLOWED_PORTS` | `443` | Comma-separated remote ports. |
| `FEDERATION_SYNC_ALLOWED_HOSTNAMES` | Empty | Additional allowed hostnames. |
| `FEDERATION_SYNC_ALLOWED_CIDRS` | Empty | Additional allowed CIDR ranges. |
| `FEDERATION_ALLOW_PRIVATE_NETWORK` | `false` | Permit private-network targets. Use only in controlled deployments. |
| `FEDERATION_ALLOW_HTTP_FOR_DEMO` | `false` | Permit HTTP for demonstrations. |
| `FEDERATION_DEMO_TOFU_UNSAFE` | `false` | Enable unsafe demo trust-on-first-use behavior. Never use in production. |

The implementation also caps discovery, JWKS, change-feed, record, embedded-payload, key-count, and page sizes. See `FederationSettings` in the source for exact defaults.

## RDF outbox

| Variable | Default | Purpose |
|---|---|---|
| `FEDERATION_RDF_FUSEKI_TIMEOUT_SECONDS` | `10` | Fuseki operation timeout. |
| `FEDERATION_RDF_OUTBOX_LEASE_SECONDS` | `300` | Worker lease duration. |
| `FEDERATION_RDF_OUTBOX_RETRY_ATTEMPTS` | `5` | Attempts before dead-lettering. |
| `FEDERATION_RDF_OUTBOX_RETRY_BASE_SECONDS` | `2` | Initial retry backoff. |
| `FEDERATION_RDF_OUTBOX_RETRY_MAX_SECONDS` | `30` | Maximum retry backoff. |
| `FEDERATION_RDF_OUTBOX_BATCH_SIZE` | `25` | Jobs claimed per batch. |

PostgreSQL remains the source of truth. Fuseki failures enter the outbox retry lifecycle and do not block licence resolution.
