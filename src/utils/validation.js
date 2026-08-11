const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NATIONALITY_REGEX = /^[A-Za-z\s]{2,40}$/;
 
export function validatePersonnel(person) {
  const errors = {};
 
  const name = person.name?.trim() || "";
  if (!name) {
    errors.name = "Full name is required.";
  } else if (!NAME_REGEX.test(name)) {
    errors.name = "Enter a valid name (letters only, no numbers).";
  }
 
  if (!person.role?.trim()) {
    errors.role = "Role is required.";
  }
 
  const email = person.email?.trim() || "";
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email address.";
  }
 
  const nationality = person.nationality?.trim() || "";
  if (!nationality) {
    errors.nationality = "Nationality is required.";
  } else if (!NATIONALITY_REGEX.test(nationality)) {
    errors.nationality = "Enter a valid nationality (letters only).";
  }
 
  if (!person.dob) {
    errors.dob = "Date of birth is required.";
  } else {
    const dobDate = new Date(person.dob);
    const today = new Date();
    if (Number.isNaN(dobDate.getTime())) {
      errors.dob = "Enter a valid date.";
    } else if (dobDate > today) {
      errors.dob = "Date of birth cannot be in the future.";
    } else {
      const ageYears = (today - dobDate) / (1000 * 60 * 60 * 24 * 365.25);
      if (ageYears < 18) errors.dob = "Personnel must be at least 18 years old.";
      else if (ageYears > 100) errors.dob = "Enter a valid date of birth.";
    }
  }
 
  return errors;
}
 
export function validateApplication(app) {
  const errors = {};
  if (!app.companyName.trim()) errors.companyName = "Company name is required.";
  if (!app.address.trim()) errors.address = "Address is required.";
  if (!app.country.trim()) errors.country = "Country is required.";
  if (!app.projectDescription.trim()) errors.projectDescription = "Project description is required.";
  if (!app.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(app.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!app.placeOfStay.trim()) errors.placeOfStay = "Place of stay is required.";
  if (!app.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required.";
  } else if (!/^[0-9]{10}$/.test(app.phoneNumber)) {
    errors.phoneNumber = "Phone number must contain exactly 10 digits.";
  }
 
  if (app.personnel.length === 0) {
    errors.personnel = "Add at least one key personnel entry.";
  } else {
    const rowErrors = {};
    app.personnel.forEach((p) => {
      const pErrors = validatePersonnel(p);
      if (Object.keys(pErrors).length > 0) rowErrors[p.id] = pErrors;
    });
    if (Object.keys(rowErrors).length > 0) {
      errors.personnel = "Fix the errors in the personnel list below.";
      errors.personnelRows = rowErrors;
    }
  }
 
  if (!app.declarations?.compliesLaws) errors.compliesLaws = "Select whether the company complies with all laws.";
  if (!app.declarations?.hasInsurance) errors.hasInsurance = "Select whether the company has valid insurance.";
  if (!app.selfDeclaration) errors.selfDeclaration = "You must confirm the self-declaration to submit.";
  return errors;
}
 
// Same rules as validateApplication, but scoped to just the current step's fields
export function validateStep(step, app) {
  const errors = {};
  if (step === 1) {
    if (!app.companyName.trim()) errors.companyName = "Company name is required.";
    if (!app.address.trim()) errors.address = "Address is required.";
    if (!app.country.trim()) errors.country = "Country is required.";
    if (!app.projectDescription.trim()) errors.projectDescription = "Project description is required.";
    if (!app.email.trim()) {
      errors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(app.email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!app.placeOfStay.trim()) errors.placeOfStay = "Place of stay is required.";
    if (!app.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(app.phoneNumber)) {
      errors.phoneNumber = "Phone number must contain exactly 10 digits.";
    }
  }
 
  if (step === 2) {
    if (app.personnel.length === 0) {
      errors.personnel = "Add at least one key personnel entry.";
    } else {
      const rowErrors = {};
      app.personnel.forEach((p) => {
        const pErrors = validatePersonnel(p);
        if (Object.keys(pErrors).length > 0) rowErrors[p.id] = pErrors;
      });
      if (Object.keys(rowErrors).length > 0) {
        errors.personnel = "Fix the errors in the personnel list below.";
        errors.personnelRows = rowErrors;
      }
    }
  }
 
  if (step === 3) {
    if (!app.declarations?.compliesLaws) errors.compliesLaws = "Select whether the company complies with all laws.";
    if (!app.declarations?.hasInsurance) errors.hasInsurance = "Select whether the company has valid insurance.";
    if (!app.selfDeclaration) errors.selfDeclaration = "You must confirm the self-declaration to continue.";
  }
 
  return errors;
}