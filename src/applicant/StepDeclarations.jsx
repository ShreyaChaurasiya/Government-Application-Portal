export default function StepDeclarations({ app, setApp, errors, readOnly }) {
  const declarations = app.declarations || {
    compliesLaws: "",
    hasInsurance: "",
  };
 
  const setDecl = (key) => (e) =>
    setApp({
      ...app,
      declarations: {
        ...declarations,
        [key]: e.target.value,
      },
    });
 
  const questions = [
    {
      key: "compliesLaws",
      label: "Does the company comply with all applicable local laws and regulations?",
    },
    {
      key: "hasInsurance",
      label: "Does the company hold valid liability insurance for this project?",
    },
  ];
 
  return (
    <div>
      {questions.map((q) => (
        <div key={q.key} className="mb-4">
          <span className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
            {q.label}
          </span>
 
          <div className="flex gap-4">
            {["yes", "no"].map((val) => (
              <label key={val} className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                <input
                  type="radio"
                  disabled={readOnly}
                  name={q.key}
                  checked={declarations[q.key] === val}
                  onChange={setDecl(q.key)}
                  value={val}
                  style={{ accentColor: "var(--accent)" }}
                />
                {val === "yes" ? "Yes" : "No"}
              </label>
            ))}
          </div>
 
          {errors[q.key] && (
            <p className="text-xs mt-1" style={{ color: "var(--reject)" }}>{errors[q.key]}</p>
          )}
        </div>
      ))}
 
      <div
        className="mt-6 rounded border p-4"
        style={{
          borderColor: errors.selfDeclaration ? "var(--reject)" : "var(--line)",
          background: errors.selfDeclaration ? "var(--reject-soft)" : "var(--paper-card)",
        }}
      >
        <label className="flex items-start gap-3 text-sm" style={{ color: "var(--ink)" }}>
          <input
            type="checkbox"
            disabled={readOnly}
            checked={app.selfDeclaration || false}
            onChange={(e) =>
              setApp({
                ...app,
                selfDeclaration: e.target.checked,
                declarations,
              })
            }
            className="mt-0.5 w-4 h-4"
            style={{ accentColor: "var(--accent)" }}
          />
          <span>
            I hereby declare that the information provided above is true and
            correct to the best of my knowledge, and I take full responsibility
            for any discrepancies.
          </span>
        </label>
 
        {errors.selfDeclaration && (
          <p className="text-xs mt-2" style={{ color: "var(--reject)" }}>{errors.selfDeclaration}</p>
        )}
      </div>
    </div>
  );
}