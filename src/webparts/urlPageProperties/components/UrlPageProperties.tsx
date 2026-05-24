import * as React from 'react';
import styles from './UrlPageProperties.module.scss';
import { IUrlPagePropertiesProps } from './IUrlPagePropertiesProps';
import { Log } from '../../advancedPageProperties/utilities/Log';
import { useState, useEffect, useRef } from 'react';
import { UrlPropertyConfiguration, TileSize, UrlDisplayMode } from '../models';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import { IReadonlyTheme } from '@microsoft/sp-component-base';

/**
 * UrlPageProperties
 * @param props URL Properties selected for display as tiles
 * @returns
 */
interface UrlPropertyValue {
  url: string;
  description: string;
  fileName: string;
  config: UrlPropertyConfiguration;
}

/**
 * Extract filename from URL
 * @param url The URL to extract filename from
 * @returns The filename or empty string
 */
function getFileNameFromUrl(url: string): string {
  if (!url) return '';

  try {
    // Remove query string and hash
    const urlWithoutQuery = url.split('?')[0].split('#')[0];
    // Get the last part of the path
    const pathParts = urlWithoutQuery.split('/');
    let fileName = pathParts[pathParts.length - 1];

    // If the last part is empty or just a slash, try the previous part
    if (!fileName || fileName === '') {
      fileName = pathParts[pathParts.length - 2] || '';
    }

    // Decode URL encoding if present
    try {
      fileName = decodeURIComponent(fileName);
    } catch (e) {
      // If decoding fails, use the original
    }

    return fileName || '';
  } catch (error) {
    return '';
  }
}

const UrlPageProperties: React.FunctionComponent<IUrlPagePropertiesProps> = props => {
  const [urlPropertyValues, setUrlPropertyValues] = useState<UrlPropertyValue[]>([]);
  const propsRef = useRef(props);

  const { semanticColors }: IReadonlyTheme = props.themeVariant;

  propsRef.current = props;

  sp.setup({ spfxContext: props.context });

  /**
   * refreshUrlProperties
   * @description Gets the actual URL values for configured properties
   */
  async function refreshUrlProperties() {
    var newSetOfValues: UrlPropertyValue[] = [];

    if (props.urlProperties !== undefined && props.urlProperties !== null && props.urlProperties.length > 0) {
      Log.Write(`${props.urlProperties.length.toString()} URL properties used.`);

      // Get all field names for the select query
      const fieldNames = props.urlProperties.map(config => config.fieldName);

      // Get the value(s) for the field from the list item itself
      var allValues: any = {};
      if (props.context.pageContext.listItem !== undefined && props.context.pageContext.listItem !== null) {
        allValues = await sp.web.lists.getByTitle("Site Pages").items.getById(props.context.pageContext.listItem.id).select(...fieldNames).get();
        console.log(allValues);
      }

      for (let i = 0; i < props.urlProperties.length; i++) {
        const config = props.urlProperties[i];
        const prop = config.fieldName;

        Log.Write(`Selected URL Property: ${prop}`);

        if (allValues.hasOwnProperty(prop) && allValues[prop] !== null) {
          const urlValue = allValues[prop];
          const url = urlValue.Url || '';
          const description = urlValue.Description || '';
          const fileName = getFileNameFromUrl(url);

          newSetOfValues.push({
            url: url,
            description: description,
            fileName: fileName,
            config: config
          });
        }
      }

      setUrlPropertyValues([...newSetOfValues]);
    } else {
      setUrlPropertyValues([]);
    }
  }

  /**
   * @description Effects to fire whenever the properties change
   */
  useEffect(() => {
    refreshUrlProperties();

    return () => {
      // No cleanup at this moment
    };
  }, [propsRef.current]);

  /**
   * GetTileSizeClass
   * @description Returns the appropriate CSS class for the tile size
   * @param tileSize
   * @returns
   */
  const GetTileSizeClass = (tileSize: TileSize): string => {
    switch (tileSize) {
      case TileSize.ExtraSmall:
        return styles.tileExtraSmall;
      case TileSize.Small:
        return styles.tileSmall;
      case TileSize.Medium:
        return styles.tileMedium;
      case TileSize.Large:
        return styles.tileLarge;
      case TileSize.ExtraLarge:
        return styles.tileExtraLarge;
      default:
        return styles.tileMedium;
    }
  };

  /**
   * RenderTitle
   * @description Renders the web part title
   * @returns
   */
  const RenderTitle = () => {
    if (props.title !== '') {
      return <div className={styles.title}>{props.title}</div>;
    } else {
      return null;
    }
  };

  /**
   * Get display name for a URL property (tile or embed label)
   */
  const getDisplayName = (urlProp: UrlPropertyValue): string => {
    if (urlProp.config.displayName && urlProp.config.displayName.trim() !== '') {
      return urlProp.config.displayName;
    }
    if (urlProp.description && urlProp.description.trim() !== '') {
      return urlProp.description;
    }
    if (urlProp.fileName && urlProp.fileName.trim() !== '') {
      return urlProp.fileName;
    }
    return urlProp.config.fieldName;
  };

  const isEmbed = (config: UrlPropertyConfiguration): boolean =>
    config.displayMode === UrlDisplayMode.Embed;

  const tileValues = urlPropertyValues.filter(v => !isEmbed(v.config));
  const embedValues = urlPropertyValues.filter(v => isEmbed(v.config));

  /**
   * RenderTiles
   * @description Renders URL properties with displayMode tile as a grid of link tiles
   */
  const RenderTiles = () => {
    if (tileValues.length === 0) return null;
    const tileSizeClass = GetTileSizeClass(props.tileSize);
    const sizeName = props.tileSize.charAt(0).toUpperCase() + props.tileSize.slice(1);
    const containerSizeClass = `tiles${sizeName}`;

    return (
      <div className={`${styles.tilesContainer} ${styles[containerSizeClass]}`}>
        {tileValues.map((urlProp, index) => {
          const displayName = getDisplayName(urlProp);
          const iconName = urlProp.config.iconName || 'Link';
          return (
            <a
              key={`tile-${index}`}
              href={urlProp.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.tile} ${tileSizeClass}`}
              style={{
                backgroundColor: semanticColors.bodyBackground,
                borderColor: semanticColors.bodyDivider,
                color: semanticColors.bodyText
              }}
            >
              <div className={styles.tileIcon}>
                <Icon iconName={iconName} />
              </div>
              <div className={styles.tileName}>{displayName}</div>
            </a>
          );
        })}
      </div>
    );
  };

  /**
   * RenderEmbeds
   * @description Renders URL properties with displayMode embed as iframes (e.g. doc library folder view)
   */
  const RenderEmbeds = () => {
    if (embedValues.length === 0) return null;
    const height = Math.max(200, Math.min(1200, props.embedHeight || 400));
    const minimal = props.hideEmbedChrome === true;
    return (
      <div className={styles.embedsContainer}>
        {embedValues.map((urlProp, index) => {
          const displayName = getDisplayName(urlProp);
          if (minimal) {
            return (
              <iframe
                key={`embed-${index}`}
                src={urlProp.url}
                title={displayName}
                className={styles.embedFrame}
                style={{ height: `${height}px` }}
              />
            );
          }
          return (
            <div key={`embed-${index}`} className={styles.embedWrapper}>
              <div className={styles.embedHeader}>
                <span className={styles.embedTitle}>{displayName}</span>
                <a
                  href={urlProp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.embedLink}
                  style={{ color: semanticColors.link }}
                >
                  Open in new tab
                </a>
              </div>
              <iframe
                src={urlProp.url}
                title={displayName}
                className={styles.embedFrame}
                style={{ height: `${height}px` }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const hasAnyValues = urlPropertyValues.length > 0;

  return (
    <div className={styles.urlPageProperties} style={{ backgroundColor: semanticColors.bodyBackground, color: semanticColors.bodyText }}>
      {RenderTitle()}
      {hasAnyValues ? (
        <>
          {RenderTiles()}
          {RenderEmbeds()}
        </>
      ) : (
        <div className={styles.emptyState}>No URL properties configured</div>
      )}
    </div>
  );
};

export default UrlPageProperties;
