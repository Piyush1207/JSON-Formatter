import { useState, useCallback } from "react";

const themes = {
  dark: {
    bg: "#010d04",
    surface: "#071a0a",
    border: "#1a3d1f",
    text: "#d4e8c2",
    muted: "#5a7a4a",
    accent: "#5dbb63",
    success: "#a3e635",
    error: "#e05252",
    warning: "#d4a017",
    string: "#b7dca0",
    number: "#5dbb63",
    boolean: "#e05252",
    null: "#5a7a4a",
    key: "#90d468",
  },
  light: {
    bg: "#f2f9ee",
    surface: "#e2f0d8",
    border: "#a8c890",
    text: "#1a2e10",
    muted: "#5a7a4a",
    accent: "#2e7d32",
    success: "#388e3c",
    error: "#b71c1c",
    warning: "#795548",
    string: "#1b5e20",
    number: "#2e7d32",
    boolean: "#b71c1c",
    null: "#5a7a4a",
    key: "#33691e",
  },
};

function JsonNode({ data, depth = 0, theme }) {
  const [collapsed, setCollapsed] = useState(depth > 2);
  const indent = depth * 16;

  if (data === null) {
    return <span style={{ color: theme.null }}>null</span>;
  }
  if (typeof data === "boolean") {
    return <span style={{ color: theme.boolean }}>{data.toString()}</span>;
  }
  if (typeof data === "number") {
    return <span style={{ color: theme.number }}>{data}</span>;
  }
  if (typeof data === "string") {
    return <span style={{ color: theme.string }}>"{data}"</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <span style={{ color: theme.muted }}>[]</span>;
    return (
      <span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "none",
            border: "none",
            color: theme.accent,
            cursor: "pointer",
            padding: "0 4px",
            fontSize: "11px",
            fontFamily: "inherit",
          }}
        >
          {collapsed ? "▶" : "▼"}
        </button>
        <span style={{ color: theme.muted }}>[</span>
        {collapsed ? (
          <span
            style={{ color: theme.muted, cursor: "pointer" }}
            onClick={() => setCollapsed(false)}
          >
            {" "}
            {data.length} items{" "}
          </span>
        ) : (
          <div style={{ marginLeft: indent + 16 }}>
            {data.map((item, i) => (
              <div key={i}>
                <JsonNode data={item} depth={depth + 1} theme={theme} />
                {i < data.length - 1 && (
                  <span style={{ color: theme.muted }}>,</span>
                )}
              </div>
            ))}
          </div>
        )}
        <span style={{ color: theme.muted }}>]</span>
      </span>
    );
  }

  if (typeof data === "object") {
    const keys = Object.keys(data);
    if (keys.length === 0) return <span style={{ color: theme.muted }}>{"{}"}</span>;
    return (
      <span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "none",
            border: "none",
            color: theme.accent,
            cursor: "pointer",
            padding: "0 4px",
            fontSize: "11px",
            fontFamily: "inherit",
          }}
        >
          {collapsed ? "▶" : "▼"}
        </button>
        <span style={{ color: theme.muted }}>{"{"}</span>
        {collapsed ? (
          <span
            style={{ color: theme.muted, cursor: "pointer" }}
            onClick={() => setCollapsed(false)}
          >
            {" "}
            {keys.length} keys{" "}
          </span>
        ) : (
          <div style={{ marginLeft: indent + 16 }}>
            {keys.map((key, i) => (
              <div key={key}>
                <span style={{ color: theme.key }}>"{key}"</span>
                <span style={{ color: theme.muted }}>: </span>
                <JsonNode data={data[key]} depth={depth + 1} theme={theme} />
                {i < keys.length - 1 && (
                  <span style={{ color: theme.muted }}>,</span>
                )}
              </div>
            ))}
          </div>
        )}
        <span style={{ color: theme.muted }}>{"}"}</span>
      </span>
    );
  }
  return null;
}

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState("");
  const [themeKey, setThemeKey] = useState("dark");
  const [indentSize, setIndentSize] = useState(2);
  const [viewMode, setViewMode] = useState("tree");
  const [copied, setCopied] = useState(false);

  const theme = themes[themeKey];

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter some JSON.");
      setParsed(null);
      setOutput("");
      return;
    }
    try {
      const obj = JSON.parse(input);
      setParsed(obj);
      setOutput(JSON.stringify(obj, null, indentSize));
      setError("");
    } catch (e) {
      setError(e.message);
      setParsed(null);
      setOutput("");
    }
  }, [input, indentSize]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter some JSON.");
      return;
    }
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj));
      setParsed(obj);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, [input]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = () => {
    setInput("");
    setOutput("");
    setParsed(null);
    setError("");
  };

  const handleSampleLoad = () => {
    const sample = {
      name: "JSON Formatter",
      version: "1.0.0",
      features: ["format", "minify", "validate", "tree view"],
      meta: {
        author: "Claude",
        year: 2026,
        active: true,
        notes: null,
      },
    };
    setInput(JSON.stringify(sample));
    setOutput("");
    setParsed(null);
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        transition: "all 0.2s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: `1px solid ${theme.border}`,
          background: theme.surface,
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>{"{ }"}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.5px" }}>
              JSON Formatter
            </div>
            <div style={{ fontSize: 11, color: theme.muted }}>
              Format · Minify · Validate · Explore
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {/* Indent */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: theme.muted }}>Indent:</span>
            {[2, 4].map((n) => (
              <button
                key={n}
                onClick={() => setIndentSize(n)}
                style={{
                  padding: "3px 10px",
                  borderRadius: 6,
                  border: `1px solid ${indentSize === n ? theme.accent : theme.border}`,
                  background: indentSize === n ? theme.accent + "22" : "transparent",
                  color: indentSize === n ? theme.accent : theme.muted,
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "inherit",
                }}
              >
                {n}
              </button>
            ))}
          </div>

          {/* View mode */}
          <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: `1px solid ${theme.border}` }}>
            {["tree", "raw"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: "4px 14px",
                  background: viewMode === mode ? theme.accent : "transparent",
                  color: viewMode === mode ? "#fff" : theme.muted,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "inherit",
                  fontWeight: viewMode === mode ? 600 : 400,
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setThemeKey(themeKey === "dark" ? "light" : "dark")}
            style={{
              padding: "4px 12px",
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
              background: "transparent",
              color: theme.text,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "inherit",
            }}
          >
            {themeKey === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          height: "calc(100vh - 61px)",
          gap: 0,
        }}
      >
        {/* Input Panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              gap: 8,
              background: theme.surface,
            }}
          >
            <span style={{ fontSize: 12, color: theme.muted, marginRight: "auto", display: "flex", alignItems: "center" }}>
              Input
            </span>
            <Btn onClick={handleSampleLoad} theme={theme} accent>
              Sample
            </Btn>
            <Btn onClick={handleClear} theme={theme}>
              Clear
            </Btn>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleFormat();
            }}
            placeholder='Paste your JSON here...\n\nTip: Press Ctrl+Enter to format'
            style={{
              flex: 1,
              background: theme.bg,
              color: theme.text,
              border: "none",
              outline: "none",
              resize: "none",
              padding: "16px",
              fontSize: 13,
              lineHeight: 1.6,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              caretColor: theme.accent,
            }}
          />

          {error && (
            <div
              style={{
                padding: "8px 16px",
                background: theme.error + "18",
                borderTop: `1px solid ${theme.error}44`,
                color: theme.error,
                fontSize: 12,
                fontFamily: "inherit",
              }}
            >
              ✕ {error}
            </div>
          )}

          <div
            style={{
              padding: "10px 16px",
              borderTop: `1px solid ${theme.border}`,
              display: "flex",
              gap: 8,
              background: theme.surface,
            }}
          >
            <button
              onClick={handleFormat}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 8,
                border: "none",
                background: `linear-gradient(135deg, #2e7d32, #5dbb63)`,
                color: "#fff",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.3px",
              }}
            >
              Format JSON
            </button>
            <Btn onClick={handleMinify} theme={theme}>
              Minify
            </Btn>
          </div>
        </div>

        {/* Output Panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              gap: 8,
              background: theme.surface,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, color: theme.muted, marginRight: "auto" }}>
              Output
              {parsed !== null && (
                <span style={{ marginLeft: 8, color: theme.success }}>
                  ✓ Valid JSON
                </span>
              )}
            </span>
            <Btn onClick={handleCopy} theme={theme} accent={copied}>
              {copied ? "Copied!" : "Copy"}
            </Btn>
          </div>

          <div
            style={{
              flex: 1,
              overflow: "auto",
              padding: "16px",
              fontSize: 13,
              lineHeight: 1.7,
              background: theme.bg,
            }}
          >
            {parsed !== null ? (
              viewMode === "tree" ? (
                <JsonNode data={parsed} depth={0} theme={theme} />
              ) : (
                <pre style={{ margin: 0, color: theme.text, fontFamily: "inherit" }}>
                  {output}
                </pre>
              )
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.muted,
                  flexDirection: "column",
                  gap: 8,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 36 }}>{"{ }"}</div>
                <div style={{ fontSize: 13 }}>
                  Formatted output will appear here
                </div>
                <div style={{ fontSize: 11 }}>
                  Paste JSON on the left and click Format
                </div>
              </div>
            )}
          </div>

          {parsed !== null && (
            <div
              style={{
                padding: "6px 16px",
                borderTop: `1px solid ${theme.border}`,
                background: theme.surface,
                fontSize: 11,
                color: theme.muted,
                display: "flex",
                gap: 16,
              }}
            >
              <span>
                Type:{" "}
                <span style={{ color: theme.text }}>
                  {Array.isArray(parsed) ? "Array" : typeof parsed}
                </span>
              </span>
              {typeof parsed === "object" && parsed !== null && (
                <span>
                  {Array.isArray(parsed) ? "Length" : "Keys"}:{" "}
                  <span style={{ color: theme.text }}>
                    {Array.isArray(parsed)
                      ? parsed.length
                      : Object.keys(parsed).length}
                  </span>
                </span>
              )}
              <span>
                Size:{" "}
                <span style={{ color: theme.text }}>
                  {(JSON.stringify(parsed).length / 1024).toFixed(2)} KB
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Btn({ children, onClick, theme, accent }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 12px",
        borderRadius: 6,
        border: `1px solid ${accent ? theme.accent : theme.border}`,
        background: accent ? theme.accent + "22" : "transparent",
        color: accent ? theme.accent : theme.muted,
        cursor: "pointer",
        fontSize: 12,
        fontFamily: "inherit",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}