import { Plus, Trash2 } from "lucide-react";
import Field from "../components/Field";
import inputClass from "../utils/inputClass";
import { nextId } from "../utils/helpers";
 
const todayStr = () => new Date().toISOString().split("T")[0];
 
export default function StepPersonnel({ app, setApp, errors, readOnly }) {
  const rowErrors = errors.personnelRows || {};
 
  const addRow = () =>
    setApp({
      ...app,
      personnel: [
        ...app.personnel,
        { id: nextId("p"), name: "", role: "", email: "", nationality: "", dob: "" },
      ],
    });
 
  const removeRow = (id) =>
    setApp({ ...app, personnel: app.personnel.filter((p) => p.id !== id) });
 
  const updateRow = (id, field, value) =>
    setApp({ ...app, personnel: app.personnel.map((p) => (p.id === id ? { ...p, [field]: value } : p)) });
 
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>Key Personnel</h3>
        {!readOnly && (
          <button onClick={addRow} className="btn-outline inline-flex items-center gap-1.5">
            <Plus size={16} /> Add Person
          </button>
        )}
      </div>
 
      {errors.personnel && <p className="text-xs mb-3" style={{ color: "var(--reject)" }}>{errors.personnel}</p>}
 
      {app.personnel.length === 0 ? (
        <div className="text-sm border border-dashed rounded py-8 text-center" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
          No key personnel added yet.
        </div>
      ) : (
        <div className="space-y-4">
          {app.personnel.map((p, idx) => {
            const pErr = rowErrors[p.id] || {};
            return (
              <div key={p.id} className="card-panel p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono" style={{ color: "var(--ink-soft)" }}>Person {idx + 1}</span>
                  {!readOnly && (
                    <button onClick={() => removeRow(p.id)} style={{ color: "var(--reject)" }} aria-label="Remove person">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
 
                <div className="grid grid-cols-2 gap-x-4">
                  <Field label="Full Name" required error={pErr.name}>
                    <input
                      disabled={readOnly}
                      className={inputClass(pErr.name)}
                      placeholder="e.g. Ananya Rao"
                      value={p.name}
                      onChange={(e) => updateRow(p.id, "name", e.target.value)}
                    />
                  </Field>
 
                  <Field label="Role" required error={pErr.role}>
                    <input
                      disabled={readOnly}
                      className={inputClass(pErr.role)}
                      placeholder="e.g. Project Lead"
                      value={p.role}
                      onChange={(e) => updateRow(p.id, "role", e.target.value)}
                    />
                  </Field>
 
                  <Field label="Email" required error={pErr.email}>
                    <input
                      disabled={readOnly}
                      type="email"
                      className={inputClass(pErr.email)}
                      placeholder="name@company.com"
                      value={p.email || ""}
                      onChange={(e) => updateRow(p.id, "email", e.target.value)}
                    />
                  </Field>
 
                  <Field label="Nationality" required error={pErr.nationality}>
                    <input
                      disabled={readOnly}
                      className={inputClass(pErr.nationality)}
                      placeholder="e.g. Indian"
                      value={p.nationality}
                      onChange={(e) => updateRow(p.id, "nationality", e.target.value)}
                    />
                  </Field>
 
                  <Field label="Date of Birth" required error={pErr.dob}>
                    <input
                      disabled={readOnly}
                      type="date"
                      max={todayStr()}
                      className={inputClass(pErr.dob)}
                      value={p.dob}
                      onChange={(e) => updateRow(p.id, "dob", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}