// Mock data for soil testing labs
const soilTestingLabs = {
  "maharashtra": [
    {
      "id": 1,
      "name": "ICAR-IISR Soil Science Lab",
      "location": "Pune",
      "address": "Dr. RAJENDRA MASHELKAR ROAD, PUNE - 411005",
      "phone": "020-25951233",
      "email": "iisr@icar.gov.in",
      "distance": 5,
      "testCost": 200,
      "turnaround": "3-5 days"
    },
    {
      "id": 2,
      "name": "Soil Testing Lab, Dept. of Soil Science",
      "location": "Kolhapur",
      "address": "Mahatma Phule Krishi Vidyapeeth, Rahuri",
      "phone": "02425-258340",
      "email": "soil@mpkv.ac.in",
      "distance": 45,
      "testCost": 150,
      "turnaround": "5-7 days"
    },
    {
      "id": 15,
      "name": "State Agriculture Lab",
      "location": "Nagpur",
      "address": "District Agriculture Office, Nagpur",
      "phone": "0987-2226700",
      "email": "soil_test@maharashtra.gov.in",
      "distance": 53,
      "testCost": 153,
      "turnaround": "4-6 days"
    },
    {
      "id": 16,
      "name": "KVK Soil Health Center",
      "location": "Nashik",
      "address": "KVK Complex, Nashik",
      "phone": "0766-2545457",
      "email": "kvk_soil@maharashtra.gov.in",
      "distance": 37,
      "testCost": 92,
      "turnaround": "3-5 days"
    }
  ],
  "uttar_pradesh": [
    {
      "id": 3,
      "name": "Soil Testing Lab, GBPUAT",
      "location": "Pantnagar",
      "address": "G.B. Pant University of Agriculture & Technology, Pantnagar - 263145",
      "phone": "05944-233555",
      "email": "soil@gbpuat.ac.in",
      "distance": 15,
      "testCost": 180,
      "turnaround": "4-6 days"
    },
    {
      "id": 4,
      "name": "Central Soil Test Lab",
      "location": "Lucknow",
      "address": "ICAR-Indian Institute of Soil Science, Lucknow",
      "phone": "0522-2842206",
      "email": "iiss@icar.gov.in",
      "distance": 60,
      "testCost": 220,
      "turnaround": "3-5 days"
    },
    {
      "id": 17,
      "name": "State Agriculture Lab",
      "location": "Kanpur",
      "address": "District Agriculture Office, Kanpur",
      "phone": "0494-2376142",
      "email": "soil_test@uttarpradesh.gov.in",
      "distance": 21,
      "testCost": 104,
      "turnaround": "4-6 days"
    },
    {
      "id": 18,
      "name": "KVK Soil Health Center",
      "location": "Varanasi",
      "address": "KVK Complex, Varanasi",
      "phone": "0670-2577833",
      "email": "kvk_soil@uttarpradesh.gov.in",
      "distance": 64,
      "testCost": 106,
      "turnaround": "3-5 days"
    }
  ],
  "karnataka": [
    {
      "id": 5,
      "name": "UAS Soil Testing Lab",
      "location": "Bangalore",
      "address": "University of Agricultural Sciences, Bangalore",
      "phone": "080-23441000",
      "email": "uasb@uasbanglore.edu.in",
      "distance": 10,
      "testCost": 190,
      "turnaround": "4-6 days"
    },
    {
      "id": 19,
      "name": "State Agriculture Lab",
      "location": "Mysore",
      "address": "District Agriculture Office, Mysore",
      "phone": "0465-2411875",
      "email": "soil_test@karnataka.gov.in",
      "distance": 37,
      "testCost": 173,
      "turnaround": "4-6 days"
    },
    {
      "id": 20,
      "name": "KVK Soil Health Center",
      "location": "Hubli",
      "address": "KVK Complex, Hubli",
      "phone": "0848-2531096",
      "email": "kvk_soil@karnataka.gov.in",
      "distance": 40,
      "testCost": 145,
      "turnaround": "3-5 days"
    }
  ],
  "punjab": [
    {
      "id": 6,
      "name": "PAU Central Soil Testing Laboratory",
      "location": "Ludhiana",
      "address": "Punjab Agricultural University, Ludhiana - 141004",
      "phone": "0161-2401960",
      "email": "soil@pau.edu",
      "distance": 8,
      "testCost": 150,
      "turnaround": "3-4 days"
    },
    {
      "id": 7,
      "name": "Punjab State Soil Health Center",
      "location": "Jalandhar",
      "address": "Agriculture Complex, GT Road, Jalandhar",
      "phone": "0181-2223450",
      "email": "shc.jalandhar@punjab.gov.in",
      "distance": 35,
      "testCost": 100,
      "turnaround": "5-6 days"
    },
    {
      "id": 21,
      "name": "State Agriculture Lab",
      "location": "Amritsar",
      "address": "District Agriculture Office, Amritsar",
      "phone": "0951-2808936",
      "email": "soil_test@punjab.gov.in",
      "distance": 44,
      "testCost": 128,
      "turnaround": "4-6 days"
    },
    {
      "id": 22,
      "name": "KVK Soil Health Center",
      "location": "Patiala",
      "address": "KVK Complex, Patiala",
      "phone": "0317-2808078",
      "email": "kvk_soil@punjab.gov.in",
      "distance": 45,
      "testCost": 121,
      "turnaround": "3-5 days"
    }
  ],
  "haryana": [
    {
      "id": 8,
      "name": "CCSHAU Soil Testing Lab",
      "location": "Hisar",
      "address": "Chaudhary Charan Singh Haryana Agricultural University, Hisar",
      "phone": "01662-231171",
      "email": "soilhisar@hau.ac.in",
      "distance": 12,
      "testCost": 120,
      "turnaround": "3-5 days"
    },
    {
      "id": 23,
      "name": "State Agriculture Lab",
      "location": "Rohtak",
      "address": "District Agriculture Office, Rohtak",
      "phone": "0508-2191985",
      "email": "soil_test@haryana.gov.in",
      "distance": 51,
      "testCost": 136,
      "turnaround": "4-6 days"
    },
    {
      "id": 24,
      "name": "KVK Soil Health Center",
      "location": "Karnal",
      "address": "KVK Complex, Karnal",
      "phone": "0560-2465102",
      "email": "kvk_soil@haryana.gov.in",
      "distance": 28,
      "testCost": 179,
      "turnaround": "3-5 days"
    }
  ],
  "gujarat": [
    {
      "id": 9,
      "name": "Anand Agricultural University Testing Lab",
      "location": "Anand",
      "address": "BORSAD Road, Anand, Gujarat - 388110",
      "phone": "02692-261310",
      "email": "soil.dept@aau.in",
      "distance": 25,
      "testCost": 180,
      "turnaround": "4-7 days"
    },
    {
      "id": 25,
      "name": "State Agriculture Lab",
      "location": "Ahmedabad",
      "address": "District Agriculture Office, Ahmedabad",
      "phone": "0776-2440422",
      "email": "soil_test@gujarat.gov.in",
      "distance": 28,
      "testCost": 136,
      "turnaround": "4-6 days"
    },
    {
      "id": 26,
      "name": "KVK Soil Health Center",
      "location": "Surat",
      "address": "KVK Complex, Surat",
      "phone": "0737-2185948",
      "email": "kvk_soil@gujarat.gov.in",
      "distance": 38,
      "testCost": 132,
      "turnaround": "3-5 days"
    }
  ],
  "madhya_pradesh": [
    {
      "id": 10,
      "name": "JNKVV Soil Science Department",
      "location": "Jabalpur",
      "address": "Jawaharlal Nehru Krishi Vishwa Vidyalaya, Krishinagar",
      "phone": "0761-2681773",
      "email": "soil.jnkvv@mp.gov.in",
      "distance": 20,
      "testCost": 170,
      "turnaround": "5-6 days"
    },
    {
      "id": 27,
      "name": "State Agriculture Lab",
      "location": "Indore",
      "address": "District Agriculture Office, Indore",
      "phone": "0708-2392309",
      "email": "soil_test@madhyapradesh.gov.in",
      "distance": 20,
      "testCost": 120,
      "turnaround": "4-6 days"
    },
    {
      "id": 28,
      "name": "KVK Soil Health Center",
      "location": "Bhopal",
      "address": "KVK Complex, Bhopal",
      "phone": "0909-2327677",
      "email": "kvk_soil@madhyapradesh.gov.in",
      "distance": 59,
      "testCost": 87,
      "turnaround": "3-5 days"
    }
  ],
  "rajasthan": [
    {
      "id": 11,
      "name": "RARI Soil Testing Lab",
      "location": "Jaipur",
      "address": "Rajasthan Agricultural Research Institute, Durgapura",
      "phone": "0141-2550229",
      "email": "raridurgapura@yahoo.com",
      "distance": 18,
      "testCost": 130,
      "turnaround": "3-5 days"
    },
    {
      "id": 29,
      "name": "State Agriculture Lab",
      "location": "Jodhpur",
      "address": "District Agriculture Office, Jodhpur",
      "phone": "0721-2226335",
      "email": "soil_test@rajasthan.gov.in",
      "distance": 53,
      "testCost": 198,
      "turnaround": "4-6 days"
    },
    {
      "id": 30,
      "name": "KVK Soil Health Center",
      "location": "Udaipur",
      "address": "KVK Complex, Udaipur",
      "phone": "0405-2811684",
      "email": "kvk_soil@rajasthan.gov.in",
      "distance": 56,
      "testCost": 168,
      "turnaround": "3-5 days"
    }
  ],
  "tamil_nadu": [
    {
      "id": 12,
      "name": "TNAU Soil Lab",
      "location": "Coimbatore",
      "address": "Tamil Nadu Agricultural University, Coimbatore",
      "phone": "0422-6611228",
      "email": "soil@tnau.ac.in",
      "distance": 15,
      "testCost": 210,
      "turnaround": "4-5 days"
    },
    {
      "id": 31,
      "name": "State Agriculture Lab",
      "location": "Madurai",
      "address": "District Agriculture Office, Madurai",
      "phone": "0365-2184105",
      "email": "soil_test@tamilnadu.gov.in",
      "distance": 51,
      "testCost": 168,
      "turnaround": "4-6 days"
    },
    {
      "id": 32,
      "name": "KVK Soil Health Center",
      "location": "Trichy",
      "address": "KVK Complex, Trichy",
      "phone": "0604-2891091",
      "email": "kvk_soil@tamilnadu.gov.in",
      "distance": 50,
      "testCost": 116,
      "turnaround": "3-5 days"
    }
  ],
  "andhra_pradesh": [
    {
      "id": 13,
      "name": "ANGRAU Testing Center",
      "location": "Guntur",
      "address": "Acharya N.G. Ranga Agricultural University",
      "phone": "0863-2340112",
      "email": "angrau_soil@ap.gov.in",
      "distance": 30,
      "testCost": 190,
      "turnaround": "4-7 days"
    },
    {
      "id": 33,
      "name": "State Agriculture Lab",
      "location": "Visakhapatnam",
      "address": "District Agriculture Office, Visakhapatnam",
      "phone": "0481-2879219",
      "email": "soil_test@andhrapradesh.gov.in",
      "distance": 20,
      "testCost": 164,
      "turnaround": "4-6 days"
    },
    {
      "id": 34,
      "name": "KVK Soil Health Center",
      "location": "Vijayawada",
      "address": "KVK Complex, Vijayawada",
      "phone": "0638-2312693",
      "email": "kvk_soil@andhrapradesh.gov.in",
      "distance": 33,
      "testCost": 135,
      "turnaround": "3-5 days"
    }
  ],
  "west_bengal": [
    {
      "id": 14,
      "name": "BCKV Soil Health Lab",
      "location": "Kalyani",
      "address": "Bidhan Chandra Krishi Viswavidyalaya, Mohanpur",
      "phone": "03473-222269",
      "email": "soil.bckv@wb.gov.in",
      "distance": 40,
      "testCost": 160,
      "turnaround": "5-8 days"
    },
    {
      "id": 35,
      "name": "State Agriculture Lab",
      "location": "Kharagpur",
      "address": "District Agriculture Office, Kharagpur",
      "phone": "0480-2863367",
      "email": "soil_test@westbengal.gov.in",
      "distance": 22,
      "testCost": 138,
      "turnaround": "4-6 days"
    },
    {
      "id": 36,
      "name": "KVK Soil Health Center",
      "location": "Siliguri",
      "address": "KVK Complex, Siliguri",
      "phone": "0358-2224971",
      "email": "kvk_soil@westbengal.gov.in",
      "distance": 30,
      "testCost": 177,
      "turnaround": "3-5 days"
    }
  ]
};

module.exports = soilTestingLabs;
