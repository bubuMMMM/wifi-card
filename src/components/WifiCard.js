import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../../src/images/wifi.png';
import './style.css';

export const WifiCard = (props) => {
  const { t } = useTranslation();
  const [qrvalue, setQrvalue] = useState('');

  const escape = (v) => {
    const needsEscape = ['"', ';', ',', ':', '\\'];
    let escaped = '';
    for (const c of v) {
      if (needsEscape.includes(c)) {
        escaped += `\\${c}`;
      } else {
        escaped += c;
      }
    }
    return escaped;
  };

  useEffect(() => {
    let opts = {};
    opts.T = props.settings.encryptionMode || 'nopass';
    if (props.settings.encryptionMode === 'WPA2-EAP') {
      opts.E = props.settings.eapMethod;
      opts.I = props.settings.eapIdentity;
    }
    opts.S = escape(props.settings.ssid);
    opts.P = escape(props.settings.password);
    opts.H = props.settings.hiddenSSID;

    let data = '';
    Object.entries(opts).forEach(([k, v]) => (data += `${k}:${v};`));
    const qrval = `WIFI:${data};`;
    setQrvalue(qrval);
  }, [props.settings]);

  const portraitWidth = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return isMobile ? '100%' : '280px';
  };

  const passwordFieldLabel = () => {
    const hiddenPassword = props.settings.hidePassword || !props.settings.encryptionMode;
    return hiddenPassword ? '' : t('wifi.password');
  };

  const eapIdentityFieldLabel = () => {
    const hiddenIdentity = props.settings.encryptionMode !== 'WPA2-EAP';
    return hiddenIdentity ? '' : t('wifi.identity');
  };

  const eapMethodFieldLabel = () => {
    return !eapIdentityFieldLabel() ? '' : t('wifi.encryption.eapMethod');
  };

  const keyid = props.keyid || '';
  const suffixKeyID = (prefix) => `${prefix}-${keyid}`;

  return (
    <div
      className="card-print"
      style={{ maxWidth: props.settings.portrait ? portraitWidth() : '100%' }}
    >
      <div className="card-header">
        <img alt="WiFi" src={logo} width="18" height="18" />
        <h2
          style={{ textAlign: props.settings.portrait ? 'center' : 'unset' }}
        >
          {t('wifi.login')}
        </h2>
      </div>

      <div
        className="details"
        style={{ flexDirection: props.settings.portrait ? 'column' : 'row' }}
      >
        <div className="qrcode" style={{ marginBottom: props.settings.portrait ? '1.5rem' : '0' }}>
          <QRCode value={qrvalue} size={150} />
        </div>

        <div className="card-fields">
          <div className="field-group">
            <label htmlFor={suffixKeyID('ssid')}>{t('wifi.name')}</label>
            <textarea
              id={suffixKeyID('ssid')}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength="32"
              placeholder={t('wifi.name.placeholder')}
              value={props.settings.ssid}
              onChange={(e) => props.onSSIDChange(e.target.value)}
              className={props.ssidError ? 'input-error' : ''}
            />
            {props.ssidError && <span className="error-text">{props.ssidError}</span>}
          </div>

          {props.settings.encryptionMode === 'WPA2-EAP' && (
            <>
              {eapMethodFieldLabel() && (
                <div className="field-group">
                  <label htmlFor={suffixKeyID('eapmethod')}>{eapMethodFieldLabel()}</label>
                  <textarea
                    id={suffixKeyID('eapmethod')}
                    readOnly
                    spellCheck={false}
                    value={props.settings.eapMethod}
                  />
                </div>
              )}
              {eapIdentityFieldLabel() && (
                <div className="field-group">
                  <label htmlFor={suffixKeyID('identity')}>{eapIdentityFieldLabel()}</label>
                  <textarea
                    id={suffixKeyID('identity')}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder={t('wifi.identity.placeholder')}
                    value={props.settings.eapIdentity}
                    onChange={(e) => props.onEapIdentityChange(e.target.value)}
                    className={props.eapIdentityError ? 'input-error' : ''}
                  />
                  {props.eapIdentityError && <span className="error-text">{props.eapIdentityError}</span>}
                </div>
              )}
            </>
          )}

          {!(props.settings.hidePassword || !props.settings.encryptionMode) && (
            <div className="field-group">
              <label htmlFor={suffixKeyID('password')}>{passwordFieldLabel()}</label>
              <textarea
                id={suffixKeyID('password')}
                maxLength="63"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                style={{
                  height: props.settings.portrait && props.settings.password.length > 40 ? '5em' : undefined,
                }}
                placeholder={t('wifi.password.placeholder')}
                value={props.settings.password}
                onChange={(e) => props.onPasswordChange(e.target.value)}
                className={props.passwordError ? 'input-error' : ''}
              />
              {props.passwordError && <span className="error-text">{props.passwordError}</span>}
            </div>
          )}
        </div>
      </div>

      {!props.settings.hideTip && (
        <>
          <hr />
          <div className="tip-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            <span className="tip-text">{t('wifi.tip')}</span>
          </div>
        </>
      )}
    </div>
  );
};
