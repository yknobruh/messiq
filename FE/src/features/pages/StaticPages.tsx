import { Link } from "react-router";

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      lineHeight: 1.6,
      color: "#4A4A6A",
      backgroundColor: "#FAFAFC",
      margin: 0,
      padding: 0,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%"
    }}>
      <header style={{
        width: "100%",
        height: "64px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #F0EEFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          width: "100%",
          maxWidth: "800px",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <div style={{
            width: "16px",
            height: "16px",
            borderRadius: "6px",
            backgroundColor: "#8B7CF6"
          }}></div>
          <span style={{
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "#1C1629",
            letterSpacing: "-0.02em"
          }}>Messiq</span>
        </div>
      </header>

      <div style={{
        width: "100%",
        maxWidth: "800px",
        boxSizing: "border-box",
        padding: "40px 24px"
      }}>
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #F0EEFF",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02), 0 10px 40px rgba(0, 0, 0, 0.01)"
        }}>
          <h1 style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#1C1629",
            marginTop: 0,
            marginBottom: "8px",
            letterSpacing: "-0.02em"
          }}>{title}</h1>
          <span style={{
            fontSize: "0.8125rem",
            color: "#9A9AB3",
            marginBottom: "32px",
            display: "block"
          }}>{lastUpdated}</span>

          {children}

          <div style={{
            marginTop: "40px",
            textAlign: "center",
            fontSize: "0.8125rem",
            color: "#9A9AB3",
            borderTop: "1px solid #F0EEFF",
            paddingTop: "24px"
          }}>
            <p style={{ marginBottom: "8px" }}>&copy; 2026 Messiq. All rights reserved.</p>
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px"
            }}>
              <Link to="/" style={{ color: "#8B7CF6", textDecoration: "none", fontWeight: 500 }}>Back to Home</Link>
              <span>|</span>
              <Link to="/privacy.html" style={{ color: "#8B7CF6", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</Link>
              <span>|</span>
              <Link to="/terms.html" style={{ color: "#8B7CF6", textDecoration: "none", fontWeight: 500 }}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="Last Updated: March 5, 2026">
      <p>At Messiq, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our messaging dashboard and services, including integrations with Meta platforms (Facebook, Instagram).</p>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>1. Information We Collect</h2>
      <p>We collect information that you provide directly to us, such as when you log in, connect your social media pages, or communicate with our support team. This may include:</p>
      <ul style={{ paddingLeft: "20px", marginBottom: "24px" }}>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Contact information (email, phone number).</li>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Account credentials.</li>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Business information.</li>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Access tokens for integrated platforms (e.g., Meta Page Access Tokens).</li>
      </ul>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>2. How We Use Your Information</h2>
      <p>We use the collected information for various purposes, including:</p>
      <ul style={{ paddingLeft: "20px", marginBottom: "24px" }}>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Providing and maintaining our services.</li>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Facilitating communication between your business and your customers.</li>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Responding to support requests.</li>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Fulfilling legal and regulatory requirements.</li>
      </ul>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>3. Data Sharing and Disclosure</h2>
      <p>We do not sell your personal information. We may share information with third-party service providers who assist us in operating our platform, subject to strict confidentiality agreements. We may also disclose information if required by law or to protect our rights.</p>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>4. Meta Platform Data</h2>
      <p>Our app uses Meta APIs to receive and send messages on your behalf. We process this data solely to provide the services you have requested. We adhere to Meta's Platform Terms and Developer Policies regarding the handling of user data.</p>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>5. Data Security</h2>
      <p>We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or alteration. However, no method of transmission over the internet is 100% secure.</p>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>6. Your Rights and Data Deletion</h2>
      <p>You have the right to access, update, or delete your personal information. To request permanent deletion of your account and all associated Meta platform data, please contact our support team directly at <strong>yknobruh@gmail.com</strong>. We will process your request within 30 days.</p>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>7. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page.</p>
    </PolicyLayout>
  );
}

export function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service" lastUpdated="Last Updated: March 5, 2026">
      <p>Welcome to Messiq. By using our website and services, you agree to comply with and be bound by the following terms and conditions.</p>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>1. Acceptance of Terms</h2>
      <p>By accessing or using the Messiq platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, you are prohibited from using the service.</p>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>2. Description of Service</h2>
      <p>Messiq provides a messaging dashboard platform for businesses to manage customer communications across Facebook and Instagram channels.</p>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>3. User Responsibilities</h2>
      <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to use the service only for lawful purposes and in accordance with these terms.</p>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>4. Data Ownership and License</h2>
      <p>You retain all rights to the data you provide to the service. By using Messiq, you grant us a limited license to process your data solely for the purpose of providing the service.</p>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>5. Prohibited Conduct</h2>
      <p>You agree not to:</p>
      <ul style={{ paddingLeft: "20px", marginBottom: "24px" }}>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Use the service for any illegal or unauthorized purpose.</li>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Attempt to interfere with the proper working of the service.</li>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Use the service to transmit spam or other unsolicited communications.</li>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Reverse engineer or attempt to extract the source code of the service.</li>
      </ul>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>6. Limitation of Liability</h2>
      <p>Messiq shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the service.</p>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>7. Termination</h2>
      <p>We reserve the right to terminate or suspend your account at any time, without prior notice, for conduct that we believe violates these terms or is harmful to our interests or other users.</p>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>8. Changes to Terms</h2>
      <p>We may revise these Terms of Service at any time. By continuing to use the service after changes are posted, you agree to be bound by the revised terms.</p>
    </PolicyLayout>
  );
}

export function DataDeletionPage() {
  return (
    <PolicyLayout title="Data Deletion Instructions" lastUpdated="Last Updated: March 5, 2026">
      <p>At Messiq, we respect your data privacy and provide easy ways for you to request the deletion of your personal information from our systems. This page outlines the steps for requesting data removal, in compliance with Meta Platform policies.</p>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>How to Request Data Deletion</h2>
      <div style={{
        backgroundColor: "#FAFAFC",
        border: "1px solid #F0EEFF",
        padding: "24px",
        borderRadius: "16px",
        marginBottom: "24px"
      }}>
        <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "1rem", color: "#1C1629", fontWeight: 600 }}>Email Request</h3>
        <p style={{ fontSize: "0.875rem", marginBottom: "8px" }}>To request deletion of your account and all associated Meta platform data, please send an email request to our support team:</p>
        <p style={{ fontSize: "0.875rem", marginBottom: "8px" }}>1. Send an email to <strong>yknobruh@gmail.com</strong>.</p>
        <p style={{ fontSize: "0.875rem", marginBottom: "8px" }}>2. Use the subject line: <strong>Data Deletion Request</strong>.</p>
        <p style={{ fontSize: "0.875rem", marginBottom: "8px" }}>3. Provide your account email address and any identifiers (e.g., Facebook Page ID, Instagram Business Account ID) associated with your data.</p>
        <p style={{ fontSize: "0.875rem", marginBottom: "8px" }}>4. Our team will verify your identity and process the request within 30 days, permanently removing all your data from our active databases.</p>
      </div>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1C1629", marginTop: "32px", marginBottom: "12px" }}>What Data is Deleted?</h2>
      <p>When you request data deletion, we remove:</p>
      <ul style={{ paddingLeft: "20px", marginBottom: "24px" }}>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Your personal contact information.</li>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Access tokens and credentials for integrated platforms.</li>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Message history processed through our system.</li>
        <li style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>Any business-related data stored in our system.</li>
      </ul>
    </PolicyLayout>
  );
}
