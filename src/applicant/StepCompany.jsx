import Field from "../components/Field";
import inputClass from "../utils/inputClass";


export default function StepCompany({ app, setApp, errors, readOnly }) {
  const set = (field) => (e) => setApp({ ...app, [field]: e.target.value });
  return (
    <div>
      <Field label="Company Name" required error={errors.companyName}>
        <input disabled={readOnly} className={inputClass(errors.companyName)} value={app.companyName} onChange={set("companyName")} placeholder="e.g. Nimbus Robotics Pvt Ltd" />
      </Field>
      <Field label="Address" required error={errors.address}>
        <textarea disabled={readOnly} rows={2} className={inputClass(errors.address)} value={app.address} onChange={set("address")} placeholder="Registered office address" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Country" required error={errors.country}>
          <input disabled={readOnly} className={inputClass(errors.country)} value={app.country} onChange={set("country")} placeholder="e.g. India" />
        </Field>
        <Field label="Email" required error={errors.email}>
          <input disabled={readOnly} type="email" className={inputClass(errors.email)} value={app.email} onChange={set("email")} placeholder="name@company.com" />
        </Field>
      </div>
      <Field label="Project Description" required error={errors.projectDescription}>
        <textarea disabled={readOnly} rows={3} className={inputClass(errors.projectDescription)} value={app.projectDescription} onChange={set("projectDescription")} placeholder="Briefly describe the project" />
      </Field>
      <Field label="Place of Stay" required error={errors.placeOfStay}>
        <input disabled={readOnly} className={inputClass(errors.placeOfStay)} value={app.placeOfStay} onChange={set("placeOfStay")} placeholder="City, State" />
      </Field>
        <Field label="Phone Number" required error={errors.phoneNumber}>
            <input
                disabled={readOnly}
                type="tel"
                className={inputClass(errors.phoneNumber)}
                value={app.phoneNumber}
                onChange={set("phoneNumber")}
                placeholder="9876543210"
            />
        </Field>
    </div>
  );
}