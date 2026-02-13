import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../src/images/wifi.png';
import { Settings } from './components/Settings';
import { WifiCard } from './components/WifiCard';
import './style.css';
import { Translations } from './translations';

function App() {
  const html = document.querySelector('html');

  const { t, i18n } = useTranslation();
  const firstLoad = useRef(true);
  const [settings, setSettings] = useState({
    ssid: '',
    password: '',
    encryptionMode: 'WPA',
    eapMethod: 'PWD',
    eapIdentity: '',
    hidePassword: false,
    hiddenSSID: false,
    portrait: false,
    additionalCards: 1,
    hideTip: false,
    lng: 'en-US',
  });

  const [errors, setErrors] = useState({
    ssidError: '',
    passwordError: '',
    eapIdentityError: '',
  });

  const htmlDirection = (languageID) => {
    languageID = languageID || i18n.language;
    const rtl = Translations.filter((t) => t.id === languageID)[0]?.rtl;
    return rtl ? 'rtl' : 'ltr';
  };

  const onChangeLanguage = (language) => {
    html.style.direction = htmlDirection(language);
    i18n.changeLanguage(language);
    setSettings({ ...settings, lng: language });
  };

  const onPrint = () => {
    if (!settings.ssid.length) {
      setErrors({ ...errors, ssidError: t('wifi.alert.name') });
      return;
    }
    if (settings.password.length < 8 && settings.encryptionMode === 'WPA') {
      setErrors({ ...errors, passwordError: t('wifi.alert.password.length.8') });
      return;
    }
    if (settings.password.length < 5 && settings.encryptionMode === 'WEP') {
      setErrors({ ...errors, passwordError: t('wifi.alert.password.length.5') });
      return;
    }
    if (settings.password.length < 1 && settings.encryptionMode === 'WPA2-EAP') {
      setErrors({ ...errors, passwordError: t('wifi.alert.password') });
      return;
    }
    if (settings.eapIdentity.length < 1 && settings.encryptionMode === 'WPA2-EAP') {
      setErrors({ ...errors, eapIdentityError: t('wifi.alert.eapIdentity') });
      return;
    }
    document.title = 'WiFi Card - ' + settings.ssid;
    window.print();
  };

  const onSSIDChange = (ssid) => {
    setErrors({ ...errors, ssidError: '' });
    setSettings({ ...settings, ssid });
  };
  const onPasswordChange = (password) => {
    setErrors({ ...errors, passwordError: '' });
    setSettings({ ...settings, password });
  };
  const onEncryptionModeChange = (encryptionMode) => {
    setErrors({ ...errors, passwordError: '' });
    setSettings({ ...settings, encryptionMode });
  };
  const onEapMethodChange = (eapMethod) => {
    setSettings({ ...settings, eapMethod });
  };
  const onEapIdentityChange = (eapIdentity) => {
    setErrors({ ...errors, eapIdentityError: '' });
    setSettings({ ...settings, eapIdentity });
  };
  const onOrientationChange = (portrait) => {
    setSettings({ ...settings, portrait });
  };
  const onHidePasswordChange = (hidePassword) => {
    setSettings({ ...settings, hidePassword });
  };
  const onHiddenSSIDChange = (hiddenSSID) => {
    setSettings({ ...settings, hiddenSSID });
  };
  const onAdditionalCardsChange = (additionalCardsStr) => {
    const amount = parseInt(additionalCardsStr);
    amount >= 1 && setSettings({ ...settings, additionalCards: amount });
  };
  const onHideTipChange = (hideTip) => {
    setSettings({ ...settings, hideTip });
  };
  const onFirstLoad = () => {
    html.style.direction = htmlDirection();
    firstLoad.current = false;
  };

  useEffect(() => {
    if (htmlDirection() === 'rtl') {
      html.style.direction = 'rtl';
    }
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <img alt="WiFi Card icon" src={logo} width="28" height="28" />
        <h1>{t('title')}</h1>
      </header>

      <div className="app-description">
        <p>{t('desc.use')}</p>
        <p>
          {t('desc.privacy')}{' '}
          <a href="https://github.com/bndw/wifi-card" target="_blank" rel="noopener noreferrer">
            {t('desc.source')}
          </a>
          .
        </p>
      </div>

      <WifiCard
        settings={settings}
        ssidError={errors.ssidError}
        passwordError={errors.passwordError}
        eapIdentityError={errors.eapIdentityError}
        onSSIDChange={onSSIDChange}
        onEapIdentityChange={onEapIdentityChange}
        onPasswordChange={onPasswordChange}
      />

      <Settings
        settings={settings}
        firstLoad={firstLoad}
        onFirstLoad={onFirstLoad}
        onLanguageChange={onChangeLanguage}
        onEncryptionModeChange={onEncryptionModeChange}
        onEapMethodChange={onEapMethodChange}
        onOrientationChange={onOrientationChange}
        onHidePasswordChange={onHidePasswordChange}
        onHiddenSSIDChange={onHiddenSSIDChange}
        onAdditionalCardsChange={onAdditionalCardsChange}
        onHideTipChange={onHideTipChange}
      />

      <button className="btn-print" onClick={onPrint}>
        {t('button.print')}
      </button>

      <div id="print-area">
        {settings.additionalCards >= 1 &&
          [...Array(settings.additionalCards)].map((el, idx) => (
            <WifiCard
              keyid={idx}
              key={`card-nr-${idx}`}
              settings={settings}
              ssidError={errors.ssidError}
              passwordError={errors.passwordError}
              eapIdentityError={errors.eapIdentityError}
              onSSIDChange={onSSIDChange}
              onEapIdentityChange={onEapIdentityChange}
              onPasswordChange={onPasswordChange}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
