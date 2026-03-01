export interface DocChecklistTemplate {
  category: string;
  items: { name: string; required: boolean }[];
}

export const DOC_CHECKLISTS: DocChecklistTemplate[] = [
  {
    category: 'Legal / Tenure',
    items: [
      { name: 'Certificate of Incorporation (SARL)', required: true },
      { name: 'RCCM Registration', required: true },
      { name: 'Tax Registration Certificate (NIF)', required: true },
      { name: 'CAMI Permit (PR or PE)', required: true },
      { name: 'Surface Rights Fee Payment Receipts', required: true },
      { name: 'Title Opinion Letter', required: false },
      { name: 'JV / Option Agreement', required: false },
      { name: 'Boundary Survey Report', required: true },
      { name: 'Anti-corruption Policy', required: true },
      { name: 'KYC / AML Procedures', required: false },
    ],
  },
  {
    category: 'Environmental / EIES',
    items: [
      { name: 'Environmental Impact Study (EIES)', required: true },
      { name: 'Environmental Management Plan', required: true },
      { name: 'Water Use Permit', required: false },
      { name: 'Waste Management Plan', required: false },
      { name: 'Rehabilitation / Closure Plan', required: false },
      { name: 'Biodiversity Baseline Assessment', required: false },
      { name: 'Carbon Footprint Assessment', required: false },
    ],
  },
  {
    category: 'Community Engagement',
    items: [
      { name: 'Community Consultation Minutes', required: true },
      { name: 'Cahier des Charges (Community Agreement)', required: true },
      { name: 'Community Development Plan', required: false },
      { name: 'Grievance Mechanism Documentation', required: false },
      { name: 'Stakeholder Register', required: true },
      { name: 'Resettlement Action Plan (if applicable)', required: false },
    ],
  },
  {
    category: 'Vendor / Compliance',
    items: [
      { name: 'Drilling Contractor Agreement', required: false },
      { name: 'Laboratory Service Agreement', required: false },
      { name: 'Security Contractor Agreement', required: false },
      { name: 'Camp/Logistics Service Agreement', required: false },
      { name: 'Insurance Certificates', required: true },
      { name: 'Vendor Due Diligence Records', required: false },
    ],
  },
  {
    category: 'Technical / Reporting',
    items: [
      { name: 'Geological Report', required: true },
      { name: 'Assay Certificates + QA/QC Report', required: true },
      { name: 'Resource Estimate Report', required: false },
      { name: 'NI 43-101 / JORC Technical Report', required: false },
      { name: 'Preliminary Economic Assessment (PEA)', required: false },
      { name: 'Feasibility Study (PFS/DFS)', required: false },
      { name: 'Metallurgical Test Report', required: false },
      { name: 'Mining Operations Manual', required: false },
    ],
  },
];
