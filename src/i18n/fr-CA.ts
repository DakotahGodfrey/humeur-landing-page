import type { Dictionary } from "./dictionary"

/**
 * Landing copy, fr-CA — Canadian French.
 *
 * Register is federal standard French (Bureau de la traduction / Termium),
 * not a regional variety. Canada is officially bilingual and French is a
 * national language here, not a Quebec one: New Brunswick is bilingual, there
 * are francophone communities in every province, and the crisis section on
 * this page already speaks about Canada as a whole. Quebec regionalisms would
 * narrow the audience for no gain.
 *
 * Typography follows Canadian convention: a space before a colon, none before
 * a semicolon, question mark or exclamation mark. Prices are "20 $", with the
 * sign after the number.
 *
 * The three rules in en-CA.ts govern this file too, and translation is where
 * they are easiest to break by accident:
 *
 *   1. No invented claims. A translation that "improves" a sentence is a new
 *      claim in a language the reviewer may read less carefully.
 *   2. Crisis resources and export are never described as gated. "jamais
 *      restreint" and "dans tous les forfaits" are load-bearing.
 *   3. Capability, not promise. "Humeur ne peut pas lire vos entrées" — the
 *      software cannot, which is a fact. Not "je ne lirai jamais".
 *
 * Two blocks below are marked TODO because they are not this page's to
 * decide: `moods` and `dayView` are reproductions of the app's own strings,
 * and the app already ships in French. They have to be reconciled against the
 * app's fr messages before launch or the mockup will show one vocabulary and
 * the product another — the exact drift the comments in en-CA.ts warn about.
 */

export default {
  meta: {
    title: "Humeur — Une journée, c'est une donnée. Quatre-vingt-dix jours, c'est une tendance.",
    description:
      "Un journal de l'humeur qui suit le matin et le soir séparément, en quatre vues, avec un sommaire imprimable pour votre médecin. Chiffré sur votre appareil. Gratuit, sans compte.",
    ogImageAlt:
      "Humeur, maintenant en version alpha : un journal de l'humeur assez rapide pour qu'on arrive à le tenir. À côté du logotype, une année de carrés d'humeur en vert, en rose et en jaune.",
  },

  nav: {
    skip: "Passer au contenu",
    primary: "Principale",
    footer: "Pied de page",
    language: "Langue",
    items: [
      { href: "/#split", label: "Matin et soir" },
      { href: "/#patterns", label: "Tendances" },
      { href: "/#export", label: "Exportation" },
      { href: "/#privacy", label: "Confidentialité" },
      { href: "/#pricing", label: "Tarifs" },
      { href: "/blog/", label: "Notes" },
    ],
    start: "Commencer le suivi",
  },

  theme: {
    toDark: "Passer au mode sombre",
    toLight: "Passer au mode clair",
    dark: "Sombre",
    light: "Clair",
  },

  shots: {
    year: "La vue annuelle : douze mois d'entrées d'exemple réunis en une seule grille, chaque jour formant un carré coloré, avec une moyenne courante à côté de chaque mois et 207 jours consignés sur 365.",
    month:
      "La vue mensuelle de juin : un calendrier d'entrées d'exemple, la plupart des jours d'une seule couleur, plusieurs partagés en diagonale là où le matin et le soir différaient, et quelques-uns laissés vides.",
    week: "La vue hebdomadaire : deux semaines d'entrées d'exemple côte à côte sous forme de grands carrés, chacun portant sa date, avec une moyenne pour chaque semaine.",
    day: "L'écran de saisie d'une journée : un grand carré pour la journée, des rangées AM et PM distinctes présentant les sept niveaux d'humeur, et des champs structurés pour le sommeil, la médication, les contacts sociaux, l'exercice, les événements stressants et les changements de routine.",
    provider:
      "La boîte de dialogue de recherche de professionnels : un champ de localisation indiquant Mapleford, comté de Rivergate, des distances de 5 à 125 km avec 10 km sélectionné, et des filtres pour psychologue, psychiatre, psychothérapeute, conseiller, thérapeute, clinique, hôpital et soutien en dépendance. En dessous, 36 professionnels à moins de 10 km — les deux premiers présentés avec leur type, leur adresse, la distance, leur numéro de téléphone et un lien vers leur site Web.",
    crisis:
      "Le panneau de ressources en cas de crise, réglé sur le Canada : la ligne d'aide en cas de crise de suicide 9-8-8, accessible en tout temps, avec des boutons pour appeler ou envoyer un message texte, la ligne du Québec, le numéro d'urgence 911, et un lien vers les lignes d'écoute à l'extérieur du Canada.",
    mobile:
      "Les mêmes vues mensuelle, annuelle et quotidienne sur un écran de téléphone, disposées en une seule colonne.",
  },

  hero: {
    eyebrow: "Journal de l'humeur · Accès anticipé",
    headline: "Une journée, c'est une donnée. Quatre-vingt-dix jours, c'est une tendance.",
    sub: "Quatre-vingt-dix jours de matins et de soirs, imprimés sur une seule page pour votre prochain rendez-vous.",
    primaryCta: "Commencer le suivi",
    secondaryCta: "Voir comment ça fonctionne",
    note: "Aucun compte requis. Fonctionne sur votre appareil, gratuitement, aussi longtemps que vous le voulez.",
    panelLabel: "Vue annuelle",
    panelMeta: "Données d'exemple",
    // The en-CA line reads "Days you don't log stay become their own state" —
    // a stray word from an edit. Translated to what it means; flagged there
    // rather than silently reproduced here.
    caption:
      "Chaque carré coloré représente une journée consignée. Les journées que vous ne consignez pas forment leur propre état — une absence est une information, elle aussi.",
  },

  how: {
    section: "Comment ça fonctionne",
    heading: "Consignez un matin, un soir ou une journée entière",
    lead: "Choisissez une humeur pour le matin, pour le soir ou pour la journée entière. Vous pouvez aussi ajouter une note libre ou structurée. C'est conçu pour rester faisable dans vos pires journées, pas seulement dans vos meilleures.",
    specs: [
      {
        key: "Suivre",
        title: "Une seule entrée",
        body: "Sept niveaux prédéfinis, de Crise à Excellente. Une note libre pour écrire au fil de la pensée, ou des champs structurés pour se lancer.",
      },
      {
        key: "Voir",
        title: "Quatre vues",
        body: "Jour, semaine, mois, année. À distance, des tendances apparaissent qui sont invisibles de près.",
      },
      {
        key: "Partager",
        title: "Conçu pour le rendez-vous",
        body: "Exportez un relevé au lieu d'essayer de reconstituer six semaines de mémoire en quinze minutes de consultation.",
      },
    ],
  },

  split: {
    section: "Matin et soir",
    heading: "Une journée en deux moitiés.",
    lead: "Un matin peut être difficile, et la soirée peut quand même être excellente",
    panelLabel: "Vue quotidienne",
    panelMeta: "Entrée d'exemple",
    caption: "AM et PM se règlent séparément.",
  },

  entry: {
    section: "L'entrée",
    heading: "Une note qui contient plus qu'une phrase.",
    lead: "Écrivez librement quand vous en avez envie. Passez au mode structuré quand vous avez besoin des questions pour vous lancer.",
    fieldsLabel: "Champs structurés",
    fieldsCount: "{count} champs",
    fields: [
      { name: "Sommeil", body: "Le nombre d'heures, sur un curseur." },
      {
        name: "Médication",
        body: "Nom, quantité, unité et heure.",
      },
      {
        name: "Vie sociale",
        body: "Resté à la maison, vu des amis, un événement de travail, un message texte.",
      },
      { name: "Exercice", body: "Intensité, activité, minutes." },
      {
        name: "Événement stressant",
        body: "Une dispute, une échéance, une mauvaise nouvelle. Vide s'il n'y en a pas.",
      },
      {
        name: "Changement de routine",
        body: "Nouvel emploi, déménagement, changement de quart. Vide s'il n'y en a pas.",
      },
    ],
    private:
      "N'importe quelle note peut être marquée privée. Les notes privées restent hors du sommaire imprimé, et le sommaire indique combien ont été retenues. Jamais lesquelles.",
  },

  patterns: {
    section: "Tendances",
    heading: "Quatre vues, un même historique.",
    lead: "Jour, semaine, mois, année — les mêmes entrées à quatre échelles. Un journal quotidien. Une semaine montre ce qui se passe ces temps-ci. Un mois à la fois. Une année montre la forme de l'ensemble.",
    memory:
      "La mémoire peut être trompeuse. Une période creuse fait paraître le passé pire qu'il ne l'était; une bonne période peut donner l'impression qu'un mois difficile n'a jamais eu lieu. Vous pourriez retrouver une période basse que vous aviez oubliée, ou constater qu'un changement dont vous gardez le souvenir d'une rupture soudaine a en fait été graduel.",
    panelLabel: "Vue mensuelle",
    weekLabel: "Vue hebdomadaire",
    weekMeta: "Données d'exemple",
    monthMeta: "Données d'exemple",
    mobileLabel: "Sur un téléphone",
    mobileMeta: "Mois · année · jour",
    mobileCaption: "Optimisé pour le mobile.",
  },

  exportSection: {
    section: "Exportation",
    heading: "Votre relevé, dans une forme que votre médecin peut lire.",
    lead: "Les rendez-vous sont courts et la mémoire est inégale. Le sommaire d'Humeur réunit les grilles mensuelles, l'échelle d'humeur et vos notes — sur papier, en ordre. Autant de temps que vous ne passerez pas à essayer de vous souvenir dans le bureau de votre clinicien.",
    notes:
      "Les notes restent à l'écart à moins que vous ne choisissiez de les inclure, et vous décidez note par note. La page imprimée indique combien vous en avez retenues. Jamais lesquelles.",
    free: "Gratuit dans tous les forfaits, y compris si vous résiliez.",
    files: ["Sommaire pour le professionnel · impression ou PDF", "JSON", "CSV"],
    filesNote:
      "Les fichiers de données contiennent toujours votre historique complet, quelle que soit la période affichée à l'écran.",
    caption: "Un sommaire imprimé : grilles mensuelles, échelle d'humeur, faits et chiffres.",
    sheetLabel: "Exemple du sommaire imprimé pour le professionnel",
    pull: "Un historique d'humeur est un dossier médical qui vous concerne. Il n'est jamais derrière un mur payant.",
  },

  privacy: {
    section: "Confidentialité",
    heading: "Humeur ne peut pas lire vos entrées.",
    rows: [
      {
        key: "Capacité",
        sub: "Ce que ça fait",
        body: "Vos entrées sont chiffrées sur votre appareil avant d'être envoyées où que ce soit. Ce qui parvient au serveur est illisible — non pas par politique, mais parce que la clé de déchiffrement ne quitte jamais votre appareil.",
      },
      {
        key: "Retrouver l'accès",
        sub: "Récupération",
        body: "Vous recevez un code de récupération à l'inscription — le seul moyen de restaurer vos notes si vous réinitialisez votre mot de passe. Sur un appareil de confiance, vous pouvez rester déverrouillé pendant 30 jours au lieu d'entrer votre mot de passe à chaque visite.",
      },
      {
        key: "La limite",
        sub: "Toujours visible",
        body: "Ce qui reste visible sur le serveur : que votre compte existe, et à quelles dates vous avez des entrées. Pas ce qu'elles contiennent.",
      },
      {
        key: "Le coût",
        sub: "Le compromis",
        body: "Le compromis : si vous perdez votre mot de passe et votre code de récupération, personne ne peut récupérer vos entrées.",
        tone: "cost",
      },
    ],
  },

  providers: {
    section: "Professionnels",
    heading: "Et si vous n'avez pas encore de professionnel.",
    lead: "Cherchez par ville ou par code postal. Filtrez selon le type d'aide dont vous avez besoin et selon la distance, de 5 km jusqu'à 125.",
    panelLabel: "Recherche de professionnels",
    panelMeta: "Recherche d'exemple",
    caption:
      "Les fiches proviennent d'OpenStreetMap. La disponibilité et les coordonnées ne sont pas vérifiées — confirmez auprès du professionnel avant de vous déplacer.",
    close: "",
  },

  languages: {
    section: "Langues",
    heading: "Actuellement offert en 4 langues.",
    lead: "Chaque écran est traduit, et les traductions font l'objet de tests de parité — rien ne retombe en anglais au milieu d'un parcours.",
    // Endonyms in every locale: a picker that says "Allemand" to a German
    // speaker is a picker they cannot use.
    list: [
      { name: "English", code: "EN" },
      { name: "Français", code: "FR · Canada" },
      { name: "Español", code: "ES · México" },
      { name: "Deutsch", code: "DE" },
    ],
  },

  pricing: {
    section: "Tarifs",
    heading: "Gratuit sur votre appareil. Deux dollars par mois pour la synchronisation.",
    free: {
      name: "Sur cet appareil",
      meta: "Sans compte",
      price: "Gratuit",
      priceNote: " · pour toujours",
      points: [
        "Toutes les fonctions. Toutes les vues.",
        "L'exportation, vos données dans un format exploitable.",
        "Les ressources en cas de crise.",
        "Aucun compte, aucune limite de temps, aucun piège.",
      ],
      cta: "Commencer sans compte",
    },
    synced: {
      name: "Synchronisé",
      meta: "Sur tous vos appareils",
      price: "20 $",
      priceNote: " /an · ou 2 $/mois",
      points: [
        "Votre historique, sur tous vos appareils.",
        "Sauvegardé, et présent quand votre carnet ne l'est pas.",
      ],
      cta: "Commencer le suivi",
    },
    note: "Si vous ne voulez jamais de compte, vous n'en aurez jamais besoin.",
    pull: "Le modèle d'affaires habituel d'une application gratuite de santé mentale, ce sont les données. Deux dollars par mois, c'est la raison pour laquelle Humeur n'a pas besoin des vôtres.",
  },

  about: {
    section: "À propos",
    // First person, as in en-CA: it is one person's project, and "nous"
    // would be a lie in a product whose whole argument is that it doesn't lie.
    heading: "Pourquoi j'ai créé Humeur",
  },

  crisis: {
    section: "Ressources en cas de crise",
    heading: "L'aide est toujours à une touche.",
    body: "Des lignes d'écoute pour les États-Unis, le Canada, le Royaume-Uni, l'Irlande, l'Allemagne, l'Australie et la Nouvelle-Zélande — avec un répertoire mondial pour partout ailleurs, et votre numéro d'urgence local à côté. Gratuit dans tous les forfaits, jamais restreint, jamais derrière une inscription.",
    body2:
      "Humeur n'est pas un service de crise et personne ne surveille vos entrées. Quand vous consignez une journée de niveau Crise, l'application propose les ressources plutôt que de vous interrompre.",
    regions: [
      "États-Unis",
      "Canada",
      "Royaume-Uni",
      "Irlande",
      "Allemagne",
      "Australie",
      "Nouvelle-Zélande",
      "Monde entier",
    ],
    cta: "Ouvrir les ressources en cas de crise",
    panelLabel: "Ressources en cas de crise",
    panelMeta: "Canada affiché",
    caption:
      "Les ressources en cas de crise, avec des liens pour votre région, le numéro d'urgence local et d'autres soutiens régionaux.",
  },

  finalCta: {
    heading: "Commencez aujourd'hui. Regardez en arrière dans un mois.",
    sub: "Aucun compte requis pour commencer.",
    cta: "Commencer le suivi",
  },

  footer: {
    tagline: "Un journal de l'humeur, pas un diagnostic.",
    links: [
      { href: "/blog/", label: "Notes" },
      { href: "/privacy", label: "Confidentialité" },
      { href: "/terms", label: "Conditions" },
      { href: "https://humeur.dev/crisis", label: "Ressources en cas de crise" },
      { href: "https://humeur.dev/sign-in", label: "Ouvrir une session" },
    ],
    fine: "Humeur favorise l'introspection et les échanges avec les professionnels de la santé. L'application ne fournit ni avis médical, ni diagnostic, ni traitement. Personne ne surveille vos entrées. Si vous êtes en situation de crise, composez le numéro d'urgence local ou communiquez avec une ligne d'écoute de votre région.",
  },

  // TODO(app-parity): reconcile against the app's own fr messages before
  // launch. These reproduce product UI, and the app already ships in French —
  // if the app says "Sauvegarder la journée" and this mockup says "Enregistrer
  // la journée", the page is showing a product that doesn't exist. AM/PM stay
  // untranslated by brand direction, as in en-CA.
  dayView: {
    scaleLabel: "Journée",
    split: "Diviser AM / PM",
    am: "AM",
    pm: "PM",
    admission: "Hospitalisation",
    notes: "Notes",
    keepPrivate: "Garder cette note privée",
    save: "Enregistrer la journée",
    clear: "Effacer la journée",
    sampleNote:
      "Pas entendu le réveil, mais arrivé au travail. Ça allait jusqu'à l'appel de seize heures. Couché à vingt heures.",
  },

  legend: {
    nothing: "Rien de consigné",
    admission: "Hospitalisation",
  },

  blog: {
    title: "Notes — Humeur",
    description:
      "Des textes sur le suivi de l'humeur : quoi consigner, comment lire un mois d'entrées, et quoi apporter à un rendez-vous.",
    heading: "Notes",
    lead: "Des textes sur le suivi de l'humeur — l'habitude, la lecture de ses propres tendances, et ce qui vaut la peine d'être apporté à un rendez-vous.",
    eyebrow: "Notes",
    backToBlog: "Toutes les notes",
    empty: "Rien de publié pour l'instant.",
    draftBadge: "Brouillon",
    published: "Publié",
    updated: "Mis à jour",
    tagsLabel: "Étiquettes",
    filedUnder: "Classé sous",
    tagHeadingPrefix: "Notes sur",
    readingOn: "Pour aller plus loin",
    disclaimerHeading: "À propos de ce texte",
    disclaimer:
      "Il s'agit des réflexions d'une seule personne sur le suivi de l'humeur, et non d'un avis médical, d'un diagnostic ou d'un traitement. Ce texte ne remplace pas une conversation avec un professionnel de la santé, et rien ici n'est adapté à votre situation. Si vous êtes en situation de crise, composez le numéro d'urgence local ou communiquez avec une ligne d'écoute de votre région.",
    crisisCta: "Ressources en cas de crise",
    notTranslated:
      "Ce texte n'a pas encore été traduit. La version anglaise est affichée ci-dessous.",
  },

  sheet: {
    title: "Humeur — journal de l'humeur",
    // Reads as "Période du <date> au <date>" — the preposition carries the
    // grammar, which is why these are two dictionary entries and not one
    // "from/to" pair reused elsewhere.
    covering: "Période du",
    to: "au",
    generated: "Généré le 8/8/2026",
    scale: "Échelle d'humeur",
    keyAdmission: "hospitalisation",
    // As in en-CA, this says "après-midi" while the rest of the page says
    // "soir" and the day view says PM — three vocabularies for one thing,
    // reproduced from the real export. Flagged there; one side has to move.
    keySplit: "Matin et après-midi différents",
    summary: "Résumé",
    daysInPeriod: "Jours dans la période",
    daysLogged: "Jours consignés",
    notLogged: "Non consignés",
    averageMood: "Humeur moyenne",
    lowest: "Minimum enregistré : {mood}.",
    highest: "Maximum enregistré : {mood}.",
    mix: "Répartition des humeurs",
    entries: "entrées enregistrées",
    admissions: "Hospitalisations",
    fine: "Journal de l'humeur rempli par la personne elle-même. Il ne s'agit pas d'une évaluation clinique.",
  },

  // TODO(app-parity): same as dayView — these are the app's seven levels and
  // the app already has French names for them. The ordering and the scores are
  // load-bearing and identical in every language; only the words change.
  // Feminine forms throughout, agreeing with "humeur".
  moods: {
    crisis: "Crise",
    awful: "Horrible",
    bad: "Mauvaise",
    "not-great": "Moyenne",
    okay: "Correcte",
    good: "Bonne",
    great: "Excellente",
  },

  calendar: {
    // Lowercase, as French writes a month inside a sentence. The grid header
    // applies `capitalize`, which leaves the English array untouched.
    months: [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre",
    ],
    monthsShort: [
      "janv.", "févr.", "mars", "avr.", "mai", "juin",
      "juill.", "août", "sept.", "oct.", "nov.", "déc.",
    ],
    weekdaysPrint: ["DI", "LU", "MA", "ME", "JE", "VE", "SA"],
    weekdaysShort: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
    dateLong: "{weekday} {day} {month} {year}",
    // "1er mai", not "1 mai". Only the first takes an ordinal in French.
    firstOfMonth: "1er",
    dateShort: "{day} {month} {year}",
    dateSpoken: "{day} {month} {year}",
    monthSummary:
      "{month} {year} : {logged} jours consignés sur {total}, dont {splits} partagés entre le matin et le soir",
    monthSummaryAdmissions: ", {admissions} jours marqués comme hospitalisation",
    dayNoEntry: "{date}, aucune entrée",
    dayAllDay: "{date}, {mood} toute la journée",
    daySplit: "{date}, {am} le matin, {pm} le soir",
    dayAdmission: ", hospitalisation",
  },

  tags: {
    tracking: {
      label: "Suivi",
      blurb:
        "L'habitude elle-même — quoi consigner, à quelle fréquence, et quoi faire des journées manquées.",
    },
    patterns: {
      label: "Tendances",
      blurb: "Lire un mois ou une année de ses propres entrées sans les surinterpréter.",
    },
    appointments: {
      label: "Rendez-vous",
      blurb:
        "Apporter un relevé à un professionnel, et ce qui s'avère utile une fois dans le bureau.",
    },
    notes: {
      label: "Notes",
      blurb:
        "La moitié écrite d'une entrée : ce qui vaut la peine d'être gardé, et ce qu'il vaut mieux laisser de côté.",
    },
    privacy: {
      label: "Confidentialité",
      blurb: "Le chiffrement, ce qu'un serveur peut voir et ne peut pas voir, et qui détient les clés.",
    },
    product: {
      label: "Produit",
      blurb: "Ce qui a été livré, ce qui a changé, et pourquoi une décision a été prise ainsi.",
    },
    intro: {
      label: "Introduction",
      blurb: "Points de départ — ce qu'est Humeur, et à quoi ça sert.",
    },
    about: {
      label: "À propos",
      blurb: "Le projet derrière l'application : pourquoi il existe, et comment il se construit.",
    },
  },

  notFound: {
    label: "404 Page introuvable",
    heading: "404 — Page introuvable",
    body: "Désolé, la page que vous cherchez n'existe pas.",
    home: "Retour à la page d'accueil",
  },
} satisfies Dictionary
