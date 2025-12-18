import * as React from 'react';
import styles from './UrlPageProperties.module.scss';
import { IUrlPagePropertiesProps } from './IUrlPagePropertiesProps';
import { Log } from '../../advancedPageProperties/utilities/Log';
import { useState, useEffect, useRef } from 'react';
import { UrlPropertyConfiguration, TileSize } from '../models';
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
   * RenderTiles
   * @description Renders the URL property tiles in a grid
   * @returns
   */
  const RenderTiles = () => {
    if (urlPropertyValues !== undefined && urlPropertyValues !== null && urlPropertyValues.length > 0) {
      const tileSizeClass = GetTileSizeClass(props.tileSize);
      // Convert camelCase to PascalCase for class name (e.g., "extraSmall" -> "ExtraSmall")
      const sizeName = props.tileSize.charAt(0).toUpperCase() + props.tileSize.slice(1);
      const containerSizeClass = `tiles${sizeName}`;

      return (
        <div className={`${styles.tilesContainer} ${styles[containerSizeClass]}`}>
          {urlPropertyValues.map((urlProp, index) => {
            // Priority: 1. config.displayName, 2. Description, 3. filename from URL
            let displayName = '';
            if (urlProp.config.displayName && urlProp.config.displayName.trim() !== '') {
              displayName = urlProp.config.displayName;
            } else if (urlProp.description && urlProp.description.trim() !== '') {
              displayName = urlProp.description;
            } else if (urlProp.fileName && urlProp.fileName.trim() !== '') {
              displayName = urlProp.fileName;
            } else {
              displayName = urlProp.config.fieldName; // Fallback to field name if all else fails
            }

            const iconName = urlProp.config.iconName || 'Link';

            return (
              <a
                key={index}
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
    } else {
      return <div className={styles.emptyState}>No URL properties configured</div>;
    }
  };

  return (
    <div className={styles.urlPageProperties} style={{backgroundColor: semanticColors.bodyBackground, color: semanticColors.bodyText}}>
      {RenderTitle()}
      {RenderTiles()}
    </div>
  );
};

export default UrlPageProperties;
