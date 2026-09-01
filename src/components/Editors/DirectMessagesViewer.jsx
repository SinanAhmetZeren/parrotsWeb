import { useState } from "react";
import { useLazyGetDirectMessagesQuery } from "../../slices/MetricsSlice";
import { adminPage, adminCard, adminTitle, adminBtnPrimary } from "../../styles/adminStyles";

const PAGE_SIZE = 50;

const dtInputStyle = {
  padding: "0.4rem 0.65rem",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  fontSize: "0.85rem",
  color: "#1e3a5f",
};

const userInputStyle = {
  padding: "0.4rem 0.65rem",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  fontSize: "0.85rem",
  color: "#1e3a5f",
  width: "220px",
};

const pgBtn = {
  backgroundColor: "white", color: "#475569", border: "1px solid #e2e8f0",
  borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: "0.78rem",
};

function pad(n) { return String(n).padStart(2, "0"); }
function toLocal(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function DirectMessagesViewer() {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [from, setFrom] = useState(toLocal(oneWeekAgo));
  const [to, setTo] = useState(toLocal(now));
  const [userId1, setUserId1] = useState("");
  const [userId2, setUserId2] = useState("");
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [triggerGet] = useLazyGetDirectMessagesQuery();

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1;

  const handleFetch = async (p = 1) => {
    setPage(p);
    setIsFetching(true);
    setError(null);
    try {
      const result = await triggerGet({
        from: from ? new Date(from).toISOString() : undefined,
        to: to ? new Date(to).toISOString() : undefined,
        userId1: userId1 || undefined,
        userId2: userId2 || undefined,
        page: p,
        pageSize: PAGE_SIZE,
      }).unwrap();
      setData(result);
    } catch (e) {
      setError(e);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div style={adminPage}>
      <div style={adminCard}>
        <div style={adminTitle}>Direct Messages</div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap", marginBottom: "1rem" }}>
          <FDate label="FROM" value={from} onChange={setFrom} />
          <FDate label="TO" value={to} onChange={setTo} />
          <FField label="USER ID 1" value={userId1} onChange={setUserId1} placeholder="optional" />
          <FField label="USER ID 2" value={userId2} onChange={setUserId2} placeholder="optional" />
          <button onClick={() => handleFetch(1)} style={{ ...adminBtnPrimary, alignSelf: "flex-end" }} disabled={isFetching}>
            {isFetching ? "Loading..." : "Fetch"}
          </button>
          {data && (
            <span style={{ fontSize: "0.78rem", color: "#94a3b8", alignSelf: "flex-end", marginBottom: 2 }}>
              {data.totalCount} message{data.totalCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {error && (
          <div style={{ color: "#991b1b", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
            Failed to load messages.
          </div>
        )}

        {data && (
          <>
            {data.items.length === 0 ? (
              <div style={{ color: "#94a3b8", padding: "1.5rem 0", textAlign: "center" }}>No messages found.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", fontSize: "0.78rem", width: "100%" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#0f2744", color: "#94a3b8" }}>
                      <th style={th}>ID</th>
                      <th style={th}>DATE</th>
                      <th style={th}>FROM</th>
                      <th style={th}>TO</th>
                      <th style={th}>BLOCKED</th>
                      <th style={{ ...th, width: "40%" }}>TEXT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((m, i) => (
                      <tr key={m.id} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                        <td style={td}>{m.id}</td>
                        <td style={td}>{fmtDate(m.dateTime)}</td>
                        <td style={td}>
                          <span style={{ fontWeight: 600 }}>{m.senderUsername ?? "—"}</span>
                          <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{m.senderId}</div>
                        </td>
                        <td style={td}>
                          <span style={{ fontWeight: 600 }}>{m.receiverUsername ?? "—"}</span>
                          <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{m.receiverId}</div>
                        </td>
                        <td style={td}>
                          {m.isBlocked
                            ? <span style={{ color: "#b91c1c", fontWeight: 700 }}>Yes</span>
                            : <span style={{ color: "#64748b" }}>No</span>}
                        </td>
                        <td style={{ ...td, whiteSpace: "normal", wordBreak: "break-word", maxWidth: "400px" }}>{m.text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", alignItems: "center" }}>
                <button onClick={() => handleFetch(page - 1)} disabled={page === 1 || isFetching} style={pgBtn}>← Prev</button>
                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Page {page} / {totalPages}</span>
                <button onClick={() => handleFetch(page + 1)} disabled={page === totalPages || isFetching} style={pgBtn}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FDate({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>{label}</span>
      <input type="datetime-local" value={value} onChange={e => onChange(e.target.value)} style={dtInputStyle} />
    </div>
  );
}

function FField({ label, value, onChange, placeholder }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>{label}</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={userInputStyle} />
    </div>
  );
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

const th = { padding: "0.6rem 0.9rem", whiteSpace: "nowrap", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.04em", textAlign: "left" };
const td = { padding: "0.5rem 0.9rem", verticalAlign: "middle", color: "#0f172a", whiteSpace: "nowrap" };
