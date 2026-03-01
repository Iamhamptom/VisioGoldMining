// VisioGold DRC — Configurable Priors
// Edit these values to tune simulation outputs without code changes.
// All costs in USD. Ranges are [min, mode, max] for triangular distribution.

export const PRIORS = {
  // Base cost ranges per department per project type [min, mode, max]
  base_costs: {
    exploration: {
      legal_and_tenure:           [15_000,   30_000,   60_000],
      licensing_and_filing:       [10_000,   25_000,   50_000],
      environmental_and_esg:      [20_000,   45_000,  100_000],
      community_engagement:       [15_000,   35_000,   80_000],
      camp_and_logistics:         [50_000,  120_000,  300_000],
      security:                   [30_000,   75_000,  200_000],
      mapping_and_remote_sensing: [25_000,   60_000,  150_000],
      sampling_and_fieldwork:     [40_000,  100_000,  250_000],
      laboratory_assays:          [0, 0, 0], // quantity-driven, see assay_cost_priors
      drilling_campaign:          [0, 0, 0], // quantity-driven, see drilling_cost_priors
      technical_studies_pea:      [50_000,  120_000,  300_000],
      reporting_and_disclosure:   [20_000,   50_000,  120_000],
    },
    small_mine: {
      legal_and_tenure:           [25_000,   60_000,  120_000],
      licensing_and_filing:       [20_000,   50_000,  100_000],
      environmental_and_esg:      [40_000,   90_000,  200_000],
      community_engagement:       [30_000,   70_000,  150_000],
      camp_and_logistics:         [100_000, 250_000,  600_000],
      security:                   [60_000,  150_000,  400_000],
      mapping_and_remote_sensing: [30_000,   70_000,  180_000],
      sampling_and_fieldwork:     [60_000,  150_000,  400_000],
      laboratory_assays:          [0, 0, 0],
      drilling_campaign:          [0, 0, 0],
      technical_studies_pea:      [100_000, 250_000,  600_000],
      reporting_and_disclosure:   [40_000,  100_000,  250_000],
    },
    industrial: {
      legal_and_tenure:           [50_000,  120_000,  300_000],
      licensing_and_filing:       [40_000,  100_000,  250_000],
      environmental_and_esg:      [100_000, 250_000,  600_000],
      community_engagement:       [80_000,  200_000,  500_000],
      camp_and_logistics:         [300_000, 800_000, 2_000_000],
      security:                   [150_000, 400_000, 1_000_000],
      mapping_and_remote_sensing: [60_000,  150_000,  400_000],
      sampling_and_fieldwork:     [100_000, 250_000,  600_000],
      laboratory_assays:          [0, 0, 0],
      drilling_campaign:          [0, 0, 0],
      technical_studies_pea:      [250_000, 600_000, 1_500_000],
      reporting_and_disclosure:   [80_000,  200_000,  500_000],
    },
  },

  // Multipliers applied to department costs based on user selections
  logistics_multiplier: {
    road:  { camp_and_logistics: 1.0, sampling_and_fieldwork: 1.0 },
    mixed: { camp_and_logistics: 1.4, sampling_and_fieldwork: 1.2 },
    heli:  { camp_and_logistics: 2.2, sampling_and_fieldwork: 1.5 },
  } as Record<string, Record<string, number>>,

  security_multiplier: {
    low:  { security: 1.0, camp_and_logistics: 1.0 },
    med:  { security: 1.6, camp_and_logistics: 1.1 },
    high: { security: 2.5, camp_and_logistics: 1.3 },
  } as Record<string, Record<string, number>>,

  camp_multiplier: {
    basic:    { camp_and_logistics: 1.0 },
    standard: { camp_and_logistics: 1.5 },
    premium:  { camp_and_logistics: 2.2 },
  } as Record<string, Record<string, number>>,

  compliance_multiplier: {
    minimum:        { environmental_and_esg: 0.8, reporting_and_disclosure: 0.8, licensing_and_filing: 0.8 },
    standard:       { environmental_and_esg: 1.0, reporting_and_disclosure: 1.0, licensing_and_filing: 1.0 },
    investor_grade: { environmental_and_esg: 1.4, reporting_and_disclosure: 1.4, licensing_and_filing: 1.2 },
  } as Record<string, Record<string, number>>,

  timeline_factor: {
    fast:         0.7,
    normal:       1.0,
    conservative: 1.4,
  } as Record<string, number>,

  // Assay cost priors (per sample, USD)
  assay_cost_priors: {
    screening:  { range: [10, 17, 25],  shipping_multiplier: 1.1 },
    standard:   { range: [18, 26, 35],  shipping_multiplier: 1.2 },
    full_qaqc:  { range: [25, 40, 60],  shipping_multiplier: 1.3 },
  } as Record<string, { range: number[]; shipping_multiplier: number }>,

  // Lab location multiplier applied to assay costs
  lab_location_multiplier: {
    local:         1.0,
    regional:      1.3,
    international: 1.8,
  } as Record<string, number>,

  // Drilling cost priors (per meter, USD)
  drilling_cost_priors: {
    RC:      { per_meter_range: [60, 95, 140] },
    diamond: { per_meter_range: [120, 200, 320] },
    mixed:   { per_meter_range: [90, 145, 230] },
  } as Record<string, { per_meter_range: number[] }>,

  drilling_mobilization_range: [150_000, 400_000, 900_000],

  // Schedule base days per phase by project type
  schedule_base_days: {
    exploration: {
      targeting:        [14, 30, 60],
      company_setup:    [30, 60, 120],
      licensing:        [60, 120, 240],
      exploration_work: [90, 180, 365],
      drilling:         [60, 120, 240],
      feasibility:      [0, 0, 0],
      permitting_esg:   [30, 60, 120],
      construction:     [0, 0, 0],
      operations:       [0, 0, 0],
    },
    small_mine: {
      targeting:        [14, 21, 45],
      company_setup:    [30, 60, 120],
      licensing:        [60, 120, 240],
      exploration_work: [60, 120, 240],
      drilling:         [60, 120, 240],
      feasibility:      [60, 120, 240],
      permitting_esg:   [60, 120, 240],
      construction:     [90, 180, 365],
      operations:       [30, 60, 120],
    },
    industrial: {
      targeting:        [14, 30, 60],
      company_setup:    [30, 60, 120],
      licensing:        [90, 180, 365],
      exploration_work: [120, 240, 480],
      drilling:         [120, 240, 480],
      feasibility:      [120, 240, 480],
      permitting_esg:   [120, 240, 480],
      construction:     [180, 365, 730],
      operations:       [60, 120, 240],
    },
  } as Record<string, Record<string, number[]>>,

  // Risk baselines for DRC
  risk_baselines: {
    security:          45,
    legal_complexity:  55,
    esg:               40,
    access:            50,
    data_completeness: 70,  // starts high = low data
  },
} as const;

export type Priors = typeof PRIORS;
