import { generateMessageId } from './agent-framework';
import type { AgentMessage } from './agent-framework';

interface LanguageContext {
  targetLanguage?: string;
}

const GREETINGS = [
  { english: 'Hello / Good morning', french: 'Bonjour', swahili: 'Habari / Habari za asubuhi', lingala: 'Mbote' },
  { english: 'How are you?', french: 'Comment allez-vous?', swahili: 'Habari yako? / U hali gani?', lingala: 'Ozali malamu?' },
  { english: 'Thank you', french: 'Merci beaucoup', swahili: 'Asante sana', lingala: 'Matondo mingi' },
  { english: 'My name is...', french: 'Je m\'appelle...', swahili: 'Jina langu ni...', lingala: 'Kombo na ngai ezali...' },
  { english: 'Good evening', french: 'Bonsoir', swahili: 'Habari za jioni', lingala: 'Mbote na butu' },
  { english: 'Welcome', french: 'Bienvenue', swahili: 'Karibu / Karibuni', lingala: 'Boyei malamu' },
  { english: 'Goodbye', french: 'Au revoir', swahili: 'Kwaheri', lingala: 'Tokomonana' },
  { english: 'Please', french: 'S\'il vous plaît', swahili: 'Tafadhali', lingala: 'Nabondeli' },
];

const MINING_TERMS = [
  { english: 'Gold', french: 'Or', swahili: 'Dhahabu', lingala: 'Wolo' },
  { english: 'Mine / Mining site', french: 'Mine / Site minier', swahili: 'Mgodi / Shimo la dhahabu', lingala: 'Libulu ya mines' },
  { english: 'Mining permit', french: 'Permis minier', swahili: 'Kibali cha uchimbaji', lingala: 'Mokanda ya mines' },
  { english: 'Exploration', french: 'Exploration', swahili: 'Utafiti wa madini', lingala: 'Bokuki ya mabanga' },
  { english: 'Rock sample', french: 'Échantillon de roche', swahili: 'Sampuli ya jiwe', lingala: 'Ndambo ya libanga' },
  { english: 'Artisanal miner', french: 'Creuseur artisanal', swahili: 'Mchimbaji mdogo', lingala: 'Motumboli' },
  { english: 'Processing plant', french: 'Usine de traitement', swahili: 'Kiwanda cha usindikaji', lingala: 'Usine ya kobongisa' },
  { english: 'Drilling', french: 'Forage', swahili: 'Uchimbaji wa sampuli', lingala: 'Kotobola mabele' },
];

const COMMUNITY_PHRASES = [
  { english: 'We come in peace', french: 'Nous venons en paix', swahili: 'Tunakuja kwa amani', lingala: 'Toyei na kimia' },
  { english: 'We want to partner with the community', french: 'Nous souhaitons collaborer avec la communauté', swahili: 'Tunataka kushirikiana na jamii', lingala: 'Tolingi kosala elongo na bato ya mboka' },
  { english: 'Village chief', french: 'Chef de localité / Chef coutumier', swahili: 'Mkuu wa kijiji', lingala: 'Mokonzi ya mboka' },
  { english: 'Community meeting', french: 'Assemblée communautaire', swahili: 'Mkutano wa jamii', lingala: 'Likita ya bato ya mboka' },
  { english: 'We respect your traditions', french: 'Nous respectons vos traditions', swahili: 'Tunaheshimu mila zenu', lingala: 'Tokumisaka mimeseno na bino' },
  { english: 'Employment opportunity', french: 'Opportunité d\'emploi', swahili: 'Nafasi ya kazi', lingala: 'Nzela ya mosala' },
];

const SAFETY_PHRASES = [
  { english: 'Danger!', french: 'Danger!', swahili: 'Hatari!', lingala: 'Likama!' },
  { english: 'Do not touch', french: 'Ne touchez pas', swahili: 'Usiguse', lingala: 'Osimba te!' },
  { english: 'Restricted area', french: 'Zone interdite', swahili: 'Eneo la marufuku', lingala: 'Esika ya kopekisa' },
  { english: 'Where is the hospital?', french: 'Où est l\'hôpital?', swahili: 'Hospitali iko wapi?', lingala: 'Lopitalo ezali wapi?' },
  { english: 'I need help', french: 'J\'ai besoin d\'aide', swahili: 'Ninahitaji msaada', lingala: 'Nazali na bosengeli ya lisalisi' },
  { english: 'Call for help', french: 'Appelez les secours', swahili: 'Piga simu kwa msaada', lingala: 'Benga lisalisi' },
];

export function getLanguageResponse(message: string, context?: LanguageContext): AgentMessage {
  const lower = message.toLowerCase();

  // ---- Greeting translations ----
  if (lower.includes('greeting') || lower.includes('hello') || lower.includes('bonjour') || lower.includes('habari') || lower.includes('mbote')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Greetings in DRC Languages\n\n` +
        `| English | French | Swahili | Lingala |\n` +
        `|---------|--------|---------|--------|\n` +
        GREETINGS.map(g => `| ${g.english} | ${g.french} | ${g.swahili} | ${g.lingala} |`).join('\n') +
        `\n\n### Cultural Notes\n` +
        `- In eastern DRC (Kivu, Ituri, Maniema), **Swahili** is the primary lingua franca\n` +
        `- In western/northern DRC (Kinshasa, Equateur), **Lingala** dominates\n` +
        `- **French** is the official language used in all formal/government contexts\n` +
        `- Always greet elders and chiefs first\n` +
        `- Handshake protocol: firm, sometimes with left hand supporting right elbow (sign of respect)\n\n` +
        `Would you like phrases for a specific context?`,
      timestamp: new Date().toISOString(),
    };
  }

  // ---- Mining vocabulary ----
  if (lower.includes('mining') || lower.includes('gold') || lower.includes('drill') || lower.includes('ore') || lower.includes('mineral')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Mining Vocabulary\n\n` +
        `| English | French | Swahili | Lingala |\n` +
        `|---------|--------|---------|--------|\n` +
        MINING_TERMS.map(t => `| ${t.english} | ${t.french} | ${t.swahili} | ${t.lingala} |`).join('\n') +
        `\n\n### Industry Acronyms in DRC\n` +
        `- **CAMI** — Cadastre Minier (Mining Registry)\n` +
        `- **CEEC** — Centre d'Expertise, d'Évaluation et de Certification\n` +
        `- **SAEMAPE** — Service d'Assistance et d'Encadrement de l'Exploitation Minière Artisanale et à Petite Échelle\n` +
        `- **PE** — Permis d'Exploitation\n` +
        `- **PR** — Permis de Recherches\n` +
        `- **SOKIMO** — Société Minière de Kilo-Moto\n` +
        `- **GÉCAMINES** — La Générale des Carrières et des Mines\n\n` +
        `Need mining terms for a specific conversation?`,
      timestamp: new Date().toISOString(),
    };
  }

  // ---- Community engagement ----
  if (lower.includes('community') || lower.includes('chief') || lower.includes('village') || lower.includes('elder') || lower.includes('engagement') || lower.includes('meeting')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Community Engagement Phrases\n\n` +
        `| English | French | Swahili | Lingala |\n` +
        `|---------|--------|---------|--------|\n` +
        COMMUNITY_PHRASES.map(p => `| ${p.english} | ${p.french} | ${p.swahili} | ${p.lingala} |`).join('\n') +
        `\n\n### Community Meeting Protocol\n\n` +
        `**Opening a community assembly (in French/Swahili):**\n\n` +
        `> *"Honorables chefs coutumiers, notables, et membres de la communauté,\n` +
        `> nous vous remercions de nous accueillir sur vos terres ancestrales.\n` +
        `> Nous venons vous présenter notre projet et écouter vos préoccupations."*\n\n` +
        `> *"Wakuu wa jadi, wazee, na wanajamii wote,\n` +
        `> tunawashukuru kwa kutukaribisha katika ardhi yenu ya mababu.\n` +
        `> Tumekuja kuwasilisha mradi wetu na kusikiliza wasiwasi wenu."*\n\n` +
        `### Key Protocol\n` +
        `1. Always address the **chef de localité** first (Bwana Mkubwa)\n` +
        `2. Bring a small gift — locally sourced food, fabric, or practical items\n` +
        `3. Allow elders to speak first before presenting\n` +
        `4. Never rush — the greeting ceremony builds trust\n` +
        `5. Have a French-Swahili/Lingala interpreter present\n` +
        `6. Document all commitments in writing (cahier des charges)\n\n` +
        `Need a template for a specific community interaction?`,
      timestamp: new Date().toISOString(),
    };
  }

  // ---- Safety phrases ----
  if (lower.includes('safety') || lower.includes('danger') || lower.includes('emergency') || lower.includes('help') || lower.includes('hospital')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Safety & Emergency Phrases\n\n` +
        `| English | French | Swahili | Lingala |\n` +
        `|---------|--------|---------|--------|\n` +
        SAFETY_PHRASES.map(p => `| ${p.english} | ${p.french} | ${p.swahili} | ${p.lingala} |`).join('\n') +
        `\n\n### Emergency Communication\n` +
        `- In eastern DRC, Swahili is most widely understood for emergency situations\n` +
        `- "Msaada! Msaada!" (Help! Help!) is universally understood in Kivu\n` +
        `- Keep emergency phrases on a laminated card\n` +
        `- Train local staff in basic English emergency vocabulary\n\n` +
        `### Medical Terms\n` +
        `| English | French | Swahili |\n` +
        `|---------|--------|---------|\n` +
        `| Doctor | Médecin | Daktari |\n` +
        `| Medicine | Médicament | Dawa |\n` +
        `| Pain | Douleur | Maumivu |\n` +
        `| Water | Eau | Maji |\n` +
        `| Malaria | Paludisme | Malaria/Homa ya manjano |`,
      timestamp: new Date().toISOString(),
    };
  }

  // ---- Translation request ----
  if (lower.includes('translate') || lower.includes('say') || lower.includes('how do you')) {
    const target = context?.targetLanguage || 'swahili';
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Translation Service\n\n` +
        `I can translate between **English**, **French**, **Swahili**, and **Lingala** for mining-related contexts.\n\n` +
        `### Language Distribution in DRC Mining Regions\n\n` +
        `| Region | Primary Language | Secondary |\n` +
        `|--------|-----------------|------------|\n` +
        `| Ituri / Haut-Uele | Swahili | French, Lendu, Hema |\n` +
        `| North Kivu | Swahili | French, Nande, Kinyarwanda |\n` +
        `| South Kivu | Swahili | French, Mashi, Fuliru |\n` +
        `| Maniema | Swahili | French, local dialects |\n` +
        `| Kinshasa | Lingala | French |\n` +
        `| Katanga | Swahili | French, Bemba |\n` +
        `| Kasai | Tshiluba | French |\n\n` +
        `Please provide the phrase you'd like translated and the target language (${target}).`,
      timestamp: new Date().toISOString(),
    };
  }

  // ---- Hiring / employment communication ----
  if (lower.includes('hire') || lower.includes('employ') || lower.includes('recruit') || lower.includes('job')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Employment Communication Templates\n\n` +
        `### Job Announcement (French — for posting)\n` +
        `> *AVIS DE RECRUTEMENT*\n` +
        `> La société [Company] recherche des candidats qualifiés pour son projet minier\n` +
        `> situé à [Location], Province de [Province].\n` +
        `>\n` +
        `> Postes disponibles:\n` +
        `> - [Role 1] — [Requirements]\n` +
        `> - [Role 2] — [Requirements]\n` +
        `>\n` +
        `> Candidatures: du [date] au [date]\n` +
        `> Contact: [phone/email]\n\n` +
        `### Interview Phrases (Swahili)\n` +
        `- "Una uzoefu gani katika kazi ya migodini?" — What mining experience do you have?\n` +
        `- "Unajua kusoma na kuandika?" — Can you read and write?\n` +
        `- "Uko tayari kufanya kazi masaa 8 kwa siku?" — Are you willing to work 8 hours/day?\n` +
        `- "Mshahara ni [amount] kwa mwezi" — The salary is [amount] per month\n\n` +
        `### DRC Labor Requirements\n` +
        `- Mining Code requires minimum 70% DRC nationals in workforce\n` +
        `- Employment contracts must be in French\n` +
        `- Minimum wage: ~$3-$5/day for unskilled labor in mining areas\n` +
        `- Skilled operators: $300-$800/month\n` +
        `- Local content reporting to Ministry of Mines required\n\n` +
        `Need a template customized for your specific roles?`,
      timestamp: new Date().toISOString(),
    };
  }

  // ---- Default ----
  return {
    id: generateMessageId(),
    agentId: 'language',
    role: 'agent',
    content:
      `## Language & Communication Agent — Ready\n\n` +
      `I provide translation and cultural communication support for DRC mining operations.\n\n` +
      `### Available Languages\n` +
      `- **French** — Official language, used in all government/business\n` +
      `- **Swahili** — Eastern DRC lingua franca (Kivu, Ituri, Maniema, Katanga)\n` +
      `- **Lingala** — Western DRC (Kinshasa, Equateur, northern regions)\n` +
      `- **Tshiluba** — Kasai provinces\n` +
      `- **Kikongo** — Bas-Congo, Kwango, Kwilu\n\n` +
      `### I Can Help With\n` +
      `- Greetings and introductions in local languages\n` +
      `- Mining-specific vocabulary translation\n` +
      `- Community engagement scripts and protocols\n` +
      `- Safety and emergency phrases\n` +
      `- Employment/hiring communication templates\n` +
      `- Cultural etiquette guidance\n` +
      `- Negotiation vocabulary\n\n` +
      `What would you like translated or what communication do you need help with?`,
    timestamp: new Date().toISOString(),
    actions: [
      { id: 'act_greetings', label: 'Greetings', type: 'generate' as const, payload: { query: 'Show me greetings' } },
      { id: 'act_mining', label: 'Mining Terms', type: 'generate' as const, payload: { query: 'Mining vocabulary' } },
      { id: 'act_community', label: 'Community Scripts', type: 'generate' as const, payload: { query: 'Community meeting phrases' } },
      { id: 'act_safety', label: 'Safety Phrases', type: 'generate' as const, payload: { query: 'Safety phrases' } },
    ],
  };
}
