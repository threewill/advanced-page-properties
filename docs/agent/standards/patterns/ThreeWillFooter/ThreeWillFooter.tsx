import * as React from 'react';
import { Stack, Text } from '@fluentui/react';
import styles from './ThreeWillFooter.module.scss';
import logoUrl from './ThreeWill-headerLogo-onWhite.png';

export type ThreeWillFooterProps = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export function ThreeWillFooter(props: ThreeWillFooterProps): JSX.Element {
  const utmSource = props.utmSource ?? 'ddswaiversapp';
  const utmMedium = props.utmMedium ?? 'powerplatform';
  const utmCampaign = props.utmCampaign ?? (process.env.CLIENT_CAMPAIGN || 'threewill');

  return (
    <footer className={styles.footer}>
      <Stack horizontal horizontalAlign="center" styles={{ root: { margin: '10px 0', width: '100%' } }}>
        <Text variant="small">
          <i>
            <a
              href={`https://threewill.com/who-we-serve/home-community-based-care/?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(utmCampaign)}`}
              target="_blank"
              data-interception="off"
              rel="noopener noreferrer"
              aria-label="ThreeWill"
              className={styles.footerLink}
            >
              <img src={logoUrl} alt="ThreeWill" className={styles.footerLogo} />
            </a>
            Solutions: Less Chaos. More Care.
          </i>
        </Text>
      </Stack>
    </footer>
  );
}

