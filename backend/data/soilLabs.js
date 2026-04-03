// Mock data for soil testing labs
const soilTestingLabs = {
  "maharashtra": [
    {
      id: 1,
      name: "ICAR-IISR Soil Science Lab",
      location: "Pune",
      address: "Dr. RAJENDRA MASHELKAR ROAD, PUNE - 411005",
      phone: "020-25951233",
      email: "iisr@icar.gov.in",
      distance: 5,
      testCost: 200,
      turnaround: "3-5 days"
    },
    {
      id: 2,
      name: "Soil Testing Lab, Dept. of Soil Science",
      location: "Kolhapur",
      address: "Mahatma Phule Krishi Vidyapeeth, Rahuri",
      phone: "02425-258340",
      email: "soil@mpkv.ac.in",
      distance: 45,
      testCost: 150,
      turnaround: "5-7 days"
    }
  ],
  "uttar_pradesh": [
    {
      id: 3,
      name: "Soil Testing Lab, GBPUAT",
      location: "Pantnagar",
      address: "G.B. Pant University of Agriculture & Technology, Pantnagar - 263145",
      phone: "05944-233555",
      email: "soil@gbpuat.ac.in",
      distance: 15,
      testCost: 180,
      turnaround: "4-6 days"
    },
    {
      id: 4,
      name: "Central Soil Test Lab",
      location: "Lucknow",
      address: "ICAR-Indian Institute of Soil Science, Lucknow",
      phone: "0522-2842206",
      email: "iiss@icar.gov.in",
      distance: 60,
      testCost: 220,
      turnaround: "3-5 days"
    }
  ],
  "karnataka": [
    {
      id: 5,
      name: "UAS Soil Testing Lab",
      location: "Bangalore",
      address: "University of Agricultural Sciences, Bangalore",
      phone: "080-23441000",
      email: "uasb@uasbanglore.edu.in",
      distance: 10,
      testCost: 190,
      turnaround: "4-6 days"
    }
  ]
};

module.exports = soilTestingLabs;
