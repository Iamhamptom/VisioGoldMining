export interface PermitType {
  id: string;
  name: string;
  frenchName: string;
  abbreviation: string;
  duration: string;
  steps: { name: string; timelineWeeks: { min: number; max: number }; fees: string }[];
}

export interface TaxObligation {
  name: string;
  rate: string;
  basis: string;
  authority: string;
}

export interface RegulatoryBody {
  name: string;
  abbreviation: string;
  role: string;
  location: string;
}

export const PERMIT_TYPES: PermitType[] = [
  {
    id: 'PR',
    name: 'Research Permit',
    frenchName: 'Permis de Recherches',
    abbreviation: 'PR',
    duration: '5 years (renewable once for 5 years)',
    steps: [
      { name: 'Application submission to CAMI', timelineWeeks: { min: 1, max: 2 }, fees: '$500 filing fee' },
      { name: 'Technical review by Direction des Mines', timelineWeeks: { min: 4, max: 8 }, fees: 'Included in filing' },
      { name: 'Environmental impact notice (EIN)', timelineWeeks: { min: 2, max: 4 }, fees: '$2,000-5,000 consultant fees' },
      { name: 'Surface area fee payment', timelineWeeks: { min: 1, max: 2 }, fees: '$4.24/carre (square) per year' },
      { name: 'CAMI registration and granting', timelineWeeks: { min: 4, max: 12 }, fees: '$300 registration fee' },
      { name: 'Provincial notification', timelineWeeks: { min: 1, max: 3 }, fees: 'No additional fee' },
    ],
  },
  {
    id: 'PE',
    name: 'Exploitation Permit',
    frenchName: 'Permis d\'Exploitation',
    abbreviation: 'PE',
    duration: '25 years (renewable for 15-year periods)',
    steps: [
      { name: 'Feasibility study submission', timelineWeeks: { min: 8, max: 16 }, fees: '$50,000-200,000 study costs' },
      { name: 'Environmental and Social Impact Assessment (ESIA)', timelineWeeks: { min: 12, max: 24 }, fees: '$100,000-500,000' },
      { name: 'Environmental management plan approval (ACE)', timelineWeeks: { min: 4, max: 8 }, fees: '$5,000 review fee' },
      { name: 'Application to CAMI with technical dossier', timelineWeeks: { min: 1, max: 2 }, fees: '$1,000 filing fee' },
      { name: 'Interministerial review and Council of Ministers', timelineWeeks: { min: 8, max: 24 }, fees: 'No direct fee' },
      { name: 'Presidential decree and CAMI registration', timelineWeeks: { min: 4, max: 16 }, fees: '$1,500 registration fee' },
      { name: 'Community development agreement (CDC)', timelineWeeks: { min: 4, max: 12 }, fees: '0.3% of annual turnover ongoing' },
    ],
  },
  {
    id: 'PEPM',
    name: 'Small-Scale Mining Permit',
    frenchName: 'Permis d\'Exploitation de Petite Mine',
    abbreviation: 'PEPM',
    duration: '10 years (renewable)',
    steps: [
      { name: 'Small-scale feasibility study', timelineWeeks: { min: 4, max: 8 }, fees: '$10,000-30,000' },
      { name: 'Environmental management plan (PAE)', timelineWeeks: { min: 4, max: 8 }, fees: '$5,000-15,000' },
      { name: 'Application to CAMI', timelineWeeks: { min: 1, max: 2 }, fees: '$500 filing fee' },
      { name: 'Provincial Mines Division review', timelineWeeks: { min: 4, max: 8 }, fees: 'Included in filing' },
      { name: 'CAMI granting and registration', timelineWeeks: { min: 4, max: 12 }, fees: '$500 registration fee' },
    ],
  },
  {
    id: 'AE',
    name: 'Artisanal Exploitation Authorization',
    frenchName: 'Autorisation d\'Exploitation Artisanale',
    abbreviation: 'AE',
    duration: '1 year (renewable annually)',
    steps: [
      { name: 'Application to Provincial Division des Mines', timelineWeeks: { min: 1, max: 2 }, fees: '$50 filing fee' },
      { name: 'Verification of ZEA (Artisanal Exploitation Zone)', timelineWeeks: { min: 2, max: 4 }, fees: 'No fee' },
      { name: 'SAEMAPE validation', timelineWeeks: { min: 1, max: 3 }, fees: '$25 validation fee' },
      { name: 'Card issuance', timelineWeeks: { min: 1, max: 2 }, fees: '$25 card fee' },
    ],
  },
];

export const TAX_OBLIGATIONS: TaxObligation[] = [
  {
    name: 'Mining Royalty',
    rate: '3.5% (for gold)',
    basis: 'Gross market value of production',
    authority: 'Direction Generale des Impots (DGI)',
  },
  {
    name: 'Profit Tax',
    rate: '30%',
    basis: 'Net taxable income',
    authority: 'Direction Generale des Impots (DGI)',
  },
  {
    name: 'Surface Rent',
    rate: '$4.24/carre for PR; $42.40/carre for PE',
    basis: 'Per square unit of concession area per year',
    authority: 'CAMI',
  },
  {
    name: 'Customs Duties',
    rate: '2-5% (reduced rate for mining equipment)',
    basis: 'CIF value of imported goods',
    authority: 'DGDA (Direction Generale des Douanes et Accises)',
  },
  {
    name: 'Provincial Mining Tax',
    rate: '1%',
    basis: 'Gross value of minerals sold',
    authority: 'Provincial Government',
  },
  {
    name: 'Community Development Contribution',
    rate: '0.3%',
    basis: 'Annual turnover',
    authority: 'Local Community Development Committee (CDC)',
  },
  {
    name: 'Export Tax',
    rate: '1% (concentrates); 0% (refined products)',
    basis: 'FOB value of mineral exports',
    authority: 'CEEC (Centre d\'Expertise, d\'Evaluation et de Certification)',
  },
  {
    name: 'Withholding Tax on Payments Abroad',
    rate: '14%',
    basis: 'Dividends, interest, royalties, and service fees paid abroad',
    authority: 'Direction Generale des Impots (DGI)',
  },
];

export const REGULATORY_BODIES: RegulatoryBody[] = [
  {
    name: 'Cadastre Minier',
    abbreviation: 'CAMI',
    role: 'Central registry for mining titles; processes and grants all mineral rights applications',
    location: 'Kinshasa (head office) with provincial antennas',
  },
  {
    name: 'Direction des Mines',
    abbreviation: 'DM',
    role: 'Technical oversight of mining operations; inspections, safety standards, and production reporting',
    location: 'Ministry of Mines, Kinshasa; provincial divisions in each capital',
  },
  {
    name: 'Service d\'Assistance et d\'Encadrement de l\'Exploitation Miniere Artisanale et a Petite Echelle',
    abbreviation: 'SAEMAPE',
    role: 'Supervision and formalization of artisanal and small-scale mining; manages ZEAs',
    location: 'Provincial offices in mining provinces',
  },
  {
    name: 'Centre d\'Expertise, d\'Evaluation et de Certification',
    abbreviation: 'CEEC',
    role: 'Evaluation, certification, and valuation of mineral substances for export',
    location: 'Kinshasa; branch offices at major export points',
  },
  {
    name: 'Agence Congolaise de l\'Environnement',
    abbreviation: 'ACE',
    role: 'Environmental impact assessment review and approval; environmental compliance monitoring',
    location: 'Kinshasa with provincial delegations',
  },
  {
    name: 'Cellule Technique de Coordination et de Planification Miniere',
    abbreviation: 'CTCPM',
    role: 'Strategic planning and policy coordination for the mining sector; investor facilitation',
    location: 'Ministry of Mines, Kinshasa',
  },
];

export function getPermitById(id: string): PermitType | undefined {
  return PERMIT_TYPES.find(
    (permit) => permit.id.toLowerCase() === id.toLowerCase()
  );
}
