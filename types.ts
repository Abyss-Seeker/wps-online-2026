import React from 'react';

export interface TableRow {
  id: number;
  serialNumber: number;
  clauseNumber: string;
  opinionContent: string;
  modificationSuggestion: string;
  proposingUnit: string;
  handlingOpinion: string;
  remarks: string;
}

export interface ToolbarItem {
  icon: React.FC<any>;
  label: string;
  hasDropdown?: boolean;
  isActive?: boolean;
}