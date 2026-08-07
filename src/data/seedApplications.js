import { STATUS } from "../utils/constants";

const seedApplications = [
  {
    id: "app-1",
    companyName: "Nimbus Robotics Pvt Ltd",
    address: "14 MG Road, Sector 5",
    country: "India",
    projectDescription: "Autonomous warehouse drone pilot program.",
    email: "contact@nimbusrobotics.io",
    placeOfStay: "",
    personnel: [
      { id: "p-1", name: "Ananya Rao", role: "Project Lead", nationality: "Indian", dob: "1990-03-14" },
    ],
    declarations: { compliesLaws: "yes", hasInsurance: "no" },
    selfDeclaration: false,
    status: STATUS.DRAFT,
    reviewerRemarks: "",
    createdAt: "2026-08-01T09:00:00Z",
    updatedAt: "2026-08-01T09:00:00Z",
  },
  {
    id: "app-2",
    companyName: "Solara Energy Systems",
    address: "22 Industrial Estate, Whitefield",
    country: "India",
    projectDescription: "Rooftop solar micro-grid deployment for rural clusters.",
    email: "info@solaraenergy.com",
    placeOfStay: "Bengaluru, Karnataka",
    personnel: [
      { id: "p-2", name: "Rahul Mehta", role: "Chief Engineer", nationality: "Indian", dob: "1985-07-22" },
      { id: "p-3", name: "Li Wei", role: "Technical Advisor", nationality: "Chinese", dob: "1988-11-02" },
    ],
    declarations: { compliesLaws: "yes", hasInsurance: "yes" },
    selfDeclaration: true,
    status: STATUS.SUBMITTED,
    reviewerRemarks: "",
    createdAt: "2026-07-28T09:00:00Z",
    updatedAt: "2026-07-30T09:00:00Z",
  },
];

export default seedApplications;