
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
