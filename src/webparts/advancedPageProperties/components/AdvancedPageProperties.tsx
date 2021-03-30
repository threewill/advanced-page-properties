import * as React from 'react';
import styles from './AdvancedPageProperties.module.scss';
import { IAdvancedPagePropertiesProps } from './IAdvancedPagePropertiesProps';
import { Log } from '../utilities/Log';
import * as _ from 'lodash';
import { useState, useEffect, useRef } from 'react';
import { PageProperty } from '../models';

import { sp } from "@pnp/sp";
import { FieldTypes, IField, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/items";

const AdvancedPageProperties: React.FunctionComponent<IAdvancedPagePropertiesProps> = props => {
  const [pagePropValues, setPagePropValues] = useState<PageProperty[]>([]);
  const propsRef = useRef(props);

  propsRef.current = props;

  sp.setup({ spfxContext: props.context });

  async function refreshProperties () {
    var newSetOfValues: PageProperty[] = [];

    if (props.selectedProperties !== undefined && props.selectedProperties !== null) {
      Log.Write(`${props.selectedProperties.length.toString()} properties used.`);

      // Get the value(s) for the field from the list item itself
      var allValues: any = {};
      if (props.context.pageContext.listItem !== undefined && props.context.pageContext.listItem !== null) {
        allValues = await sp.web.lists.getByTitle("Site Pages").items.getById(props.context.pageContext.listItem.id).select(...props.selectedProperties).get();
        console.log(allValues);
      }

      for (let i = 0; i < props.selectedProperties.length; i++) {
        const prop = props.selectedProperties[i];

        Log.Write(`Selected Property: ${prop}`);

        // Get field information, in case anything is needed in conjunction with value types
        const field = await sp.web.lists.getByTitle("Site Pages").fields.getByInternalNameOrTitle(prop)();

        // Establish the values array
        var values: string[] = [];
        if (allValues.hasOwnProperty(prop)) {
          switch (field.TypeAsString) {
            case "MultiChoice":
              values.push(allValues[prop]);
              break;

            case "URL":
              break;

            default:
              // Default behavior is to treat it like a string
              values.push(allValues[prop].toString());
              break;
          }
        }

        // Push the final setup of a PageProperty object
        newSetOfValues.push({ info: field, values: [...values] });
      }

      setPagePropValues({...newSetOfValues});
    }
  }

  useEffect(() => {
    refreshProperties();

    return () => {
      // No cleanup at this moment
    };
  }, [propsRef.current]);

  const RenderPageProperties = () => {
    if (pagePropValues !== undefined && pagePropValues !== null) {
      var retVal = _.map(pagePropValues, (prop) => {
        return (
            <>
              <div className={styles.row}>{prop.info.Title} - {prop.info.TypeAsString}</div>
              <div className={styles.row}>
                {RenderPagePropValue(prop.values)}
              </div>
            </>
          );
      });
      return retVal;
    } else {
      return <i>Nothing to display</i>;
    }
  };

  const RenderPagePropValue = (values: string[]) => {
    var retVal = _.map(values, (val) => {
      return (
          <span>{val}</span>
        );
    });
    return retVal;
  };

  const RenderTitle = () => {
    if (props.title !== '') {
      return <div className={styles.title}>{props.title}</div>;
    } else {
      return null;
    }
  };

  return (
    <div className={`${styles.advancedPageProperties} ${styles.container}`}>
      {RenderTitle()}
      {RenderPageProperties()}
    </div>
  );
};

export default AdvancedPageProperties;
