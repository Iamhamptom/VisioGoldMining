export interface DRCGovernmentContact {
  id: string;
  office: string;
  officeholder: string;
  level: 'national' | 'provincial' | 'local';
  province?: string;
  jurisdiction: string;
  contactInfo: string;
  responsibilities: string[];
}

export const DRC_GOVERNMENT: DRCGovernmentContact[] = [
  {
    id: 'gov-001',
    office: 'Ministry of Mines',
    officeholder: 'Cabinet du Ministre des Mines',
    level: 'national',
    jurisdiction: 'National mining policy, licensing oversight, code implementation',
    contactInfo: 'Kinshasa ministerial quarter; formal correspondence in French required.',
    responsibilities: ['Mining policy directives', 'Permit sign-off escalation', 'Sector coordination'],
  },
  {
    id: 'gov-002',
    office: 'CAMI (Cadastre Minier)',
    officeholder: 'Direction Générale CAMI',
    level: 'national',
    jurisdiction: 'National mineral title cadastre and permit registry',
    contactInfo: 'Kinshasa head office plus provincial relay offices.',
    responsibilities: ['Permit filings', 'Cadastre validation', 'Licence map extracts'],
  },
  {
    id: 'gov-003',
    office: 'SAEMAPE',
    officeholder: 'Direction Générale SAEMAPE',
    level: 'national',
    jurisdiction: 'Artisanal and small-scale mining oversight',
    contactInfo: 'Kinshasa with provincial mine-service representatives.',
    responsibilities: ['ASM supervision', 'Cooperative engagement', 'Field inspections'],
  },
  {
    id: 'gov-004',
    office: 'CEEC',
    officeholder: 'Direction Générale CEEC',
    level: 'national',
    jurisdiction: 'Evaluation and certification of precious minerals',
    contactInfo: 'Kinshasa; field coordination via export and assay points.',
    responsibilities: ['Traceability', 'Export certification', 'Valuation support'],
  },
  {
    id: 'gov-005',
    office: 'Ministry of Environment',
    officeholder: 'Cabinet du Ministre de l’Environnement',
    level: 'national',
    jurisdiction: 'Environmental permitting, protected areas, ESIA oversight',
    contactInfo: 'Kinshasa; close coordination with ICCN and provincial environment divisions.',
    responsibilities: ['ESIA approvals', 'Protected area review', 'Biodiversity compliance'],
  },
  {
    id: 'gov-006',
    office: 'Ministry of Finance',
    officeholder: 'Cabinet du Ministre des Finances',
    level: 'national',
    jurisdiction: 'Fiscal policy, royalties, customs and treasury interfaces',
    contactInfo: 'Kinshasa fiscal administration cluster.',
    responsibilities: ['Royalty frameworks', 'Tax coordination', 'Large-investment approvals'],
  },
  {
    id: 'gov-007',
    office: 'Governor of Haut-Uele',
    officeholder: 'Gouvernorat du Haut-Uele',
    level: 'provincial',
    province: 'Haut-Uele',
    jurisdiction: 'Provincial administration, security coordination, local permits',
    contactInfo: 'Isiro governor’s office; protocol requests should be submitted through cabinet staff.',
    responsibilities: ['Provincial access letters', 'Security coordination', 'Investor protocol'],
  },
  {
    id: 'gov-008',
    office: 'Governor of Ituri',
    officeholder: 'Gouvernorat de l’Ituri',
    level: 'provincial',
    province: 'Ituri',
    jurisdiction: 'Bunia-based provincial authority during sensitive security conditions',
    contactInfo: 'Bunia governor’s office; armed escort and state-of-siege implications often routed here.',
    responsibilities: ['Security coordination', 'Provincial introductions', 'Conflict-sensitive approvals'],
  },
  {
    id: 'gov-009',
    office: 'Governor of South Kivu',
    officeholder: 'Gouvernorat du Sud-Kivu',
    level: 'provincial',
    province: 'South Kivu',
    jurisdiction: 'Bukavu-based administration for South Kivu territories',
    contactInfo: 'Bukavu governor’s office; provincial protocol and local administration gateway.',
    responsibilities: ['Provincial protocol', 'Local liaison', 'Operational notifications'],
  },
  {
    id: 'gov-010',
    office: 'Governor of Maniema',
    officeholder: 'Gouvernorat du Maniema',
    level: 'provincial',
    province: 'Maniema',
    jurisdiction: 'Kindu-based provincial authority',
    contactInfo: 'Kindu governor’s office; radio and in-person notice still common for field missions.',
    responsibilities: ['Field-mission notification', 'Territorial coordination', 'Provincial introductions'],
  },
  {
    id: 'gov-011',
    office: 'Governor of North Kivu',
    officeholder: 'Gouvernorat du Nord-Kivu',
    level: 'provincial',
    province: 'North Kivu',
    jurisdiction: 'Goma-based provincial administration in a volatile operating environment',
    contactInfo: 'Goma governor’s office; route changes can alter meeting feasibility with little notice.',
    responsibilities: ['Security posture updates', 'Cross-border coordination', 'Provincial protocol'],
  },
  {
    id: 'gov-012',
    office: 'Division Provinciale des Mines',
    officeholder: 'Chef de Division des Mines - Ituri',
    level: 'provincial',
    province: 'Ituri',
    jurisdiction: 'Ituri provincial mining administration',
    contactInfo: 'Bunia mining division office.',
    responsibilities: ['Local permit follow-up', 'Field introductions', 'Document validation'],
  },
  {
    id: 'gov-013',
    office: 'Division Provinciale des Mines',
    officeholder: 'Chef de Division des Mines - South Kivu',
    level: 'provincial',
    province: 'South Kivu',
    jurisdiction: 'South Kivu mining division',
    contactInfo: 'Bukavu mining division office.',
    responsibilities: ['Mine-service liaison', 'Provincial compliance', 'Project meeting scheduling'],
  },
  {
    id: 'gov-014',
    office: 'Division Provinciale des Mines',
    officeholder: 'Chef de Division des Mines - Maniema',
    level: 'provincial',
    province: 'Maniema',
    jurisdiction: 'Maniema mining division',
    contactInfo: 'Kindu mining office; confirm availability before travel.',
    responsibilities: ['Territorial liaison', 'Province-level mining records', 'Field coordination'],
  },
  {
    id: 'gov-015',
    office: 'Administrator of Watsa Territory',
    officeholder: 'Administrateur du Territoire de Watsa',
    level: 'local',
    province: 'Haut-Uele',
    jurisdiction: 'Local civil administration for Kibali corridor communities',
    contactInfo: 'Watsa territory office; meetings often arranged through local protocol staff.',
    responsibilities: ['Local access letters', 'Community introductions', 'Territorial notifications'],
  },
  {
    id: 'gov-016',
    office: 'Administrator of Mwenga Territory',
    officeholder: 'Administrateur du Territoire de Mwenga',
    level: 'local',
    province: 'South Kivu',
    jurisdiction: 'Local administration covering Twangiza and Kamituga access routes',
    contactInfo: 'Mwenga territory office; travel windows depend on current escort posture.',
    responsibilities: ['Local approvals', 'Customary liaison', 'Territorial reporting'],
  },
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function getGovernmentByProvince(province: string) {
  const normalizedProvince = normalize(province);
  return DRC_GOVERNMENT.filter((contact) => {
    if (!contact.province) return contact.level === 'national';
    return normalize(contact.province).includes(normalizedProvince);
  });
}
