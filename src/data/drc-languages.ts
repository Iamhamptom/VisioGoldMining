export interface LanguagePhrase {
  english: string;
  french: string;
  swahili: string;
  lingala: string;
  context: 'greeting' | 'mining' | 'business' | 'safety' | 'community' | 'logistics';
}

export const LANGUAGE_PHRASES: LanguagePhrase[] = [
  // Greeting phrases
  {
    english: 'Hello / Good morning',
    french: 'Bonjour',
    swahili: 'Habari ya asubuhi',
    lingala: 'Mbote',
    context: 'greeting',
  },
  {
    english: 'How are you?',
    french: 'Comment allez-vous?',
    swahili: 'Habari yako?',
    lingala: 'Ozali malamu?',
    context: 'greeting',
  },
  {
    english: 'Thank you very much',
    french: 'Merci beaucoup',
    swahili: 'Asante sana',
    lingala: 'Melesi mingi',
    context: 'greeting',
  },
  {
    english: 'My name is...',
    french: 'Je m\'appelle...',
    swahili: 'Jina langu ni...',
    lingala: 'Kombo na ngai ezali...',
    context: 'greeting',
  },
  {
    english: 'Goodbye',
    french: 'Au revoir',
    swahili: 'Kwaheri',
    lingala: 'Tokomonana',
    context: 'greeting',
  },

  // Mining phrases
  {
    english: 'Where is the mining site?',
    french: 'Ou est le site minier?',
    swahili: 'Mgodi uko wapi?',
    lingala: 'Esika ya mine ezali wapi?',
    context: 'mining',
  },
  {
    english: 'Gold ore',
    french: 'Minerai d\'or',
    swahili: 'Madini ya dhahabu',
    lingala: 'Libanga ya wolo',
    context: 'mining',
  },
  {
    english: 'We need to take rock samples',
    french: 'Nous devons prendre des echantillons de roche',
    swahili: 'Tunahitaji kuchukua sampuli za mawe',
    lingala: 'Tosengeli kozwa biteni ya mabanga',
    context: 'mining',
  },
  {
    english: 'Mining permit',
    french: 'Permis minier',
    swahili: 'Kibali cha uchimbaji',
    lingala: 'Mokanda ya mine',
    context: 'mining',
  },
  {
    english: 'What minerals are found here?',
    french: 'Quels mineraux trouve-t-on ici?',
    swahili: 'Madini gani yanapatikana hapa?',
    lingala: 'Mabanga nini bazali kozwa awa?',
    context: 'mining',
  },

  // Business phrases
  {
    english: 'We would like to discuss a partnership',
    french: 'Nous aimerions discuter d\'un partenariat',
    swahili: 'Tungependa kujadili ushirikiano',
    lingala: 'Tolingi kosolola likambo ya kosala elongo',
    context: 'business',
  },
  {
    english: 'What is the price?',
    french: 'Quel est le prix?',
    swahili: 'Bei gani?',
    lingala: 'Ntalu ezali boni?',
    context: 'business',
  },
  {
    english: 'We need to sign a contract',
    french: 'Nous devons signer un contrat',
    swahili: 'Tunahitaji kusaini mkataba',
    lingala: 'Tosengeli kosaina mokanda ya boyokani',
    context: 'business',
  },
  {
    english: 'Can I speak with the person in charge?',
    french: 'Puis-je parler au responsable?',
    swahili: 'Naweza kuongea na mtu anayehusika?',
    lingala: 'Nakoki kosolola na mokonzi?',
    context: 'business',
  },
  {
    english: 'We represent a mining company',
    french: 'Nous representons une societe miniere',
    swahili: 'Tunawakilisha kampuni ya madini',
    lingala: 'Tozali bato ya kompanyi ya mine',
    context: 'business',
  },

  // Safety phrases
  {
    english: 'Is this area safe?',
    french: 'Est-ce que cette zone est sure?',
    swahili: 'Eneo hili ni salama?',
    lingala: 'Esika oyo ezali na kimia?',
    context: 'safety',
  },
  {
    english: 'We need help immediately',
    french: 'Nous avons besoin d\'aide immediatement',
    swahili: 'Tunahitaji msaada haraka',
    lingala: 'Tosengeli lisungi noki',
    context: 'safety',
  },
  {
    english: 'Where is the nearest hospital?',
    french: 'Ou est l\'hopital le plus proche?',
    swahili: 'Hospitali ya karibu iko wapi?',
    lingala: 'Lopitalo ya penepene ezali wapi?',
    context: 'safety',
  },
  {
    english: 'Do not enter this area',
    french: 'Ne pas entrer dans cette zone',
    swahili: 'Usiingie eneo hili',
    lingala: 'Bokota awa te',
    context: 'safety',
  },

  // Community phrases
  {
    english: 'We respect your traditions',
    french: 'Nous respectons vos traditions',
    swahili: 'Tunaheshimu mila zenu',
    lingala: 'Totosaka mimeseno na bino',
    context: 'community',
  },
  {
    english: 'We would like to meet the village chief',
    french: 'Nous aimerions rencontrer le chef du village',
    swahili: 'Tungependa kukutana na mkuu wa kijiji',
    lingala: 'Tolingi kokutana na mokonzi ya mboka',
    context: 'community',
  },
  {
    english: 'This project will benefit the community',
    french: 'Ce projet beneficiera a la communaute',
    swahili: 'Mradi huu utafaidisha jamii',
    lingala: 'Mosala oyo ekosalisa bato ya mboka',
    context: 'community',
  },
  {
    english: 'We want to hire local workers',
    french: 'Nous voulons embaucher des travailleurs locaux',
    swahili: 'Tunataka kuajiri wafanyakazi wa hapa',
    lingala: 'Tolingi kozwa basali ya mboka',
    context: 'community',
  },

  // Logistics phrases
  {
    english: 'How far is it?',
    french: 'C\'est a quelle distance?',
    swahili: 'Ni mbali kiasi gani?',
    lingala: 'Ezali mosika boni?',
    context: 'logistics',
  },
  {
    english: 'We need a vehicle with a driver',
    french: 'Nous avons besoin d\'un vehicule avec chauffeur',
    swahili: 'Tunahitaji gari na dereva',
    lingala: 'Tosengeli motuka na shoferi',
    context: 'logistics',
  },
  {
    english: 'Where can we get fuel?',
    french: 'Ou pouvons-nous trouver du carburant?',
    swahili: 'Tunaweza kupata mafuta wapi?',
    lingala: 'Tokoki kozwa esensi wapi?',
    context: 'logistics',
  },
  {
    english: 'The road is in bad condition',
    french: 'La route est en mauvais etat',
    swahili: 'Barabara iko hali mbaya',
    lingala: 'Nzela ezali mabe',
    context: 'logistics',
  },
  {
    english: 'We need to cross the river',
    french: 'Nous devons traverser la riviere',
    swahili: 'Tunahitaji kuvuka mto',
    lingala: 'Tosengeli kokatisa ebale',
    context: 'logistics',
  },
];

export function getPhrasesByContext(context: string): LanguagePhrase[] {
  return LANGUAGE_PHRASES.filter(
    (phrase) => phrase.context === context
  );
}
