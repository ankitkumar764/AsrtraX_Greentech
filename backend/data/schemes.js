// Government Schemes data with multilingual support (en, hi, gu)
const governmentSchemes = [
  {
    id: 1,
    name: {
      en: "PM Fasal Bima Yojana",
      hi: "पीएम फसल बीमा योजना",
      gu: "PM ફસલ વીમા યોજના"
    },
    description: {
      en: "Provides insurance coverage for farmers against crop losses",
      hi: "फसल नुकसान के लिए किसानों को बीमा कवरेज प्रदान करती है",
      gu: "પાક નુકસાન સામે ખેડૂતોને વીમો પ્રદાન કરે છે"
    },
    category: "Insurance",
    categoryLabel: {
      en: "Insurance",
      hi: "बीमा",
      gu: "વીમો"
    },
    eligibility: {
      en: "All farmers growing notified crops",
      hi: "अधिसूचित फसल उगाने वाले सभी किसान",
      gu: "સૂચિત પાક ઉગાડતા તમામ ખેડૂતો"
    },
    premium: {
      en: "2% of SI (Kharif), 1.5% (Rabi)",
      hi: "2% (खरीफ), 1.5% (रबी)",
      gu: "2% (ખરીફ), 1.5% (રવી)"
    },
    benefits: {
      en: "Coverage against natural disasters, pest attacks, and diseases",
      hi: "प्राकृतिक आपदाओं, कीट हमलों और बीमारियों से सुरक्षा",
      gu: "કુદરતી આફતો, જીવાતો અને રોગો સામે રક્ષણ"
    },
    link: "https://pmfby.gov.in",
    state: { en: "All India", hi: "पूरे भारत", gu: "સમગ્ર ભારત" }
  },
  {
    id: 2,
    name: {
      en: "Pradhan Mantri Krishi Sinchayee Yojana",
      hi: "प्रधान मंत्री कृषि सिंचाई योजना",
      gu: "પ્રધાન મંત્રી કૃષિ સિંચાઈ યોજના"
    },
    description: {
      en: "Focuses on irrigation infrastructure development",
      hi: "सिंचाई अवसंरचना विकास पर ध्यान केंद्रित करती है",
      gu: "સિંચાઈ ઈન્ફ્રાસ્ટ્રક્ચર વિકાસ પર ધ્યાન આપે છે"
    },
    category: "Irrigation",
    categoryLabel: {
      en: "Irrigation",
      hi: "सिंचाई",
      gu: "સિંચાઈ"
    },
    eligibility: {
      en: "Farmers with agricultural land",
      hi: "कृषि भूमि वाले किसान",
      gu: "ખેતીની જમીન ધરાવતા ખેડૂતો"
    },
    premium: {
      en: "Subsidy up to 55%",
      hi: "55% तक सब्सिडी",
      gu: "55% સુધી સબ્સિડી"
    },
    benefits: {
      en: "Improved irrigation, reduced water usage, higher yields",
      hi: "बेहतर सिंचाई, कम पानी उपयोग, अधिक पैदावार",
      gu: "સુધારેલ સિંચાઈ, ઓછો પાણી વપરાશ, વધુ ઉપજ"
    },
    link: "#",
    state: { en: "All India", hi: "पूरे भारत", gu: "સमગ્ર ભારत" }
  },
  {
    id: 3,
    name: {
      en: "Soil Health Card Scheme",
      hi: "मृदा स्वास्थ्य कार्ड योजना",
      gu: "માટી સ્વાસ્થ્ય કાર્ડ યોજना"
    },
    description: {
      en: "Free soil testing and nutrient management cards",
      hi: "निःशुल्क मिट्टी परीक्षण और पोषक तत्व प्रबंधन कार्ड",
      gu: "મફત માટી પરીક્ષણ અને પોષક તત્વ વ્યવસ્થાपन કાર્ડ"
    },
    category: "Testing",
    categoryLabel: {
      en: "Testing",
      hi: "परीक्षण",
      gu: "પरीक्षण"
    },
    eligibility: {
      en: "All farmers",
      hi: "सभी किसान",
      gu: "તmama ખেडૂtoો"
    },
    premium: {
      en: "Free",
      hi: "निःशुल्क",
      gu: "Mफت"
    },
    benefits: {
      en: "Detailed soil analysis, nutrient recommendations, cost savings",
      hi: "विस्तृत मिट्टी विश्लेषण, पोषक तत्व सिफारिशें, खर्च बचत",
      gu: "Vie।strit mati vishleSHan, poShak tatva bhalamano, kharch bachhat"
    },
    link: "#",
    state: { en: "All India", hi: "पूरे भारत", gu: "Samagra bhaarat" }
  },
  {
    id: 4,
    name: {
      en: "National Agriculture Market (eNAM)",
      hi: "राष्ट्रीय कृषि बाजार (ई-नाम)",
      gu: "રાષ્ट્રીય કૃષi بازار (eNAM)"
    },
    description: {
      en: "Online trading platform for agricultural commodities",
      hi: "कृषि जिंसों के लिए ऑनलाइन व्यापार मंच",
      gu: "ks्HELni jinso mAtE onaLine vypaar manch"
    },
    category: "Marketing",
    categoryLabel: {
      en: "Marketing",
      hi: "विपणन",
      gu: "mArketiNg"
    },
    eligibility: {
      en: "Registered farmers and traders",
      hi: "पंजीकृत किसान और व्यापारी",
      gu: "panoramaIkrit kheDAUton anE vyaApAriyon"
    },
    premium: {
      en: "Registration free",
      hi: "पंजीकरण निःशुल्क",
      gu: "PanoramaIkaran mafat"
    },
    benefits: {
      en: "Better prices, transparent pricing, expanded market access",
      hi: "बेहतर दाम, पारदर्शी मूल्य निर्धारण, बाजार तक विस्तृत पहुंच",
      gu: "sAru bhAv, pAradarShi kiMMat, bazAr paho~nch"
    },
    link: "https://enam.gov.in",
    state: { en: "All India", hi: "पूरे भारत", gu: "Samagra bhArat" }
  },
  {
    id: 5,
    name: {
      en: "Paramparagat Krishi Vikas Yojana",
      hi: "परंपरागत कृषि विकास योजना",
      gu: "ParamparAgat kRuSHi vikAs yojana"
    },
    description: {
      en: "Organic farming promotion and certification support",
      hi: "जैविक खेती को बढ़ावा और प्रमाणीकरण समर्थन",
      gu: "JaivIk kheLi protsAhan anE prAmaNIkaraN sahay"
    },
    category: "Organic Farming",
    categoryLabel: {
      en: "Organic Farming",
      hi: "जैव खेती",
      gu: "JaivIk khaletI"
    },
    eligibility: {
      en: "Farmers willing to adopt organic farming",
      hi: "जैविक खेती अपनाने के इच्छुक किसान",
      gu: "JaivIk khelt apnAvA taiYAr kheDAUton"
    },
    premium: {
      en: "Subsidy ₹50,000/hectare for 3 years",
      hi: "₹50,000/हेक्टेयर 3 साल के लिए सब्सिडी",
      gu: "₹50,000/hectare 3 varSH mAtE subsidy"
    },
    benefits: {
      en: "Organic certification, premium prices, sustainability",
      hi: "जैविक प्रमाणपत्र, अच्छे दाम, टिकाऊ खेती",
      gu: "JaivIk prAmaN, sAru bhAv, tikAU khelI"
    },
    link: "#",
    state: { en: "All India", hi: "पूरे भारत", gu: "Samagra bhArat" }
  },
  {
    id: 6,
    name: {
      en: "Pradhan Mantri Kisan Samman Nidhi",
      hi: "प्रधान मंत्री किसान सम्मान निधि",
      gu: "Pradhan Mantri kisan sammAn nidhi"
    },
    description: {
      en: "Direct income support to farmers",
      hi: "किसानों को सीधी आय सहायता",
      gu: "kheDAUton nE SAdi Aavak sahay"
    },
    category: "Income Support",
    categoryLabel: {
      en: "Income Support",
      hi: "आय समर्थन",
      gu: "Aavak sahay"
    },
    eligibility: {
      en: "All farmers holding cultivable land",
      hi: "कृषि योग्य भूमि रखने वाले सभी किसान",
      gu: "kheDA. krushiyogya jamin dharAvtA tamAm kheDAUtton"
    },
    premium: {
      en: "₹6000/year (₹2000 per instalment)",
      hi: "₹6000/साल (₹2000 प्रति किस्त)",
      gu: "₹6000/varSH (₹2000 pratyEk haptE)"
    },
    benefits: {
      en: "Direct cash transfer, financial stability",
      hi: "सीधा नकद हस्तांतरण, आर्थिक स्थिरता",
      gu: "SAdo rokad transfer, aarthik sthiraTa"
    },
    link: "https://pmkisan.gov.in",
    state: { en: "All India", hi: "पूरे भारत", gu: "Samagra bhArat" }
  }
];

module.exports = governmentSchemes;
