export function validateApplication(app) {
  const errors = {};
  if (!app.companyName.trim()) errors.companyName = "Company name is required.";
  if (!app.address.trim()) errors.address = "Address is required.";
  if (!app.country.trim()) errors.country = "Country is required.";
  if (!app.projectDescription.trim()) errors.projectDescription = "Project description is required.";
  if (!app.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(app.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!app.placeOfStay.trim()) errors.placeOfStay = "Place of stay is required.";
  if (!app.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required.";
  } else if (!/^[0-9]{10}$/.test(app.phoneNumber)) {
    errors.phoneNumber = "Phone number must contain exactly 10 digits.";
  }
  if (app.personnel.length === 0) errors.personnel = "Add at least one key personnel entry.";
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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(app.email)) {
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
    if (app.personnel.length === 0) errors.personnel = "Add at least one key personnel entry.";
  }
  if (step === 3) {
    if (!app.declarations?.compliesLaws) errors.compliesLaws = "Select whether the company complies with all laws.";
    if (!app.declarations?.hasInsurance) errors.hasInsurance = "Select whether the company has valid insurance.";
    if (!app.selfDeclaration) errors.selfDeclaration = "You must confirm the self-declaration to continue.";
  }
  return errors;
}