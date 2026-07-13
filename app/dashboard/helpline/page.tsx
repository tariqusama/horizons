import React from "react";
import styles from './helpline.module.css';

export default function DashboardHelplinePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Contact Support</p>
          <h1>Need help with your application?</h1>
          <p className={styles.intro}>
            Our immigration experts are ready to assist you with document preparation, case updates, and USCIS questions.
          </p>
        </div>
      </header>

      <section className={styles.cardGrid}>
        <div className={styles.supportCard}>
          <h2>Live Chat</h2>
          <p>Connect with your case manager instantly for urgent questions and application guidance.</p>
          <button className={styles.primaryButton}>Start chat</button>
        </div>
        <div className={styles.supportCard}>
          <h2>Request callback</h2>
          <p>Schedule a phone call with our support team for detailed case help and next-step planning.</p>
          <button className={styles.secondaryButton}>Request callback</button>
        </div>
      </section>

      <section className={styles.faqSection}>
        <h2>How we can help</h2>
        <ul>
          <li>Document review and upload support</li>
          <li>Application status questions</li>
          <li>Interview preparation guidance</li>
        </ul>
      </section>
    </div>
  );
}

