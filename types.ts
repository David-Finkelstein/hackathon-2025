export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum FindingType {
  DAMAGE = 'DAMAGE',
  MISSING_ITEM = 'MISSING_ITEM',
  CLEANLINESS = 'CLEANLINESS',
  MOVED = 'MOVED'
}

export interface Finding {
  id: string;
  type: FindingType;
  item: string;
  description: string;
  severity: Severity;
  confidence: number;
  estimatedCost?: string;
  location?: string;
}

export interface InspectionResult {
  findings: Finding[];
  summary: string;
  analyzedAt: string;
}

// Backend API Types
export interface DamageItem {
  itemName: string;
  condition: 'missing' | 'damaged' | 'broken';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface RoomAssessment {
  room: string;
  damageDetected: boolean;
  items: DamageItem[];
  notes?: string;
}

export interface ItemToCheck {
  room: string;
  item: string;
}

export interface FinalSummary {
  overallStatus: 'all_clear' | 'minor_issues' | 'major_concerns';
  summary: string;
  itemsToCheck: ItemToCheck[];
  totalIssuesFound: number;
}

export interface CompareResponse {
  summary: FinalSummary;
  roomAssessments: RoomAssessment[];
}

export interface UploadResponse {
  fileName: string;
}

export interface RoomImages {
  kitchen: string | null;
  bathroom: string | null;
  livingRoom: string | null;
  bedroom: string | null;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  thumbnail: string;
  pendingCheckout?: {
    guestName: string;
    checkoutTime: string;
    reservationId: string;
  };
}

export type AppView = 'DASHBOARD' | 'INSPECTION_WIZARD' | 'ANALYSIS' | 'REPORT' | 'ANALYTICS';
