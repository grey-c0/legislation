export type Status = 
  | 'proposed'
  | 'passed'
  | 'implementing'
  | 'active'
  | 'challenged'
  | 'repealed';

export type Category = 
  | 'digital_id'
  | 'age_verification'
  | 'encryption_backdoor'
  | 'traffic_retention'
  | 'biometric_collection'
  | 'worker_surveillance'
  | 'platform_mandated_scanning'
  | 'data_retention'
  | 'algorithmic_management'
  | 'other';

export type SourceType = 
  | 'primary'
  | 'civil_society'
  | 'news';

export interface Source {
  url: string;
  type: SourceType;
  description: string;
}

export interface Severity {
  rationale: string;
  score: 1 | 2 | 3 | 4 | 5;
}

export interface Entry {
  id: string;
  commonName: string;
  legalName: string;
  /**
   * For EU-level legislation (e.g. eIDAS 2.0, Chat Control), set this to "EU".
   *
   * EU entries represent directives/regulations that cascade into member states. They are not laws of any single country, but impose compliance obligations on member states.
   *
   * Country name for map grouping, for example: "Germany", "Australia" or "EU"
   */
  location: string;
  status: Status;
  severity: Severity;
  categories: Category[];
  /** Administrative level: "Union", "National", "State", or "Regional" */
  jurisdiction: 'Union' | 'National' | 'State' | 'Regional';
  description: string;
  sources: Source[];
  notes: string;
}

export interface LegislationData {
  entries: Entry[];
}

export const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  'EU': [10.0, 51.5],
  'Germany': [10.4515, 51.1657],
  'United Kingdom': [-3.4360, 55.3781],
  'Canada': [-106.3468, 56.1304],
  'United States': [-95.7129, 37.0902],
  'Australia': [133.7751, -25.2744]
};

/** EU member states whose markers should also surface Union-level entries. */
export const EU_MEMBER_STATES = new Set([
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
  'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta',
  'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia',
  'Spain', 'Sweden'
]);

export const STATUS_COLORS: Record<Status, string> = {
  'proposed': '#FFB6C1',
  'passed': '#DC143C',
  'implementing': '#8B0000',
  'active': '#8B0000',
  'challenged': '#FF4500',
  'repealed': '#CCCCCC'
};

export const SEVERITY_COLORS: Record<number, string> = {
  1: '#FFFFFF',
  2: '#FFE4E1',
  3: '#FFB6C1',
  4: '#DC143C',
  5: '#8B0000'
};

export const CATEGORY_LABELS: Record<Category, string> = {
  'digital_id': 'Digital ID',
  'age_verification': 'Age Verification',
  'encryption_backdoor': 'Encryption Backdoor',
  'traffic_retention': 'Traffic Retention',
  'biometric_collection': 'Biometric Collection',
  'worker_surveillance': 'Worker Surveillance',
  'platform_mandated_scanning': 'Platform Scanning',
  'data_retention': 'Data Retention',
  'algorithmic_management': 'Algorithmic Management',
  'other': 'Other'
};

export const STATUS_LABELS: Record<Status, string> = {
  'proposed': 'Proposed',
  'passed': 'Passed',
  'implementing': 'Implementing',
  'active': 'Active',
  'challenged': 'Challenged',
  'repealed': 'Repealed'
};
