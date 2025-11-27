// pages/index.js
import { useState } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function Home() {
  const [address, setAddress] = useState("");
  const [token, setToken] = useState("");
  const [requireToken, setRequireToken] = useState(true);
  const [loading, setLoading] = useState(false);
  const [inbox, setInbox] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const reset = () => {
    setInbox(null);
    setMessages([]);
    setError("");
  };

  const fetchInbox = async () => {
    reset();
    if (!address) return setError("Enter an inbox address first");
    setLoading(true);
    try {
      const url = `${API}/inboxes/${encodeURIComponent(address)}` + (token ? `?token=${encodeURIComponent(token)}` : "");
      const r = await axios.get(url);
      setInbox(r.data);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Fetch inbox failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    reset();
    if (!address) return setError("Enter an inbox address first");
    setLoading(true);
    try {
      const q = `?require_token=${requireToken ? "1" : "0"}` + (token ? `&token=${encodeURIComponent(token)}` : "");
      const url = `${API}/inboxes/${encodeURIComponent(address)}/messages${q}`;
      const r = await axios.get(url);
      setMessages(r.data.messages || []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Fetch messages failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: "system-ui, Arial", padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>TopFreeMail — dev UI</h1>

      <label style={{ display: "block", marginTop: 12 }}>
        Inbox address
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="anything@topfreemail.org.ng"
          style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label style={{ display: "block", marginTop: 12 }}>
        Token (optional)
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="paste token here (if you have it)"
          style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label style={{ display: "block", marginTop: 12 }}>
        <input
          type="checkbox"
          checked={requireToken}
          onChange={(e) => setRequireToken(e.target.checked)}
        />{" "}
        Require token when fetching messages (toggle for dev)
      </label>

      <div style={{ marginTop: 12 }}>
        <button onClick={fetchInbox} disabled={loading} style={{ padding: "8px 12px", marginRight: 8 }}>
          {loading ? "..." : "Fetch inbox"}
        </button>
        <button onClick={fetchMessages} disabled={loading} style={{ padding: "8px 12px" }}>
          {loading ? "..." : "Fetch messages"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 12, color: "crimson" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {inbox && (
        <section style={{ marginTop: 20, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <h3>Inbox</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(inbox, null, 2)}</pre>
        </section>
      )}

      <section style={{ marginTop: 20 }}>
        <h3>Messages ({messages.length})</h3>
        {messages.length === 0 && <div>No messages to show</div>}
        {messages.map((m) => (
          <article key={m.id} style={{ marginTop: 12, padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
            <div><strong>From:</strong> {m.mail_from}</div>
            <div><strong>Subject:</strong> {m.subject}</div>
            <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{m.body}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>{m.created_at}</div>
          </article>
        ))}
      </section>
    </main>
  );
    }
