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

export interface DocumentMeta {
  title: string;
  projectName: string;
  draftingUnitLabel: string; // e.g., "负责起草单位："
  draftingUnitValue: string; // The specific unit name if added manually or left blank
  pageInfoPrefix: string; // "共"
  pageInfoSuffix: string; // "页 第"
  contractorLabel: string; // "承办人："
  dateLabel: string; // "年 月 日填写"
  footerNote: string; // "注：技术审查会时需填写..."
}

export interface ToolbarItem {
  icon: React.FC<any>;
  label: string;
  hasDropdown?: boolean;
  isActive?: boolean;
}
