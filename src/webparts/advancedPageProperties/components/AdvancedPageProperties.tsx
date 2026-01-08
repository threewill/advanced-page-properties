import * as React from 'react';
import styles from './AdvancedPageProperties.module.scss';
import { IAdvancedPagePropertiesProps } from './IAdvancedPagePropertiesProps';
import { Log } from '../utilities/Log';
import * as _ from 'lodash';
import { useState, useEffect, useRef } from 'react';
import { PageProperty, PropertyConfiguration, DisplayMode, TextStyle, BooleanDisplayFormat } from '../models';

import { sp } from "@pnp/sp";
import { taxonomy } from "@pnp/sp-taxonomy";
import { DateTimeFieldFormatType, DateTimeFieldFriendlyFormatType, FieldTypes, IField, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import { IReadonlyTheme } from '@microsoft/sp-component-base';

/**
 * AdvancedPageProperties
 * @param props Page Properties selected for display
 * @returns
 */
// Extended PageProperty that includes configuration
interface PagePropertyWithConfig extends PageProperty {
  config: PropertyConfiguration;
}

/**
 * Normalize Boolean values from various formats
 * @param value The value to normalize
 * @returns Normalized boolean value
 */
function normalizeBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === '1' || lower === 'yes';
  }
  return false;
}

/**
 * Format Boolean value based on display format
 * @param value The boolean value to format
 * @param format The display format to use
 * @returns Formatted string representation
 */
function formatBoolean(value: boolean, format: BooleanDisplayFormat | undefined): string {
  const displayFormat = format || BooleanDisplayFormat.YesNo;
  switch (displayFormat) {
    case BooleanDisplayFormat.YesNo:
      return value ? 'Yes' : 'No';
    case BooleanDisplayFormat.TrueFalse:
      return value ? 'True' : 'False';
    case BooleanDisplayFormat.Checkmark:
      return value ? '✅' : '❌';
    default:
      return value ? 'Yes' : 'No';
  }
}

const AdvancedPageProperties: React.FunctionComponent<IAdvancedPagePropertiesProps> = props => {
  // Main state object for the life of this component - pagePropValues with config
  const [pagePropValues, setPagePropValues] = useState<PagePropertyWithConfig[]>([]);
  const propsRef = useRef(props);

  const { semanticColors }: IReadonlyTheme = props.themeVariant;

  propsRef.current = props;

  sp.setup({ spfxContext: props.context });

  /**
   * refreshProperties
   * @description Gets the actual values for any selected properties, along with critical field metadata and ultimately re-sets the pagePropValues state
   */
  async function refreshProperties () {
    var newSetOfValues: PagePropertyWithConfig[] = [];

    if (props.propertyConfigurations !== undefined && props.propertyConfigurations !== null && props.propertyConfigurations.length > 0) {
      Log.Write(`${props.propertyConfigurations.length.toString()} properties used.`);

      // Get all field names for the select query
      const fieldNames = props.propertyConfigurations.map(config => config.fieldName);

      // Get the value(s) for the field from the list item itself
      var allValues: any = {};
      if (props.context.pageContext.listItem !== undefined && props.context.pageContext.listItem !== null) {
        allValues = await sp.web.lists.getByTitle("Site Pages").items.getById(props.context.pageContext.listItem.id).select(...fieldNames).get();
        console.log(allValues);
      }

      for (let i = 0; i < props.propertyConfigurations.length; i++) {
        const config = props.propertyConfigurations[i];
        const prop = config.fieldName;

        Log.Write(`Selected Property: ${prop}`);

        // Get field information, in case anything is needed in conjunction with value types
        const field = await sp.web.lists.getByTitle("Site Pages").fields.getByInternalNameOrTitle(prop)();

        // Establish the values array
        var values: any[] = [];
        if (allValues.hasOwnProperty(prop)) {
          switch (field.TypeAsString) {
            case "TaxonomyFieldTypeMulti":
            case "MultiChoice":
              values = _.clone(allValues[prop]);
              break;
            case "Thumbnail":
              values.push(JSON.parse(allValues[prop]));
              break;
            case "TaxonomyFieldType":
              // Special behavior JUST for TaxonomyFieldType, as the API appears to be bugged when returning the label for a single select term set
              // When we have this specific type, we need to update the existing label with a separate call to the API for the tern label for the GUID
              // In all other ways it should behave the same as the default behavior
              try {
                const termStore = await taxonomy.termStores.get();
                let newProp = {
                  Label: allValues[prop].Label,
                  TermGuid: allValues[prop].TermGuid,
                  WssId: allValues[prop].WssId
                };
                for (let storeIndex = 0; storeIndex < termStore.length; storeIndex++) {
                  const store = termStore[storeIndex];
                  const term = await store.getTermById(newProp.TermGuid).get();
                  if (term !== null && term !== undefined) {
                    console.log(`SPECIAL: Single select term found. (${term.Name})`);
                    storeIndex = termStore.length;
                    newProp.Label = term.Name;
                  }
                }

                values.push(newProp);
              } catch (error) {
                  console.error("Error: ", error);
                  values.push(allValues[prop]);
              }
              break;
            case "Boolean":
              // Normalize Boolean values (handle true/false, 1/0, "true"/"false")
              const boolValue = normalizeBoolean(allValues[prop]);
              values.push(boolValue);
              break;
            default:
              // Default behavior is to treat it like a string
              values.push(allValues[prop]);
              break;
          }
        }

        // Push the final setup of a PageProperty object with its configuration
        newSetOfValues.push({ info: field, values: [...values], config: config });
      }

      setPagePropValues([...newSetOfValues]);
    }
  }

  /**
   * @description Effects to fire whenever the properties change
   */
  useEffect(() => {
    refreshProperties();

    return () => {
      // No cleanup at this moment
    };
  }, [propsRef.current]);

  /**
   * GetTextStyleClass
   * @description Returns the appropriate CSS class for the text style
   * @param textStyle
   * @returns
   */
  const GetTextStyleClass = (textStyle: TextStyle): string => {
    switch (textStyle) {
      case TextStyle.H2:
        return styles.textH2;
      case TextStyle.H3:
        return styles.textH3;
      case TextStyle.H4:
        return styles.textH4;
      case TextStyle.Body:
      default:
        return styles.textBody;
    }
  };

  /**
   * RenderPagePropValue
   * @description Focuses on the 3rd and final row layer, which is the actual values tied to any property displayed for the page
   * @param prop
   * @returns
   */
  const RenderPagePropValue = (prop: PagePropertyWithConfig) => {
    console.log(prop);
    const isCapsule = prop.config.displayMode === DisplayMode.Capsule;
    const textStyleClass = GetTextStyleClass(prop.config.textStyle);

    var retVal = _.map(prop.values, (val, index) => {
      if (val !== null) {
        // Render based on field type
        let content: JSX.Element;

        switch (prop.info.TypeAsString) {
          case "URL":
            if (isCapsule) {
              content = (
                <span className={styles.urlValue}><a href={val.Url} target="_blank" style={{color: semanticColors.link}}>{val.Description}</a></span>
              );
            } else {
              content = (
                <span className={textStyleClass}>{val.Description}</span>
              );
            }
            break;
          case "Thumbnail":
            content = (
              <span><img className={styles.imgValue} src={val.serverRelativeUrl} /></span>
            );
            break;
          case "Number":
            const numberValue = (prop.info["ShowAsPercentage"] === true ? Number(val).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:0}) : (prop.info["CommaSeparator"] === true ? val.toLocaleString('en') : val.toString()));
            if (isCapsule) {
              content = (
                <span className={styles.standardCapsule} style={{backgroundColor: semanticColors.accentButtonBackground, color: semanticColors.accentButtonText}}>
                  <a href={`${props.context.pageContext.web.absoluteUrl}${props.capsuleLinkUrl}?${(props.useFieldNameForCapsuleLinkQSName ? prop.info.InternalName : (props.capsuleLinkQSFieldName === null || props.capsuleLinkQSFieldName === undefined ? "q" : props.capsuleLinkQSFieldName))}=${encodeURIComponent(numberValue)}`} style={{ color: semanticColors.accentButtonText }}>{numberValue}</a>
                </span>
              );
            } else {
              content = (
                <span className={textStyleClass}>{numberValue}</span>
              );
            }
            break;
          case "Currency":
            const currencyValue = (prop.info["CommaSeparator"] === true ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val) : Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', useGrouping: false }).format(val));
            if (isCapsule) {
              content = (
                <span className={styles.standardCapsule} style={{backgroundColor: semanticColors.accentButtonBackground, color: semanticColors.accentButtonText}}>
                  <a href={`${props.context.pageContext.web.absoluteUrl}${props.capsuleLinkUrl}?${(props.useFieldNameForCapsuleLinkQSName ? prop.info.InternalName : (props.capsuleLinkQSFieldName === null || props.capsuleLinkQSFieldName === undefined ? "q" : props.capsuleLinkQSFieldName))}=${encodeURIComponent(currencyValue)}`} style={{ color: semanticColors.accentButtonText }}>{currencyValue}</a>
                </span>
              );
            } else {
              content = (
                <span className={textStyleClass}>{currencyValue}</span>
              );
            }
            break;
          case "DateTime":
            let dateValue: string;
            switch (prop.info["DateFormat"]) {
              case "StandardUS":
                dateValue = new Date(val).toLocaleDateString();
                break;
              case "ISO8601":
                const d = new Date(val);
                dateValue = `${d.getFullYear().toString()}-${d.getMonth()}-${d.getDate()}`;
                break;
              case "DayOfWeek":
                dateValue = new Date(val).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
                break;
              case "MonthSpelled":
                dateValue = new Date(val).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' });
                break;
              default:
                dateValue = new Date(val).toLocaleDateString();
                break;
            }
            if (isCapsule) {
              content = (
                <span className={styles.standardCapsule} style={{backgroundColor: semanticColors.accentButtonBackground, color: semanticColors.accentButtonText}}>
                  <a href={`${props.context.pageContext.web.absoluteUrl}${props.capsuleLinkUrl}?${(props.useFieldNameForCapsuleLinkQSName ? prop.info.InternalName : (props.capsuleLinkQSFieldName === null || props.capsuleLinkQSFieldName === undefined ? "q" : props.capsuleLinkQSFieldName))}=${encodeURIComponent(dateValue)}`} style={{ color: semanticColors.accentButtonText }}>{dateValue}</a>
                </span>
              );
            } else {
              content = (
                <span className={textStyleClass}>{dateValue}</span>
              );
            }
            break;
          case "Note":
            // Note fields are multi-line text - preserve line breaks
            // Note fields should only be in Text mode (enforced in property pane)
            const noteValue = val.toString();
            content = (
              <span className={textStyleClass} style={{whiteSpace: 'pre-wrap'}}>{noteValue}</span>
            );
            break;
          case "Boolean":
            // Boolean fields should only be in Text mode (enforced in property pane)
            const boolValue = normalizeBoolean(val);
            const formattedBool = formatBoolean(boolValue, prop.config.booleanDisplayFormat);
            content = (
              <span className={textStyleClass}>{formattedBool}</span>
            );
            break;
          case "TaxonomyFieldTypeMulti":
          case "TaxonomyFieldType":
            const termLabel = val.Label || val;
            if (isCapsule) {
              content = (
                <span className={styles.standardCapsule} style={{backgroundColor: semanticColors.accentButtonBackground, color: semanticColors.accentButtonText}}>
                  <a href={`${props.context.pageContext.web.absoluteUrl}${props.capsuleLinkUrl}?${(props.useFieldNameForCapsuleLinkQSName ? prop.info.InternalName : (props.capsuleLinkQSFieldName === null || props.capsuleLinkQSFieldName === undefined ? "q" : props.capsuleLinkQSFieldName))}=${encodeURIComponent(termLabel)}`} style={{ color: semanticColors.accentButtonText }}>{termLabel}</a>
                </span>
              );
            } else {
              content = (
                <span className={textStyleClass}>{termLabel}</span>
              );
            }
            break;
          default:
            const stringValue = val.toString();
            if (isCapsule) {
              content = (
                <span className={styles.standardCapsule} style={{backgroundColor: semanticColors.accentButtonBackground, color: semanticColors.accentButtonText}}>
                  <a href={`${props.context.pageContext.web.absoluteUrl}${props.capsuleLinkUrl}?${(props.useFieldNameForCapsuleLinkQSName ? prop.info.InternalName : (props.capsuleLinkQSFieldName === null || props.capsuleLinkQSFieldName === undefined ? "q" : props.capsuleLinkQSFieldName))}=${encodeURIComponent(stringValue)}`} style={{ color: semanticColors.accentButtonText }}>{stringValue}</a>
                </span>
              );
            } else {
              content = (
                <span className={textStyleClass}>{stringValue}</span>
              );
            }
            break;
        }

        return <React.Fragment key={index}>{content}</React.Fragment>;
      } else {
        return (
          <React.Fragment key={index}>
            <span className={isCapsule ? styles.standardCapsule : textStyleClass} style={isCapsule ? {backgroundColor: semanticColors.accentButtonBackground, color: semanticColors.accentButtonText} : {}}>N/A</span>
          </React.Fragment>
        );
      }
    });
    return retVal;
  };

  /**
   * RenderPageProperties
   * @description Focuses on the 2nd row layer, which is the property names that have been chosen to be displayed (uses Title as the display name)
   * @returns
   */
  const RenderPageProperties = () => {
    if (pagePropValues !== undefined && pagePropValues !== null && pagePropValues.length > 0) {
      var retVal = _.map(pagePropValues, (prop) => {
        const showLabel = !prop.config.hideLabel;
        return (
            <>
              {showLabel && (
                <div className={styles.propNameRow}>{prop.info.Title}<span style={{display: 'none'}}> - {prop.info.TypeAsString}</span></div>
              )}
              <div className={`${styles.propValsRow} ${!showLabel ? styles.propValsRowNoLabel : ''}`}>
                {RenderPagePropValue(prop)}
              </div>
            </>
          );
      });
      return retVal;
    } else {
      return <i>Nothing to display</i>;
    }
  };

  /**
   * RenderTitle
   * @description Focuses on the 1 row layer, being the Title that has been chosen for the page
   * @returns
   */
  const RenderTitle = () => {
    if (props.title !== '') {
      return <div className={styles.title}>{props.title}</div>;
    } else {
      return null;
    }
  };

  return (
    <div className={`${styles.advancedPageProperties} ${styles.container}`} style={{backgroundColor: semanticColors.bodyBackground, color: semanticColors.bodyText}}>
      {RenderTitle()}
      {RenderPageProperties()}
    </div>
  );
};

export default AdvancedPageProperties;
