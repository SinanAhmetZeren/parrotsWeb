import React from "react";

const blue = "#1a3a6b";
const lightBg = "#f6f8fc";

export default function PrivacyPolicyPage() {
  return (
    <div style={page}>
      <div style={container}>
        <h1 style={title}>Terms of Use, Privacy Policy &amp; Disclaimer</h1>
        <p style={version}>Parrots Voyages — parrotsvoyages.com</p>

        <nav style={toc}>
          {sections.map((s, i) => (
            <a key={i} href={`#s${i + 1}`} style={tocLink}>{s.heading}</a>
          ))}
        </nav>

        {sections.map((s, i) => (
          <section key={i} id={`s${i + 1}`} style={section}>
            <h2 style={h2}>{s.heading}</h2>
            <div style={body}>{s.content}</div>
          </section>
        ))}

        <p style={footer}>Contact: parrotsapp@gmail.com · United Kingdom</p>
      </div>
    </div>
  );
}

const sections = [
  {
    heading: "1. About Parrots",
    content: (
      <>
        <p>Parrots is a community platform designed to connect users who are interested in sharing information about vehicles, voyages, and related activities. Users can:</p>
        <ul>
          <li><b>Create profiles</b> — personal information they choose to share, such as a brief bio, social media links, and contact details.</li>
          <li><b>Upload images</b> — photos to their profile or listings. Parrots does not review or verify these images.</li>
          <li><b>List vehicles and voyages</b> — descriptions, dates, and destinations. Parrots does not verify whether vehicles exist or voyages will take place.</li>
          <li><b>Propose to join voyages</b> — placing a bid does not create any legal or financial obligation.</li>
          <li><b>Communicate</b> — in-app messaging between users. Parrots does not monitor or guarantee the safety of messages.</li>
        </ul>
        <p>Users are responsible for the content they post. Parrots does not verify user identities, guarantee voyage completion, or endorse any content.</p>
      </>
    ),
  },
  {
    heading: "2. Eligibility",
    content: (
      <>
        <p><b>Users must be at least 18 years old.</b> By using Parrots, you confirm that you meet this age requirement and have the legal capacity to enter into this agreement under UK law.</p>
        <p>By creating an account or continuing to use the platform, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must not use the platform.</p>
      </>
    ),
  },
  {
    heading: "3. Profile and Content Responsibilities",
    content: (
      <>
        <p>Users are responsible for the accuracy and appropriateness of all content they post. Parrots is not responsible for false or misleading content.</p>
        <p><b>User profiles and voyage listings are publicly accessible by anyone with the link, regardless of whether the user has chosen to display them on the public map. Users should not include personal information they are not comfortable being publicly visible.</b></p>
      </>
    ),
  },
  {
    heading: "4. Platform Neutrality and No Endorsement",
    content: (
      <>
        <p>Parrots is a technology platform that enables users to list, discover, and bid on voyages and vehicle hire. Parrots does not create, own, operate, or control any voyage, vehicle, or service listed on the platform.</p>
        <p>We do not verify, approve, endorse, or guarantee:</p>
        <ul>
          <li>the accuracy or completeness of any listing</li>
          <li>the identity, credentials, or reliability of any user</li>
          <li>the quality, safety, or legality of any voyage or vehicle offered</li>
          <li>that any voyage will depart, arrive, or be completed as described</li>
          <li>any transaction, payment, or agreement made between users</li>
        </ul>
        <p>All arrangements are made solely between the users involved. Parrots is not a party to any agreement, booking, or transaction between users and accepts no liability arising from them.</p>
      </>
    ),
  },
  {
    heading: "5. Voyages and Bids",
    content: (
      <>
        <p>Parrots does not guarantee any voyage will occur, be safe, or as described. <b>Participation is at users' own risk.</b></p>
        <p><b>Accepted Bids:</b> When a voyage owner accepts a bid, this constitutes an expression of intent between users only. It does not create a legally binding contract.</p>
        <p>Parrots strongly recommends that users:</p>
        <ul>
          <li>Confirm arrangements directly with the voyage owner before making any personal plans</li>
          <li><b>Do not make non-refundable bookings or financial commitments based solely on a bid acceptance within the app</b></li>
          <li>Exercise caution when sharing personal contact details</li>
        </ul>
        <p><b>Note: Parrots does not facilitate payments.</b> Any financial arrangements made between users occur entirely outside the platform.</p>
      </>
    ),
  },
  {
    heading: "6. Communication Between Users",
    content: (
      <>
        <p>Parrots allows users to communicate through in-app messaging. Messages may be false, misleading, or inappropriate, and Parrots does not monitor or endorse user communications.</p>
        <p><b>Notifications &amp; Badge:</b> Our app includes push notifications and an in-app badge for unread messages. These require permission on your device and can be managed through device settings.</p>
        <p><b>Message Encryption &amp; Data:</b> Messages are encrypted when stored on our servers. However, message content is not end-to-end encrypted — it is processed as plain text before encryption. <b>We recommend you do not share sensitive personal information through messaging</b>, including passwords, financial details, passport information, or home addresses.</p>
        <p>Message content may be accessed by Parrots staff where required by law or to enforce our policies. Messages may be deleted after a retention period of up to 2 years.</p>
        <p><b>Group Conversations:</b> Group conversations can be created by any registered user. The creator is the group administrator and may add or remove members. All members have access to the full message history from the group's creation.</p>
      </>
    ),
  },
  {
    heading: "7. Prohibited Activities",
    content: (
      <>
        <p><b>Users must not post illegal, harmful, or offensive content; harass or threaten others; or violate intellectual property rights.</b></p>
        <p>Users must not:</p>
        <ul>
          <li>Impersonate any real person, business, or organisation</li>
          <li>Create multiple accounts to manipulate listings, bids, or platform visibility</li>
          <li>Post content containing external links for commercial or promotional purposes without Parrots' consent</li>
          <li>Use the platform to collect personal information from other users for purposes unrelated to genuine voyage participation</li>
        </ul>
        <p>Parrots reserves the right to review, restrict, or remove any content at its sole discretion.</p>
      </>
    ),
  },
  {
    heading: "8. Account Suspension and Termination",
    content: (
      <p><b>Parrots reserves the right to suspend, restrict, or permanently terminate any user account at its sole discretion, at any time, without prior notice</b>, for any reason including breach of these Terms, suspicious activity, or prolonged inactivity. Terminated users may not re-register without express permission from Parrots.</p>
    ),
  },
  {
    heading: "9. Intellectual Property",
    content: (
      <p>Users retain ownership of content they post but grant Parrots a non-exclusive, royalty-free licence to display it on the platform.</p>
    ),
  },
  {
    heading: "10. Limitation of Liability",
    content: (
      <>
        <p>Parrots is not liable for any direct, indirect, incidental, consequential, or special losses or damages arising from use of the platform. <b>To the maximum extent permitted by law, Parrots' total liability to any user shall not exceed zero, as the platform is provided free of charge.</b></p>
        <p>Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded under applicable UK law.</p>
      </>
    ),
  },
  {
    heading: "11. Disclaimers",
    content: (
      <>
        <p>The platform is provided "as is" without warranties. Parrots does not facilitate payments or transactions. <b>Parrots does not guarantee that any voyage will happen, that users are truthful, or that content is accurate.</b> Users and content are not endorsed or verified by Parrots.</p>
      </>
    ),
  },
  {
    heading: "12. Modifications",
    content: (
      <p>Parrots may update these Terms at any time. Where changes are material, Parrots will make reasonable efforts to notify users. Continued use of the platform after changes take effect constitutes acceptance of the updated Terms.</p>
    ),
  },
  {
    heading: "13. Privacy Policy",
    content: (
      <>
        <p>Parrots respects your privacy and is committed to protecting your personal data.</p>
        <p><b>a. Information We Collect:</b> Profile details, images, vehicle and voyage information, messages, and contact details that users voluntarily provide. Users choose what information to share.</p>
        <p><b>b. Automatically Collected Data:</b> Limited technical data such as device type, app version, error logs, and IP address, for security and service improvement purposes only.</p>
        <p><b>c. How We Use Data:</b> Solely to operate and maintain the platform, enable user interaction, display content, ensure security, and respond to support requests. Parrots does not sell user data and does not use personal data for advertising or profiling.</p>
        <p><b>d. Legal Basis:</b> Data is processed based on user consent, contractual necessity, legitimate interests (such as platform security), and legal obligations under UK GDPR.</p>
        <p><b>e. Data Sharing:</b> Parrots does not share personal data with third parties for marketing purposes. Parrots uses trusted third-party infrastructure providers (file storage, hosting) acting as data processors under UK GDPR.</p>
        <p><b>f. Data Retention:</b> Personal data is retained only as long as necessary to operate the service or comply with legal requirements. Message content may be deleted after up to 2 years. Users may request deletion of their account and associated data.</p>
        <p><b>g. User Rights:</b> Users have the right to access, correct, delete, or restrict processing of their personal data, and to withdraw consent at any time, in accordance with UK GDPR.</p>
        <p><b>h. Children's Privacy:</b> Parrots is not intended for users under the age of 18 and does not knowingly collect data from minors.</p>
        <p><b>i. Local Device Storage:</b> Parrots may store login credentials and preferences locally on your device to maintain your session. This data is not shared with third parties.</p>
        <p><b>j. Changes to Privacy Policy:</b> Parrots may update this Privacy Policy from time to time. Continued use of the platform constitutes acceptance of the updated policy.</p>
      </>
    ),
  },
  {
    heading: "14. Dispute Resolution",
    content: (
      <>
        <p>In the event of a dispute, users are encouraged to contact Parrots at parrotsapp@gmail.com in the first instance to seek an informal resolution.</p>
        <p>Parrots does not currently participate in any formal Alternative Dispute Resolution (ADR) scheme. Users retain the right to bring claims before a UK court of competent jurisdiction.</p>
      </>
    ),
  },
  {
    heading: "15. Governing Law",
    content: <p>These Terms are governed by the laws of the United Kingdom.</p>,
  },
  {
    heading: "16. Service Termination and Discontinuation",
    content: (
      <>
        <p>Parrots reserves the right to modify, suspend, or permanently discontinue the Service at any time without prior notice.</p>
        <p>In the event of permanent discontinuation, we will make reasonable efforts to provide advance notice. Any unused paid credits (ParrotCoins) will be eligible for a refund. Your data will be retained for 30 days after discontinuation, during which you may request a copy.</p>
      </>
    ),
  },
  {
    heading: "17. Refund Policy",
    content: (
      <>
        <p>ParrotCoins are currently provided free of charge until further notice. The refund terms below apply once ParrotCoins become a paid feature.</p>
        <p>Once paid, all purchases will be final and non-refundable except where: a technical error by Parrots caused credits not to be applied; the Service is permanently discontinued; or applicable consumer protection law grants a statutory right to a refund.</p>
        <p>Purchases made through the Google Play Store must be refunded directly through Google in accordance with their refund policy.</p>
        <p>To request a refund, contact parrotsapp@gmail.com within 14 days of purchase.</p>
      </>
    ),
  },
  {
    heading: "18. Contact",
    content: (
      <p>For questions regarding these Terms:<br />Email: parrotsapp@gmail.com<br />Location: United Kingdom</p>
    ),
  },
];

const page = {
  backgroundColor: lightBg,
  minHeight: "100vh",
  padding: "2rem 1rem",
  fontFamily: "Nunito, sans-serif",
};

const container = {
  maxWidth: "860px",
  margin: "0 auto",
  backgroundColor: "white",
  borderRadius: "1rem",
  padding: "2.5rem 3rem",
  boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
};

const title = {
  fontSize: "1.8rem",
  fontWeight: "800",
  color: blue,
  textAlign: "center",
  marginBottom: "0.3rem",
};

const version = {
  textAlign: "center",
  color: "#888",
  fontSize: "0.9rem",
  marginBottom: "2rem",
};

const toc = {
  backgroundColor: "#f0f4fb",
  borderRadius: "0.5rem",
  padding: "1rem 1.5rem",
  marginBottom: "2rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
};

const tocLink = {
  color: blue,
  fontSize: "0.9rem",
  textDecoration: "none",
  fontWeight: "600",
};

const section = {
  marginBottom: "2rem",
  borderBottom: "1px solid #edf0f7",
  paddingBottom: "1.5rem",
};

const h2 = {
  fontSize: "1.15rem",
  fontWeight: "800",
  color: blue,
  marginBottom: "0.7rem",
};

const body = {
  fontSize: "0.95rem",
  color: "#2a3a5c",
  lineHeight: "1.7",
};

const footer = {
  textAlign: "center",
  color: "#aaa",
  fontSize: "0.85rem",
  marginTop: "2rem",
};
