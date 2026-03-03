/**
 * Localized explanation strings for portal educational content.
 * Used by ExplanationTooltip and ExplanationPanel components.
 */

type Locale = 'en' | 'fr';

interface Explanation {
  en: string;
  fr: string;
}

// Scoring Dimensions
export const SCORE_EXPLANATIONS: Record<string, Explanation> = {
  geological: {
    en: 'Measures the quality and quantity of geological data available, including mineral resource estimates, drill results, and geophysical surveys. Higher scores indicate well-documented deposits with proven reserves.',
    fr: 'Mesure la qualité et la quantité des données géologiques disponibles, y compris les estimations de ressources minérales, les résultats de forage et les levés géophysiques. Des scores plus élevés indiquent des gisements bien documentés avec des réserves prouvées.',
  },
  infrastructure: {
    en: 'Evaluates proximity to essential infrastructure: roads, electrical grid, water supply, telecommunications, and transportation hubs. Projects near existing infrastructure have lower development costs.',
    fr: "Évalue la proximité des infrastructures essentielles : routes, réseau électrique, approvisionnement en eau, télécommunications et centres de transport. Les projets proches des infrastructures existantes ont des coûts de développement plus faibles.",
  },
  legal: {
    en: 'Assesses the clarity of land tenure, permit status, regulatory compliance, and legal framework. A high legal score means clear ownership, valid permits, and a stable regulatory environment.',
    fr: "Évalue la clarté du régime foncier, l'état des permis, la conformité réglementaire et le cadre juridique. Un score juridique élevé signifie une propriété claire, des permis valides et un environnement réglementaire stable.",
  },
  environmental: {
    en: 'Considers environmental baseline conditions, impact assessment status, biodiversity sensitivity, and sustainability practices. Higher scores indicate manageable environmental risks with proper mitigation plans.',
    fr: "Considère les conditions environnementales de base, l'état de l'évaluation d'impact, la sensibilité de la biodiversité et les pratiques de durabilité. Des scores plus élevés indiquent des risques environnementaux gérables avec des plans d'atténuation appropriés.",
  },
  social: {
    en: 'Reflects community relations, social license to operate, employment impact, stakeholder engagement, and potential for community benefit. Strong social scores indicate projects with community support.',
    fr: "Reflète les relations communautaires, la licence sociale d'exploitation, l'impact sur l'emploi, l'engagement des parties prenantes et le potentiel de bénéfice communautaire. Des scores sociaux élevés indiquent des projets avec un soutien communautaire.",
  },
  overall: {
    en: 'A weighted average of all five dimensions: Geological (25%), Infrastructure (20%), Legal (20%), Environmental (20%), Social (15%). This provides a holistic view of the opportunity\'s investment readiness.',
    fr: "Une moyenne pondérée des cinq dimensions : Géologique (25%), Infrastructure (20%), Juridique (20%), Environnemental (20%), Social (15%). Cela fournit une vue holistique de la préparation à l'investissement de l'opportunité.",
  },
};

// Investment Concepts
export const INVESTMENT_EXPLANATIONS: Record<string, Explanation> = {
  roi: {
    en: 'Return on Investment (ROI) represents the expected percentage return on the capital invested. In DRC projects, ROI projections account for local conditions, regulatory requirements, and market dynamics.',
    fr: "Le retour sur investissement (ROI) représente le pourcentage de rendement attendu sur le capital investi. Dans les projets en RDC, les projections de ROI tiennent compte des conditions locales, des exigences réglementaires et de la dynamique du marché.",
  },
  investment_range: {
    en: 'The suggested capital range needed for this opportunity. The minimum represents entry-level participation, while the maximum represents a full development commitment. Actual requirements may vary based on project phase.',
    fr: "La fourchette de capital suggérée nécessaire pour cette opportunité. Le minimum représente une participation d'entrée de gamme, tandis que le maximum représente un engagement de développement complet. Les besoins réels peuvent varier selon la phase du projet.",
  },
  timeline: {
    en: 'Expected project timeline from initial investment to first returns. This includes permitting, development, construction, and ramp-up phases. Early-stage projects typically have longer timelines but higher potential returns.',
    fr: "Calendrier prévu du projet de l'investissement initial aux premiers rendements. Cela comprend les phases d'autorisation, de développement, de construction et de montée en puissance. Les projets en phase précoce ont généralement des délais plus longs mais des rendements potentiels plus élevés.",
  },
  revenue_split: {
    en: 'VisioGold operates on a commission model: the government entity receives 80% of transaction revenue, while VisioGold retains 20% as a platform fee. This rate is configurable per agreement.',
    fr: "VisioGold fonctionne sur un modèle de commission : l'entité gouvernementale reçoit 80% des revenus de transaction, tandis que VisioGold retient 20% comme frais de plateforme. Ce taux est configurable par accord.",
  },
};

// Regional Context
export const REGIONAL_EXPLANATIONS: Record<string, Explanation> = {
  drc_mining: {
    en: 'The DRC holds an estimated 80% of the world\'s coltan reserves, significant gold deposits, and substantial copper-cobalt resources. The mining code of 2018 provides the legal framework for foreign investment in the sector.',
    fr: "La RDC détient environ 80% des réserves mondiales de coltan, des gisements d'or importants et des ressources substantielles en cuivre-cobalt. Le code minier de 2018 fournit le cadre juridique pour l'investissement étranger dans le secteur.",
  },
  drc_agriculture: {
    en: 'The DRC has over 80 million hectares of arable land, less than 10% of which is currently cultivated. The country has significant potential for cash crops, livestock, and aquaculture development.',
    fr: "La RDC dispose de plus de 80 millions d'hectares de terres arables, dont moins de 10% sont actuellement cultivés. Le pays a un potentiel important pour les cultures de rente, l'élevage et le développement de l'aquaculture.",
  },
  security: {
    en: 'Security conditions vary significantly by province. Eastern provinces (North Kivu, South Kivu, Ituri) face ongoing conflict, while central and western provinces are generally more stable. Always consult current security advisories.',
    fr: "Les conditions de sécurité varient considérablement selon la province. Les provinces de l'est (Nord-Kivu, Sud-Kivu, Ituri) font face à des conflits en cours, tandis que les provinces centrales et occidentales sont généralement plus stables. Consultez toujours les avis de sécurité actuels.",
  },
  infrastructure_gap: {
    en: 'The DRC has significant infrastructure gaps: only ~3% of roads are paved, electricity access is below 20% nationally, and telecommunications coverage is concentrated in urban areas. This creates both challenges and investment opportunities.',
    fr: "La RDC a des lacunes infrastructurelles importantes : seulement ~3% des routes sont pavées, l'accès à l'électricité est inférieur à 20% au niveau national, et la couverture des télécommunications est concentrée dans les zones urbaines. Cela crée à la fois des défis et des opportunités d'investissement.",
  },
};

/**
 * Get a localized explanation string.
 */
export function getExplanation(
  category: 'score' | 'investment' | 'regional',
  key: string,
  locale: Locale = 'en'
): string {
  const sources = {
    score: SCORE_EXPLANATIONS,
    investment: INVESTMENT_EXPLANATIONS,
    regional: REGIONAL_EXPLANATIONS,
  };

  return sources[category]?.[key]?.[locale] || '';
}
