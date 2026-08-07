import { Plus, Trash2 } from "lucide-react";
import inputClass from "../utils/inputClass";
import { nextId } from "../utils/helpers";

export default function StepPersonnel({ app, setApp, errors, readOnly }) {
  const addRow = () =>
    setApp({ ...app, personnel: [...app.personnel, { id: nextId("p"), name: "", role: "", nationality: "", dob: "" }] });
  const removeRow = (id) => setApp({ ...app, personnel: app.personnel.filter((p) => p.id !== id) });
  const updateRow = (id, field, value) =>
    setApp({ ...app, personnel: app.personnel.map((p) => (p.id === id ? { ...p, [field]: value } : p)) });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Key Personnel</h3>
        {!readOnly && (
          <button
            onClick={addRow}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-600/40 hover:border-indigo-600 rounded-md px-3 py-1.5 transition"
          >
            <Plus size={16} /> Add Person
          </button>
        )}
      </div>

      {errors.personnel && <p className="text-xs text-rose-600 mb-3">{errors.personnel}</p>}

      {app.personnel.length === 0 ? (
        <div className="text-sm text-slate-500 border border-dashed border-slate-300 rounded-md py-8 text-center">
          No key personnel added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {app.personnel.map((p, idx) => (
            <div key={p.id} className="border border-white bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Person {idx + 1}</span>
                {!readOnly && (
                  <button onClick={() => removeRow(p.id)} className="text-rose-500 hover:text-rose-700" aria-label="Remove person">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input disabled={readOnly} className={inputClass(false)} placeholder="Full name" value={p.name} onChange={(e) => updateRow(p.id, "name", e.target.value)} />
                <input disabled={readOnly} className={inputClass(false)} placeholder="Role" value={p.role} onChange={(e) => updateRow(p.id, "role", e.target.value)} />
                <input disabled={readOnly} className={inputClass(false)} placeholder="Nationality" value={p.nationality} onChange={(e) => updateRow(p.id, "nationality", e.target.value)} />
                <input disabled={readOnly} type="date" className={inputClass(false)} value={p.dob} onChange={(e) => updateRow(p.id, "dob", e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}