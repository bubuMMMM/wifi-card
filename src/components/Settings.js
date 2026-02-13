import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Translations } from '../translations';
import './style.css';

export const Settings = (props) => {
  const { t } = useTranslation();
  const encryptionModes = [
    { label: t('wifi.password.encryption.none'), value: '' },
    { label: 'WPA/WPA2/WPA3', value: 'WPA' },
    { label: 'WPA2-EAP', value: 'WPA2-EAP' },
    { label: 'WEP', value: 'WEP' },
  ];
  const eapMethods = [{ label: 'PWD', value: 'PWD' }];

  const langSelectDefaultValue = () => {
    const lang = Translations.filter((tr) => tr.id === i18n.language);
    if (lang.length !== 1) return 'en-US';
    return lang[0].id;
  };

  useEffect(() => {
    if (props.firstLoad.current && window.innerWidth < 500) {
      props.onFirstLoad();
      props.onOrientationChange(true);
    }
  });

  return (
    <div id="settings" style={{ maxWidth: props.settings.portrait ? '350px' : '100%' }}>
      <div className="field-group">
        <label htmlFor="language-select">{t('select')}</label>
        <select
          id="language-select"
          onChange={(e) => props.onLanguageChange(e.target.value)}
          defaultValue={langSelectDefaultValue()}
        >
          {Translations.map((tr) => (
            <option key={tr.id} value={tr.id}>
              {tr.name}
            </option>
          ))}
        </select>
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={props.settings.portrait}
            onChange={() => props.onOrientationChange(!props.settings.portrait)}
          />
          <span>{t('button.rotate')}</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={props.settings.hidePassword}
            onChange={() => props.onHidePasswordChange(!props.settings.hidePassword)}
          />
          <span>{t('wifi.password.hide')}</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={props.settings.hiddenSSID}
            onChange={() => props.onHiddenSSIDChange(!props.settings.hiddenSSID)}
          />
          <span>{t('wifi.name.hiddenSSID')}</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={props.settings.hideTip}
            onChange={() => props.onHideTipChange(!props.settings.hideTip)}
          />
          <span>{t('cards.tip.hide')}</span>
        </label>
      </div>

      <div className="field-group">
        <label htmlFor="additional-cards">{t('cards.additional')}</label>
        <input
          id="additional-cards"
          type="number"
          min="1"
          value={props.settings.additionalCards}
          onChange={(e) => props.onAdditionalCardsChange(e.target.value)}
        />
      </div>

      <div className="radio-group">
        <span className="radio-group-label">{t('wifi.password.encryption')}</span>
        {encryptionModes.map((mode) => (
          <label key={mode.value} className="radio-label">
            <input
              type="radio"
              name="encryption"
              value={mode.value}
              checked={props.settings.encryptionMode === mode.value}
              onChange={(e) => props.onEncryptionModeChange(e.target.value)}
            />
            <span>{mode.label}</span>
          </label>
        ))}
      </div>

      {props.settings.encryptionMode === 'WPA2-EAP' && (
        <div className="radio-group">
          <span className="radio-group-label">{t('wifi.encryption.eapMethod')}</span>
          {eapMethods.map((method) => (
            <label key={method.value} className="radio-label">
              <input
                type="radio"
                name="eapMethod"
                value={method.value}
                checked={props.settings.eapMethod === method.value}
                onChange={(e) => props.onEapMethodChange(e.target.value)}
              />
              <span>{method.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
