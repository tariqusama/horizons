import React from 'react';
import Link from 'next/link';
import styles from './submission.module.css';

export default function SubmissionPage() {
    return (
        <div className={styles.pageWrapper}>
            <h1 className={styles.pageTitle}>Ready to Submit Your Application</h1>
            <p className={styles.pageSubtitle}>Congratulations! You have completed your application and uploaded all required supporting documents.</p>

            <div className={styles.formSection}>
                {/* --- Review Section --- */}
                <h2 className={styles.sectionHeading}>Review Your Application</h2>
                <p className={styles.sectionDesc}>
                    Please review your provided information and uploaded documents before finalizing your submission.
                </p>
                
                <div className={styles.reviewContainer}>
                    <div className={styles.reviewBlock}>
                        <div className={styles.reviewHeader}>
                            <h3 className={styles.reviewTitle}>Forms & Questionnaires</h3>
                            <Link href="/dashboard/get-started/forms" className={styles.btnEdit}>Edit</Link>
                        </div>
                        <p className={styles.reviewStatus}>
                            <span className={styles.statusDot}></span> Complete
                        </p>
                    </div>

                    <div className={styles.reviewBlock}>
                        <div className={styles.reviewHeader}>
                            <h3 className={styles.reviewTitle}>Uploaded Documents</h3>
                            <Link href="/dashboard/get-started/document-upload" className={styles.btnEdit}>Edit</Link>
                        </div>
                        <p className={styles.reviewStatus}>
                            <span className={styles.statusDot}></span> Complete
                        </p>
                    </div>
                </div>

                <hr className={styles.divider} />

                {/* --- Acknowledgments --- */}
                <h2 className={styles.sectionHeading}>Before submitting, please review and acknowledge the following:</h2>
                <p className={styles.sectionDesc}>
                    Horizon Pathways offers professional document translation services for USCIS-required documents. If your documents are not in English, you may purchase our translation service or upload a certified English translation with your original document.
                </p>

                <div className={styles.ackList}>
                    <div className={styles.ackItem}>
                        I confirm that all information and documents I have provided are true, accurate, and complete to the best of my knowledge.
                    </div>
                    <div className={styles.ackItem}>
                        I understand that Horizon Pathways is an immigration document preparation and support company and is not a law firm. Legal services, when applicable, are provided only by independently licensed immigration attorneys.
                    </div>
                    <div className={styles.ackItem}>
                        I understand that my application will first be reviewed by my assigned Case Manager for completeness and quality assurance.
                    </div>
                    <div className={styles.ackItem}>
                        If my package includes Attorney Review (or I have purchased it as an add-on), I understand that my application will also be reviewed by a licensed immigration attorney before final preparation and filing.
                    </div>
                    <div className={styles.ackItem}>
                        I understand that additional information, supporting documents, or corrections may be requested during the review process.
                    </div>
                    <div className={styles.ackItem}>
                        I acknowledge that the review process, including Case Manager and, if applicable, Attorney Review, may take up to five (5) business days, although some cases may require additional time depending on complexity.
                    </div>
                </div>

                <h2 className={styles.sectionHeading}>After you submit your application:</h2>
                <ol className={styles.orderedList}>
                    <li>Your assigned Case Manager will review your application and supporting documents.</li>
                    <li>If applicable, your file will be forwarded for Attorney Review.</li>
                    <li>If additional information is needed, you will be notified through your dashboard.</li>
                    <li>Once all reviews are complete, your application will proceed to the next stage of processing.</li>
                </ol>

                <h2 className={styles.sectionHeading}>Need Assistance?</h2>
                <p className={styles.helpText}>If you have any questions, please contact your assigned Case Manager through your dashboard messaging system.</p>
                <p className={styles.helpText}>If your matter is urgent or you need immediate assistance, please contact our Support Team, and we'll be happy to help.</p>

                <div className={styles.agreementRow}>
                    <label className={styles.agreementLabel}>
                        <input type="radio" name="agreement" />
                        I have read, understood, and agree to the above terms before submitting my application.
                    </label>
                </div>

                <Link href="/dashboard/applications" className={styles.btnSubmit}>
                    Submit Application
                </Link>
            </div>
        </div>
    );
}
