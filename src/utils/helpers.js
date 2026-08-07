import { STATUS } from "./constants";

let idCounter = 100;

export const nextId = (prefix) => `${prefix}-${idCounter++}`;

export function blankApplication() {
  return {
    id: nextId("app"),
    companyName: "",
    address: "",
    country: "",
    projectDescription: "",
    email: "",
    placeOfStay: "",
    personnel: [],
    declarations: {
        compliesLaws: "",
        hasInsurance: "",
    },
    selfDeclaration: false,
    status: STATUS.DRAFT,
    reviewerRemarks: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    };
}