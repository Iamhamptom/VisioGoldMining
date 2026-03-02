// ============================================================================
// Language & Communication Agent — Translation, cultural guidance
// DRC Gold Mining Intelligence Platform
// ============================================================================

import { AgentMessage, generateMessageId } from './agent-framework';

// ---------------------------------------------------------------------------
// Phrase databases
// ---------------------------------------------------------------------------

interface Phrase {
  english: string;
  french: string;
  swahili: string;
  lingala: string;
}

const GREETINGS: Phrase[] = [
  { english: 'Hello / Good morning', french: 'Bonjour', swahili: 'Habari / Habari za asubuhi', lingala: 'Mbote' },
  { english: 'How are you?', french: 'Comment allez-vous?', swahili: 'Habari yako? / U hali gani?', lingala: 'Ozali malamu?' },
  { english: 'I am fine, thank you', french: 'Je vais bien, merci', swahili: 'Nzuri, asante', lingala: 'Nazali malamu, matondo' },
  { english: 'Thank you very much', french: 'Merci beaucoup', swahili: 'Asante sana', lingala: 'Matondo mingi' },
  { english: 'My name is...', french: 'Je m\'appelle...', swahili: 'Jina langu ni...', lingala: 'Kombo na ngai ezali...' },
  { english: 'Good evening', french: 'Bonsoir', swahili: 'Habari za jioni', lingala: 'Mbote na butu' },
  { english: 'Welcome', french: 'Bienvenue', swahili: 'Karibu / Karibuni (plural)', lingala: 'Boyei malamu' },
  { english: 'Goodbye', french: 'Au revoir', swahili: 'Kwaheri', lingala: 'Tokomonana' },
  { english: 'Please', french: 'S\'il vous plait', swahili: 'Tafadhali', lingala: 'Nabondeli' },
  { english: 'Yes / No', french: 'Oui / Non', swahili: 'Ndiyo / Hapana', lingala: 'Iyo / Te' },
  { english: 'Excuse me', french: 'Excusez-moi', swahili: 'Samahani', lingala: 'Limbisa ngai' },
  { english: 'I don\'t understand', french: 'Je ne comprends pas', swahili: 'Sielewi', lingala: 'Nayoki te' },
];

const MINING_TERMS: Phrase[] = [
  { english: 'Gold', french: 'Or', swahili: 'Dhahabu', lingala: 'Wolo' },
  { english: 'Mine / Mining site', french: 'Mine / Site minier', swahili: 'Mgodi / Shimo la dhahabu', lingala: 'Libulu ya mines' },
  { english: 'Mining permit', french: 'Permis minier', swahili: 'Kibali cha uchimbaji', lingala: 'Mokanda ya mines' },
  { english: 'Exploration', french: 'Exploration', swahili: 'Utafiti wa madini', lingala: 'Bokuki ya mabanga' },
  { english: 'Rock sample', french: 'Echantillon de roche', swahili: 'Sampuli ya jiwe', lingala: 'Ndambo ya libanga' },
  { english: 'Soil sample', french: 'Echantillon de sol', swahili: 'Sampuli ya udongo', lingala: 'Ndambo ya mabele' },
  { english: 'Artisanal miner', french: 'Creuseur artisanal', swahili: 'Mchimbaji mdogo', lingala: 'Motumboli' },
  { english: 'Processing plant', french: 'Usine de traitement', swahili: 'Kiwanda cha usindikaji', lingala: 'Usine ya kobongisa' },
  { english: 'Drilling', french: 'Forage', swahili: 'Uchimbaji wa sampuli', lingala: 'Kotobola mabele' },
  { english: 'Geologist', french: 'Geologue', swahili: 'Mtaalamu wa jiologia', lingala: 'Moto ya mabanga' },
  { english: 'Ore / Mineral', french: 'Minerai', swahili: 'Madini', lingala: 'Minerai' },
  { english: 'Concession', french: 'Concession miniere', swahili: 'Eneo la uchimbaji', lingala: 'Eteni ya mines' },
];

const COMMUNITY_PHRASES: Phrase[] = [
  { english: 'We come in peace', french: 'Nous venons en paix', swahili: 'Tunakuja kwa amani', lingala: 'Toyei na kimia' },
  { english: 'We want to partner with the community', french: 'Nous souhaitons collaborer avec la communaute', swahili: 'Tunataka kushirikiana na jamii', lingala: 'Tolingi kosala elongo na bato ya mboka' },
  { english: 'Village chief / Traditional chief', french: 'Chef de localite / Chef coutumier', swahili: 'Mkuu wa kijiji', lingala: 'Mokonzi ya mboka' },
  { english: 'Community meeting', french: 'Assemblee communautaire', swahili: 'Mkutano wa jamii', lingala: 'Likita ya bato ya mboka' },
  { english: 'We respect your traditions', french: 'Nous respectons vos traditions', swahili: 'Tunaheshimu mila zenu', lingala: 'Tokumisaka mimeseno na bino' },
  { english: 'Employment opportunity', french: 'Opportunite d\'emploi', swahili: 'Nafasi ya kazi', lingala: 'Nzela ya mosala' },
  { english: 'We want to listen to your concerns', french: 'Nous voulons ecouter vos preoccupations', swahili: 'Tunataka kusikiliza wasiwasi wenu', lingala: 'Tolingi koyoka mitungisi na bino' },
  { english: 'Community development', french: 'Developpement communautaire', swahili: 'Maendeleo ya jamii', lingala: 'Bokoli ya mboka' },
  { english: 'Clean water project', french: 'Projet d\'eau potable', swahili: 'Mradi wa maji safi', lingala: 'Mosala ya mai ya peto' },
  { english: 'School / Education', french: 'Ecole / Education', swahili: 'Shule / Elimu', lingala: 'Eteyelo / Boyekoli' },
];

const SAFETY_PHRASES: Phrase[] = [
  { english: 'Danger!', french: 'Danger!', swahili: 'Hatari!', lingala: 'Likama!' },
  { english: 'Do not touch', french: 'Ne touchez pas', swahili: 'Usiguse', lingala: 'Osimba te!' },
  { english: 'Restricted area', french: 'Zone interdite', swahili: 'Eneo la marufuku', lingala: 'Esika ya kopekisa' },
  { english: 'Where is the hospital?', french: 'Ou est l\'hopital?', swahili: 'Hospitali iko wapi?', lingala: 'Lopitalo ezali wapi?' },
  { english: 'I need help', french: 'J\'ai besoin d\'aide', swahili: 'Ninahitaji msaada', lingala: 'Nazali na bosengeli ya lisalisi' },
  { english: 'Call for help', french: 'Appelez les secours', swahili: 'Piga simu kwa msaada', lingala: 'Benga lisalisi' },
  { english: 'Stop!', french: 'Arretez!', swahili: 'Simama!', lingala: 'Telema!' },
  { english: 'Fire!', french: 'Au feu!', swahili: 'Moto!', lingala: 'Moto!' },
  { english: 'Evacuate', french: 'Evacuez', swahili: 'Ondokeni', lingala: 'Bobima!' },
  { english: 'First aid', french: 'Premiers secours', swahili: 'Huduma ya kwanza', lingala: 'Lisalisi ya liboso' },
];

const NEGOTIATION_PHRASES: Phrase[] = [
  { english: 'We would like to discuss terms', french: 'Nous souhaitons discuter les termes', swahili: 'Tunataka kujadili masharti', lingala: 'Tolingi kosolola makambo' },
  { english: 'What are your expectations?', french: 'Quelles sont vos attentes?', swahili: 'Matarajio yenu ni nini?', lingala: 'Bozali kozela nini?' },
  { english: 'We propose the following', french: 'Nous proposons ce qui suit', swahili: 'Tunapendekeza yafuatayo', lingala: 'Topesi likanisi oyo' },
  { english: 'This is our best offer', french: 'C\'est notre meilleure offre', swahili: 'Hii ni ofa yetu bora zaidi', lingala: 'Oyo ezali likanisi ya biso ya malamu' },
  { english: 'We need more time to consider', french: 'Nous avons besoin de plus de temps', swahili: 'Tunahitaji muda zaidi wa kufikiria', lingala: 'Tosengeli na tango koleka ya kokanisa' },
  { english: 'We agree', french: 'Nous sommes d\'accord', swahili: 'Tunakubaliana', lingala: 'Tondimi' },
  { english: 'Let us sign the agreement', french: 'Signons l\'accord', swahili: 'Tusaini mkataba', lingala: 'Tosaina boyokani' },
];

// ---------------------------------------------------------------------------
// Communication templates
// ---------------------------------------------------------------------------

interface CommunicationTemplate {
  id: string;
  name: string;
  context: string;
  french: string;
  notes: string;
}

const COMMUNICATION_TEMPLATES: CommunicationTemplate[] = [
  {
    id: 'formal_meeting_request',
    name: 'Formal Meeting Request',
    context: 'Requesting a meeting with a government official (CAMI, Ministry of Mines)',
    french:
      `Objet : Demande d'audience\n\n` +
      `Monsieur le Directeur General,\n\n` +
      `J'ai l'honneur de solliciter une audience avec votre Excellence afin de ` +
      `discuter de notre projet minier situe dans la Province de [Province].\n\n` +
      `Notre societe, [Company Name], est une entreprise miniere internationale ` +
      `qui souhaite investir dans le secteur aurifere de la Republique Democratique du Congo.\n\n` +
      `Nous souhaiterions vous presenter notre projet et discuter des modalites de ` +
      `collaboration avec vos services.\n\n` +
      `Dans l'attente de votre reponse favorable, veuillez agreer, Monsieur le Directeur General, ` +
      `l'expression de notre haute consideration.\n\n` +
      `[Name]\n[Title]\n[Company]`,
    notes: 'Use formal register. Address by proper title. Attach company profile document.',
  },
  {
    id: 'community_introduction',
    name: 'Community Introduction Letter',
    context: 'First contact with a community near a mining project',
    french:
      `Objet : Presentation de notre societe et de notre projet\n\n` +
      `Honorable Chef Coutumier,\n` +
      `Notables et membres de la communaute,\n\n` +
      `Nous avons l'honneur de nous presenter a vous. Notre societe, [Company Name], ` +
      `est titulaire d'un Permis de Recherches (PR) octroye par le Cadastre Minier (CAMI) ` +
      `pour la zone de [Zone].\n\n` +
      `Nous souhaitons mener des activites d'exploration dans votre region et nous ` +
      `vous assurons que:\n` +
      `- Nous respecterons vos traditions et votre culture\n` +
      `- Nous privilegerons l'emploi local\n` +
      `- Nous contribuerons au developpement de votre communaute\n` +
      `- Nous protegerons l'environnement\n\n` +
      `Nous sollicitons une assemblee communautaire pour nous presenter ` +
      `et ecouter vos preoccupations.\n\n` +
      `Respectueusement,\n[Name]\n[Title]`,
    notes: 'Translate key points into local language. Deliver in person with a small gift. Have local translator present.',
  },
  {
    id: 'employment_notice',
    name: 'Employment Notice / Job Posting',
    context: 'Recruiting local workers for mining operations',
    french:
      `AVIS DE RECRUTEMENT\n\n` +
      `La societe [Company Name] recherche des candidats qualifies ` +
      `pour son projet minier situe a [Location], Province de [Province].\n\n` +
      `POSTES DISPONIBLES:\n` +
      `1. [Poste 1] — Nombre: [X] postes\n` +
      `   Qualifications: [Requirements]\n` +
      `   Salaire: [Range]\n\n` +
      `2. [Poste 2] — Nombre: [X] postes\n` +
      `   Qualifications: [Requirements]\n` +
      `   Salaire: [Range]\n\n` +
      `CONDITIONS:\n` +
      `- Etre de nationalite congolaise\n` +
      `- Etre age de 18 ans minimum\n` +
      `- Etre en bonne sante physique\n` +
      `- Etre disponible immediatement\n\n` +
      `DEPOT DES CANDIDATURES:\n` +
      `Du [date debut] au [date fin]\n` +
      `Lieu: [Location]\n` +
      `Contact: [Phone/Email]\n\n` +
      `NB: La preference sera accordee aux candidats originaires de la zone du projet.`,
    notes: 'Post in French. Translate summary into local language. Display in public places. Local content is legally required by Mining Code.',
  },
  {
    id: 'security_checkpoint',
    name: 'Checkpoint / Military Interaction',
    context: 'Communicating at military/police checkpoints during field travel',
    french:
      `Phrases utiles aux barrieres:\n\n` +
      `- "Bonjour, nous sommes de la societe [Company]. Voici nos documents."\n` +
      `- "Nous allons au site minier de [Location]."\n` +
      `- "Voici notre autorisation de la Division des Mines."\n` +
      `- "Nous sommes des geologues/ingenieurs en mission de travail."\n` +
      `- "Merci pour votre service."`,
    notes: 'Stay calm and polite. Have documents ready. Avoid arguments. Small denomination bills may be expected.',
  },
  {
    id: 'environmental_notice',
    name: 'Environmental Consultation Notice',
    context: 'Informing community about ESIA process',
    french:
      `AVIS DE CONSULTATION PUBLIQUE\n\n` +
      `Etude d'Impact Environnemental et Social (EIES)\n` +
      `Projet: [Project Name]\n` +
      `Province: [Province]\n` +
      `Territoire: [Territory]\n\n` +
      `La societe [Company Name] informe la population que dans le cadre de ` +
      `l'elaboration de l'Etude d'Impact Environnemental et Social de son projet ` +
      `minier, une consultation publique se tiendra:\n\n` +
      `Date: [Date]\n` +
      `Heure: [Time]\n` +
      `Lieu: [Location]\n\n` +
      `Tous les membres de la communaute sont invites a participer ` +
      `pour exprimer leurs opinions et preoccupations.\n\n` +
      `Le document de reference est disponible pour consultation a [Location].`,
    notes: 'Required by DRC environmental regulations. Must be in French and translated verbally into local languages at the meeting. Public notice period required.',
  },
];

// ---------------------------------------------------------------------------
// Response generation
// ---------------------------------------------------------------------------

function formatPhraseTable(phrases: Phrase[], title: string): string {
  return (
    `### ${title}\n\n` +
    `| English | French | Swahili | Lingala |\n` +
    `|---------|--------|---------|--------|\n` +
    phrases.map((p) => `| ${p.english} | ${p.french} | ${p.swahili} | ${p.lingala} |`).join('\n')
  );
}

export function getLanguageResponse(
  message: string,
  context?: { targetLanguage?: string },
): AgentMessage {
  const msg = message.toLowerCase();
  const targetLang = context?.targetLanguage;

  // ----- Greeting translations -----
  if (msg.includes('greeting') || msg.includes('hello') || msg.includes('bonjour') || msg.includes('habari') || msg.includes('mbote') || msg.includes('introduce')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Greetings in DRC Languages\n\n` +
        formatPhraseTable(GREETINGS, 'Essential Greetings') +
        `\n\n### Cultural Greeting Protocol\n` +
        `- In eastern DRC (Kivu, Ituri, Maniema), **Swahili** is the primary lingua franca\n` +
        `- In western/northern DRC (Kinshasa, Equateur), **Lingala** dominates\n` +
        `- **French** is the official language used in all formal/government contexts\n` +
        `- Always greet elders and chiefs first — this is non-negotiable\n` +
        `- Handshake protocol: firm grip, sometimes with left hand supporting right elbow (sign of respect)\n` +
        `- In Swahili-speaking areas, extended greetings are expected: ask about health, family, work\n` +
        `- Time invested in greetings builds trust — never rush this step\n\n` +
        `### Formal Introduction (French)\n` +
        `> *"Bonjour, je m'appelle [Name]. Je suis [Title] de la societe [Company]. ` +
        `Nous sommes tres honores d'etre ici et nous vous remercions de nous recevoir."*\n\n` +
        `### Formal Introduction (Swahili — Eastern DRC)\n` +
        `> *"Habari za leo. Jina langu ni [Name]. Mimi ni [Title] kutoka kampuni ya [Company]. ` +
        `Tunashukuru sana kwa kutukaribisha."*`,
      data: {
        phrases: GREETINGS,
        category: 'greetings',
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_greet_community',
          label: 'Community engagement phrases',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'Community engagement phrases' },
        },
        {
          id: 'action_greet_mining',
          label: 'Mining vocabulary',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'Mining terms' },
        },
      ],
    };
  }

  // ----- Mining vocabulary -----
  if (msg.includes('mining') || msg.includes('gold') || msg.includes('drill') || msg.includes('ore') || msg.includes('mineral') || msg.includes('geolog') || msg.includes('vocabulary') || msg.includes('term')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Mining Vocabulary — Multilingual\n\n` +
        formatPhraseTable(MINING_TERMS, 'Mining Terms') +
        `\n\n### DRC Mining Industry Acronyms\n` +
        `- **CAMI** — Cadastre Minier (Mining Registry)\n` +
        `- **CEEC** — Centre d'Expertise, d'Evaluation et de Certification\n` +
        `- **SAEMAPE** — Service d'Assistance et d'Encadrement de l'Exploitation Miniere Artisanale et a Petite Echelle\n` +
        `- **PE** — Permis d'Exploitation (Exploitation Permit)\n` +
        `- **PR** — Permis de Recherches (Research Permit)\n` +
        `- **PEPM** — Permis d'Exploitation de Petite Mine (Small-Scale Mining Permit)\n` +
        `- **ZEA** — Zone d'Exploitation Artisanale (Artisanal Mining Zone)\n` +
        `- **SOKIMO** — Societe Miniere de Kilo-Moto\n` +
        `- **GECAMINES** — La Generale des Carrieres et des Mines\n` +
        `- **ACE** — Agence Congolaise de l'Environnement\n` +
        `- **DGRAD** — Direction Generale des Recettes Administratives\n` +
        `- **DGDA** — Direction Generale des Douanes et Accises\n` +
        `- **ESIA/EIES** — Environmental and Social Impact Assessment / Etude d'Impact Environnemental et Social\n\n` +
        `### Field Communication Tips\n` +
        `- When explaining technical concepts to local workers, use simple French or Swahili\n` +
        `- Visual aids (diagrams, photos) are more effective than written instructions\n` +
        `- Demonstrate safety procedures physically, then have workers repeat\n` +
        `- Numbers and measurements should be confirmed by pointing and showing`,
      data: {
        phrases: MINING_TERMS,
        category: 'mining_terms',
        acronyms: ['CAMI', 'CEEC', 'SAEMAPE', 'PE', 'PR', 'PEPM', 'ZEA', 'SOKIMO', 'ACE'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_mining_safety',
          label: 'Safety phrases',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'Safety phrases' },
        },
        {
          id: 'action_mining_paperwork',
          label: 'Permit terminology',
          type: 'dispatch',
          payload: { agentId: 'paperwork', query: 'Explain DRC permit types' },
        },
      ],
    };
  }

  // ----- Community engagement -----
  if (msg.includes('community') || msg.includes('chief') || msg.includes('village') || msg.includes('elder') || msg.includes('engagement') || msg.includes('fpic')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Community Engagement — Language & Protocol\n\n` +
        formatPhraseTable(COMMUNITY_PHRASES, 'Community Engagement Phrases') +
        `\n\n### Community Assembly Opening Speech\n\n` +
        `**French:**\n` +
        `> *"Honorables chefs coutumiers, notables, et membres de la communaute,\n` +
        `> nous vous remercions de nous accueillir sur vos terres ancestrales.\n` +
        `> Nous venons vous presenter notre projet et ecouter vos preoccupations."*\n\n` +
        `**Swahili (Eastern DRC):**\n` +
        `> *"Wakuu wa jadi, wazee, na wanajamii wote,\n` +
        `> tunawashukuru kwa kutukaribisha katika ardhi yenu ya mababu.\n` +
        `> Tumekuja kuwasilisha mradi wetu na kusikiliza wasiwasi wenu."*\n\n` +
        `**Lingala (Western DRC):**\n` +
        `> *"Ba mokonzi ya nkoko, ba notables, mpe bato nyonso ya mboka,\n` +
        `> topesi matondo mingi mpo na boyambi na bino na mabele ya bankoko.\n` +
        `> Toyei kolakisa mosala na biso mpe koyoka mitungisi na bino."*\n\n` +
        `### Community Engagement Protocol\n` +
        `1. **Approach the chef coutumier first** — send a formal letter (French) at least one week in advance\n` +
        `2. **Bring a small gift** — locally sourced food, fabric, or practical items (not cash)\n` +
        `3. **Allow elders to speak first** — do not interrupt\n` +
        `4. **Use local language interpreter** — even if they speak French, using local language shows respect\n` +
        `5. **Record all commitments** — document in a *cahier des charges* (record book)\n` +
        `6. **FPIC process** — Free, Prior and Informed Consent is required by DRC Mining Code\n` +
        `7. **Follow up** — deliver on promises or explain delays transparently\n\n` +
        `### Common Community Concerns to Address\n` +
        `- Will there be local employment?\n` +
        `- What happens to our farmland?\n` +
        `- Will there be environmental damage to water sources?\n` +
        `- What benefits will the community receive?\n` +
        `- How long will the project last?\n` +
        `- What about the artisanal miners currently working here?`,
      data: {
        phrases: COMMUNITY_PHRASES,
        category: 'community_engagement',
        protocol: ['chief_first', 'gift', 'elders_speak', 'interpreter', 'record', 'fpic', 'follow_up'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_community_template',
          label: 'Community introduction letter',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'Show me the community introduction letter template' },
        },
        {
          id: 'action_community_intel',
          label: 'Get local cultural intelligence',
          type: 'dispatch',
          payload: { agentId: 'local-intel', query: 'Cultural intelligence for community engagement' },
        },
      ],
    };
  }

  // ----- Safety phrases -----
  if (msg.includes('safety') || msg.includes('danger') || msg.includes('emergency') || msg.includes('hospital') || msg.includes('medical') || msg.includes('first aid')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Safety & Emergency Phrases\n\n` +
        formatPhraseTable(SAFETY_PHRASES, 'Emergency Phrases') +
        `\n\n### Medical Terms\n\n` +
        `| English | French | Swahili |\n` +
        `|---------|--------|---------|\n` +
        `| Doctor | Medecin / Docteur | Daktari |\n` +
        `| Medicine | Medicament | Dawa |\n` +
        `| Pain | Douleur | Maumivu |\n` +
        `| Water | Eau | Maji |\n` +
        `| Malaria | Paludisme | Malaria / Homa ya manjano |\n` +
        `| Snake bite | Morsure de serpent | Kuumwa na nyoka |\n` +
        `| Broken bone | Os casse | Mfupa umevunjika |\n` +
        `| Bleeding | Saignement | Kutoka damu |\n` +
        `| Fever | Fievre | Homa |\n` +
        `| Diarrhea | Diarrhee | Kuharisha |\n\n` +
        `### Emergency Communication Tips\n` +
        `- In eastern DRC, Swahili is most widely understood for emergencies\n` +
        `- "Msaada! Msaada!" (Help! Help!) is universally understood in Kivu\n` +
        `- Keep emergency phrases on a **laminated card** in your pocket at all times\n` +
        `- Train all local staff in basic English emergency vocabulary\n` +
        `- Satellite phone emergency numbers should be pre-programmed\n` +
        `- Medical evacuation phrase: "Tunahitaji ndege ya dharura" (We need an emergency aircraft)`,
      data: {
        phrases: SAFETY_PHRASES,
        category: 'safety',
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_safety_trip',
          label: 'Emergency evacuation planning',
          type: 'dispatch',
          payload: { agentId: 'trip', query: 'Emergency evacuation options' },
        },
      ],
    };
  }

  // ----- Negotiation phrases -----
  if (msg.includes('negotiat') || msg.includes('agreement') || msg.includes('contract') || msg.includes('terms') || msg.includes('deal') || msg.includes('offer')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Negotiation Language — DRC Mining Context\n\n` +
        formatPhraseTable(NEGOTIATION_PHRASES, 'Negotiation Phrases') +
        `\n\n### Negotiation Cultural Notes\n` +
        `- **Patience is essential:** Negotiations in DRC take longer than in Western contexts\n` +
        `- **Relationship first:** Build personal rapport before discussing business terms\n` +
        `- **Hierarchy matters:** Decision-makers may not be present at initial meetings\n` +
        `- **Consensus building:** Decisions are often collective, especially in community contexts\n` +
        `- **Written confirmation:** Always follow up verbal agreements with written confirmation in French\n` +
        `- **Legal framework:** Reference the Mining Code provisions to support your position\n\n` +
        `### Key Negotiation Contexts\n` +
        `1. **Government (CAMI, Ministry):** Formal French. Reference legal provisions. Patience with bureaucracy.\n` +
        `2. **Community leaders:** Respectful, inclusive. Allow counter-proposals. Document in cahier des charges.\n` +
        `3. **JV partners:** Professional French/English. Legal counsel present. Term sheet then binding agreement.\n` +
        `4. **Service providers:** Price negotiation expected. Get 3 quotes minimum. Payment terms in writing.\n` +
        `5. **ASM cooperatives:** Sensitive. Use community liaison as intermediary. Focus on mutual benefit.\n\n` +
        `### Useful Phrases for Price Negotiation\n` +
        `- "C'est trop cher" — That's too expensive\n` +
        `- "Quel est votre meilleur prix?" — What's your best price?\n` +
        `- "Nous avons un budget limite" — We have a limited budget\n` +
        `- "Pouvons-nous negocier?" — Can we negotiate?\n` +
        `- "Bei gani?" (Swahili) — What's the price?\n` +
        `- "Punguza bei tafadhali" (Swahili) — Please reduce the price`,
      data: {
        phrases: NEGOTIATION_PHRASES,
        category: 'negotiation',
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_negotiate_paperwork',
          label: 'Review contract requirements',
          type: 'dispatch',
          payload: { agentId: 'paperwork', query: 'What documents are needed for mining agreements?' },
        },
      ],
    };
  }

  // ----- Translation request -----
  if (msg.includes('translate') || msg.includes('say in') || msg.includes('how do you say') || msg.includes('what is') || msg.includes('how to say')) {
    const targetDisplay = targetLang ? targetLang.charAt(0).toUpperCase() + targetLang.slice(1) : 'all languages';
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Translation Service\n\n` +
        `I can translate between **English**, **French**, **Swahili**, and **Lingala** for mining-related contexts.\n\n` +
        `Current target language: **${targetDisplay}**\n\n` +
        `### Language Distribution in DRC Mining Regions\n\n` +
        `| Region | Primary Language | Secondary | Local Languages |\n` +
        `|--------|-----------------|-----------|------------------|\n` +
        `| Ituri / Haut-Uele | Swahili | French | Lendu, Hema, Lugbara, Zande |\n` +
        `| North Kivu | Swahili | French | Nande, Kinyarwanda |\n` +
        `| South Kivu | Swahili | French | Mashi, Kifuliru, Kilega |\n` +
        `| Maniema | Swahili | French | Kilega, Kibembe |\n` +
        `| Kinshasa | Lingala | French | Various |\n` +
        `| Haut-Katanga | Swahili | French | Bemba, Lunda |\n` +
        `| Kasai | Tshiluba | French | Various |\n\n` +
        `### How to Use\n` +
        `- Tell me a phrase and the target language\n` +
        `- Ask for a specific category (greetings, mining terms, safety, community, negotiation)\n` +
        `- Request a communication template (meeting request, job posting, community letter)\n\n` +
        `### Translation Accuracy Note\n` +
        `Translations provided are for general communication. For legal documents, formal permits, ` +
        `and contracts, always use a certified French translator. Community engagement translations ` +
        `should be verified by a local speaker of the target language.`,
      data: {
        targetLanguage: targetLang || 'all',
        availableLanguages: ['French', 'Swahili', 'Lingala', 'Tshiluba', 'Kikongo'],
        categories: ['greetings', 'mining_terms', 'safety', 'community', 'negotiation'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_translate_greetings',
          label: 'Greetings',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'Show me greetings' },
        },
        {
          id: 'action_translate_mining',
          label: 'Mining vocabulary',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'Mining terms' },
        },
        {
          id: 'action_translate_hire',
          label: 'Hire local translator',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Dispatch translator hire task' },
        },
      ],
    };
  }

  // ----- Hiring / employment communication -----
  if (msg.includes('hire') || msg.includes('employ') || msg.includes('recruit') || msg.includes('job') || msg.includes('worker') || msg.includes('staff')) {
    const template = COMMUNICATION_TEMPLATES.find((t) => t.id === 'employment_notice')!;
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Employment Communication Templates\n\n` +
        `### Job Announcement Template (French)\n\n` +
        `\`\`\`\n${template.french}\n\`\`\`\n\n` +
        `**Note:** ${template.notes}\n\n` +
        `### Interview Phrases (Swahili)\n` +
        `- "Una uzoefu gani katika kazi ya migodini?" — What mining experience do you have?\n` +
        `- "Unajua kusoma na kuandika?" — Can you read and write?\n` +
        `- "Uko tayari kufanya kazi masaa 8 kwa siku?" — Are you willing to work 8 hours/day?\n` +
        `- "Mshahara ni [amount] kwa mwezi" — The salary is [amount] per month\n` +
        `- "Kazi inaanza saa [time]" — Work starts at [time]\n` +
        `- "Unatoka wapi?" — Where are you from?\n` +
        `- "Una watoto wangapi?" — How many children do you have?\n\n` +
        `### DRC Labor Law Requirements\n` +
        `- Mining Code requires minimum **70% DRC nationals** in workforce\n` +
        `- Employment contracts must be in **French**\n` +
        `- Minimum wage: ~$3-5/day for unskilled labor in mining areas\n` +
        `- Skilled operators: $300-800/month\n` +
        `- Local content reporting to Ministry of Mines required\n` +
        `- Expatriate work permits (Carte de Travail pour Etranger) required for foreign staff\n` +
        `- Preference must be given to local community members per Mining Code`,
      data: {
        template: template,
        category: 'employment',
        laborLaw: { minLocalContent: '70%', minWage: '$3-5/day', contractLanguage: 'French' },
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_hire_research',
          label: 'Find local candidates',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Find local geologists and workers' },
        },
        {
          id: 'action_hire_paperwork',
          label: 'Work permit requirements',
          type: 'dispatch',
          payload: { agentId: 'paperwork', query: 'Expatriate work permit requirements' },
        },
      ],
    };
  }

  // ----- Communication templates -----
  if (msg.includes('template') || msg.includes('letter') || msg.includes('formal') || msg.includes('document') || msg.includes('write') || msg.includes('draft')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Communication Templates — DRC Mining\n\n` +
        `I have the following French-language templates ready:\n\n` +
        COMMUNICATION_TEMPLATES.map(
          (t, i) => `### ${i + 1}. ${t.name}\n**Context:** ${t.context}\n\n\`\`\`\n${t.french}\n\`\`\`\n\n**Notes:** ${t.notes}`
        ).join('\n\n---\n\n') +
        `\n\n### Template Customization\n` +
        `Replace the bracketed fields [Company], [Province], [Location], etc. with your specific details. ` +
        `All formal correspondence in DRC should be in French and follow the structure shown above.`,
      data: {
        templates: COMMUNICATION_TEMPLATES.map((t) => ({ id: t.id, name: t.name, context: t.context })),
        category: 'templates',
      },
      timestamp: new Date().toISOString(),
      actions: COMMUNICATION_TEMPLATES.slice(0, 3).map((t) => ({
        id: `action_template_${t.id}`,
        label: t.name,
        type: 'generate' as const,
        payload: { templateId: t.id },
      })),
    };
  }

  // ----- Cultural etiquette -----
  if (msg.includes('culture') || msg.includes('etiquette') || msg.includes('custom') || msg.includes('protocol') || msg.includes('respect') || msg.includes('tradition')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Cultural Etiquette Guide — DRC\n\n` +
        `### General Cultural Norms\n` +
        `- **Greetings are extended:** Take time with greetings. Ask about health, family, and work. Rushing is disrespectful.\n` +
        `- **Respect hierarchy:** Address elders and leaders by title. In Swahili: "Mzee" (elder), "Bwana" (sir).\n` +
        `- **Right hand:** Offer and receive items with the right hand (or both hands for important items).\n` +
        `- **Eye contact:** Moderate eye contact is respectful. Avoiding eye contact with elders can show deference.\n` +
        `- **Food and drink:** Accept offered food/drink even if you only take a small amount. Refusing is impolite.\n` +
        `- **Time:** "African time" is real — meetings may start 30-60 minutes late. Do not show frustration.\n` +
        `- **Dress:** Conservative dress for meetings. Women should cover knees and shoulders.\n\n` +
        `### Business Meeting Etiquette\n` +
        `- Exchange business cards with both hands\n` +
        `- French is the language of business — have all documents in French\n` +
        `- Begin with personal conversation before business\n` +
        `- Decision-making may require multiple meetings\n` +
        `- Follow up in writing (letter or email in French)\n\n` +
        `### Community Visit Etiquette\n` +
        `- Always visit the traditional chief first\n` +
        `- Bring a small gift (not cash) — fabric, food, practical items\n` +
        `- Remove shoes if entering a traditional meeting space (follow local cues)\n` +
        `- Palm wine or local drinks may be offered — accepting is polite\n` +
        `- Photography: Always ask permission before taking photos\n` +
        `- Women's groups should be consulted separately in some cultures\n\n` +
        `### Religious Sensitivity\n` +
        `- Christianity (Catholic, Protestant, Kimbanguist) is dominant\n` +
        `- Islamic communities in eastern DRC (especially Swahili-speaking areas)\n` +
        `- Traditional beliefs coexist with organized religion — be respectful\n` +
        `- Sunday is not a working day in most communities\n` +
        `- Respect religious holidays and observances`,
      data: {
        category: 'cultural_etiquette',
        keyNorms: ['greetings', 'hierarchy', 'right_hand', 'food_drink', 'time', 'dress'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_culture_intel',
          label: 'Regional cultural intelligence',
          type: 'dispatch',
          payload: { agentId: 'local-intel', query: 'Cultural intelligence' },
        },
        {
          id: 'action_culture_community',
          label: 'Community engagement phrases',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'Community engagement phrases' },
        },
      ],
    };
  }

  // ----- Specific language focus (French) -----
  if (msg.includes('french') && !msg.includes('translate')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## French for DRC Mining Operations\n\n` +
        `French is the **official language** of the DRC and is required for all:\n` +
        `- Government correspondence and permit applications\n` +
        `- Legal documents and contracts\n` +
        `- Court proceedings\n` +
        `- Formal business communication\n` +
        `- CAMI submissions\n\n` +
        `### Key Formal French Phrases\n` +
        `- "J'ai l'honneur de..." — I have the honor to...\n` +
        `- "Veuillez agreer l'expression de ma haute consideration" — Standard formal closing\n` +
        `- "Suite a notre entretien du..." — Following our meeting of...\n` +
        `- "Nous vous prions de bien vouloir..." — We kindly request that you...\n` +
        `- "Ci-joint vous trouverez..." — Enclosed please find...\n\n` +
        `### Formal Address\n` +
        `- Minister: "Monsieur le Ministre" / "Madame la Ministre"\n` +
        `- Governor: "Monsieur le Gouverneur" / "Son Excellence"\n` +
        `- Director General: "Monsieur le Directeur General"\n` +
        `- Traditional chief: "Honorable Chef Coutumier"\n` +
        `- General: "Mon General"\n\n` +
        `### DRC French Particularities\n` +
        `- DRC French has local expressions and vocabulary\n` +
        `- "Dossier" is used broadly to mean any matter or issue\n` +
        `- "Protocole" refers to a formal agreement or MOU\n` +
        `- "Creuseur" (digger) is the term for artisanal miner\n` +
        `- "Comptoir" is a gold buying house\n` +
        `- "Barrage" means checkpoint\n` +
        `- "Tracasserie" means harassment/hassle (at checkpoints)`,
      data: {
        language: 'french',
        category: 'formal_french',
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_french_templates',
          label: 'French letter templates',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'Show me communication templates' },
        },
        {
          id: 'action_french_paperwork',
          label: 'CAMI application in French',
          type: 'dispatch',
          payload: { agentId: 'paperwork', query: 'How to apply for a CAMI permit?' },
        },
      ],
    };
  }

  // ----- Swahili focus -----
  if (msg.includes('swahili') && !msg.includes('translate')) {
    return {
      id: generateMessageId(),
      agentId: 'language',
      role: 'agent',
      content:
        `## Swahili for Eastern DRC Mining Operations\n\n` +
        `Swahili (Kiswahili) is the dominant lingua franca across eastern DRC, including all major gold mining provinces: Ituri, Haut-Uele, North Kivu, South Kivu, Maniema, and Tanganyika.\n\n` +
        `### DRC Swahili vs. Standard Swahili\n` +
        `DRC Swahili (sometimes called "Kingwana") differs from standard East African Swahili:\n` +
        `- Simplified grammar in some constructions\n` +
        `- French loanwords are common\n` +
        `- Regional variations between Kivu and Ituri/Haut-Uele\n` +
        `- Written Swahili follows standard East African norms\n\n` +
        `### Essential Swahili for Field Work\n` +
        `- "Ndiyo" / "Hapana" — Yes / No\n` +
        `- "Sawa sawa" — OK / Agreed\n` +
        `- "Pole pole" — Slowly / Gently\n` +
        `- "Haraka haraka" — Quickly / Hurry\n` +
        `- "Wapi?" — Where?\n` +
        `- "Ngapi?" — How many?\n` +
        `- "Bei gani?" — What price?\n` +
        `- "Njia" — Road / Path\n` +
        `- "Maji" — Water\n` +
        `- "Chakula" — Food\n` +
        `- "Pesa" — Money\n` +
        `- "Bunduki" — Gun (important to recognize)\n` +
        `- "Askari" — Soldier / Guard\n\n` +
        `### Counting in Swahili\n` +
        `1=moja, 2=mbili, 3=tatu, 4=nne, 5=tano, 6=sita, 7=saba, 8=nane, 9=tisa, 10=kumi\n` +
        `100=mia, 1000=elfu`,
      data: {
        language: 'swahili',
        category: 'swahili_guide',
        regions: ['Ituri', 'Haut-Uele', 'North Kivu', 'South Kivu', 'Maniema', 'Tanganyika'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_swahili_greetings',
          label: 'Swahili greetings',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'Greetings in Swahili' },
        },
        {
          id: 'action_swahili_hire',
          label: 'Hire Swahili translator',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Hire a Swahili translator' },
        },
      ],
    };
  }

  // ----- Default response -----
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
      `- **Greetings & introductions** — Essential phrases in local languages\n` +
      `- **Mining vocabulary** — Technical terms in French/Swahili/Lingala\n` +
      `- **Community engagement** — Scripts and protocols for community meetings\n` +
      `- **Safety phrases** — Emergency communication in local languages\n` +
      `- **Negotiation language** — Business and deal-making phrases\n` +
      `- **Communication templates** — Formal letters, job postings, ESIA notices\n` +
      `- **Cultural etiquette** — Dos and don'ts for DRC business culture\n` +
      `- **Employment communication** — Hiring templates and interview phrases\n\n` +
      `What communication support do you need?`,
    data: {
      capabilities: ['greetings', 'mining_terms', 'community', 'safety', 'negotiation', 'templates', 'etiquette', 'employment'],
      languages: ['French', 'Swahili', 'Lingala', 'Tshiluba', 'Kikongo'],
    },
    timestamp: new Date().toISOString(),
    actions: [
      { id: 'action_default_greetings', label: 'Greetings', type: 'dispatch', payload: { agentId: 'language', query: 'Show me greetings' } },
      { id: 'action_default_mining', label: 'Mining vocabulary', type: 'dispatch', payload: { agentId: 'language', query: 'Mining terms' } },
      { id: 'action_default_community', label: 'Community scripts', type: 'dispatch', payload: { agentId: 'language', query: 'Community engagement phrases' } },
      { id: 'action_default_safety', label: 'Safety phrases', type: 'dispatch', payload: { agentId: 'language', query: 'Safety phrases' } },
      { id: 'action_default_templates', label: 'Letter templates', type: 'dispatch', payload: { agentId: 'language', query: 'Communication templates' } },
      { id: 'action_default_culture', label: 'Cultural etiquette', type: 'dispatch', payload: { agentId: 'language', query: 'Cultural etiquette guide' } },
    ],
  };
}
