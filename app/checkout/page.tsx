import React from 'react';
import Link from 'next/link';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          &larr; Back
        </Link>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.pageTitle}>
            <h1>Your Order</h1>
            <p>Review your selected plan and services</p>
          </div>

          <section className={styles.accountInfo}>
            <h2>Account Information</h2>
            <div className={styles.accountDetails}>
              <p>Shahryar Shafique</p>
              <p className={styles.email}>shahryarshafique04@gmail.com</p>
            </div>
          </section>

          <section className={styles.planSection}>
            <div className={styles.planHeader}>
              <div className={styles.planTitleContainer}>
                <h3>Green Card Renewal</h3>
                <span className={styles.planBadge}>Advanced Plan</span>
              </div>
              <div className={styles.planPrice}>$449.99</div>
            </div>

            <div className={styles.includedFeatures}>
              <h4>What's Included:</h4>
              <ul>
                <li><span className={styles.checkIcon}>✓</span> Everything in Basic Plan</li>
                <li><span className={styles.checkIcon}>✓</span> Certified translation services</li>
                <li><span className={styles.checkIcon}>✓</span> Legal review by an immigration attorney</li>
                <li><span className={styles.checkIcon}>✓</span> Priority support with 24-hour response time</li>
                <li><span className={styles.checkIcon}>✓</span> Phone support for real-time assistance</li>
              </ul>
            </div>
          </section>

          <section className={styles.additionalServices}>
            <h3>Additional Services</h3>
            <div className={styles.serviceList}>
              <label className={styles.serviceItem}>
                <div className={styles.serviceInput}>
                  <input type="checkbox" />
                </div>
                <div className={styles.serviceDetails}>
                  <span className={styles.serviceName}>Document Translation (per page)</span>
                  <span className={styles.serviceDesc}>Professional translation of additional document pages</span>
                </div>
                <div className={styles.servicePrice}>$25</div>
              </label>

              <label className={styles.serviceItem}>
                <div className={styles.serviceInput}>
                  <input type="checkbox" />
                </div>
                <div className={styles.serviceDetails}>
                  <span className={styles.serviceName}>Certified Copy &amp; E-Notary</span>
                  <span className={styles.serviceDesc}>Certified copies of your documents, Electronic notary services</span>
                </div>
                <div className={styles.servicePrice}>$15</div>
              </label>

              <label className={styles.serviceItem}>
                <div className={styles.serviceInput}>
                  <input type="checkbox" />
                </div>
                <div className={styles.serviceDetails}>
                  <span className={styles.serviceName}>Expedited Form Preparation (48hrs)</span>
                  <span className={styles.serviceDesc}>Priority preparation of the full application packet</span>
                </div>
                <div className={styles.servicePrice}>$100</div>
              </label>
            </div>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.orderSummary}>
            <h3>Order Summary</h3>
            <div className={styles.summaryItem}>
              <span>Green Card Renewal</span>
              <span>$449.99</span>
            </div>
            <hr className={styles.summaryDivider} />
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>$449.99</span>
            </div>
            <button className={styles.continueButton}>
              Continue Payment
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
