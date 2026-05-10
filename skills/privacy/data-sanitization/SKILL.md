---
name: data-sanitization
description: Use when handling local, private, customer, production, or real-world data that may be uploaded, shared, pasted into an external service, used with remote tools, or included in prompts, logs, screenshots, files, examples, or analysis artifacts.
metadata:
  author: QuentinHsu
  version: "2026.05.10"
---

# Data Sanitization

Protect local real data before it is used outside the local trusted environment.

Core rule: never upload, paste, transmit, or expose local actual data to any third party unless the user explicitly confirms that the exact data is safe to share. Use sanitized copies for thinking, analysis, examples, external tools, model prompts, debugging artifacts, and generated files.

## Trigger Conditions

Use this skill before any action that may expose data outside the local environment:

- Uploading files, screenshots, logs, database exports, spreadsheets, documents, archives, or media.
- Calling remote APIs, hosted models, cloud tools, paste services, issue trackers, SaaS apps, or browser-based analysis tools.
- Including local data in prompts, examples, bug reports, PRs, commits, tickets, telemetry, or chat messages.
- Summarizing, transforming, sampling, or debugging production, customer, employee, business, financial, health, legal, credential, or private project data.
- Using screenshots or terminal output that may contain real identifiers, secrets, paths, hostnames, account names, or proprietary content.

If unsure whether data is real or sensitive, treat it as sensitive.

## Sensitive Data Classes

Redact or replace at least these classes:

| Class | Examples |
| --- | --- |
| Identity | names, usernames, emails, phone numbers, addresses, national IDs, passport numbers |
| Credentials | passwords, API keys, model provider keys, tokens, cookies, private keys, session IDs, OTPs, recovery codes |
| Business data | customer names, contracts, prices, invoices, internal roadmaps, sales data, support tickets |
| Financial data | bank accounts, cards, tax IDs, payroll, revenue, payment history |
| Health and legal data | medical records, legal matters, case IDs, regulated personal data |
| Technical secrets | internal URLs, hostnames, IPs, database names, bucket names, project IDs, repo names when private |
| Service configuration | AI API keys, model provider configs, database connection strings, DSNs, website login configs, OAuth client secrets, webhook URLs |
| Behavioral data | logs, analytics events, traces, usage histories, location data, device IDs |
| File metadata | local paths, usernames in paths, machine names, timestamps that reveal private activity |

Treat connection and login configuration as sensitive even when it does not contain an obvious password. Endpoint URLs, usernames, tenant IDs, organization IDs, database names, login domains, and provider names can reveal private infrastructure or account relationships.

## Sanitization Protocol

1. **Classify the destination.** If data will leave the local trusted environment, continue with sanitization first.
2. **Identify sensitive fields and context.** Scan headers, keys, sample rows, filenames, screenshots, logs, stack traces, metadata, and free text.
3. **Create a sanitized copy.** Never overwrite the original unless the user explicitly asks. Work only on a derived artifact.
4. **Preserve useful shape.** Keep schema, row counts when needed, formats, value categories, relationships, ordering, and edge cases that matter for analysis.
5. **Break reversibility.** Do not use weak masking that preserves enough characters to reconstruct real values. Prefer deterministic placeholders only when relationships must be preserved.
6. **Minimize data volume.** Share the smallest sanitized subset that answers the task.
7. **Verify before exposure.** Re-scan the sanitized artifact for secrets and real identifiers before upload or transmission.
8. **State the boundary.** Tell the user that only sanitized data is being used or uploaded. If sanitization cannot be verified, do not upload.

## Replacement Rules

Use realistic but fake placeholders:

- Emails: `user_001@example.test`, `billing@example.test`
- Names: `Person 001`, `Customer A`, `Employee 042`
- Phone numbers: `+1-555-0100`, `+86-10-5555-0100`
- Addresses: `123 Example Street, Example City`
- Tokens and secrets: `[REDACTED_API_KEY]`, `[REDACTED_TOKEN]`, `[REDACTED_PRIVATE_KEY]`
- AI service config: `OPENAI_API_KEY=[REDACTED_API_KEY]`, `ANTHROPIC_API_KEY=[REDACTED_API_KEY]`, `base_url=https://api.example.test/v1`
- Database config: `postgresql://app_user:[REDACTED_PASSWORD]@db.example.test:5432/app_db`, `DATABASE_URL=[REDACTED_DATABASE_URL]`
- Website login config: `login_url=https://login.example.test`, `username=user_001@example.test`, `password=[REDACTED_PASSWORD]`, `totp_secret=[REDACTED_TOTP_SECRET]`
- Internal URLs and hosts: `https://internal.example.test`, `db-01.example.test`
- IDs: `cust_001`, `acct_001`, `order_001`
- Monetary values: preserve scale or range only when needed, such as `amount_bucket: 1000-5000`
- Dates and timestamps: shift consistently or bucket to month/quarter when exact timing is unnecessary
- Free text: paraphrase or replace private details while preserving intent, error type, or domain category

Prefer reserved example domains (`example.com`, `example.org`, `example.net`, `example.test`) for generated data.

## Do Not Do

- Do not upload raw local files to any service just to inspect, convert, summarize, or debug them.
- Do not paste real rows, logs, stack traces, screenshots, secrets, or customer records into remote tools.
- Do not assume a value is safe because it is "only metadata", "only a path", "only a test row", or "already in a log".
- Do not keep partial secrets such as first and last characters of tokens unless the user explicitly needs that for local-only matching.
- Do not claim data is anonymized if unique combinations can still identify a person, customer, project, or system.
- Do not store sanitized artifacts in public or synced locations unless the user asked for that destination.

## When Sanitization May Be Skipped

Only skip sanitization when one of these is true:

- The user explicitly states that the exact data is synthetic or public.
- The data stays local and is processed only by local tools without upload, telemetry, or remote execution.
- The user explicitly instructs you to share exact data after you warn that it may expose local real data.

Even then, redact credentials, private keys, tokens, and passwords unless the user gives a precise, intentional exception.

## User Interaction

If raw data is required and no safe substitute exists, ask a short confirmation before exposure:

```text
This appears to contain local real data. I can sanitize it before using any external service, or keep the analysis local. Should I proceed with a sanitized copy?
```

If the user asks to upload raw data, respond with the risk and offer a sanitized alternative.

## Final Check

Before any upload or external use, confirm:

- The artifact is a sanitized copy, not the original.
- Credentials, identifiers, private text, paths, and metadata were removed or replaced.
- The remaining data is sufficient for the task and not more detailed than necessary.
- The user-visible summary does not include raw sensitive values.
