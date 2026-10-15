/**
 * SchemeSathi AI — Frontend Client Logic
 * Handles API communication, search, filtering, rule-based eligibility evaluation,
 * multilingual dictionary (EN, TE, HI), document checklists, saved schemes, and AI chat.
 */

(function () {
  'use strict';

  // Configurable API base URL: defaults to relative if served from same origin, or fallback to local port 5000
  const API_BASE_URL = (function () {
    if (window.__SCHEMESATHI_API_URL__) {
      return window.__SCHEMESATHI_API_URL__.replace(/\/+$/, '');
    }
    if (window.location.protocol === 'file:') {
      return 'http://127.0.0.1:5000';
    }
    // If running on local live-server (e.g. port 3000, 5500, etc.), default to backend on 5000
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      if (window.location.port !== '5000') {
        return 'http://127.0.0.1:5000';
      }
    }
    // In production when served by Python/Flask, relative URLs work directly
    return '';
  })();

  // Multilingual Translation Dictionary (English, Telugu, Hindi)
  const I18N = {
    en: {
      top_notice: "Independent public information platform. Verified official government portal links are provided for every scheme.",
      read_disclaimer: "Read Disclaimer",
      tagline: "Your Guide to Government Schemes",
      nav_explore: "Explore Schemes",
      nav_eligibility: "Check Eligibility",
      nav_assistant: "AI Assistant",
      nav_checklist: "Document Checklist",
      nav_saved: "Saved Schemes",
      select_language: "Select Language",
      preferences: "⚙️ Preferences",
      hero_badge: "Empowering Every Indian Citizen",
      hero_title: "Find Government Schemes Made for You.",
      hero_subtitle: "Discover verified Central and State government welfare schemes for students, farmers, women, entrepreneurs, and senior citizens with clear eligibility rules and official application portals.",
      search_placeholder: "Search by scheme name, e.g. PM-KISAN, Scholarship, Mudra...",
      btn_search: "Search Schemes",
      btn_check_eligibility: "🎯 Check Your Eligibility",
      btn_ask_ai: "💬 Ask AI Assistant",
      metric_verified: "100% Official Links",
      metric_rules: "Strict Rule Evaluation",
      metric_privacy: "Privacy First & Local",
      browse_by_user: "Browse Schemes By Beneficiary:",
      chip_all: "All Citizens",
      chip_students: "🎓 Students",
      chip_farmers: "🌾 Farmers",
      chip_women: "👩 Women",
      chip_business: "🏪 Small Businesses",
      chip_seniors: "👴 Senior Citizens",
      chip_jobs: "💼 Job Seekers",
      chip_ews: "🤝 Economically Weaker",
      explore_heading: "Explore Government Schemes",
      explore_subheading: "Filter by sector, administrative level, or state to view verified programs.",
      label_search: "Keyword Search",
      label_category: "Category",
      label_state: "State / UT Jurisdiction",
      label_level: "Government Level",
      opt_all_categories: "All Categories",
      opt_all_states: "All India (Central + State)",
      opt_all_levels: "All Levels",
      opt_central: "Central Government",
      opt_state: "State Government",
      btn_apply_filters: "Apply Filters",
      btn_reset_filters: "Reset Filters",
      loading_schemes: "Retrieving verified government schemes...",
      no_schemes_found: "No Schemes Found",
      no_schemes_desc: "Try broadening your search keywords or resetting filters.",
      btn_retry: "Retry",
      view_details: "View Details",
      save_scheme: "Save Scheme",
      saved_scheme: "Saved",
      eligibility_title: "Check Your Scheme Eligibility",
      eligibility_subtitle: "Enter your basic details to evaluate which schemes you may potentially qualify for. We respect your privacy: calculations are performed on criteria rules and no personal identifying records are stored.",
      el_age: "Age (Years)",
      el_state: "Residing State / UT",
      el_income: "Annual Family Income (₹)",
      el_gender: "Gender",
      el_occupation: "Primary Occupation",
      el_beneficiary_cat: "Social / Beneficiary Group",
      optional: "(Optional)",
      help_age: "Required for youth, child, or pension schemes",
      help_state: "Matches state-specific welfare benefits",
      help_income: "Helps verify economic criteria limits",
      help_gender: "Only used for women or girl child specific initiatives",
      opt_select: "Select...",
      opt_female: "Female",
      opt_male: "Male",
      opt_other: "Other",
      occ_student: "Student / Scholar",
      occ_farmer: "Farmer / Agricultural Worker",
      occ_business: "Small Business Owner / Artisan",
      occ_unorganized: "Unorganized / Daily Wage Worker",
      occ_job_seeker: "Job Seeker / Unemployed",
      occ_salaried: "Private / Salaried Employee",
      occ_homemaker: "Homemaker",
      occ_retired: "Retired / Senior Citizen",
      cat_general: "General",
      cat_obc: "OBC (Other Backward Class)",
      cat_sc: "SC (Scheduled Caste)",
      cat_st: "ST (Scheduled Tribe)",
      cat_ews: "EWS / BPL Cardholder",
      chk_student: "Currently enrolled as an active student",
      chk_farmer: "Owns or cultivates agricultural land (Farmer family)",
      btn_evaluate: "🔍 Evaluate My Eligibility",
      btn_clear_form: "Clear Form",
      eval_results_title: "Evaluation Results",
      eval_potentially_eligible: "Potentially eligible",
      eval_not_eligible: "Not eligible based on available rules",
      eval_insufficient_info: "Insufficient information",
      ai_pill: "🤖 Grounded AI Chat",
      assistant_title: "SchemeSathi AI Assistant",
      assistant_subtitle: "Ask any question in plain language. Our assistant checks verified scheme guidelines and provides exact references with official portal links.",
      try_asking: "Try asking:",
      ai_welcome: "Namaste! I am <strong>SchemeSathi AI</strong>. I can assist you with information about government schemes, eligibility guidelines, required documents, and official application portals. How can I help you today?",
      btn_send: "Send",
      ai_footer_note: "⚠️ Answers are strictly grounded in verified government records. Always verify current rules on official government websites.",
      checklist_title: "Interactive Document Checklist",
      checklist_subtitle: "Keep track of required certificates and documents before applying. Ticked items are saved on your device only.",
      select_scheme_to_check: "Select Scheme for Document Checklist:",
      opt_select_scheme: "-- Choose a scheme --",
      select_scheme_prompt: "Select any scheme above to display its required documents and track your preparation.",
      saved_title: "Saved Schemes",
      saved_subtitle: "Your bookmarked schemes for quick access on this browser.",
      btn_clear_saved: "Clear Saved",
      saved_storage_notice: "Favourites are saved locally in your browser storage. They are private and specific to this device.",
      no_saved_title: "No Saved Schemes Yet",
      no_saved_desc: "Click the bookmark icon (Save) on any scheme card to save it here for later review.",
      btn_explore_now: "Explore Schemes",
      prefs_title: "User Preferences",
      prefs_intro: "Save your preferred browsing settings. These are stored locally on your device without creating any account.",
      label_pref_lang: "Default Language",
      label_pref_state: "Home State / UT",
      label_pref_category: "Primary Category",
      btn_save_prefs: "Save Preferences",
      sec_overview: "Scheme Overview",
      sec_benefits: "Key Benefits & Financial Assistance",
      sec_eligibility: "Eligibility Guidelines",
      sec_steps: "Step-by-Step Application Process",
      sec_documents: "Verified Required Documents",
      last_verified: "Last Verified:",
      source_database: "Database Status:",
      btn_save_scheme: "🔖 Save to Favourites",
      btn_official_portal: "Visit Official Government Portal",
      quick_links: "Quick Navigation",
      official_resources: "Official Portals",
      supported_languages: "Languages Supported",
      lang_support_note: "SchemeSathi AI currently supports English, Telugu (తెలుగు), and Hindi (हिन्दी), with additional regional languages being added continuously.",
      disclaimer_heading: "Statutory Disclaimer & Fair Use Notice:",
      full_disclaimer: "SchemeSathi AI is an independent, non-governmental educational and public discovery tool created solely to help Indian citizens navigate public welfare information. SchemeSathi AI is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with the Government of India, any State Government, or any of their ministries or agencies. All official scheme names, guidelines, and logos remain the registered trademarks and copyrights of their respective government bodies. Scheme guidelines, financial criteria, eligibility limits, and deadlines are subject to official revision. Users must independently verify all scheme details and submit formal applications exclusively through the official government portal links provided (.gov.in / .nic.in). SchemeSathi AI does not collect any application fees, Aadhaar biometric keys, or financial passwords.",
      footer_about: "SchemeSathi AI helps Indian citizens discover relevant government initiatives, evaluate eligibility criteria, and access direct official government portals."
    },
    te: {
      top_notice: "స్వతంత్ర ప్రజా సమాచార వేదిక. ప్రతి పథకానికి ధృవీకరించబడిన అధికారిక ప్రభుత్వ పోర్టల్ లింకులు అందించబడ్డాయి.",
      read_disclaimer: "హక్కుల నిరాకరణ చదవండి",
      tagline: "ప్రభుత్వ పథకాలకు మీ మార్గదర్శి",
      nav_explore: "పథకాలను అన్వేషించండి",
      nav_eligibility: "అర్హతను తనిఖీ చేయండి",
      nav_assistant: "AI సహాయకుడు",
      nav_checklist: "పత్రాల జాబితా",
      nav_saved: "సేవ్ చేసిన పథకాలు",
      select_language: "భాషను ఎంచుకోండి",
      preferences: "⚙️ ప్రాధాన్యతలు",
      hero_badge: "ప్రతి భారతీయ పౌరుడికి చేయూత",
      hero_title: "మీకు తగిన ప్రభుత్వ పథకాలను కనుగొనండి.",
      hero_subtitle: "విద్యార్థులు, రైతులు, మహిళలు, వ్యాపారులు మరియు వృద్ధుల కోసం కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ సంక్షేమ పథకాలు, స్పష్టమైన అర్హత నియమాలు మరియు అధికారిక పోర్టల్స్.",
      search_placeholder: "పథకం పేరు లేదా అంశం ద్వారా వెతకండి (ఉదా: PM-KISAN, స్కాలర్‌షిప్, ముద్ర)...",
      btn_search: "పథకాలను శోధించండి",
      btn_check_eligibility: "🎯 మీ అర్హతను తనిఖీ చేయండి",
      btn_ask_ai: "💬 AI సహాయకుడిని అడగండి",
      metric_verified: "100% అధికారిక లింకులు",
      metric_rules: "ఖచ్చితమైన నియమాల పరిశీలన",
      metric_privacy: "గోప్యత మరియు భద్రత",
      browse_by_user: "లబ్ధిదారుల ఆధారంగా పథకాలు:",
      chip_all: "అందరు పౌరులు",
      chip_students: "🎓 విద్యార్థులు",
      chip_farmers: "🌾 రైతులు",
      chip_women: "👩 మహిళలు",
      chip_business: "🏪 చిన్న వ్యాపారాలు",
      chip_seniors: "👴 సీనియర్ సిటిజన్లు",
      chip_jobs: "💼 ఉద్యోగార్ధులు",
      chip_ews: "🤝 బలహీన వర్గాలు",
      explore_heading: "ప్రభుత్వ పథకాలను అన్వేషించండి",
      explore_subheading: "ధృవీకరించబడిన సంక్షేమ పథకాలను చూడటానికి రంగం లేదా రాష్ట్రం వారీగా ఫిల్టర్ చేయండి.",
      label_search: "కీవర్డ్ శోధన",
      label_category: "వర్గం",
      label_state: "రాష్ట్రం / కేంద్రపాలిత ప్రాంతం",
      label_level: "ప్రభుత్వ స్థాయి",
      opt_all_categories: "అన్ని వర్గాలు",
      opt_all_states: "భారతదేశం మొత్తం (కేంద్ర + రాష్ట్ర)",
      opt_all_levels: "అన్ని స్థాయిలు",
      opt_central: "కేంద్ర ప్రభుత్వం",
      opt_state: "రాష్ట్ర ప్రభుత్వం",
      btn_apply_filters: "ఫిల్టర్లు వర్తింపజేయి",
      btn_reset_filters: "రీసెట్ చేయి",
      loading_schemes: "పథకాల సమాచారాన్ని పొందుతున్నాము...",
      no_schemes_found: "పథకాలు కనుగొనబడలేదు",
      no_schemes_desc: "దయచేసి మీ శోధన పదాలను మార్చండి లేదా ఫిల్టర్లను రీసెట్ చేయండి.",
      btn_retry: "మళ్లీ ప్రయత్నించండి",
      view_details: "పూర్తి వివరాలు",
      save_scheme: "సేవ్ చేయండి",
      saved_scheme: "సేవ్ చేయబడింది",
      eligibility_title: "మీ పథక అర్హతను తనిఖీ చేయండి",
      eligibility_subtitle: "మీ ప్రాథమిక వివరాలను నమోదు చేయండి. మేము మీ గోప్యతను గౌరవిస్తాము: నియమాల ఆధారంగా లెక్కింపు జరుగుతుంది మరియు వ్యక్తిగత డేటా ఏదీ నిల్వ చేయబడదు.",
      el_age: "వయస్సు (సంవత్సరాలు)",
      el_state: "నివాస రాష్ట్రం",
      el_income: "వార్షిక కుటుంబ ఆదాయం (₹)",
      el_gender: "లింగం",
      el_occupation: "ప్రధాన వృత్తి",
      el_beneficiary_cat: "సామాజిక వర్గం",
      optional: "(ఐచ్ఛికం)",
      help_age: "యువత లేదా పెన్షన్ పథకాలకు అవసరం",
      help_state: "రాష్ట్ర సంక్షేమ పథకాలకు ఉపయోగపడుతుంది",
      help_income: "ఆదాయ పరిమితులను ధృవీకరిస్తుంది",
      help_gender: "మహిళల ప్రత్యేక పథకాల కోసం మాత్రమే",
      opt_select: "ఎంచుకోండి...",
      opt_female: "స్త్రీ",
      opt_male: "పురుషుడు",
      opt_other: "ఇతర",
      occ_student: "విద్యార్థి",
      occ_farmer: "రైతు / వ్యవసాయదారుడు",
      occ_business: "చిన్న వ్యాపారి / కళాకారుడు",
      occ_unorganized: "అసంఘటిత / రోజువారీ కార్మికుడు",
      occ_job_seeker: "ఉద్యోగార్థి",
      occ_salaried: "ప్రైవేట్ ఉద్యోగి",
      occ_homemaker: "గృహిణి",
      occ_retired: "పదవీ విరమణ / సీనియర్ సిటిజన్",
      cat_general: "జనరల్",
      cat_obc: "ఓబీసీ",
      cat_sc: "ఎస్సీ",
      cat_st: "ఎస్టీ",
      cat_ews: "ఈడబ్ల్యూఎస్ / బీపీఎల్",
      chk_student: "ప్రస్తుతం విద్యార్థిగా చదువుతున్నారు",
      chk_farmer: "వ్యవసాయ భూమి కలిగి ఉన్నారు (రైతు కుటుంబం)",
      btn_evaluate: "🔍 నా అర్హతను తనిఖీ చేయండి",
      btn_clear_form: "ఫారమ్ క్లియర్ చేయి",
      eval_results_title: "అర్హత ఫలితాలు",
      eval_potentially_eligible: "అర్హత పొందే అవకాశం ఉంది",
      eval_not_eligible: "నియమాల ప్రకారం అర్హత లేదు",
      eval_insufficient_info: "సరిపోని సమాచారం",
      ai_pill: "🤖 AI చాట్ సహాయకుడు",
      assistant_title: "స్కీమ్‌సాథి AI సహాయకుడు",
      assistant_subtitle: "మీ సందేహాలను సహజ భాషలో అడగండి. మా అసిస్టెంట్ ధృవీకరించబడిన ప్రభుత్వ నిబంధనల ఆధారంగా అధికారిక పోర్టల్ లింకులతో సమాధానం ఇస్తుంది.",
      try_asking: "ఇలా అడగండి:",
      ai_welcome: "నమస్కారం! నేను <strong>స్కీమ్‌సాథి AI</strong>ని. ప్రభుత్వ పథకాలు, అర్హత నిబంధనలు, అవసరమైన పత్రాలు మరియు అధికారిక పోర్టల్స్ గురించి మీకు సహాయం చేయగలను. నేను మీకు ఎలా సహాయపడగలను?",
      btn_send: "పంపు",
      ai_footer_note: "⚠️ సమాధానాలు ధృవీకరించబడిన ప్రభుత్వ రికార్డులపై ఆధారపడి ఉంటాయి. దరఖాస్తు చేసే ముందు అధికారిక వెబ్‌సైట్లలో నియమాలను పరిశీలించండి.",
      checklist_title: "ఇంటరాక్టివ్ డాక్యుమెంట్ చెక్‌లిస్ట్",
      checklist_subtitle: "దరఖాస్తు చేయడానికి ముందు అవసరమైన ధృవపత్రాలు మరియు పత్రాలను సిద్ధం చేసుకోండి.",
      select_scheme_to_check: "పత్రాల జాబితా కోసం పథకాన్ని ఎంచుకోండి:",
      opt_select_scheme: "-- పథకాన్ని ఎంచుకోండి --",
      select_scheme_prompt: "అవసరమైన పత్రాల వివరాలను చూడటానికి పైన ఉన్న పథకాన్ని ఎంచుకోండి.",
      saved_title: "సేవ్ చేసిన పథకాలు",
      saved_subtitle: "ఈ బ్రౌజర్‌లో సులభంగా యాక్సెస్ చేయడానికి మీరు బుక్‌మార్క్ చేసిన పథకాలు.",
      btn_clear_saved: "సేవ్ చేసినవి క్లియర్ చేయి",
      saved_storage_notice: "ఇష్టమైనవి మీ బ్రౌజర్ స్టోరేజీలో స్థానికంగా సేవ్ చేయబడతాయి.",
      no_saved_title: "ఇంకా పథకాలు ఏవీ సేవ్ చేయలేదు",
      no_saved_desc: "పథకం కార్డుపై ఉన్న బుక్‌మార్క్ గుర్తును క్లిక్ చేసి ఇక్కడ సేవ్ చేసుకోండి.",
      btn_explore_now: "పథకాలను అన్వేషించండి",
      prefs_title: "వినియోగదారు ప్రాధాన్యతలు",
      prefs_intro: "మీ ప్రాధాన్య సెట్టింగ్‌లను సేవ్ చేయండి. ఇవి మీ పరికరంలో స్థానికంగా సేవ్ అవుతాయి.",
      label_pref_lang: "డిఫాల్ట్ భాష",
      label_pref_state: "స్వరాష్ట్రం",
      label_pref_category: "ప్రధాన వర్గం",
      btn_save_prefs: "ప్రాధాన్యతలు సేవ్ చేయి",
      sec_overview: "పథకం అవలోకనం",
      sec_benefits: "ప్రధాన ప్రయోజనాలు & ఆర్థిక సహాయం",
      sec_eligibility: "అర్హత మార్గదర్శకాలు",
      sec_steps: "దరఖాస్తు విధానం",
      sec_documents: "అవసరమైన పత్రాలు",
      last_verified: "చివరి ధృవీకరణ తేదీ:",
      source_database: "డేటాబేస్ స్థితి:",
      btn_save_scheme: "🔖 ఇష్టమైన వాటిలో సేవ్ చేయి",
      btn_official_portal: "అధికారిక ప్రభుత్వ పోర్టల్‌ను సందర్శించండి",
      quick_links: "శీఘ్ర లింకులు",
      official_resources: "అధికారిక పోర్టల్స్",
      supported_languages: "మద్దతు ఉన్న భాషలు",
      lang_support_note: "స్కీమ్‌సాథి AI ప్రస్తుతం ఇంగ్లీష్, తెలుగు మరియు హిందీ భాషలకు మద్దతు ఇస్తుంది.",
      disclaimer_heading: "చట్టబద్ధమైన నిరాకరణ మరియు గమనిక:",
      full_disclaimer: "స్కీమ్‌సాథి AI అనేది భారతీయ పౌరులకు ప్రభుత్వ సంక్షేమ పథకాలను సులభంగా అర్థం చేసుకోవడానికి రూపొందించబడిన స్వతంత్ర, ప్రభుత్వేతర ప్రజా సమాచార వేదిక. స్కీమ్‌సాథి AI భారత ప్రభుత్వానికి లేదా ఏ రాష్ట్ర ప్రభుత్వానికి అనుబంధ సంస్థ కాదు. అధికారిక పథకాల పేర్లు మరియు నిబంధనలు ఆయా ప్రభుత్వ సంస్థలకే చెందుతాయి. దరఖాస్తులను ఎల్లప్పుడూ అధికారిక ప్రభుత్వ పోర్టల్స్ (.gov.in / .nic.in) ద్వారా మాత్రమే సమర్పించాలి.",
      footer_about: "స్కీమ్‌సాథి AI భారతీయ పౌరులకు సంక్షేమ పథకాలను కనుగొనడంలో, అర్హతను పరిశీలించడంలో మరియు అధికారిక పోర్టల్స్ పొందడంలో సహాయపడుతుంది."
    },
    hi: {
      top_notice: "स्वतंत्र सार्वजनिक सूचना मंच। प्रत्येक योजना के लिए सत्यापित आधिकारिक सरकारी पोर्टल लिंक प्रदान किए गए हैं।",
      read_disclaimer: "अस्वीकरण पढ़ें",
      tagline: "सरकारी योजनाओं के लिए आपका मार्गदर्शक",
      nav_explore: "योजनाएं खोजें",
      nav_eligibility: "पात्रता जांचें",
      nav_assistant: "AI सहायक",
      nav_checklist: "दस्तावेज़ चेकलिस्ट",
      nav_saved: "सहेजी गई योजनाएं",
      select_language: "भाषा चुनें",
      preferences: "⚙️ प्राथमिकताएं",
      hero_badge: "हर भारतीय नागरिक का सशक्तिकरण",
      hero_title: "आपके लिए बनाई गई सरकारी योजनाएं खोजें।",
      hero_subtitle: "छात्रों, किसानों, महिलाओं, उद्यमियों और वरिष्ठ नागरिकों के लिए केंद्र और राज्य सरकार की कल्याणकारी योजनाएं, स्पष्ट पात्रता नियम और आधिकारिक आवेदन पोर्टल।",
      search_placeholder: "योजना के नाम से खोजें, जैसे PM-KISAN, छात्रवृत्ति, मुद्रा...",
      btn_search: "योजनाएं खोजें",
      btn_check_eligibility: "🎯 अपनी पात्रता जांचें",
      btn_ask_ai: "💬 AI सहायक से पूछें",
      metric_verified: "100% आधिकारिक लिंक",
      metric_rules: "सटीक नियम मूल्यांकन",
      metric_privacy: "गोपनीयता और स्थानीय सुरक्षा",
      browse_by_user: "लाभार्थियों के अनुसार योजनाएं देखें:",
      chip_all: "सभी नागरिक",
      chip_students: "🎓 छात्र",
      chip_farmers: "🌾 किसान",
      chip_women: "👩 महिलाएं",
      chip_business: "🏪 छोटे व्यवसाय",
      chip_seniors: "👴 वरिष्ठ नागरिक",
      chip_jobs: "💼 नौकरी चाहने वाले",
      chip_ews: "🤝 आर्थिक रूप से कमजोर",
      explore_heading: "सरकारी योजनाएं खोजें",
      explore_subheading: "सत्यापित योजनाओं को देखने के लिए क्षेत्र, प्रशासनिक स्तर या राज्य के अनुसार फ़िल्टर करें।",
      label_search: "कीवर्ड खोज",
      label_category: "श्रेणी",
      label_state: "राज्य / केंद्र शासित प्रदेश",
      label_level: "सरकारी स्तर",
      opt_all_categories: "सभी श्रेणियां",
      opt_all_states: "अखिल भारतीय (केंद्रीय + राज्य)",
      opt_all_levels: "सभी स्तर",
      opt_central: "केंद्र सरकार",
      opt_state: "राज्य सरकार",
      btn_apply_filters: "फ़िल्टर लागू करें",
      btn_reset_filters: "रीसेट करें",
      loading_schemes: "सरकारी योजनाएं प्राप्त की जा रही हैं...",
      no_schemes_found: "कोई योजना नहीं मिली",
      no_schemes_desc: "कृपया अपने खोज शब्दों को बदलें या फ़िल्टर रीसेट करें।",
      btn_retry: "पुनः प्रयास करें",
      view_details: "विवरण देखें",
      save_scheme: "सहेजें",
      saved_scheme: "सहेजा गया",
      eligibility_title: "अपनी योजना पात्रता जांचें",
      eligibility_subtitle: "यह जानने के लिए अपनी बुनियादी जानकारी दर्ज करें कि आप किन योजनाओं के लिए पात्र हो सकते हैं। हम आपकी गोपनीयता का सम्मान करते हैं: कोई व्यक्तिगत पहचान योग्य डेटा संग्रहीत नहीं किया जाता है।",
      el_age: "आयु (वर्ष)",
      el_state: "निवास का राज्य",
      el_income: "वार्षिक पारिवारिक आय (₹)",
      el_gender: "लिंग",
      el_occupation: "मुख्य व्यवसाय",
      el_beneficiary_cat: "सामाजिक / लाभार्थी वर्ग",
      optional: "(वैकल्पिक)",
      help_age: "युवा, बाल या पेंशन योजनाओं के लिए आवश्यक",
      help_state: "राज्य-विशिष्ट कल्याणकारी लाभों से मेल खाता है",
      help_income: "आर्थिक मानदंडों की जांच में सहायक",
      help_gender: "केवल महिलाओं या बालिकाओं के लिए विशिष्ट योजनाओं में प्रयुक्त",
      opt_select: "चुनें...",
      opt_female: "महिला",
      opt_male: "पुरुष",
      opt_other: "अन्य",
      occ_student: "छात्र / शोधार्थी",
      occ_farmer: "किसान / कृषि श्रमिक",
      occ_business: "छोटा व्यवसायी / कारीगर",
      occ_unorganized: "असंगठित / दैनिक वेतनभोगी श्रमिक",
      occ_job_seeker: "रोज़गार चाहने वाले",
      occ_salaried: "निजी कर्मचारी",
      occ_homemaker: "गृहिणी",
      occ_retired: "सेवानिवृत्त / वरिष्ठ नागरिक",
      cat_general: "सामान्य",
      cat_obc: "ओबीसी (अन्य पिछड़ा वर्ग)",
      cat_sc: "एससी (अनुसूचित जाति)",
      cat_st: "एसटी (अनुसूचित जनजाति)",
      cat_ews: "ईडब्ल्यूएस / बीपीएल",
      chk_student: "वर्तमान में सक्रिय छात्र के रूप में नामांकित",
      chk_farmer: "कृषि भूमि का स्वामित्व या खेती (किसान परिवार)",
      btn_evaluate: "🔍 मेरी पात्रता का मूल्यांकन करें",
      btn_clear_form: "फ़ॉर्म साफ़ करें",
      eval_results_title: "मूल्यांकन परिणाम",
      eval_potentially_eligible: "संभावित रूप से पात्र",
      eval_not_eligible: "उपलब्ध नियमों के आधार पर पात्र नहीं",
      eval_insufficient_info: "अपर्याप्त जानकारी",
      ai_pill: "🤖 AI चैट सहायक",
      assistant_title: "स्कीमसाथी AI सहायक",
      assistant_subtitle: "सरल भाषा में कोई भी प्रश्न पूछें। हमारा सहायक सत्यापित दिशानिर्देशों की जांच करता है और आधिकारिक पोर्टल लिंक प्रदान करता है।",
      try_asking: "यह पूछकर देखें:",
      ai_welcome: "नमस्ते! मैं <strong>स्कीमसाथी AI</strong> हूँ। मैं सरकारी योजनाओं, पात्रता दिशानिर्देशों, आवश्यक दस्तावेजों और आधिकारिक पोर्टलों के बारे में आपकी सहायता कर सकता हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?",
      btn_send: "भेजें",
      ai_footer_note: "⚠️ उत्तर सत्यापित सरकारी रिकॉर्ड पर आधारित हैं। आवेदन करने से पहले हमेशा आधिकारिक वेबसाइट पर वर्तमान नियमों की पुष्टि करें।",
      checklist_title: "इंटरएक्टिव दस्तावेज़ चेकलिस्ट",
      checklist_subtitle: "आवेदन करने से पहले आवश्यक प्रमाण पत्रों और दस्तावेजों की तैयारी ट्रैक करें।",
      select_scheme_to_check: "दस्तावेज़ चेकलिस्ट के लिए योजना चुनें:",
      opt_select_scheme: "-- योजना चुनें --",
      select_scheme_prompt: "आवश्यक दस्तावेजों को देखने और तैयारी ट्रैक करने के लिए ऊपर किसी योजना का चयन करें।",
      saved_title: "सहेजी गई योजनाएं",
      saved_subtitle: "इस ब्राउज़र पर त्वरित पहुंच के लिए आपकी बुकमार्क की गई योजनाएं।",
      btn_clear_saved: "सहेजी गई साफ़ करें",
      saved_storage_notice: "पसंदीदा योजनाएं आपके स्थानीय ब्राउज़र स्टोरेज में सुरक्षित रूप से सहेजी जाती हैं।",
      no_saved_title: "अभी तक कोई योजना सहेजी नहीं गई",
      no_saved_desc: "बाद में समीक्षा के लिए किसी भी योजना कार्ड पर बुकमार्क आइकन (सहेजें) पर क्लिक करें।",
      btn_explore_now: "योजनाएं खोजें",
      prefs_title: "उपयोगकर्ता प्राथमिकताएं",
      prefs_intro: "अपनी पसंदीदा सेटिंग्स सहेजें। ये बिना कोई खाता बनाए आपके डिवाइस पर स्थानीय रूप से संग्रहीत की जाती हैं।",
      label_pref_lang: "डिफ़ॉल्ट भाषा",
      label_pref_state: "गृह राज्य",
      label_pref_category: "प्राथमिक श्रेणी",
      btn_save_prefs: "प्राथमिकताएं सहेजें",
      sec_overview: "योजना का संक्षिप्त विवरण",
      sec_benefits: "प्रमुख लाभ और वित्तीय सहायता",
      sec_eligibility: "पात्रता दिशानिर्देश",
      sec_steps: "चरण-दर-चरण आवेदन प्रक्रिया",
      sec_documents: "सत्यापित आवश्यक दस्तावेज़",
      last_verified: "अंतिम सत्यापन तिथि:",
      source_database: "डेटाबेस स्थिति:",
      btn_save_scheme: "🔖 पसंदीदा में सहेजें",
      btn_official_portal: "आधिकारिक सरकारी पोर्टल पर जाएं",
      quick_links: "त्वरित नेविगेशन",
      official_resources: "आधिकारिक पोर्टल",
      supported_languages: "समर्थित भाषाएं",
      lang_support_note: "स्कीमसाथी AI वर्तमान में अंग्रेजी, तेलुगु और हिंदी का समर्थन करता है।",
      disclaimer_heading: "वैधानिक अस्वीकरण और निष्पक्ष उपयोग सूचना:",
      full_disclaimer: "स्कीमसाथी AI एक स्वतंत्र, गैर-सरकारी शैक्षणिक और सार्वजनिक सूचना उपकरण है जिसे भारतीय नागरिकों को सार्वजनिक कल्याणकारी योजनाओं की जानकारी प्राप्त करने में सहायता के लिए बनाया गया है। स्कीमसाथी AI भारत सरकार, किसी भी राज्य सरकार या उनके किसी भी मंत्रालय से संबद्ध या आधिकारिक रूप से जुड़ा नहीं है। सभी आधिकारिक नाम और दिशानिर्देश संबंधित सरकारी निकायों की संपत्ति हैं। उपयोगकर्ताओं को हमेशा आधिकारिक सरकारी पोर्टलों (.gov.in / .nic.in) के माध्यम से ही नियमों का सत्यापन करना चाहिए और आवेदन जमा करना चाहिए।",
      footer_about: "स्कीमसाथी AI भारतीय नागरिकों को प्रासंगिक सरकारी योजनाएं खोजने, पात्रता का मूल्यांकन करने और आधिकारिक पोर्टल प्राप्त करने में मदद करता है।"
    }
  };

  // State Management
  const state = {
    currentLang: localStorage.getItem('schemesathi_lang') || 'en',
    schemes: [],
    categories: [],
    states: [],
    savedSchemeIds: JSON.parse(localStorage.getItem('schemesathi_saved_ids') || '[]'),
    preferences: JSON.parse(localStorage.getItem('schemesathi_user_prefs') || '{"lang":"en","state":"ALL","beneficiary":""}'),
    activeBeneficiaryFilter: '',
    currentChecklistSchemeId: '',
    checkedDocs: JSON.parse(localStorage.getItem('schemesathi_checked_docs') || '{}')
  };

  // DOM Elements Cache
  const DOM = {
    langSelect: document.getElementById('language-select'),
    mobileToggle: document.getElementById('mobile-menu-toggle'),
    mobileDrawer: document.getElementById('mobile-nav-drawer'),
    savedCount: document.getElementById('saved-count'),
    themePrefsBtn: document.getElementById('theme-prefs-btn'),

    heroSearchForm: document.getElementById('hero-search-form'),
    heroSearchInput: document.getElementById('hero-search-input'),
    beneficiaryChips: document.getElementById('beneficiary-chips'),

    filterSearch: document.getElementById('filter-search'),
    filterCategory: document.getElementById('filter-category'),
    filterState: document.getElementById('filter-state'),
    filterLevel: document.getElementById('filter-level'),
    btnApplyFilters: document.getElementById('btn-apply-filters'),
    btnResetFilters: document.getElementById('btn-reset-filters'),
    filterResultsCounter: document.getElementById('filter-results-counter'),
    dataSourceStatus: document.getElementById('data-source-status'),

    schemesGrid: document.getElementById('schemes-grid'),
    schemesLoading: document.getElementById('schemes-loading'),
    schemesError: document.getElementById('schemes-error'),
    schemesErrorMsg: document.getElementById('schemes-error-msg'),
    schemesEmpty: document.getElementById('schemes-empty'),
    btnRetrySchemes: document.getElementById('btn-retry-schemes'),

    elForm: document.getElementById('eligibility-form'),
    elState: document.getElementById('el-state'),
    btnEvalSubmit: document.getElementById('btn-eval-submit'),
    btnEvalReset: document.getElementById('btn-eval-reset'),
    elResults: document.getElementById('eligibility-results'),
    evalSummaryText: document.getElementById('eval-summary-text'),
    evaluationsList: document.getElementById('evaluations-list'),
    evalDisclaimerText: document.getElementById('eval-disclaimer-text'),

    chatViewport: document.getElementById('chat-viewport'),
    chatForm: document.getElementById('chat-form'),
    chatInput: document.getElementById('chat-input'),
    btnChatSend: document.getElementById('btn-chat-send'),

    checklistSchemeSelect: document.getElementById('checklist-scheme-select'),
    checklistContent: document.getElementById('checklist-content'),

    savedSchemesGrid: document.getElementById('saved-schemes-grid'),
    savedEmpty: document.getElementById('saved-empty'),
    btnClearSaved: document.getElementById('btn-clear-saved'),

    prefsModal: document.getElementById('prefs-modal'),
    prefsModalClose: document.getElementById('prefs-modal-close'),
    prefLanguage: document.getElementById('pref-language'),
    prefState: document.getElementById('pref-state'),
    prefBeneficiary: document.getElementById('pref-beneficiary'),
    btnSavePrefs: document.getElementById('btn-save-prefs'),

    schemeModal: document.getElementById('scheme-modal'),
    schemeModalClose: document.getElementById('scheme-modal-close'),
    modalSchemeHeading: document.getElementById('scheme-modal-title'),
    modalSchemeDept: document.getElementById('modal-scheme-dept'),
    modalSchemeLevel: document.getElementById('modal-scheme-level'),
    modalSchemeState: document.getElementById('modal-scheme-state'),
    modalSchemeDesc: document.getElementById('modal-scheme-desc'),
    modalSchemeBenefits: document.getElementById('modal-scheme-benefits'),
    modalSchemeEligibility: document.getElementById('modal-scheme-eligibility'),
    modalSchemeSteps: document.getElementById('modal-scheme-steps'),
    modalSchemeDocs: document.getElementById('modal-scheme-docs'),
    modalSchemeVerified: document.getElementById('modal-scheme-verified'),
    modalOfficialLink: document.getElementById('modal-official-link'),
    modalSaveBtn: document.getElementById('modal-save-btn')
  };

  // --------------------------------------------------------------------------
  // Core Internationalization (i18n) Engine
  // --------------------------------------------------------------------------
  function applyLanguage(lang) {
    if (!I18N[lang]) {
      lang = 'en';
    }
    state.currentLang = lang;
    localStorage.setItem('schemesathi_lang', lang);
    document.documentElement.lang = lang;
    document.body.setAttribute('lang', lang);

    if (DOM.langSelect) {
      DOM.langSelect.value = lang;
    }
    if (DOM.prefLanguage) {
      DOM.prefLanguage.value = lang;
    }

    const dict = I18N[lang];

    // Translate standard text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Translate inputs with placeholder bindings
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });

    // Re-render dynamic elements that require translated labels
    renderSavedBadge();
    if (state.schemes.length > 0) {
      renderSchemes(state.schemes);
      renderSavedSchemes();
    }
  }

  // --------------------------------------------------------------------------
  // API Request Wrapper with Safe Error Handling
  // --------------------------------------------------------------------------
  async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg = json && json.message ? json.message : `HTTP Error ${response.status}`;
        throw new Error(errorMsg);
      }

      return json;
    } catch (err) {
      console.warn(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  }

  // --------------------------------------------------------------------------
  // App Initialization & Master Data
  // --------------------------------------------------------------------------
  async function init() {
    setupEventListeners();
    applyLanguage(state.currentLang);

    // Initial check of server health and diagnostics
    try {
      const health = await apiFetch('/api/health');
      if (health && health.data) {
        if (DOM.dataSourceStatus) {
          DOM.dataSourceStatus.textContent = health.data.database_mode === 'supabase'
            ? 'Connected: Supabase DB'
            : 'Active: Verified Demo DB';
        }
      }
    } catch (e) {
      if (DOM.dataSourceStatus) {
        DOM.dataSourceStatus.textContent = 'Demo Mode (Offline / Direct)';
      }
    }

    // Load Master Lists
    await Promise.allSettled([loadStates(), loadCategories()]);

    // Apply stored preferences to initial filters
    if (state.preferences.state && state.preferences.state !== 'ALL') {
      if (DOM.filterState) DOM.filterState.value = state.preferences.state;
      if (DOM.elState) DOM.elState.value = state.preferences.state;
    }
    if (state.preferences.beneficiary) {
      state.activeBeneficiaryFilter = state.preferences.beneficiary;
      highlightBeneficiaryChip(state.preferences.beneficiary);
    }

    // Load Schemes
    fetchSchemes();
  }

  async function loadStates() {
    try {
      const res = await apiFetch('/api/states');
      if (res && res.data) {
        state.states = res.data;
        populateStateDropdowns(res.data);
      }
    } catch (e) {
      console.error('Could not load states list:', e);
    }
  }

  function populateStateDropdowns(statesList) {
    const selects = [DOM.filterState, DOM.elState, DOM.prefState];
    selects.forEach(select => {
      if (!select) return;
      select.innerHTML = '';
      statesList.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st.code;
        opt.textContent = st.code === 'ALL' ? 'All India (Central + State)' : `${st.name} (${st.code})`;
        select.appendChild(opt);
      });
    });
  }

  async function loadCategories() {
    try {
      const res = await apiFetch('/api/categories');
      if (res && res.data) {
        state.categories = res.data;
        if (DOM.filterCategory) {
          DOM.filterCategory.innerHTML = '<option value="">All Categories</option>';
          res.data.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.name;
            opt.textContent = `${cat.name} (${cat.count})`;
            DOM.filterCategory.appendChild(opt);
          });
        }
      }
    } catch (e) {
      console.error('Could not load categories:', e);
    }
  }

  // --------------------------------------------------------------------------
  // Schemes Discovery & Search (Feature 2)
  // --------------------------------------------------------------------------
  async function fetchSchemes() {
    showSchemesLoading();

    const query = DOM.filterSearch ? DOM.filterSearch.value.trim() : '';
    const category = DOM.filterCategory ? DOM.filterCategory.value : '';
    const stateVal = DOM.filterState ? DOM.filterState.value : 'ALL';
    const level = DOM.filterLevel ? DOM.filterLevel.value : '';
    const beneficiary = state.activeBeneficiaryFilter;

    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    if (stateVal && stateVal !== 'ALL') params.append('state', stateVal);
    if (level) params.append('level', level);
    if (beneficiary) params.append('beneficiary', beneficiary);

    try {
      const res = await apiFetch(`/api/schemes?${params.toString()}`);
      if (res && res.data) {
        state.schemes = res.data;
        renderSchemes(res.data);
        populateChecklistSchemeSelector(res.data);
        renderSavedSchemes();

        if (DOM.filterResultsCounter) {
          DOM.filterResultsCounter.textContent = `${res.data.length} scheme(s) found`;
        }
      }
    } catch (err) {
      showSchemesError(err.message || 'Unable to load scheme data from server.');
    }
  }

  function showSchemesLoading() {
    if (DOM.schemesLoading) DOM.schemesLoading.hidden = false;
    if (DOM.schemesError) DOM.schemesError.hidden = true;
    if (DOM.schemesEmpty) DOM.schemesEmpty.hidden = true;
    if (DOM.schemesGrid) DOM.schemesGrid.innerHTML = '';
  }

  function showSchemesError(msg) {
    if (DOM.schemesLoading) DOM.schemesLoading.hidden = true;
    if (DOM.schemesError) {
      DOM.schemesError.hidden = false;
      if (DOM.schemesErrorMsg) DOM.schemesErrorMsg.textContent = msg;
    }
    if (DOM.schemesEmpty) DOM.schemesEmpty.hidden = true;
  }

  function renderSchemes(schemesList) {
    if (DOM.schemesLoading) DOM.schemesLoading.hidden = true;
    if (DOM.schemesError) DOM.schemesError.hidden = true;

    if (!schemesList || schemesList.length === 0) {
      if (DOM.schemesEmpty) DOM.schemesEmpty.hidden = false;
      if (DOM.schemesGrid) DOM.schemesGrid.innerHTML = '';
      return;
    }

    if (DOM.schemesEmpty) DOM.schemesEmpty.hidden = true;
    if (!DOM.schemesGrid) return;

    DOM.schemesGrid.innerHTML = '';
    const dict = I18N[state.currentLang] || I18N.en;

    schemesList.forEach(scheme => {
      const isSaved = state.savedSchemeIds.includes(scheme.id);
      const levelClass = (scheme.government_level || '').toLowerCase() === 'central' ? 'central' : 'state';
      const benefitsText = (scheme.benefits && scheme.benefits.summary) ? scheme.benefits.summary : 'Verified benefits apply.';
      const docsSummary = (scheme.required_documents && scheme.required_documents.length)
        ? scheme.required_documents.slice(0, 2).join(', ') + (scheme.required_documents.length > 2 ? '...' : '')
        : 'KYC & standard records';

      const card = document.createElement('article');
      card.className = 'scheme-card';
      card.setAttribute('data-id', scheme.id);

      card.innerHTML = `
        <div class="card-top-meta">
          <span class="badge-level ${levelClass}">${escapeHtml(scheme.government_level || 'Central')}</span>
          <span class="badge-state">${scheme.state_code === 'ALL' ? 'All India' : escapeHtml(scheme.state_code)}</span>
          <button class="btn-bookmark ${isSaved ? 'saved' : ''}" data-scheme-id="${scheme.id}" title="${isSaved ? dict.saved_scheme : dict.save_scheme}" aria-label="Bookmark scheme">
            ${isSaved ? '❤️' : '🤍'}
          </button>
        </div>

        <h3 class="scheme-card-title">${escapeHtml(scheme.name)}</h3>
        <p class="scheme-department">${escapeHtml(scheme.department || 'Government of India')}</p>

        <div class="card-tags">
          ${(scheme.categories || []).map(cat => `<span class="tag">${escapeHtml(cat)}</span>`).join('')}
        </div>

        <p class="scheme-desc">${escapeHtml(scheme.description || '')}</p>

        <div class="scheme-highlight-box">
          <strong>Key Benefit:</strong> ${escapeHtml(benefitsText)}
        </div>

        <div class="card-footer">
          <button class="btn btn-primary btn-sm btn-view-scheme" data-scheme-id="${scheme.id}">
            ${dict.view_details}
          </button>
          <a href="${scheme.official_url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            Official Portal ↗
          </a>
        </div>
      `;

      DOM.schemesGrid.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // Beneficiary Filter Chip Handler
  // --------------------------------------------------------------------------
  function highlightBeneficiaryChip(beneficiaryVal) {
    if (!DOM.beneficiaryChips) return;
    const chips = DOM.beneficiaryChips.querySelectorAll('.chip');
    chips.forEach(chip => {
      const val = chip.getAttribute('data-beneficiary');
      if (val === beneficiaryVal) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // Eligibility Evaluation (Feature 3)
  // --------------------------------------------------------------------------
  async function handleEligibilitySubmit(e) {
    e.preventDefault();

    const ageVal = document.getElementById('el-age').value.trim();
    const stateVal = document.getElementById('el-state').value;
    const incomeVal = document.getElementById('el-income').value.trim();
    const genderVal = document.getElementById('el-gender').value;
    const occVal = document.getElementById('el-occupation').value;
    const catVal = document.getElementById('el-category').value;
    const isStudent = document.getElementById('el-is-student').checked;
    const isFarmer = document.getElementById('el-is-farmer').checked;

    // Frontend validation
    if (ageVal !== '') {
      const ageNum = parseInt(ageVal, 10);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
        alert('Please enter a valid age between 0 and 120 years.');
        return;
      }
    }

    if (incomeVal !== '') {
      const incomeNum = parseFloat(incomeVal);
      if (isNaN(incomeNum) || incomeNum < 0) {
        alert('Please enter a valid positive annual family income.');
        return;
      }
    }

    const payload = {
      age: ageVal ? parseInt(ageVal, 10) : null,
      state: stateVal || 'ALL',
      income: incomeVal ? parseFloat(incomeVal) : null,
      gender: genderVal || null,
      occupation: occVal || null,
      beneficiary_category: catVal || null,
      is_student: isStudent,
      is_farmer: isFarmer
    };

    DOM.btnEvalSubmit.disabled = true;
    DOM.btnEvalSubmit.textContent = 'Evaluating Criteria Rules...';

    try {
      const res = await apiFetch('/api/eligibility', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res && res.data) {
        renderEligibilityResults(res.data);
      }
    } catch (err) {
      alert(`Evaluation failed: ${err.message}`);
    } finally {
      DOM.btnEvalSubmit.disabled = false;
      const dict = I18N[state.currentLang] || I18N.en;
      DOM.btnEvalSubmit.textContent = dict.btn_evaluate;
    }
  }

  function renderEligibilityResults(data) {
    const { evaluations, potentially_eligible_count, total_evaluated, disclaimer } = data;
    const dict = I18N[state.currentLang] || I18N.en;

    DOM.elResults.hidden = false;
    DOM.evalSummaryText.textContent = `Identified ${potentially_eligible_count} scheme(s) you are potentially eligible for out of ${total_evaluated} evaluated.`;
    DOM.evalDisclaimerText.textContent = disclaimer;
    DOM.evaluationsList.innerHTML = '';

    evaluations.forEach(ev => {
      let badgeClass = 'badge-warning';
      let borderClass = 'border-warning';
      let statusLabel = ev.status;

      if (ev.status === 'Potentially eligible') {
        badgeClass = 'badge-success';
        borderClass = 'border-success';
        statusLabel = dict.eval_potentially_eligible;
      } else if (ev.status === 'Not eligible based on available rules') {
        badgeClass = 'badge-danger';
        borderClass = 'border-danger';
        statusLabel = dict.eval_not_eligible;
      } else {
        statusLabel = dict.eval_insufficient_info;
      }

      const itemCard = document.createElement('div');
      itemCard.className = `eval-item-card ${borderClass}`;

      itemCard.innerHTML = `
        <div class="eval-header">
          <div>
            <h4 class="eval-scheme-title">${escapeHtml(ev.scheme_name)}</h4>
            <span class="scheme-department">${escapeHtml(ev.department || '')} (${escapeHtml(ev.government_level || 'Central')})</span>
          </div>
          <span class="verdict-badge ${badgeClass}">${escapeHtml(statusLabel)}</span>
        </div>

        <p class="scheme-desc" style="margin-bottom: 0.75rem;"><strong>Summary:</strong> ${escapeHtml(ev.summary_reason)}</p>

        <div class="eval-breakdown">
          ${ev.matched_criteria.map(c => `
            <div class="breakdown-row">
              <span class="breakdown-icon text-success">✓</span>
              <span>${escapeHtml(c)}</span>
            </div>
          `).join('')}

          ${ev.unmet_criteria.map(c => `
            <div class="breakdown-row">
              <span class="breakdown-icon text-danger">✗</span>
              <span>${escapeHtml(c)}</span>
            </div>
          `).join('')}

          ${ev.unknown_criteria.map(c => `
            <div class="breakdown-row">
              <span class="breakdown-icon text-warning">?</span>
              <span class="text-muted">${escapeHtml(c)}</span>
            </div>
          `).join('')}
        </div>

        <div class="card-footer" style="padding-top: 0.75rem;">
          <button class="btn btn-outline btn-sm btn-view-scheme" data-scheme-id="${ev.scheme_id}">
            ${dict.view_details}
          </button>
          <a href="${ev.official_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            Apply on Official Portal ↗
          </a>
        </div>
      `;

      DOM.evaluationsList.appendChild(itemCard);
    });

    // Smooth scroll to results
    DOM.elResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // --------------------------------------------------------------------------
  // Grounded AI Assistant (Feature 4)
  // --------------------------------------------------------------------------
  async function handleChatSubmit(e) {
    e.preventDefault();
    const query = DOM.chatInput.value.trim();
    if (!query) return;

    appendChatMessage('user', query);
    DOM.chatInput.value = '';
    DOM.btnChatSend.disabled = true;

    // Typing indicator
    const typingMsg = appendChatMessage('assistant', 'Searching verified scheme records and formulating answer...', true);

    try {
      const res = await apiFetch('/api/assistant', {
        method: 'POST',
        body: JSON.stringify({ query: query })
      });

      if (typingMsg && typingMsg.parentNode) {
        typingMsg.remove();
      }

      if (res && res.data) {
        appendChatMessage('assistant', res.data.answer, false, res.data.citations);
      }
    } catch (err) {
      if (typingMsg && typingMsg.parentNode) {
        typingMsg.remove();
      }
      appendChatMessage('assistant', `⚠️ Sorry, unable to process your question at this moment: ${err.message}. Please browse schemes directly or retry.`);
    } finally {
      DOM.btnChatSend.disabled = false;
    }
  }

  function appendChatMessage(sender, content, isTyping = false, citations = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender === 'user' ? 'user-message' : 'assistant-message'}`;

    const avatar = sender === 'user' ? '👤' : '🤖';

    // Basic markdown conversion for bold, headers, links, bullets
    let formattedText = escapeHtml(content)
      .replace(/^### (.*$)/gim, '<h4 style="margin: 0.5rem 0 0.25rem; font-size: 0.9375rem; font-weight:700;">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#0284c7; text-decoration:underline;">$1 ↗</a>')
      .replace(/\n/g, '<br>');

    let citationsHtml = '';
    if (citations && citations.length > 0) {
      citationsHtml = `
        <div class="chat-citations">
          <div class="citation-title">Verified Official References:</div>
          <div class="citation-list">
            ${citations.map(c => `
              <a href="${c.url}" target="_blank" rel="noopener noreferrer" class="citation-badge">
                🏛️ ${escapeHtml(c.name)} ↗
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    msgDiv.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">
        ${isTyping ? '<div class="spinner" style="width:1.25rem; height:1.25rem; margin:0 0 0.5rem;"></div>' : ''}
        <p>${formattedText}</p>
        ${citationsHtml}
      </div>
    `;

    DOM.chatViewport.appendChild(msgDiv);
    DOM.chatViewport.scrollTop = DOM.chatViewport.scrollHeight;
    return msgDiv;
  }

  // --------------------------------------------------------------------------
  // Document Checklist Tool (Feature 8)
  // --------------------------------------------------------------------------
  function populateChecklistSchemeSelector(schemesList) {
    if (!DOM.checklistSchemeSelect) return;
    const current = DOM.checklistSchemeSelect.value;
    DOM.checklistSchemeSelect.innerHTML = '<option value="">-- Choose a scheme --</option>';

    schemesList.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.name} (${s.government_level})`;
      DOM.checklistSchemeSelect.appendChild(opt);
    });

    if (current && schemesList.some(s => s.id === current)) {
      DOM.checklistSchemeSelect.value = current;
    }
  }

  function renderChecklist(schemeId) {
    state.currentChecklistSchemeId = schemeId;
    if (!DOM.checklistContent) return;

    if (!schemeId) {
      const dict = I18N[state.currentLang] || I18N.en;
      DOM.checklistContent.innerHTML = `<p class="placeholder-msg">${dict.select_scheme_prompt}</p>`;
      return;
    }

    const scheme = state.schemes.find(s => s.id === schemeId);
    if (!scheme) return;

    const docs = scheme.required_documents || [];
    if (docs.length === 0) {
      DOM.checklistContent.innerHTML = '<p class="placeholder-msg">No verified mandatory document records currently listed for this scheme.</p>';
      return;
    }

    const savedChecked = state.checkedDocs[schemeId] || [];
    const totalDocs = docs.length;
    const completedDocs = savedChecked.length;
    const progressPercent = Math.round((completedDocs / totalDocs) * 100);

    DOM.checklistContent.innerHTML = `
      <div class="checklist-progress-bar">
        <div class="progress-track">
          <div class="progress-fill" style="width: ${progressPercent}%;"></div>
        </div>
        <span class="progress-text">${completedDocs} of ${totalDocs} documents ready (${progressPercent}%)</span>
      </div>

      <div class="doc-items-list">
        ${docs.map((doc, idx) => {
          const isDone = savedChecked.includes(doc);
          return `
            <label class="doc-item-row ${isDone ? 'completed' : ''}">
              <input type="checkbox" class="doc-checkbox" data-scheme-id="${schemeId}" data-doc-name="${escapeHtml(doc)}" ${isDone ? 'checked' : ''}>
              <span class="doc-item-label">${escapeHtml(doc)}</span>
            </label>
          `;
        }).join('')}
      </div>

      <p class="field-help" style="margin-top: 1rem;">
        🔒 All checked items are stored exclusively in your local browser storage. No identity documents or files are uploaded to any server.
      </p>
    `;
  }

  function handleDocCheckboxToggle(checkbox) {
    const schemeId = checkbox.getAttribute('data-scheme-id');
    const docName = checkbox.getAttribute('data-doc-name');

    if (!state.checkedDocs[schemeId]) {
      state.checkedDocs[schemeId] = [];
    }

    if (checkbox.checked) {
      if (!state.checkedDocs[schemeId].includes(docName)) {
        state.checkedDocs[schemeId].push(docName);
      }
    } else {
      state.checkedDocs[schemeId] = state.checkedDocs[schemeId].filter(d => d !== docName);
    }

    localStorage.setItem('schemesathi_checked_docs', JSON.stringify(state.checkedDocs));
    renderChecklist(schemeId);
  }

  // --------------------------------------------------------------------------
  // Saved Schemes (Feature 11)
  // --------------------------------------------------------------------------
  function toggleSaveScheme(schemeId) {
    const idx = state.savedSchemeIds.indexOf(schemeId);
    if (idx > -1) {
      state.savedSchemeIds.splice(idx, 1);
    } else {
      state.savedSchemeIds.push(schemeId);
    }

    localStorage.setItem('schemesathi_saved_ids', JSON.stringify(state.savedSchemeIds));
    renderSavedBadge();
    renderSchemes(state.schemes);
    renderSavedSchemes();

    // Update modal save button if open
    if (DOM.modalSaveBtn) {
      const isSaved = state.savedSchemeIds.includes(schemeId);
      const dict = I18N[state.currentLang] || I18N.en;
      DOM.modalSaveBtn.textContent = isSaved ? `❤️ ${dict.saved_scheme}` : `🔖 ${dict.btn_save_scheme}`;
    }
  }

  function renderSavedBadge() {
    if (DOM.savedCount) {
      DOM.savedCount.textContent = state.savedSchemeIds.length;
    }
  }

  function renderSavedSchemes() {
    if (!DOM.savedSchemesGrid) return;

    const saved = state.schemes.filter(s => state.savedSchemeIds.includes(s.id));

    if (saved.length === 0) {
      if (DOM.savedEmpty) DOM.savedEmpty.hidden = false;
      DOM.savedSchemesGrid.innerHTML = '';
      return;
    }

    if (DOM.savedEmpty) DOM.savedEmpty.hidden = true;
    DOM.savedSchemesGrid.innerHTML = '';
    const dict = I18N[state.currentLang] || I18N.en;

    saved.forEach(scheme => {
      const card = document.createElement('article');
      card.className = 'scheme-card';
      card.innerHTML = `
        <div class="card-top-meta">
          <span class="badge-level central">${escapeHtml(scheme.government_level || 'Central')}</span>
          <button class="btn-bookmark saved" data-scheme-id="${scheme.id}" title="Remove Bookmark">
            ❤️
          </button>
        </div>
        <h3 class="scheme-card-title">${escapeHtml(scheme.name)}</h3>
        <p class="scheme-department">${escapeHtml(scheme.department || '')}</p>
        <p class="scheme-desc">${escapeHtml(scheme.description || '')}</p>
        <div class="card-footer">
          <button class="btn btn-primary btn-sm btn-view-scheme" data-scheme-id="${scheme.id}">
            ${dict.view_details}
          </button>
          <a href="${scheme.official_url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            Official Portal ↗
          </a>
        </div>
      `;
      DOM.savedSchemesGrid.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // Scheme Details Modal (Feature 9 & 10)
  // --------------------------------------------------------------------------
  async function openSchemeModal(schemeId) {
    let scheme = state.schemes.find(s => s.id === schemeId);

    if (!scheme) {
      try {
        const res = await apiFetch(`/api/schemes/${schemeId}`);
        if (res && res.data) {
          scheme = res.data;
        }
      } catch (err) {
        alert('Could not retrieve full scheme details.');
        return;
      }
    }

    if (!scheme) return;

    DOM.modalSchemeHeading.textContent = scheme.name;
    DOM.modalSchemeDept.textContent = scheme.department || 'Government of India';
    DOM.modalSchemeLevel.textContent = scheme.government_level || 'Central';
    DOM.modalSchemeState.textContent = scheme.state_code === 'ALL' ? 'All India' : scheme.state_code;
    DOM.modalSchemeDesc.textContent = scheme.description || 'No description available.';

    // Benefits
    DOM.modalSchemeBenefits.innerHTML = `
      <p><strong>Benefits Summary:</strong> ${escapeHtml(scheme.benefits?.summary || 'Standard benefits apply.')}</p>
      ${scheme.benefits?.mode ? `<p style="margin-top:0.375rem;"><strong>Disbursement Mode:</strong> ${escapeHtml(scheme.benefits.mode)}</p>` : ''}
    `;

    // Eligibility Rules
    const rules = scheme.eligibility_rules || {};
    DOM.modalSchemeEligibility.innerHTML = `
      <p><strong>Eligibility Guidelines:</strong> ${escapeHtml(rules.notes || 'Please verify exact rules on the official portal.')}</p>
      <ul style="margin-top:0.5rem; padding-left:1.25rem;">
        ${rules.min_age !== null && rules.min_age !== undefined ? `<li>Age requirement: Minimum ${rules.min_age} years</li>` : ''}
        ${rules.max_income !== null && rules.max_income !== undefined ? `<li>Annual family income ceiling: ₹${rules.max_income.toLocaleString()}</li>` : ''}
        ${rules.farmer_only ? `<li>Restricted exclusively to landholding farmer families</li>` : ''}
        ${rules.student_only ? `<li>Applicant must be an actively enrolled student</li>` : ''}
        ${rules.gender ? `<li>Designated for: ${rules.gender} applicants</li>` : ''}
      </ul>
    `;

    // Application Steps
    DOM.modalSchemeSteps.innerHTML = '';
    const steps = scheme.application_steps || [];
    if (steps.length > 0) {
      steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        DOM.modalSchemeSteps.appendChild(li);
      });
    } else {
      DOM.modalSchemeSteps.innerHTML = '<li>Visit the official government scheme portal to begin application.</li>';
    }

    // Required Documents
    DOM.modalSchemeDocs.innerHTML = '';
    const docs = scheme.required_documents || [];
    if (docs.length > 0) {
      docs.forEach(doc => {
        const row = document.createElement('div');
        row.style.fontSize = '0.875rem';
        row.style.color = '#334155';
        row.innerHTML = `📄 <strong>${escapeHtml(doc)}</strong>`;
        DOM.modalSchemeDocs.appendChild(row);
      });
    } else {
      DOM.modalSchemeDocs.innerHTML = '<p class="text-muted">Standard KYC identification and proof of residence required.</p>';
    }

    DOM.modalSchemeVerified.textContent = scheme.last_verified_at || 'Recently Verified';
    DOM.modalOfficialLink.href = scheme.official_url;

    // Save button state
    const isSaved = state.savedSchemeIds.includes(scheme.id);
    const dict = I18N[state.currentLang] || I18N.en;
    DOM.modalSaveBtn.textContent = isSaved ? `❤️ ${dict.saved_scheme}` : `🔖 ${dict.btn_save_scheme}`;
    DOM.modalSaveBtn.setAttribute('data-scheme-id', scheme.id);

    DOM.schemeModal.hidden = false;
  }

  function closeSchemeModal() {
    DOM.schemeModal.hidden = true;
  }

  // --------------------------------------------------------------------------
  // User Preferences (Feature 12)
  // --------------------------------------------------------------------------
  function openPrefsModal() {
    DOM.prefLanguage.value = state.preferences.lang || state.currentLang;
    DOM.prefState.value = state.preferences.state || 'ALL';
    DOM.prefBeneficiary.value = state.preferences.beneficiary || '';
    DOM.prefsModal.hidden = false;
  }

  function closePrefsModal() {
    DOM.prefsModal.hidden = true;
  }

  function saveUserPreferences() {
    state.preferences = {
      lang: DOM.prefLanguage.value,
      state: DOM.prefState.value,
      beneficiary: DOM.prefBeneficiary.value
    };
    localStorage.setItem('schemesathi_user_prefs', JSON.stringify(state.preferences));

    applyLanguage(state.preferences.lang);

    if (DOM.filterState) DOM.filterState.value = state.preferences.state;
    if (DOM.elState) DOM.elState.value = state.preferences.state;
    state.activeBeneficiaryFilter = state.preferences.beneficiary;
    highlightBeneficiaryChip(state.preferences.beneficiary);

    closePrefsModal();
    fetchSchemes();
  }

  // --------------------------------------------------------------------------
  // Event Listeners Binding
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    // Language Switcher
    if (DOM.langSelect) {
      DOM.langSelect.addEventListener('change', (e) => applyLanguage(e.target.value));
    }

    // Mobile Menu Toggle
    if (DOM.mobileToggle && DOM.mobileDrawer) {
      DOM.mobileToggle.addEventListener('click', () => {
        const isHidden = DOM.mobileDrawer.hidden;
        DOM.mobileDrawer.hidden = !isHidden;
        DOM.mobileToggle.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      });
      DOM.mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          DOM.mobileDrawer.hidden = true;
          DOM.mobileToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Hero Search Form
    if (DOM.heroSearchForm) {
      DOM.heroSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = DOM.heroSearchInput.value.trim();
        if (DOM.filterSearch) DOM.filterSearch.value = q;
        fetchSchemes();
        const exploreSec = document.getElementById('explore');
        if (exploreSec) exploreSec.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Beneficiary Filter Chips
    if (DOM.beneficiaryChips) {
      DOM.beneficiaryChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        state.activeBeneficiaryFilter = chip.getAttribute('data-beneficiary') || '';
        highlightBeneficiaryChip(state.activeBeneficiaryFilter);
        fetchSchemes();
      });
    }

    // Filter Buttons
    if (DOM.btnApplyFilters) {
      DOM.btnApplyFilters.addEventListener('click', fetchSchemes);
    }
    if (DOM.btnResetFilters) {
      DOM.btnResetFilters.addEventListener('click', () => {
        if (DOM.filterSearch) DOM.filterSearch.value = '';
        if (DOM.filterCategory) DOM.filterCategory.value = '';
        if (DOM.filterState) DOM.filterState.value = 'ALL';
        if (DOM.filterLevel) DOM.filterLevel.value = '';
        state.activeBeneficiaryFilter = '';
        highlightBeneficiaryChip('');
        fetchSchemes();
      });
    }
    if (DOM.btnRetrySchemes) {
      DOM.btnRetrySchemes.addEventListener('click', fetchSchemes);
    }

    // Eligibility Form
    if (DOM.elForm) {
      DOM.elForm.addEventListener('submit', handleEligibilitySubmit);
    }
    if (DOM.btnEvalReset) {
      DOM.btnEvalReset.addEventListener('click', () => {
        DOM.elForm.reset();
        DOM.elResults.hidden = true;
      });
    }

    // AI Assistant Chat
    if (DOM.chatForm) {
      DOM.chatForm.addEventListener('submit', handleChatSubmit);
    }
    document.querySelectorAll('.chip-prompt').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-query');
        if (DOM.chatInput) DOM.chatInput.value = q;
        if (DOM.chatForm) DOM.chatForm.dispatchEvent(new Event('submit'));
      });
    });

    // Document Checklist Scheme Select
    if (DOM.checklistSchemeSelect) {
      DOM.checklistSchemeSelect.addEventListener('change', (e) => {
        renderChecklist(e.target.value);
      });
    }

    // Document Checklist Checkbox Toggle Delegation
    if (DOM.checklistContent) {
      DOM.checklistContent.addEventListener('change', (e) => {
        if (e.target.classList.contains('doc-checkbox')) {
          handleDocCheckboxToggle(e.target);
        }
      });
    }

    // Bookmark & Details Delegation on Schemes Grid
    document.addEventListener('click', (e) => {
      // Bookmark Click
      const bookmarkBtn = e.target.closest('.btn-bookmark');
      if (bookmarkBtn) {
        const id = bookmarkBtn.getAttribute('data-scheme-id');
        if (id) toggleSaveScheme(id);
        return;
      }

      // View Details Click
      const viewBtn = e.target.closest('.btn-view-scheme');
      if (viewBtn) {
        const id = viewBtn.getAttribute('data-scheme-id');
        if (id) openSchemeModal(id);
        return;
      }
    });

    // Clear Saved Schemes
    if (DOM.btnClearSaved) {
      DOM.btnClearSaved.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your saved schemes?')) {
          state.savedSchemeIds = [];
          localStorage.removeItem('schemesathi_saved_ids');
          renderSavedBadge();
          renderSchemes(state.schemes);
          renderSavedSchemes();
        }
      });
    }

    // Scheme Modal Close
    if (DOM.schemeModalClose) {
      DOM.schemeModalClose.addEventListener('click', closeSchemeModal);
    }
    if (DOM.schemeModal) {
      DOM.schemeModal.addEventListener('click', (e) => {
        if (e.target === DOM.schemeModal) closeSchemeModal();
      });
    }
    if (DOM.modalSaveBtn) {
      DOM.modalSaveBtn.addEventListener('click', () => {
        const id = DOM.modalSaveBtn.getAttribute('data-scheme-id');
        if (id) toggleSaveScheme(id);
      });
    }

    // Preferences Modal
    if (DOM.themePrefsBtn) {
      DOM.themePrefsBtn.addEventListener('click', openPrefsModal);
    }
    if (DOM.prefsModalClose) {
      DOM.prefsModalClose.addEventListener('click', closePrefsModal);
    }
    if (DOM.prefsModal) {
      DOM.prefsModal.addEventListener('click', (e) => {
        if (e.target === DOM.prefsModal) closePrefsModal();
      });
    }
    if (DOM.btnSavePrefs) {
      DOM.btnSavePrefs.addEventListener('click', saveUserPreferences);
    }

    // Keyboard ESC for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeSchemeModal();
        closePrefsModal();
      }
    });
  }

  // Security Helper
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
