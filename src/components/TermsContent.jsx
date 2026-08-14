import React from "react";
import { parrotBlue, parrotDarkBlue, parrotGreyTransparent, parrotTextDarkBlue } from "../styles/colors";
import logoMini from '../assets/images/ParrotsLogoHead.png';
import { useGetCurrentTermsAdminQuery } from "../slices/TermsSlice";

export const TermsContent = ({ onAccept, onDecline }) => {
    const { data: currentTerms } = useGetCurrentTermsAdminQuery();

    const styles = {
        termsContainer: {
            maxWidth: "900px",
            margin: "0 auto",
            fontFamily: '"Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: "1rem",
            lineHeight: 1.6,
            color: "#222",
        },
        titleMain: {
            fontSize: "2rem",
            fontWeight: "bold",
            color: parrotTextDarkBlue,
            textAlign: "left",
        },
        sectionTitle: {
            fontSize: "1.3rem",
            fontWeight: "bold",
            color: parrotTextDarkBlue,
            textAlign: "left",
        },
        sectionTitle2: {
            fontSize: "1.1rem",
            fontWeight: "bold",
            color: parrotTextDarkBlue,
            textAlign: "left",
        },
        paragraph: {
            color: "#444",
            textAlign: "justify",
        },
        boldHighlight: {
            fontWeight: "bold",
            backgroundColor: "rgba(0, 53, 128, 0.11)",
            padding: "3px 0",
        },
    };

    const sectionContainer = { padding: "1rem" };

    const transparentWrapper = {
        backgroundColor: parrotGreyTransparent,
        padding: "1rem",
        marginTop: "1rem",
        border: `2px solid rgb(222, 222, 222)`,
        borderRadius: "0.5rem",
    };

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div style={styles.termsContainer}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <img src={logoMini} alt="Parrots Logo" style={{ width: "3rem", marginBottom: "1rem" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={styles.titleMain}>Parrots</div>
                    {currentTerms?.version && (
                        <div style={{ fontSize: "0.8rem", color: "#888", fontWeight: 500 }}>
                            Terms of Use — v{currentTerms.version}
                        </div>
                    )}
                </div>
            </div>

            <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", justifyItems: "start",
                alignItems: "start", columnGap: "1rem", rowGap: "0.4rem",
                backgroundColor: "rgb(246, 246, 246)", border: "2px solid rgb(222, 222, 222)",
                width: "100%", margin: "auto", marginBottom: "2rem",
                paddingLeft: "2rem", paddingRight: "2rem", paddingBottom: "1rem", paddingTop: "1rem",
                borderRadius: "0.5rem",
            }}>
                {[
                    { num: "1.", text: "About Parrots", id: "about" },
                    { num: "2.", text: "Eligibility", id: "eligibility" },
                    { num: "3.", text: "Profile and Content Responsibilities", id: "profile" },
                    { num: "4.", text: "Platform Neutrality and No Endorsement", id: "neutrality" },
                    { num: "5.", text: "Voyages and Requests to Join Voyages (Bids)", id: "voyages" },
                    { num: "6.", text: "Communication Between Users", id: "communication" },
                    { num: "7.", text: "Prohibited Activities", id: "prohibited" },
                    { num: "8.", text: "Account Suspension and Termination", id: "suspension" },
                    { num: "9.", text: "Intellectual Property", id: "ip" },
                    { num: "10.", text: "Limitation of Liability", id: "liability" },
                    { num: "11.", text: "Disclaimers", id: "disclaimers" },
                    { num: "12.", text: "AI-Generated Content (Ask Parrots)", id: "ai-content" },
                    { num: "13.", text: "Modifications", id: "modifications" },
                    { num: "14.", text: "Privacy Policy", id: "privacy" },
                    { num: "15.", text: "Dispute Resolution", id: "dispute" },
                    { num: "16.", text: "Governing Law", id: "law" },
                    { num: "17.", text: "Service Termination and Discontinuation", id: "termination" },
                    { num: "18.", text: "Refund Policy", id: "refund" },
                    { num: "19.", text: "Contact & Legal Entity", id: "contact" },
                ].map((item) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "0.3rem", cursor: "pointer", color: parrotTextDarkBlue, fontSize: "1.1rem", fontWeight: "bold" }} onClick={() => scrollToSection(item.id)}>
                        <span style={{ minWidth: "1.5rem", textAlign: "left" }}>{item.num}</span>
                        <span style={{ minWidth: "9.5rem", textAlign: "left" }}>{item.text}</span>
                    </div>
                ))}
            </div>

            <div style={styles.titleMain}>Terms of Use, Privacy Policy & Disclaimer</div>

            <div style={transparentWrapper}>
                <div id="about" style={styles.sectionTitle}>1. About Parrots</div>
                <div style={styles.paragraph}>Parrots is a community platform designed to connect users who are interested in sharing information about vehicles, voyages, and related activities. Users can:</div>
                <div style={sectionContainer}>
                    <div style={styles.sectionTitle2}>a. Create profiles</div>
                    <div style={styles.paragraph}>Each user can make their own profile page, providing personal information they choose to share, such as a brief bio, social media links, and contact details.</div>
                    <div style={styles.paragraph}>Profiles help other users identify who they are communicating with or interacting with on the platform.</div>
                    <div style={styles.sectionTitle2}>b. Upload images</div>
                    <div style={styles.paragraph}>Users can upload photos to their profile or their listings, such as pictures of themselves, their vehicles, or other relevant content.</div>
                    <div style={styles.paragraph}>Parrots does not review or verify these images, so users are responsible for the content they upload.</div>
                    <div style={styles.sectionTitle2}>c. List vehicles and voyages</div>
                    <div style={styles.paragraph}>Users can add vehicles they own and propose voyages (trips, journeys, or rides) they intend to organize.</div>
                    <div style={styles.paragraph}>Listings may include descriptions, dates, destinations, or other details to inform other users.</div>
                    <div style={styles.paragraph}>Parrots does not verify whether these vehicles exist or whether voyages will actually take place.</div>
                    <div style={styles.sectionTitle2}>d. Propose to join others' voyages</div>
                    <div style={styles.paragraph}>Users can propose to join voyages listed by others, showing interest or proposing participation.</div>
                    <div style={styles.paragraph}>Bids on Parrots are proposals to join a voyage and do not create any financial obligation through the platform. Placing a bid does not create any legal or financial obligation, and Parrots does not enforce or guarantee that the voyage will occur.</div>
                    <div style={styles.sectionTitle2}>e. Communicate</div>
                    <div style={styles.paragraph}>Users can message or interact with each other within the platform to discuss voyages, or other topics.</div>
                    <div style={styles.paragraph}>All communication is the responsibility of the users themselves. Parrots does not monitor, endorse, or guarantee the safety or truthfulness of these messages.</div>
                    <div style={styles.sectionTitle2}>f. Ask Parrots (AI Tool)</div>
                    <div style={styles.paragraph}>Users can interact with an AI-powered tool ("Ask Parrots") to generate travel suggestions, routes, and location information. This feature relies on automated technology and user-provided inputs, and Parrots does not guarantee the accuracy, safety, or suitability of any AI-generated content.</div>
                </div>
                <div style={styles.paragraph}>Users are responsible for the content they post. Account verification, where provided, does not constitute verification of a user's identity, credentials, character, or reliability. Parrots does not guarantee voyage completion or endorse any content.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="eligibility" style={styles.sectionTitle}>2. Eligibility</div>
                <div style={styles.paragraph}><strong style={styles.boldHighlight}>Users must be at least 18 years old.</strong> By using Parrots, you confirm that you meet this age requirement and have the legal capacity to enter into this agreement under applicable law.</div>
                <div style={styles.paragraph}>By creating an account or continuing to use the platform, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must not use the platform.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="profile" style={styles.sectionTitle}>3. Profile and Content Responsibilities</div>
                <div style={styles.paragraph}>Users are responsible for ensuring that all content they post is accurate and true to the best of their knowledge, appropriate, and not misleading or deceptive. This includes, but is not limited to, images, contact details, social media links, vehicles, voyages, and any information submitted through or generated via platform features. Parrots is not responsible for false, misleading, inaccurate content or content as mentioned above.</div>
                <div style={styles.paragraph}><strong style={styles.boldHighlight}>All user-generated content on Parrots — including profiles, profile and background images, contact details, vehicle listings, voyage listings, bids, and related content, etc. — is visible to all registered users of the platform. Users should not include any information they are not comfortable sharing with all platform members.</strong></div>
            </div>

            <div style={transparentWrapper}>
                <div id="neutrality" style={styles.sectionTitle}>4. Platform Neutrality and No Endorsement</div>
                <div style={styles.paragraph}>Parrots is a technology platform that enables users to list, discover, and bid on voyages. Parrots does not create, own, operate, or control any voyage, vehicle, or service listed on the platform, nor does it generate, verify, or endorse any AI-powered suggestions provided through Ask Parrots.</div>
                <div style={styles.paragraph}>We do not verify, approve, endorse, or guarantee:</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• the accuracy or completeness of any listing</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• the identity, credentials, or reliability of any user</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• the quality, safety, or legality of any voyage offered</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• that any voyage will depart, arrive, or be completed as described</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• any transaction, payment, or agreement made between users</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• the accuracy, safety, or reliability of any AI-generated content or route suggestions via Ask Parrots</div>
                <div style={styles.paragraph}>All arrangements are made solely between the users involved. Parrots is not a party to any agreement, booking, or transaction between users and accepts no liability arising from them.</div>
                <div style={styles.paragraph}>Any reliance on listings, user profiles, AI suggestions, or content posted by other users is at your own risk.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="voyages" style={styles.sectionTitle}>5. Voyages and Requests to Join Voyages (Bids)</div>
                <div style={styles.paragraph}>Users may list vehicles and propose voyages. They can place bids (requests to join) for voyages listed by others. Bids are proposals to join a voyage and do not create any financial obligation through the platform. Parrots does not guarantee any voyage will occur, be safe, or as described. Some listings may be fake or incomplete. <strong style={styles.boldHighlight}>Participation is at users' own risk.</strong></div>
                <div style={styles.sectionTitle2}>a. Accepted Bids and Voyage Owner Responsibility</div>
                <div style={styles.paragraph}>When a voyage owner accepts a bid, this constitutes an expression of intent between users only. It does not create a legally binding contract, and Parrots is not a party to any such arrangement.</div>
                <div style={styles.paragraph}>Parrots does not guarantee that a voyage owner will follow through on an accepted bid, fulfil any stated arrangements, or communicate further after acceptance. Users who have had a bid accepted proceed entirely at their own risk.</div>
                <div style={styles.paragraph}>Parrots strongly recommends that users:</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Confirm arrangements directly with the voyage owner before making any personal plans</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• <strong style={styles.boldHighlight}>Do not make non-refundable bookings or financial commitments based solely on a bid acceptance within the app</strong></div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Exercise caution when sharing personal contact details</div>
                <div style={styles.paragraph}>Parrots shall not be held liable for any loss, inconvenience, or harm resulting from a voyage owner's failure to proceed following bid acceptance.</div>
                <div style={styles.sectionTitle2}>b. AI-Inspired Voyage Listings</div>
                <div style={styles.paragraph}>If a user lists or proposes a voyage inspired by, generated through, or assisted by Ask Parrots, such listings remain entirely subject to the rules, disclaimers, and liability waivers outlined in this Section 5 and Section 12. Parrots does not verify, guarantee, or endorse the feasibility, safety, or legality of any AI-inspired voyage.</div>
                <div style={styles.paragraph}><strong style={styles.boldHighlight}>Note: Parrots does not facilitate payments.</strong> Any financial arrangements made between users occur entirely outside the platform and are the sole responsibility of the parties involved.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="communication" style={styles.sectionTitle}>6. Communication Between Users</div>
                <div style={styles.paragraph}>Parrots allows users to communicate with each other through web-based messaging features. Messages may be false, misleading, or inappropriate, and Parrots does not monitor, control, or endorse user communications. Users are solely responsible for the content of their messages. All messages must adhere to the same standards of truth, accuracy, and moral conduct required by Section 3, and must not contain false, misleading, harmful, or deceptive content.</div>
                <div style={sectionContainer}>
                    <div style={styles.sectionTitle2}><strong>a. Message Notifications, Badge, and Read Status (mobile app)</strong></div>
                    <div style={styles.paragraph}>Our app includes notification features designed to inform users about new messages. This includes an in-app badge as well as device-level push notifications when the app is in the background or inactive.</div>
                    <div style={styles.paragraph}>We process message status information (read/unread) to operate messaging features and notification badges.</div>
                    <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• When the app is launched, if there are unread messages.</div>
                    <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• When a new message is received while not actively viewing that conversation.</div>
                    <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• When the app is reconnected or resumed after being inactive.</div>
                    <div style={styles.paragraph}>The badge is provided for informational purposes only and may not always reflect exact real-time status.</div>
                </div>
                <div style={sectionContainer}>
                    <div style={styles.sectionTitle2}><strong>b. Messages Sent After Bid Acceptance</strong></div>
                    <div style={styles.paragraph}>When a user accepts a bid, a message will be sent through the platform's messaging system to the creator of the bid on behalf of the accepting user.</div>
                    <div style={styles.paragraph}>By accepting or placing a bid, users acknowledge and agree that such messages are a core feature of the platform and consent to receiving and sending these communications.</div>
                </div>
                <div style={sectionContainer}>
                    <div style={styles.sectionTitle2}><strong>c. Message Encryption & Data</strong></div>
                    <div style={styles.paragraph}>Messages are encrypted when stored on our servers. However, message content is transmitted to and processed on our servers as plain text before encryption, and is not end-to-end encrypted.</div>
                    <div style={styles.paragraph}><strong style={styles.boldHighlight}>We recommend you do not share sensitive personal information through the messaging feature</strong>, including passwords, financial details, passport information, or home addresses.</div>
                    <div style={styles.paragraph}>Message content may be accessed by Parrots staff where required by law or to enforce our policies. Messages may be retained for as long as necessary to operate the service and may be deleted at Parrots' discretion or as required by applicable law.</div>
                    <div style={{ marginTop: "1rem" }}>
                        <div style={styles.sectionTitle2}><strong>d. Group Conversations</strong></div>
                        <div style={styles.paragraph}>Group conversations can be created by any registered user. The creator is the group administrator and may add or remove members. All members have access to the full message history from the group's creation.</div>
                    </div>
                </div>
            </div>

            <div style={transparentWrapper}>
                <div id="prohibited" style={styles.sectionTitle}>7. Prohibited Activities</div>
                <div style={styles.paragraph}><strong style={styles.boldHighlight}>Users must not post illegal, harmful, or offensive content; harass or threaten others; manipulate, mislead, or defraud other users; or violate intellectual property rights.</strong></div>
                <div style={styles.paragraph}>Users must not:</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Impersonate any real person, business, or organisation</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Create multiple accounts to manipulate listings, bids, or platform visibility</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Post content containing external links for commercial or promotional purposes without Parrots' consent</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Use the platform to collect personal information from other users for purposes unrelated to genuine voyage participation</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Use automated scripts, bots, scrapers, or unauthorized tools to extract data, routes, or content from the platform, including Ask Parrots</div>
                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Post content or behave in a manner that is unlawful, fraudulent, deceptive, threatening, harassing, defamatory, obscene, discriminatory, or harmful to other users</div>
                <div style={styles.sectionTitle2}>Content Moderation and Removal</div>
                <div style={styles.paragraph}>Parrots reserves the right, but not the obligation, to review, restrict, or remove any voyage, vehicle listing, or related content at its sole discretion.</div>
                <div style={styles.paragraph}>Removal of content does not imply wrongdoing by the user, and Parrots is not required to provide prior notice, explanation, or justification, except where required by applicable law.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="suspension" style={styles.sectionTitle}>8. Account Suspension and Termination</div>
                <div style={styles.paragraph}><strong style={styles.boldHighlight}>Parrots reserves the right to suspend, restrict, or permanently terminate any user account at its sole discretion, at any time, without prior notice</strong>, for any reason including but not limited to: breach of these Terms, suspicious activity, prolonged inactivity, or behaviour that Parrots reasonably considers harmful to the platform or its users.</div>
                <div style={styles.paragraph}>Users whose accounts are terminated for serious violations (including fraud, harassment, or illegal activity) will not be eligible for re-registration. For other terminations, re-registration may be permitted at Parrots' discretion.</div>
                <div style={styles.paragraph}>Upon termination of an account, all rights granted to the user under these Terms will immediately cease. Parrots reserves the right, but has no obligation, to delete user content, profiles, or associated data following termination. Terminated accounts with unused ParrotCrackers are not entitled to a refund, except where required by applicable Turkish consumer protection law.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="ip" style={styles.sectionTitle}>9. Intellectual Property</div>
                <div style={styles.paragraph}>Users retain ownership of content they post, but grant Parrots a worldwide, non-exclusive, royalty-free license to host, store, reproduce, display, modify, and transmit such content solely for the purpose of operating the Service. This includes transmitting user-provided inputs to third-party AI services such as Google Gemini solely for the purposes described in these Terms. Users warrant that they own or have the necessary rights to share all content uploaded.</div>
                <div style={styles.paragraph}>All platform software, branding, UI designs, trademarks, and features associated with Parrots and Ask Parrots are the exclusive property of A. Zeren and are protected under applicable intellectual property laws. Users must not copy, modify, distribute, or reverse engineer any part of the platform without express written permission.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="liability" style={styles.sectionTitle}>10. Limitation of Liability</div>
                <div style={styles.paragraph}>Users assume full liability, risk, and responsibility for their participation in any voyages, use of vehicles, interactions with other users, and reliance on platform content, AI features (including Ask Parrots), or AI-generated suggestions.</div>
                <div style={styles.paragraph}><strong style={styles.boldHighlight}>To the maximum extent permitted by applicable law, Parrots shall not be liable for any indirect, incidental, consequential, special, or similar losses arising from use of the Service.</strong></div>
                <div style={styles.paragraph}>Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded under applicable law.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="disclaimers" style={styles.sectionTitle}>11. Disclaimers</div>
                <div style={styles.paragraph}>The platform is provided "as is" and "as available" without warranties of any kind, express or implied. Parrots does not guarantee the accuracy, reliability, safety, or suitability of any content, listings, communications, or AI-generated features.</div>
                <div style={sectionContainer}>
                    <div style={styles.sectionTitle2}><strong>No payments:</strong></div>
                    <div style={styles.paragraph}>Parrots does not facilitate any payments, transactions, or financial obligations. Any financial arrangements occur entirely outside the platform.</div>
                    <div style={styles.sectionTitle2}><strong>No guarantees:</strong></div>
                    <div style={styles.paragraph}><strong style={styles.boldHighlight}>Parrots does not guarantee that any voyage will happen, that users are truthful, or that content is accurate. While Ask Parrots is engineered to provide helpful travel suggestions, Parrots does not guarantee that AI-generated routes or tips will be correct, safe, or feasible in reality.</strong></div>
                    <div style={styles.sectionTitle2}><strong>No endorsement:</strong></div>
                    <div style={styles.paragraph}>Users, vehicles, listings, and content are not endorsed, verified, or guaranteed by Parrots.</div>
                </div>
            </div>

            <div style={transparentWrapper}>
                <div id="ai-content" style={styles.sectionTitle}>12. AI-Generated Content (Ask Parrots)</div>
                <div style={styles.sectionTitle2}>1. Nature of AI Suggestions</div>
                <div style={styles.paragraph}>"Ask Parrots" features AI-generated travel suggestions powered by third-party AI technology (currently Google Gemini, which may be changed or updated without prior notice or approval). While Ask Parrots is engineered to provide helpful travel suggestions, responses are generated programmatically and may contain inaccuracies, outdated information, or incomplete routing. Parrots does not guarantee that AI-generated routes or tips will be correct, safe, or feasible in reality. Suggestions do not constitute professional, safety, or travel planning advice.</div>
                <div style={styles.sectionTitle2}>2. Location & Query Data</div>
                <div style={styles.paragraph}>By using Ask Parrots, your selected search location coordinates, chosen vehicle type, voyage duration, and vibe preferences are transmitted to Parrots servers and forwarded to the AI provider solely to process and generate your request, in accordance with these Terms.</div>
                <div style={styles.sectionTitle2}>3. Travel Safety, Legal Compliance & Independent Verification</div>
                <div style={styles.paragraph}>You assume full liability for your personal safety, compliance with local traffic and maritime laws, adherence to physical road, water, or path conditions, and possession of all necessary legal documents (including valid passports, visas, licenses, permits, vessel certifications, etc.). Always independently verify route feasibility, venue operating hours, local regulations, and safety conditions before embarking on any suggested voyage.</div>
                <div style={styles.sectionTitle2}>4. No Liability & Disclaimer of Warranties</div>
                <div style={styles.paragraph}>Ask Parrots is provided on an "AS IS" and "AS AVAILABLE" basis. To the maximum extent permitted by law, Parrots accepts no liability for any loss arising from reliance on AI-generated suggestions.</div>
                <div style={styles.sectionTitle2}>5. Usage Limits, Costs & Service Availability</div>
                <div style={styles.paragraph}>Usage of Ask Parrots may be subject to rate limits or temporary suspensions. Each Ask Parrots query consumes 1 ParrotCracker. Parrots reserves the right to adjust this rate or pricing structure at any time.</div>
                <div style={styles.sectionTitle2}>6. AI Inputs & Output Ownership</div>
                <div style={styles.paragraph}>You retain ownership of the custom inputs (such as vibe preferences, vehicle choices, and location parameters) that you provide to Ask Parrots. However, you acknowledge that AI-generated responses are produced programmatically and may be similar to or identical with outputs provided to other users. You may use Ask Parrots outputs for personal voyage planning. Redistribution or republication of AI-generated outputs outside the platform is not permitted.</div>
                <div style={styles.sectionTitle2}>7. Prohibited AI Usage</div>
                <div style={styles.paragraph}>You must not attempt to reverse engineer, scrape, extract, or use automated scripts to harvest bulk data, routes, or suggestions from Ask Parrots, nor use the AI tool to generate spam, malicious, unlawful, or deceptive content.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="modifications" style={styles.sectionTitle}>13. Modifications</div>
                <div style={styles.paragraph}>Parrots may update or modify these Terms at any time. When we make material changes, we may notify users through the platform or via email. Continued use of the platform after changes take effect constitutes your acceptance of the updated Terms.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="privacy" style={styles.sectionTitle}>14. Privacy Policy</div>
                <div style={styles.paragraph}>Parrots respects your privacy and is committed to protecting your personal data.</div>
                <div style={styles.sectionTitle2}>a. Information We Collect</div>
                <div style={styles.paragraph}>Parrots may collect information that users voluntarily provide, including profile details, images, vehicle and voyage information, messages, and contact details.</div>
                <div style={styles.sectionTitle2}>b. Automatically Collected Data</div>
                <div style={styles.paragraph}>Limited technical data may be collected automatically, such as device type, app version, error logs, and IP address, for security and service improvement purposes only.</div>
                <div style={styles.sectionTitle2}>c. How We Use Data</div>
                <div style={styles.paragraph}>We process personal data exclusively for core platform operations, security, and customer support. AI-powered features, including Ask Parrots, operate on a strict per-request basis, transmitting only isolated query parameters without linking your personal account identity. Parrots never sells personal data or uses personal data for advertising or user profiling.</div>
                <div style={styles.sectionTitle2}>d. Legal Basis</div>
                <div style={styles.paragraph}>Data is processed based on user consent, contractual necessity, legitimate interests (such as platform security), and applicable legal obligations.</div>
                <div style={styles.sectionTitle2}>e. Data Sharing</div>
                <div style={styles.paragraph}>Parrots does not share personal data with third parties for marketing purposes. The following query parameters are transmitted to third-party AI service providers, currently Google Gemini, solely to process and fulfill user requests through Ask Parrots: user-selected map coordinates (manually chosen by the user and not obtained from device GPS), vehicle type, voyage duration, vibe preference, and discovery style. No account identifiers, names, email addresses, contact details, or other direct account-identifying information are included in these transmissions. <strong style={styles.boldHighlight}>All user-generated content — including profiles, profile and background images, contact details, vehicle listings, voyage listings, bids, and related content, etc. — is visible to all registered users of the platform.</strong></div>
                <div style={styles.sectionTitle2}>f. User Communications</div>
                <div style={styles.paragraph}>Direct messages between users are private. Group conversations are accessible to all current and newly added members, including message history from before they joined. Parrots does not actively monitor, verify, or endorse user communications.</div>
                <div style={styles.sectionTitle2}>g. Data Retention</div>
                <div style={styles.paragraph}>Personal data is retained only as long as necessary to operate the service or comply with legal requirements. Message content may be deleted after a retention period of up to 2 years.</div>
                <div style={styles.sectionTitle2}>h. User Rights</div>
                <div style={styles.paragraph}>Users have the right to access, correct, delete, or restrict processing of their personal data, and to withdraw consent at any time, in accordance with applicable data protection laws (including KVKK and GDPR where applicable). Note: Deletion requests may be deferred where data is necessary to fulfil ongoing platform obligations, such as active voyages or pending bids, after which deletion will be processed promptly.</div>
                <div style={styles.sectionTitle2}>i. Children's Privacy</div>
                <div style={styles.paragraph}>Parrots is not intended for users under the age of 18 and does not knowingly collect data from minors.</div>
                <div style={styles.sectionTitle2}>j. Changes to Privacy Policy</div>
                <div style={styles.paragraph}>Parrots may update this Privacy Policy from time to time. Continued use of the platform constitutes acceptance of the updated policy.</div>
                <div style={styles.sectionTitle2}>k. Local Device Storage</div>
                <div style={styles.paragraph}>Parrots may store certain information locally on your device, such as login credentials, preferences, and app settings, to maintain your session and improve functionality. This data is not shared with third parties.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="dispute" style={styles.sectionTitle}>15. Dispute Resolution</div>
                <div style={styles.paragraph}>In the event of a dispute, users are encouraged to contact Parrots at parrotsapp@gmail.com in the first instance to seek an informal resolution. Users retain the right to bring claims before a court of competent jurisdiction where the operator is established.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="law" style={styles.sectionTitle}>16. Governing Law</div>
                <div style={styles.paragraph}>These Terms are governed by the laws of the Republic of Türkiye, subject to any mandatory rights that cannot be waived under the applicable law of your country of residence. Nothing in these Terms affects your right to bring claims before courts with mandatory jurisdiction over consumer disputes.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="termination" style={styles.sectionTitle}>17. Service Termination and Discontinuation</div>
                <div style={styles.paragraph}>Parrots reserves the right to modify, suspend, or permanently discontinue the Service at any time without prior notice.</div>
                <div style={styles.paragraph}>Purchased ParrotCracker credits are non-refundable under normal operating circumstances and cannot be exchanged for cash. However, in the event of permanent platform discontinuation, any unused paid ParrotCracker credits—as well as the prorated value of any active, paid features or future listings paid for in advance—will be eligible for a proportional refund, and user accounts will remain accessible for a final 30-day wind-down period.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="refund" style={styles.sectionTitle}>18. Refund Policy</div>
                <div style={styles.sectionTitle2}>a. ParrotCrackers and Paid Credits</div>
                <div style={styles.paragraph}>Purchases of ParrotCrackers and digital credits are final and non-refundable, except where a technical error by Parrots prevented credits from being applied, the Service is permanently discontinued (as outlined in Section 17), or applicable consumer protection law mandates a statutory right to a refund. ParrotCrackers are typically credited to your account shortly after payment confirmation. By completing a purchase, users acknowledge this and consent to waive any applicable right of withdrawal for digital content.</div>
                <div style={styles.sectionTitle2}>b. Third-Party Platform Purchases</div>
                <div style={styles.paragraph}>Where purchases are made through third-party platforms (such as Apple App Store or Google Play), the refund policies of those platforms apply and take precedence over this policy.</div>
                <div style={styles.sectionTitle2}>c. How to Request a Refund</div>
                <div style={styles.paragraph}>If you experience a verified technical error preventing credit delivery, contact parrotsapp@gmail.com within 14 days of purchase. Include your registered email address, the date of purchase, and a description of the issue.</div>
            </div>

            <div style={transparentWrapper}>
                <div id="contact" style={styles.sectionTitle}>19. Contact & Legal Entity</div>

                <div style={styles.paragraph}>For questions regarding these Terms or the service:</div>
                <div style={styles.paragraph}>• <strong>Operator:</strong> A. Zeren (Sole Proprietorship)<br />• <strong>Tax ID:</strong> 9980412824<br />• <strong>Email:</strong> parrotsapp@gmail.com</div>
            </div>


{onAccept && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1.5rem 0 0.5rem", gap: "0.75rem" }}>
                    <button onClick={onAccept} style={{ backgroundColor: "rgb(24, 111, 241)", color: "white", border: "2px solid #3c9dee42", borderRadius: "1.5rem", padding: "0.2rem", fontSize: "1.3rem", fontWeight: 700, cursor: "pointer", width: "100%", maxWidth: "400px" }}>
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
