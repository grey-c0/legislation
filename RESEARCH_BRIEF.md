# Research Brief: Surveillance & Digital Control Legislation Tracker

## Your Task

Research **[COUNTRY]** and produce a JSON array of `Entry` objects covering all significant
surveillance, digital ID, biometric, encryption-backdoor, and worker-surveillance legislation
enacted, proposed, or active in that country. Append your output to `public/legislation.json`
under the `"entries"` key. Do not remove or modify existing entries.

---

## What This Tracker Covers

This is a civil-liberties tracker documenting laws and policies that expand state or corporate
surveillance power over ordinary people, workers, and organizers. The analytical lens is:

- **Who loses privacy / autonomy?** Workers, migrants, youth, activists, union members.
- **Who gains power?** States, employers, platforms, intelligence agencies.
- **What mechanisms are used?** Digital ID mandates, biometric collection, encryption backdoors,
  traffic/data retention, age verification walls, platform-mandated scanning, algorithmic
  management of workers.

Cover legislation that is *currently active, being implemented, proposed, or recently challenged*.
Do not cover repealed laws unless they are historically significant and directly feed into active
successor legislation.

---

## JSON Schema

Each entry must exactly match this TypeScript interface:

```typescript
interface Entry {
  id: string;                  // See ID format below
  commonName: string;          // Short plain-English name (e.g. "Online Safety Act")
  legalName: string;           // Official legal title including year
  location: string;            // Country name — must exactly match an existing location string
                               // OR be a new country (see adding new countries below)
  status: Status;              // See Status enum below
  severity: {
    score: 1 | 2 | 3 | 4 | 5; // See severity rubric below
    rationale: string;         // Step-by-step scoring justification (see examples)
  };
  categories: Category[];      // One or more — see Category enum below
  jurisdiction: 'National' | 'State' | 'Regional';
  description: string;         // 2–4 sentences. Precise, factual, no jargon.
  sources: Source[];           // Minimum 2, ideally 3. See Source type below.
  notes: string;               // 1 paragraph. Implementation detail, political context,
                               // resistance, corporate actors, labor/organizing impact.
}

type Status =
  | 'proposed'      // Bill introduced / announced, not yet voted on
  | 'passed'        // Voted into law but not yet in force / implementing
  | 'implementing'  // In force but rollout/regulations still in progress
  | 'active'        // Fully in force
  | 'challenged'    // Active legal challenge (court injunction, constitutional case)
  | 'repealed';     // Struck down or revoked

type Category =
  | 'digital_id'               // Mandatory or strongly-coerced digital identity systems
  | 'age_verification'         // Laws requiring proof of age to access services
  | 'encryption_backdoor'      // Laws compelling platforms to break/bypass E2E encryption
  | 'traffic_retention'        // Mandatory retention of metadata / traffic data by ISPs
  | 'biometric_collection'     // Collection of biometric data (face, fingerprint, iris, etc.)
  | 'worker_surveillance'      // Monitoring of workers' activity, location, output
  | 'platform_mandated_scanning' // Laws requiring platforms to scan user content
  | 'data_retention'           // Broader data retention beyond traffic metadata
  | 'algorithmic_management'   // Automated systems that control workers' tasks/conditions
  | 'other';

type SourceType = 'primary' | 'civil_society' | 'news';

interface Source {
  url: string;           // Full URL (verify it resolves)
  type: SourceType;
  description: string;   // One sentence describing what this source shows/argues
}
```

---

## ID Format

```
[ISO-3166-1 alpha-2 country code]-[4-digit year of passage/proposal]-[SHORT-KEYWORD]-[3-digit sequence]
```

Examples:
- `UK-2023-OSA-001`
- `DE-2025-BND-001`
- `AU-2024-DIGID-001`
- `US-2025-STATE-001`

For state/regional laws group them under one entry per law family where practical (e.g. "State
Social Media Age Verification Laws").

---

## Severity Scoring Rubric

Score is **1–5**. Assess against these 7 criteria — each met criterion adds roughly +1 (fractional
credit allowed). Map total to 1–5 scale:

| Criterion | +1 if… |
|-----------|--------|
| **Universality** | Applies to entire population, not a targeted subset |
| **Criminal penalties** | Non-compliance by individuals or platforms carries criminal sanctions |
| **Irreversibility** | Creates permanent infrastructure (biometric DB, surveillance network) |
| **Chilling effect on organizing** | Would deter union activity, protest, political speech |
| **Mission creep** | Explicit or obvious pathway to expansion beyond stated purpose |
| **Lack of judicial oversight** | Access/use not gated by independent judicial authorization |
| **Digital exclusion** | Non-participation means exclusion from essential services/employment |

**Scoring guide:**
- 7/7 → 5/5 (Extreme)
- 5–6/7 → 4/5 (High)
- 3–4/7 → 3/5 (Significant)
- 1–2/7 → 2/5 (Moderate)
- 0/7 → 1/5 (Low)

**Rationale format** (copy this pattern exactly):
```
Universal application to all residents [+1], criminal penalties for non-compliance [+1],
biometric database is permanent [+1], chilling effect on union communications [+1],
explicit expansion pathway to employment verification [+1], no independent judicial
authorization required [+1], exclusion from public services for non-participants [+1].
Total: 7/7 → 5/5
```

---

## What to Research

Focus your research on these categories. For **[COUNTRY]** specifically, look for:

### Digital Identity
- National digital ID schemes (mandatory or effectively mandatory for employment, benefits, banking)
- EU Digital Identity Wallet implementation (if EU member state)
- Government app-based identity systems

### Surveillance & Intelligence
- Mass interception powers (internet exchange node tapping, bulk collection)
- Data/traffic retention laws (obligations on ISPs and telcos)
- Intelligence agency reform bills expanding powers

### Encryption & Platform Obligations
- Laws compelling platforms to scan encrypted messages (chat control equivalents)
- "Lawful access" bills requiring backdoors or key escrow
- Platform liability laws that pressure platforms to over-censor/surveil

### Age Verification
- Laws requiring government ID or biometrics to access social media or adult content
- Parental consent regimes that de-anonymize minors online

### Biometrics
- Face recognition deployment (police, border, retail, workplaces)
- Biometric time-and-attendance systems with legal backing
- DNA database expansions

### Worker Surveillance
- Electronic monitoring disclosure laws (or lack thereof)
- Algorithmic management / AI hiring and firing laws
- Gig economy tracking requirements
- Sector-specific worker ID schemes (construction, healthcare, transport)

### Sources to search
- Government legislative portals (primary source)
- Civil liberties orgs: EFF (US), Open Rights Group (UK), Netzpolitik (DE), Digital Rights Watch (AU),
  CCLA (CA), Access Now, Privacy International, EDRi (EU)
- Academic/legal: SSRN, law school clinics
- Quality journalism: The Guardian, Wired, Politico, The Intercept, netzpolitik.org
- Parliamentary records / Hansard equivalents

---

## Existing Coverage (Do Not Duplicate)

### United Kingdom (location: `"United Kingdom"`)
| ID | Law | Status |
|----|-----|--------|
| `UK-2025-DIGID-001` | Digital ID for Employment (Britcard) | proposed |
| `UK-2023-OSA-001` | Online Safety Act (Age Verification and Encryption) | active |
| `UK-2024-IPA-001` | Investigatory Powers Act 2024 Amendments | implementing |
| `UK-2025-DUA-001` | Data (Use and Access) Act 2025 | passed |

### Germany (location: `"Germany"`)
| ID | Law | Status |
|----|-----|--------|
| `DE-2025-BND-001` | BND Law 2025 (Traffic Retention Expansion) | proposed |
| `DE-2025-EUDI-001` | Digital Personalausweis Online Expansion | implementing |
| `DE-2025-CHAT-001` | Chatkontrolle (EU CSAM Regulation) | proposed |
| `DE-2021-NetzDG-002` | NetzDG BKA Reporting Amendment (ZMI) | active |

### United States (location: `"United States"`)
| ID | Law | Status |
|----|-----|--------|
| `US-2025-STATE-001` | State Social Media Age Verification Laws | challenged |
| `US-2025-EARN-001` | EARN IT Act (Federal Encryption Threat) | proposed |
| `US-2025-ICE-001` | ICE Social Media Surveillance Expansion | implementing |
| `US-2025-AMZN-001` | Amazon Warehouse Worker Algorithmic Surveillance | active |
| `US-2025-KOSA-001` | Kids Online Safety Act (KOSA) 2025 | proposed |
| `US-2026-CA-947` | No Robo Bosses Act (California) | proposed |

### Australia (location: `"Australia"`)
| ID | Law | Status |
|----|-----|--------|
| `AU-2024-DIGID-001` | Digital ID Act 2024 (MyGovID Expansion) | implementing |
| `AU-2024-SMMA-001` | Social Media Minimum Age Ban (Under-16s) | active |
| `AU-2018-TOLA-001` | Assistance and Access Act (TOLA) | active |
| `AU-2025-NSW-DWC` | NSW Digital White Card (Construction Worker ID) | active |

### Canada (location: `"Canada"`)
| ID | Law | Status |
|----|-----|--------|
| `CA-2025-C2-001` | Bill C-2 (Strong Borders Act) - Lawful Access | challenged |
| `CA-2025-C63-001` | Online Harms Act (Bill C-63) | proposed |
| `CA-2025-DIACC-001` | DIACC Digital ID and Authentication Expansion | implementing |
| `CA-2025-C8-001` | Critical Cyber Systems Protection Act (Bill C-8) | proposed |

---

## Adding a New Country

If **[COUNTRY]** is not in the list above, you must also add its coordinates to
`src/types/legislation.ts` inside the `COUNTRY_COORDINATES` object:

```typescript
'[Country Name]': [longitude, latitude],  // decimal degrees, longitude first
```

Use the geographic centre of the country. The map marker will appear there.

---

## Output Format

Return a JSON array (not a full file — just the array of new entries to append):

```json
[
  {
    "id": "XX-2025-EXAMPLE-001",
    "commonName": "...",
    "legalName": "...",
    "location": "[COUNTRY]",
    "status": "active",
    "severity": {
      "score": 4,
      "rationale": "Universal application [+1], criminal penalties [+1], ..."
    },
    "categories": ["digital_id", "biometric_collection"],
    "jurisdiction": "National",
    "description": "...",
    "sources": [
      { "url": "https://...", "type": "primary", "description": "..." },
      { "url": "https://...", "type": "civil_society", "description": "..." }
    ],
    "notes": "..."
  }
]
```

Aim for **4–8 entries** per country. Prioritise laws that are actively in force or have high
severity scores. Do not invent or hallucinate legislation — if you are uncertain whether a law
exists or its current status, note your uncertainty in `notes` and mark status as `"proposed"`.

Verify every source URL is real before including it. If a URL is uncertain, omit it and use a
different source.
