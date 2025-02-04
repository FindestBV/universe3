import LineChart from "@/components/common/utilities/line-chart";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

import { useEffect, useState } from "react";

const topics = [
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2000",
    count: 1114,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2001",
    count: 2360,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2002",
    count: 4266,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2003",
    count: 3366,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2004",
    count: 3426,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2005",
    count: 4198,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2006",
    count: 4633,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2007",
    count: 4708,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2008",
    count: 5191,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2009",
    count: 5258,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2010",
    count: 5733,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2011",
    count: 6035,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2012",
    count: 6059,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2013",
    count: 6230,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2014",
    count: 5996,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2015",
    count: 6171,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2016",
    count: 5760,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2017",
    count: 6249,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2018",
    count: 7156,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2019",
    count: 8765,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2020",
    count: 9046,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2021",
    count: 9731,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2022",
    count: 10581,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2023",
    count: 12669,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2024",
    count: 16630,
  },
  {
    topic: "83898fc7-7996-4a8e-b486-35a5e3bc2122",
    name: "Fabric Defect Detection in Industrial Applications",
    year: "2025",
    count: 370,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2000",
    count: 1586,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2001",
    count: 2981,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2002",
    count: 4704,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2003",
    count: 4339,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2004",
    count: 4260,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2005",
    count: 4918,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2006",
    count: 5425,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2007",
    count: 5402,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2008",
    count: 5937,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2009",
    count: 5923,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2010",
    count: 6152,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2011",
    count: 6782,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2012",
    count: 6896,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2013",
    count: 7318,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2014",
    count: 7628,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2015",
    count: 7599,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2016",
    count: 7314,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2017",
    count: 7515,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2018",
    count: 7744,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2019",
    count: 8336,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2020",
    count: 8029,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2021",
    count: 8199,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2022",
    count: 8101,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2023",
    count: 9110,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2024",
    count: 9247,
  },
  {
    topic: "6d8b9c61-f48c-4bff-8b18-90218981ab48",
    name: "Non-Destructive Techniques Based on Eddy Current Testing",
    year: "2025",
    count: 196,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2000",
    count: 493,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2001",
    count: 1143,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2002",
    count: 1403,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2003",
    count: 1687,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2004",
    count: 1810,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2005",
    count: 2148,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2006",
    count: 2520,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2007",
    count: 2717,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2008",
    count: 2809,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2009",
    count: 2833,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2010",
    count: 3282,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2011",
    count: 3994,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2012",
    count: 4136,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2013",
    count: 4263,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2014",
    count: 4636,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2015",
    count: 4560,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2016",
    count: 4457,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2017",
    count: 4424,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2018",
    count: 5271,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2019",
    count: 5480,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2020",
    count: 5275,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2021",
    count: 5275,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2022",
    count: 5245,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2023",
    count: 5297,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2024",
    count: 5964,
  },
  {
    topic: "f3dd5e8d-aa68-4929-ade7-0354cf08c7b0",
    name: "Advances in Friction Stir Welding and Processing",
    year: "2025",
    count: 157,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2000",
    count: 826,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2001",
    count: 1315,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2002",
    count: 1717,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2003",
    count: 1683,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2004",
    count: 1500,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2005",
    count: 1796,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2006",
    count: 1830,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2007",
    count: 1774,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2008",
    count: 2074,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2009",
    count: 1930,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2010",
    count: 2389,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2011",
    count: 2393,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2012",
    count: 2557,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2013",
    count: 2665,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2014",
    count: 2860,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2015",
    count: 3077,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2016",
    count: 3262,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2017",
    count: 3165,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2018",
    count: 3374,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2019",
    count: 3561,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2020",
    count: 3357,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2021",
    count: 3440,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2022",
    count: 3364,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2023",
    count: 3624,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2024",
    count: 3098,
  },
  {
    topic: "50f8db73-549f-4c2f-ae37-16ff3c09b6b4",
    name: "Applications of Infrared Thermography in Non-Destructive Testing",
    year: "2025",
    count: 76,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2000",
    count: 1073,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2001",
    count: 2386,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2002",
    count: 2877,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2003",
    count: 3164,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2004",
    count: 3368,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2005",
    count: 3695,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2006",
    count: 4306,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2007",
    count: 4453,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2008",
    count: 5040,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2009",
    count: 5040,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2010",
    count: 5687,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2011",
    count: 6571,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2012",
    count: 6315,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2013",
    count: 6626,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2014",
    count: 6671,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2015",
    count: 6837,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2016",
    count: 6395,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2017",
    count: 6527,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2018",
    count: 7427,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2019",
    count: 8029,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2020",
    count: 8323,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2021",
    count: 8206,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2022",
    count: 8635,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2023",
    count: 8752,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2024",
    count: 9814,
  },
  {
    topic: "477563a8-1490-4355-93b3-f8d821df794a",
    name: "Welding Techniques and Residual Stresses",
    year: "2025",
    count: 273,
  },
];

const CustomBlock = ({ node, updateAttributes }) => {
  const { dataUrl = "" } = node.attrs;
  const [chartData, setChartData] = useState([]);
  const [dataOutput, setDataOutput] = useState();
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (dataUrl) {
      console.log("Fetching data from:", dataUrl);

      fetch(dataUrl)
        .then((res) => res.json())
        .then((data) => {
          setTimeout(() => {
            console.log("remote data", data);
            setDataOutput(data);
            // Simulate transformed data (can modify as needed)
            setChartData(topics);

            setLoading(false); // Stop loading after timeout
          }, 3500); // 2.5s delay
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false); // Stop loading on error
        });
    }
  }, [dataUrl]);

  return (
    <NodeViewWrapper className="custom-graph-component max-width-full">
      {/* Editable content */}
      <NodeViewContent className="content is-editable" />

      <div className="chart-container relative w-auto max-w-full overflow-y-scroll">
        {/* Show loading message for 2.5s */}
        {loading ? (
          <p>Loading visualisation data...</p>
        ) : (
          <>{chartData.length > 0 && <LineChart data={chartData} text={"Topic"} />}</>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default CustomBlock;
