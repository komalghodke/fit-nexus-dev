import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/Home.css';
import Navbar from './Navbar';
import Footer from './Footer';

const PolicyPage = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        {/* Language Selector */}
        <div className="language-toggle">
          <label htmlFor="language">{t('language')}: </label>
          <select
            id="language"
            onChange={(e) => changeLanguage(e.target.value)}
            defaultValue={i18n.language}
            className="language-selector"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>

        {/* Page Header */}
          <h1 className="home-title">{t('PolicyTitle')}</h1>
          <p className="home-subtitle">{t('PolicySubtitle')}</p>

                  {/* Section Navigation */}
          <nav className="policy-nav">
            <a href="#privacy">{t('PrivacyPolicy.Title')}</a> | 
            <a href="#terms">{t('Terms.Title')}</a> | 
            <a href="#refund">{t('Refund.Title')}</a> | 
            <a href="#liability">{t('Liability.Title')}</a>
          </nav>

        <hr style={{ width: '100%', border: '2px dashed #d78108ff' }} />

        {/* Privacy Policy */}
        <section className="philosophy-section" id="privacy">
          <h3 className="philosophy-heading">{t('PrivacyPolicy.Title')}</h3>
          <p className="philosophy-description">{t('PrivacyPolicy.Intro')}</p>
          <ul className="wellness-list">
            {t('PrivacyPolicy.Points', { returnObjects: true }).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </section>

        {/* Terms & Conditions */}
        <section className="philosophy-section" id="terms">
          <h3 className="philosophy-heading">{t('Terms.Title')}</h3>
          <p className="philosophy-description">{t('Terms.Intro')}</p>
          <ul className="wellness-list">
            {t('Terms.Points', { returnObjects: true }).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </section>

        {/* Refund / Cancellation Policy */}
        <section className="philosophy-section" id="refund">
          <h3 className="philosophy-heading">{t('Refund.Title')}</h3>
          <p className="philosophy-description">{t('Refund.Intro')}</p>
          <ul className="wellness-list">
            {t('Refund.Points', { returnObjects: true }).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </section>

        {/* Liability Waiver */}
        <section className="philosophy-section" id="liability">
          <h3 className="philosophy-heading">{t('Liability.Title')}</h3>
          <p className="philosophy-description">{t('Liability.Intro')}</p>
          <ul className="wellness-list">
            {t('Liability.Points', { returnObjects: true }).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </section>

        <nav className="policy-nav">
            <a href="#privacy">{t('PrivacyPolicy.Title')}</a> | 
            <a href="#terms">{t('Terms.Title')}</a> | 
            <a href="#refund">{t('Refund.Title')}</a> | 
            <a href="#liability">{t('Liability.Title')}</a>
        </nav>

        {/* Footer Note */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#d78108ff', marginTop: '2rem' }}>
          {t('LastUpdated')}
        </p>
      </div>
      <Footer />
    </>
  );
};

export default PolicyPage;