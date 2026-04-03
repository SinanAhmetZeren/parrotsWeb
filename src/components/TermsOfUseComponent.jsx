import { color, text } from "d3";
import React, { useState } from "react";
import { parrotBlue, parrotButtonGreen, parrotDarkBlue, parrotGreen, parrotGreyTransparent, parrotRed, parrotTextDarkBlue } from "../styles/colors";
import logoMini from '../assets/images/ParrotsLogoHead.png';

const TermsOfUseComponent = ({ open: controlledOpen, onClose } = {}) => {
    const [isOpen, setIsOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const modalOpen = isControlled ? controlledOpen : isOpen;

    const toggleModal = () => {
        if (isControlled) {
            onClose?.();
        } else {
            setIsOpen(prev => !prev);
        }
    };

    // Inline styles as JS objects
    const styles = {
        modalOpenButton: {
            backgroundColor: "#007bff",
            color: "white",
            padding: "0.6rem 1.2rem",
            border: "none",
            borderRadius: "1rem",
            cursor: "pointer",
            fontSize: "1rem",
            margin: "1rem",
        },
        modalOverlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            overflowY: "auto",
            padding: "1rem",
        },
        modalContent: {
            position: "relative",
            backgroundColor: "#fff",
            maxWidth: "900px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        },
        modalCloseButton: {
            position: "absolute",
            top: "1rem",
            right: "1rem",
            fontSize: "2rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#333",
        },
        termsContainer: {
            maxWidth: "900px",
            margin: "0 auto",
            fontFamily: "Arial, sans-serif",
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
        bold: {
            fontWeight: "bold",
        },
        link: {
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
        },
    };

    const sectionContainer = {
        padding: "1rem",
    };

    const transparentWrapper = {
        backgroundColor: parrotGreyTransparent,
        padding: "1rem",
        marginTop: "1rem",
        border: `2px solid rgb(222, 222, 222)`,
        borderRadius: "0.5rem",
    }

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (

        <>
            {!isControlled && (
                <button style={navigationButton} onClick={toggleModal}>
                    <span>Terms of Use</span>
                </button>
            )}

            {modalOpen && (
                <div style={styles.modalOverlay} onClick={toggleModal}>
                    <div
                        style={styles.modalContent}
                        className="scrollable-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <style>
                            {`
                                .scrollable-modal::-webkit-scrollbar {
                                width: 10px;
                                }
                                .scrollable-modal::-webkit-scrollbar-track {
                                background: ${parrotDarkBlue};
                                border-radius: 5px;
                                }
                                .scrollable-modal::-webkit-scrollbar-thumb {
                                background: ${parrotBlue};
                                border-radius: 5px;
                                }
                                .scrollable-modal::-webkit-scrollbar-thumb:hover {
                                background: ${parrotBlue};
                                }
                            `}
                        </style>


                        <button style={styles.modalCloseButton} onClick={toggleModal}>
                            &times;
                        </button>

                        <div style={styles.termsContainer}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                                <img src={logoMini} alt="Parrots Logo" style={{ width: "3rem", marginBottom: "1rem" }} />
                                <div style={styles.titleMain}>
                                    Parrots
                                </div>
                            </div>





                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    justifyItems: "start",
                                    alignItems: "start",
                                    columnGap: "1rem",
                                    rowGap: "0.4rem",
                                    backgroundColor: "rgb(246, 246, 246)",
                                    border: "2px solid rgb(222, 222, 222)",
                                    width: "100%",
                                    margin: "auto",
                                    marginBottom: "2rem",
                                    paddingLeft: "2rem",
                                    paddingRight: "2rem",
                                    paddingBottom: "1rem",
                                    paddingTop: "1rem",
                                    borderRadius: "0.5rem",



                                }}
                            >
                                {[
                                    { num: "1.", text: "About Parrots", id: "about" },
                                    { num: "2.", text: "Eligibility", id: "eligibility" },
                                    { num: "3.", text: "Profile and Content Responsibilities", id: "profile" },
                                    { num: "4.", text: "Platform Neutrality and No Endorsement", id: "neutrality" },
                                    { num: "5.", text: "Voyages and Bids", id: "voyages" },
                                    { num: "6.", text: "Communication Between Users", id: "communication" },
                                    { num: "7.", text: "Prohibited Activities", id: "prohibited" },
                                    { num: "8.", text: "Account Suspension and Termination", id: "suspension" },
                                    { num: "9.", text: "Intellectual Property", id: "ip" },
                                    { num: "10.", text: "Limitation of Liability", id: "liability" },
                                    { num: "11.", text: "Disclaimers", id: "disclaimers" },
                                    { num: "12.", text: "Modifications", id: "modifications" },
                                    { num: "13.", text: "Privacy Policy", id: "privacy" },
                                    { num: "14.", text: "Dispute Resolution", id: "dispute" },
                                    { num: "15.", text: "Governing Law", id: "law" },
                                    { num: "16.", text: "Contact", id: "contact" },
                                ].map((item) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.3rem",
                                            cursor: "pointer",
                                            color: parrotTextDarkBlue,
                                            fontSize: "1.1rem",
                                            fontWeight: "bold"
                                        }}
                                        onClick={() => scrollToSection(item.id)}
                                    >
                                        <span style={{ minWidth: "1.5rem", textAlign: "left" }}>{item.num}</span>
                                        <span style={{ minWidth: "9.5rem", textAlign: "left" }}>{item.text}</span>
                                    </div>
                                ))}
                            </div>



                            <div style={styles.titleMain}>
                                Terms of Use, Privacy Policy & Disclaimer
                            </div>

                            <div style={transparentWrapper}>

                                <div id="about" style={styles.sectionTitle}>1. About Parrots</div>
                                <div style={styles.paragraph}>
                                    Parrots is a community platform designed to connect users who are interested in sharing information about vehicles, voyages, and related activities.  Users can:
                                </div>

                                <div style={sectionContainer}>

                                    <div>
                                        <div style={styles.sectionTitle2}>a. Create profiles</div>
                                        <div style={styles.paragraph}>
                                            Each user can make their own profile page, providing personal information they choose to share, such as a brief bio, social media links, and contact details.
                                        </div>
                                        <div style={styles.paragraph}>
                                            Profiles help other users identify who they are communicating with or interacting with on the platform.
                                        </div>

                                        <div style={styles.sectionTitle2}>b. Upload images</div>
                                        <div style={styles.paragraph}>
                                            Users can upload photos to their profile or their listings, such as pictures of themselves, their vehicles, or other relevant content.
                                        </div>
                                        <div style={styles.paragraph}>
                                            Parrots does not review or verify these images, so users are responsible for the content they upload.
                                        </div>

                                        <div style={styles.sectionTitle2}>c. List vehicles and voyages</div>
                                        <div style={styles.paragraph}>
                                            Users can add vehicles they own and propose voyages (trips, journeys, or rides) they intend to organize.
                                        </div>
                                        <div style={styles.paragraph}>
                                            Listings may include descriptions, dates, destinations, or other details to inform other users.
                                        </div>
                                        <div style={styles.paragraph}>
                                            Parrots does not verify whether these vehicles exist or whether voyages will actually take place.
                                        </div>

                                        <div style={styles.sectionTitle2}>d. Propose to join others' voyages</div>
                                        <div style={styles.paragraph}>
                                            Users can propose to join voyages listed by others, showing interest or proposing participation.
                                        </div>
                                        <div style={styles.paragraph}>
                                            Placing a bid does not create any legal or financial obligation, and Parrots does not enforce or guarantee that the voyage will occur.
                                        </div>

                                        <div style={styles.sectionTitle2}>e. Communicate</div>
                                        <div style={styles.paragraph}>
                                            Users can message or interact with each other within the platform to discuss voyages, or other topics.
                                        </div>
                                        <div style={styles.paragraph}>
                                            All communication is the responsibility of the users themselves. Parrots does not monitor, endorse, or guarantee the safety or truthfulness of these messages.
                                        </div>
                                    </div>


                                </div>

                                <div style={styles.paragraph}>
                                    Users are responsible for the content they post. Parrots does not verify user identities, guarantee voyage completion, or endorse any content.
                                </div>
                            </div>


                            <div style={transparentWrapper}>
                                <div id="eligibility" style={styles.sectionTitle}>2. Eligibility</div>
                                <div style={styles.paragraph}>
                                    Users must be at least 18 years old. By using Parrots, you confirm that you meet this age requirement and have the legal capacity to enter into this agreement under UK law.
                                </div>
                                <div style={styles.paragraph}>
                                    By creating an account or continuing to use the platform, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must not use the platform.
                                </div>
                            </div>



                            <div style={transparentWrapper}>
                                <div id="profile" style={styles.sectionTitle}>3. Profile and Content Responsibilities</div>
                                <div style={styles.paragraph}>
                                    Users are responsible for the accuracy and appropriateness of all content they post, including images, contact details, social media links, vehicles, and voyages. Parrots is not responsible for false or misleading content.
                                </div>
                            </div>

                            <div style={transparentWrapper}>
                                <div id="neutrality" style={styles.sectionTitle}>4. Platform Neutrality and No Endorsement</div>
                                <div style={styles.paragraph}>
                                    Parrots is a technology platform that enables users to list, discover, and bid on voyages and vehicle hire. Parrots does not create, own, operate, or control any voyage, vehicle, or service listed on the platform.
                                </div>
                                <div style={styles.paragraph}>We do not verify, approve, endorse, or guarantee:</div>
                                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• the accuracy or completeness of any listing</div>
                                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• the identity, credentials, or reliability of any user</div>
                                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• the quality, safety, or legality of any voyage or vehicle offered</div>
                                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• that any voyage will depart, arrive, or be completed as described</div>
                                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• any transaction, payment, or agreement made between users</div>
                                <div style={styles.paragraph}>
                                    All arrangements are made solely between the users involved. Parrots is not a party to any agreement, booking, or transaction between users and accepts no liability arising from them.
                                </div>
                                <div style={styles.paragraph}>
                                    Any reliance on listings, user profiles, or content posted by other users is at your own risk.
                                </div>
                            </div>

                            <div style={transparentWrapper}>
                                <div id="voyages" style={styles.sectionTitle}>5. Voyages and Bids</div>
                                <div style={styles.paragraph}>
                                    Users may list vehicles and propose voyages. They can place bids for voyages listed by others. Parrots does not guarantee any voyage will occur, be safe, or as described. Some listings may be fake or incomplete. Participation is at users’ own risk.
                                </div>
                                <div style={styles.sectionTitle2}>a. Accepted Bids and Voyage Owner Responsibility</div>
                                <div style={styles.paragraph}>
                                    When a voyage owner accepts a bid, this constitutes an expression of intent between users only. It does not create a legally binding contract, and Parrots is not a party to any such arrangement.
                                </div>
                                <div style={styles.paragraph}>
                                    Parrots does not guarantee that a voyage owner will follow through on an accepted bid, fulfil any stated arrangements, or communicate further after acceptance. Users who have had a bid accepted proceed entirely at their own risk.
                                </div>
                                <div style={styles.paragraph}>
                                    Parrots strongly recommends that users:
                                </div>
                                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Confirm arrangements directly with the voyage owner before making any personal plans</div>
                                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Do not make non-refundable bookings or financial commitments based solely on a bid acceptance within the app</div>
                                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Exercise caution when sharing personal contact details</div>
                                <div style={styles.paragraph}>
                                    Parrots shall not be held liable for any loss, inconvenience, or harm resulting from a voyage owner’s failure to proceed following bid acceptance.
                                </div>
                                <div style={styles.paragraph}>
                                    Note: Parrots does not facilitate payments. Any financial arrangements made between users occur entirely outside the platform and are the sole responsibility of the parties involved.
                                </div>
                            </div>





                            <div style={transparentWrapper}>
                                <div id="communication" style={styles.sectionTitle}>6. Communication Between Users</div>
                                <div style={styles.paragraph}>
                                    Parrots allows users to communicate with each other through web-based messaging features.
                                    Messages may be false, misleading, or inappropriate, and Parrots does not monitor, control, or endorse user communications. Users are solely responsible for the content of their messages.
                                    <div style={sectionContainer}>
                                        <div>
                                            <div style={styles.sectionTitle2}><strong>Message Notifications, Badge, and Read Status (mobile app)</strong></div>
                                            <div style={styles.paragraph}>
                                                Our app includes an in-app notification badge designed to inform users about new messages. This badge appears only within the app interface and is not a device-level or operating system notification.
                                            </div>
                                            <div style={styles.paragraph}>
                                                We process message status information (read/unread) to operate messaging features and notification badges.
                                            </div>
                                            <div style={styles.paragraph}>
                                                The in-app notification badge may appear in the following situations:
                                            </div>
                                            <div style={{ ...styles.paragraph, textIndent: "2rem" }}>
                                                • When the app is launched, if there are unread messages.
                                            </div>
                                            <div style={{ ...styles.paragraph, textIndent: "2rem" }}>
                                                • When a new message is received while using screens other than the Messages screen.
                                            </div>
                                            <div style={{ ...styles.paragraph, textIndent: "2rem" }}>
                                                • When the Messages screen is opened, messages may be automatically marked as read and the badge cleared.
                                            </div>
                                            <div style={styles.paragraph}>
                                                The badge is provided for informational purposes only and may not always reflect exact real-time status. Users are solely responsible for monitoring and reviewing their messages. Parrots does not guarantee that the badge will accurately reflect message status at all times and shall not be held responsible or liable for missed messages, unread messages, delayed badge updates, or any consequences arising from a user’s failure to review their messages.
                                            </div>
                                        </div>
                                    </div>

                                    <div style={sectionContainer}>
                                        <div>
                                            <div style={styles.sectionTitle2}>
                                                <strong>Messages Sent After Bid Acceptance</strong>
                                            </div>
                                            <div style={styles.paragraph}>
                                                When a user accepts a bid, a message will be sent through the platform’s
                                                messaging system to the creator of the bid on behalf of the accepting user.
                                            </div>
                                            <div style={styles.paragraph}>
                                                This message is a direct result of the accepting user’s action and is intended
                                                to allow users to communicate regarding the relevant voyage or listing.
                                            </div>
                                            <div style={styles.paragraph}>
                                                This is not a marketing message or notification, but a functional communication necessary
                                                for the operation of the service.
                                            </div>
                                            <div style={styles.paragraph}>
                                                By accepting or placing a bid, users acknowledge and agree that such messages are a core feature of the platform and consent to receiving and sending these communications.
                                            </div>
                                            <div style={styles.paragraph}>
                                                Parrots does not monitor, verify, or guarantee the content, accuracy, or outcome of these communications. Users are solely responsible for their interactions and any arrangements made.
                                            </div>
                                        </div>
                                    </div>
                                    <div style={sectionContainer}>
                                        <div>
                                            <div style={styles.sectionTitle2}>
                                                <strong>Message Delivery and Refresh Limitations</strong>
                                            </div>
                                            <div style={styles.paragraph}>
                                                While the App strives to provide real-time message updates, message
                                                delivery and automatic refresh may not always occur immediately, particularly
                                                if the App has been idle, the device is in sleep mode, or network conditions are poor.
                                                Users are responsible for ensuring that they have an active
                                                connection and that the App is open to receive the latest messages.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={transparentWrapper}>
                                <div id="prohibited" style={styles.sectionTitle}>
                                    7. Prohibited Activities
                                </div>

                                <div style={styles.paragraph}>
                                    Users must not post illegal, harmful, or offensive content; harass or
                                    threaten others; manipulate, mislead, or defraud other users; or violate
                                    intellectual property rights.
                                </div>
                                <div style={styles.paragraph}>Users must not:</div>
                                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Impersonate any real person, business, or organisation</div>
                                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Create multiple accounts to manipulate listings, bids, or platform visibility</div>
                                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Post content containing external links for commercial or promotional purposes without Parrots' consent</div>
                                <div style={{ ...styles.paragraph, textIndent: "2rem" }}>• Use the platform to collect personal information from other users for purposes unrelated to genuine voyage participation</div>

                                <div style={styles.sectionTitle2}>
                                    Content Moderation and Removal
                                </div>

                                <div style={styles.paragraph}>
                                    Parrots reserves the right, but not the obligation, to review, restrict, or
                                    remove any voyage, vehicle listing, or related content at its sole
                                    discretion. This may include content that appears to be fake, misleading,
                                    fraudulent, outdated, inactive for an extended period, or otherwise
                                    inconsistent with the purpose of the platform or these Terms.
                                </div>

                                <div style={styles.paragraph}>
                                    Removal of content does not imply wrongdoing by the user, and Parrots is not
                                    required to provide prior notice, explanation, or justification.
                                </div>
                            </div>



                            <div style={transparentWrapper}>
                                <div id="suspension" style={styles.sectionTitle}>8. Account Suspension and Termination</div>
                                <div style={styles.paragraph}>
                                    Parrots reserves the right to suspend, restrict, or permanently terminate any user account at its sole discretion, at any time, without prior notice, for any reason including but not limited to: breach of these Terms, suspicious activity, prolonged inactivity, or behaviour that Parrots reasonably considers harmful to the platform or its users.
                                </div>
                                <div style={styles.paragraph}>
                                    Terminated users may not re-register without express permission from Parrots.
                                </div>
                            </div>

                            <div style={transparentWrapper}>
                                <div id="ip" style={styles.sectionTitle}>9. Intellectual Property</div>
                                <div style={styles.paragraph}>
                                    Users retain ownership of content they post but grant Parrots a non-exclusive, royalty-free license to display it for the purpose of operating the service. Users must have the right to share all content uploaded.
                                </div>
                            </div >

                            <div style={transparentWrapper}>
                                <div id="liability" style={styles.sectionTitle}>10. Limitation of Liability</div>
                                <div style={styles.paragraph}>
                                    Parrots is not liable for any direct, indirect, incidental, consequential, or special losses or damages arising from use of the platform, including but not limited to loss of data, loss of opportunity, personal injury, or property damage. To the maximum extent permitted by law, Parrots' total liability to any user shall not exceed zero, as the platform is provided free of charge.
                                </div>
                                <div style={styles.paragraph}>
                                    Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded under applicable UK law.
                                </div>
                            </div>
                            <div style={transparentWrapper}>
                                <div id="disclaimers" style={styles.sectionTitle}>11. Disclaimers</div>
                                <div style={styles.paragraph}>
                                    The platform is provided “as is” without warranties. Parrots does not guarantee accuracy, reliability, or safety of content, listings, or communications.
                                </div>

                                <div style={sectionContainer}>
                                    <div>
                                        <div style={styles.sectionTitle2}><strong>No payments:</strong></div>
                                        <div style={styles.paragraph}>Parrots does not facilitate any payments, transactions, or financial obligations. Any arrangement outside the platform is entirely between users.</div>
                                        <div style={styles.sectionTitle2}><strong>No guarantees</strong></div>
                                        <div style={styles.paragraph}>Parrots does not guarantee that any voyage will happen, that users are truthful, or that content is accurate.</div>
                                        <div style={styles.sectionTitle2}><strong>No endorsement</strong></div>
                                        <div style={styles.paragraph}>Users and content are not endorsed or verified by Parrots. Users should exercise caution and discretion when interacting with others.</div>
                                    </div>
                                </div>
                            </div>
                            <div style={transparentWrapper}>
                                <div id="modifications" style={styles.sectionTitle}>12. Modifications</div>
                                <div style={styles.paragraph}>
                                    Parrots may update these Terms at any time. Where changes are material, Parrots will make reasonable efforts to notify users, such as by displaying a notice within the app or sending an email to the registered address. Continued use of the platform after changes take effect constitutes acceptance of the updated Terms. Users who do not agree to updated Terms should stop using the platform and may request account deletion.
                                </div>
                            </div>

                            <div style={transparentWrapper}>
                                <div id="privacy" style={styles.sectionTitle}>13. Privacy Policy</div>

                                <div style={styles.paragraph}>
                                    Parrots respects your privacy and is committed to protecting your personal data. This section explains how information is collected, used, stored, and protected when you use the platform.
                                </div>

                                <div style={styles.sectionTitle2}>a. Information We Collect</div>
                                <div style={styles.paragraph}>
                                    Parrots may collect information that users voluntarily provide, including profile details, images, vehicle and voyage information, messages, and contact details. Users choose what information to share.
                                </div>
                                <div style={styles.paragraph}>
                                    Parrots does not verify the accuracy of user-provided information.
                                </div>

                                <div style={styles.sectionTitle2}>b. Automatically Collected Data</div>
                                <div style={styles.paragraph}>
                                    Limited technical data may be collected automatically, such as device type, app version, error logs, and IP address, for security and service improvement purposes only.
                                </div>

                                <div style={styles.sectionTitle2}>c. How We Use Data</div>
                                <div style={styles.paragraph}>
                                    Personal data is used solely to operate and maintain the platform, enable user interaction, display content, ensure security, and respond to support requests.
                                </div>
                                <div style={styles.paragraph}>
                                    Parrots does not sell user data and does not use personal data for advertising or profiling.
                                </div>

                                <div style={styles.sectionTitle2}>d. Legal Basis</div>
                                <div style={styles.paragraph}>
                                    Data is processed based on user consent, contractual necessity, legitimate interests (such as platform security), and legal obligations under UK GDPR.
                                </div>

                                <div style={styles.sectionTitle2}>e. Data Sharing</div>
                                <div style={styles.paragraph}>
                                    Parrots does not share personal data with third parties for marketing purposes. Information is visible to other users only where users choose to make it public (e.g., profiles, listings, messages).
                                </div>
                                <div style={styles.paragraph}>
                                    Parrots uses trusted third-party infrastructure providers to store and serve data, including file storage and hosting services. These providers act as data processors under UK GDPR and are engaged under appropriate data processing terms. They do not have independent access to your data for their own purposes.
                                </div>

                                <div style={styles.sectionTitle2}>f. User Communications</div>
                                <div style={styles.paragraph}>
                                    Messages between users are private. Parrots does not actively monitor, verify, or endorse user communications.
                                </div>

                                <div style={styles.sectionTitle2}>g. Data Retention</div>
                                <div style={styles.paragraph}>
                                    Personal data is retained only as long as necessary to operate the service or comply with legal requirements. Users may request deletion of their account and associated data.
                                </div>

                                <div style={styles.sectionTitle2}>h. User Rights</div>
                                <div style={styles.paragraph}>
                                    Users have the right to access, correct, delete, or restrict processing of their personal data, and to withdraw consent at any time, in accordance with UK GDPR.
                                </div>

                                <div style={styles.sectionTitle2}>i. Children’s Privacy</div>
                                <div style={styles.paragraph}>
                                    Parrots is not intended for users under the age of 18 and does not knowingly collect data from minors.
                                </div>

                                <div style={styles.sectionTitle2}>j. Changes to Privacy Policy</div>
                                <div style={styles.paragraph}>
                                    Parrots may update this Privacy Policy from time to time. Continued use of the platform constitutes acceptance of the updated policy.
                                </div>


                                <div style={styles.sectionTitle2}>k. Local Device Storage</div>
                                <div style={styles.paragraph}>


                                    Parrots may store certain information locally on your device,
                                    such as login credentials, preferences, and app settings, to maintain your session and improve functionality.
                                    This data is not shared with third parties and can be cleared by you at any time.

                                </div>

                            </div>


                            <div style={transparentWrapper}>
                                <div id="dispute" style={styles.sectionTitle}>14. Dispute Resolution</div>
                                <div style={styles.paragraph}>
                                    In the event of a dispute, users are encouraged to contact Parrots at parrotsapp@gmail.com in the first instance to seek an informal resolution.
                                </div>
                                <div style={styles.paragraph}>
                                    Parrots does not currently participate in any formal Alternative Dispute Resolution (ADR) scheme. Users retain the right to bring claims before a UK court of competent jurisdiction.
                                </div>
                            </div>

                            <div style={transparentWrapper}>
                                <div id="law" style={styles.sectionTitle}>15. Governing Law</div>
                                <div style={styles.paragraph}>
                                    These Terms are governed by the laws of the United Kingdom. Disputes shall be subject to UK courts.
                                </div>
                            </div>

                            <div style={transparentWrapper}>

                                <div id="contact" style={styles.sectionTitle}>16. Contact</div>
                                <div style={styles.paragraph}>
                                    For questions regarding these Terms:
                                    <br />
                                    Email: parrotsapp@gmail.com
                                    <br />
                                    Location: United Kingdom
                                </div>
                            </div>



                        </div >
                    </div >
                </div >
            )}
        </>

    );
};

export default TermsOfUseComponent;


const navigationButton = {
    borderRadius: "1.5rem",
    backgroundColor: "white",
    color: "#007bff",
    padding: "0.2rem 0.8rem",
    textAlign: "center",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1.1rem",
    border: "none",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
    transition: "box-shadow 0.2s ease",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
};