import React from "react";
import { useGetCurrentTermsPublicQuery } from "../slices/TermsSlice";

export const TermsContent = ({ onAccept, onDecline }) => {
    const { data, isLoading } = useGetCurrentTermsPublicQuery();

    if (isLoading) return <div style={{ padding: "2rem", textAlign: "center", color: "#888" }}>Loading...</div>;

    let html = data?.content || "";
    html = html.replace("{VERSION}", data?.version || "");
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    let styles = "";
    if (styleMatch) {
        const scoped = styleMatch[1].replace(/\bbody\b/g, ".terms-content-root");
        styles = `<style>${scoped}</style>`;
    }
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) html = styles + bodyMatch[1];

    return (
        <div>
            <div className="terms-content-root" dangerouslySetInnerHTML={{ __html: html }} />
            {onAccept && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1.5rem 0 0.5rem", gap: "0.75rem" }}>
                    <button onClick={onAccept} style={{ backgroundColor: "rgb(24,111,241)", color: "white", border: "none", borderRadius: "1.5rem", padding: "0.6rem 0", fontSize: "1.3rem", fontWeight: 700, cursor: "pointer", width: "100%", maxWidth: "400px" }}>
                        I Accept
                    </button>
                    {onDecline && (
                        <button onClick={onDecline} style={{ background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: "0.9rem" }}>
                            Decline and go back
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
