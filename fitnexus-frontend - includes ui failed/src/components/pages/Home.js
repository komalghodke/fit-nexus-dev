import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/Home.css';
import Navbar from './Navbar';
import Footer from './Footer';

const Home = () => {
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

        <section className="welcome-section">
          <h1 className="home-title">{t('HomeTitle')}</h1>
          <h2 className="home-subtitle">{t('HomeSubtitle')}</h2>
          <p className="home-description">{t('HomeDescription1')}</p>
          <p className="home-description">{t('HomeDescription2')}</p>
        </section>

        <section className="philosophy-section">
          <h3 className="philosophy-heading">{t('WhyYogDharaHeading')}</h3>

          <p className="philosophy-description">{t('WhyYogDharaPara1')}</p>
          <p className="philosophy-description">{t('WhyYogDharaPara2')}</p>

          <h4 className="philosophy-subheading">{t('MirrorHeading')}</h4>
          <p className="philosophy-description">{t('MirrorIntro')}</p>

          <ul className="wellness-list">
            <li><strong>{t('MirrorPoints.Emotional')}</strong></li>
            <li><strong>{t('MirrorPoints.Physical')}</strong></li>
            <li><strong>{t('MirrorPoints.Spiritual')}</strong></li>
            <li><strong>{t('MirrorPoints.Intellectual')}</strong></li>
            <li><strong>{t('MirrorPoints.Social')}</strong></li>
            <li><strong>{t('MirrorPoints.Occupational')}</strong></li>
          </ul>

          <h4 className="philosophy-subheading">{t('StreamHeading')}</h4>
          <p className="philosophy-description">{t('StreamDescription')}</p>

          <p className="philosophy-description">
            {t('StreamLines.Line1')}<br />
            {t('StreamLines.Line2')}<br />
            {t('StreamLines.Line3')}<br />
            {t('StreamLines.Line4')}
          </p>
        </section>

        <section className="features-section">
          <h3 className="features-heading">{t('FeaturesHeading')}</h3>
          <ul className="features-list">
            <li>{t('FeaturesList.Multilingual')}</li>
            <li>{t('FeaturesList.WellnessScore')}</li>
            <li>{t('FeaturesList.DailyGuidance')}</li>
          </ul>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
