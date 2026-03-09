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
  // EU bloc marker
  'EU': [10.0, 51.5],
  // EU member states — all receive Union-level entries on the map
  'Austria': [14.5501, 47.5162],
  'Belgium': [4.4699, 50.5039],
  'Bulgaria': [25.4858, 42.7339],
  'Croatia': [15.2000, 45.1000],
  'Cyprus': [33.4299, 34.9254],
  'Czech Republic': [15.4729, 49.8175],
  'Denmark': [9.5018, 56.2639],
  'Estonia': [24.7536, 58.5953],
  'Finland': [25.7482, 61.9241],
  'France': [2.3522, 46.2276],
  'Germany': [10.4515, 51.1657],
  'Greece': [21.8243, 39.0742],
  'Hungary': [19.5033, 47.1625],
  'Ireland': [-8.2439, 53.4129],
  'Italy': [12.5674, 41.8719],
  'Latvia': [24.6032, 56.8796],
  'Lithuania': [23.8813, 55.1694],
  'Luxembourg': [6.1296, 49.8153],
  'Malta': [14.3754, 35.9375],
  'Netherlands': [5.2913, 52.1326],
  'Poland': [19.1451, 51.9194],
  'Portugal': [-8.2245, 39.3999],
  'Romania': [24.9668, 45.9432],
  'Slovakia': [19.6990, 48.6690],
  'Slovenia': [14.9955, 46.1512],
  'Spain': [-3.7492, 40.4637],
  'Sweden': [18.6435, 60.1282],
  // Other countries
  'United Kingdom': [-3.4360, 55.3781],
  'Canada': [-106.3468, 56.1304],
  'United States': [-95.7129, 37.0902],
  'Australia': [133.7751, -25.2744],
  'New Zealand': [174.8860, -40.9006],
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
  1: '#a8d5a2',
  2: '#f5c542',
  3: '#f4853a',
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
