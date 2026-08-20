import React from "react";
import { TermsContent } from "../components/TermsContent";

export default function TermsPage() {
    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f6f8fc", padding: "2rem 1rem", fontFamily: '"Nunito", sans-serif' }}>
            <div style={{ maxWidth: "900px", margin: "0 auto", backgroundColor: "white", borderRadius: "1rem", padding: "2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
                <TermsContent />
            </div>
        </div>
    );
}
