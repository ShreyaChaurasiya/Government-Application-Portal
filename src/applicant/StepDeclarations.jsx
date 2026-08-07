export default function StepDeclarations({ app, setApp, errors, readOnly }) {
  const setDecl = (key) => (e) => setApp({ ...app, declarations: { ...app.declarations, [key]: e.target.value } });
  const questions = [
    { key: "compliesLaws", label: "Does the company comply with all applicable local laws and regulations?" },
    { key: "hasInsurance", label: "Does the company hold valid liability insurance for this project?" },
  ];

  return (
    <div>
      {questions.map((q) => (
        <div key={q.key} className="mb-4">
          <span className="block text-sm font-medium text-slate-700 mb-2">{q.label}</span>
          <div className="flex gap-4">
            {["yes", "no"].map((val) => (
              <label key={val} className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="radio"
                  disabled={readOnly}
                  name={q.key}
                  checked={app.declarations[q.key] === val}
                  onChange={setDecl(q.key)}
                  value={val}
                  className="accent-indigo-600"
                />
                {val === "yes" ? "Yes" : "No"}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className={`mt-6 rounded-md border p-4 ${errors.selfDeclaration ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50"}`}>
        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            disabled={readOnly}
            checked={app.selfDeclaration}
            onChange={(e) => setApp({ ...app, selfDeclaration: e.target.checked })}
            className="mt-0.5 accent-indigo-600 w-4 h-4"
          />
          <span>
            I hereby declare that the information provided above is true and correct to the best of my knowledge, and I
            take full responsibility for any discrepancies.
          </span>
        </label>
        {errors.selfDeclaration && <p className="text-xs text-rose-600 mt-2">{errors.selfDeclaration}</p>}
      </div>
    </div>
  );
}