# Run with Docker Compose

Use this guide to run the licence API and Fuseki locally. Run all commands from the repository root.

## 1. Create local configuration

```bash
cp .env.example .env
```

Change the example passwords before using the stack outside an isolated development machine. Add administrator and curator tokens if you need protected endpoints:

```dotenv
LFS_ADMIN_TOKEN=replace-with-a-long-random-value
LFS_CURATOR_TOKEN=replace-with-another-long-random-value
```

Keep `.env` out of version control. It is already ignored.

## 2. Start the application profile

```bash
docker compose --profile app up --build -d
```

This starts:

- `license-facade-service` on <http://localhost:12104>;
- Apache Jena Fuseki on the internal Compose network.

## 3. Check readiness

```bash
curl -fsS http://localhost:12104/api/v1/health
curl -fsS http://localhost:12104/api/v1/ready
```

`health` reports process liveness. `ready` checks the cached licence data and, when enabled, Fuseki and federation runtime state.

Open <http://localhost:12104/docs> to inspect the interactive API.

## 4. Make a lookup

```bash
curl -fsS http://localhost:12104/api/v1/licenses/CC-BY-4.0/json \
  | python3 -m json.tool
```

The response includes local links, upstream SPDX metadata, representation availability, and conformance information.

## 5. Stop the stack

```bash
docker compose --profile app down
```

The named Fuseki volume remains available for the next start. Use Docker volume management deliberately if you need to remove it.

For all application and federation settings, see [Configuration](../reference/configuration.md).
