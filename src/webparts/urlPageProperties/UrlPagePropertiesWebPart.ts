import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration, IPropertyPaneDropdownOption, IPropertyPaneField, PropertyPaneButton, PropertyPaneButtonType, PropertyPaneDropdown, PropertyPaneHorizontalRule, PropertyPaneSlider, PropertyPaneTextField, PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';

import * as strings from 'UrlPagePropertiesWebPartStrings';
import UrlPageProperties from './components/UrlPageProperties';
import { IUrlPagePropertiesProps } from './components/IUrlPagePropertiesProps';
import { PropertyFieldIconPicker } from '@pnp/spfx-property-controls/lib/PropertyFieldIconPicker';
import { getSP } from '../../common/pnpjsConfig';
import { getPageListId, getPageListItemId, hasPageListItem } from '../../common/pageContextHelpers';
import { Log } from '../advancedPageProperties/utilities/Log';
import * as _ from 'lodash';
import {
  ThemeProvider,
  ThemeChangedEventArgs,
  IReadonlyTheme
} from '@microsoft/sp-component-base';
import { UrlPropertyConfiguration, TileSize, UrlDisplayMode } from './models';

export interface IUrlPagePropertiesWebPartProps {
  title: string;
  tileSize: TileSize;
  urlProperties: UrlPropertyConfiguration[];
  /** Height in pixels for embedded iframes (default 400) */
  embedHeight: number;
  /** When true, hide border, title, and "Open in new tab" on embeds so iframe feels part of the page */
  hideEmbedChrome: boolean;
}

export default class UrlPagePropertiesWebPart extends BaseClientSideWebPart<IUrlPagePropertiesWebPartProps> {

  private _sp!: SPFI;
  private availableUrlProperties: IPropertyPaneDropdownOption[] = [];
  private _themeProvider!: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }

  protected async onInit(): Promise<void> {
    this._sp = getSP(this.context);

    // Consume the new ThemeProvider service
    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

    // If it exists, get the theme variant
    this._themeVariant = this._themeProvider.tryGetTheme();

    // Register a handler to be notified if the theme variant changes
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IUrlPagePropertiesProps> = React.createElement(
      UrlPageProperties,
      {
        context: this.context,
        sp: this._sp,
        title: this.properties.title || '',
        tileSize: this.properties.tileSize || TileSize.Medium,
        urlProperties: this.properties.urlProperties || [],
        embedHeight: this.properties.embedHeight != null ? this.properties.embedHeight : 400,
        hideEmbedChrome: this.properties.hideEmbedChrome === true,
        themeVariant: this._themeVariant
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async getUrlProperties(): Promise<void> {
    Log.Write("Getting Site Page URL fields...");
    const listId = getPageListId(this.context);
    if (!listId) {
      Log.Write("Page list context unavailable.");
      return;
    }

    const list = this._sp.web.lists.getById(listId);
    const fi = await list.fields();

    this.availableUrlProperties = [];
    Log.Write(`${fi.length.toString()} fields retrieved!`);
    fi.forEach((f) => {
      // Only include URL fields
      if (!f.FromBaseType && !f.Hidden && !f.Sealed && f.SchemaXml.indexOf("ShowInListSettings=\"FALSE\"") === -1
          && f.TypeAsString === "URL") {
        this.availableUrlProperties.push({ key: f.InternalName, text: f.Title });
        Log.Write(`URL Field: ${f.InternalName} (${f.TypeAsString})`);
      }
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected onAddButtonClick(value: any) {
    if (!this.properties.urlProperties) {
      this.properties.urlProperties = [];
    }
    if (this.availableUrlProperties.length > 0) {
      const selectedFieldName = this.availableUrlProperties[0].key.toString();

      // Get the field's default description to seed the display name
      this.getFieldDescription(selectedFieldName).then((description) => {
        this.properties.urlProperties.push({
          fieldName: selectedFieldName,
          displayName: description || selectedFieldName,
          iconName: 'Link',
          displayMode: UrlDisplayMode.Tile
        });
        this.context.propertyPane.refresh();
      });
    }
  }

  private async getFieldDescription(fieldName: string): Promise<string> {
    try {
      const listId = getPageListId(this.context);
      const listItemId = getPageListItemId(this.context);
      if (listId && hasPageListItem(this.context) && listItemId !== undefined) {
        const item = await this._sp.web.lists.getById(listId).items.getById(listItemId).select(fieldName)();
        if (item[fieldName] && item[fieldName].Description) {
          return item[fieldName].Description;
        }
      }
    } catch (error) {
      Log.Write(`Error getting field description: ${error}`);
    }
    return '';
  }

  protected onDeleteButtonClick(value: any) {
    Log.Write(value.toString());
    if (this.properties.urlProperties && this.properties.urlProperties.length > value) {
      var removed = this.properties.urlProperties.splice(value, 1);
      Log.Write(`${removed[0].fieldName} removed.`);
      this.context.propertyPane.refresh();
    }
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (!this.properties.urlProperties) {
      this.properties.urlProperties = [];
    }

    if (propertyPath.indexOf("urlProperty") >= 0) {
      Log.Write('URL Property field identified');
      let index: number = _.toInteger(propertyPath.replace("urlProperty", ""));
      if (this.properties.urlProperties[index]) {
        this.properties.urlProperties[index].fieldName = newValue;
        // Update display name when field changes
        this.getFieldDescription(newValue).then((description) => {
          if (this.properties.urlProperties[index]) {
            this.properties.urlProperties[index].displayName = description || newValue;
            this.context.propertyPane.refresh();
          }
        });
      }
    } else if (propertyPath.indexOf("displayName") >= 0) {
      let index: number = _.toInteger(propertyPath.replace("displayName", ""));
      if (this.properties.urlProperties[index]) {
        this.properties.urlProperties[index].displayName = newValue;
      }
    } else if (propertyPath.indexOf("iconPicker") >= 0) {
      let index: number = _.toInteger(propertyPath.replace("iconPicker", ""));
      if (this.properties.urlProperties[index]) {
        this.properties.urlProperties[index].iconName = newValue;
      }
    } else if (propertyPath.indexOf("displayMode") >= 0) {
      let index: number = _.toInteger(propertyPath.replace("displayMode", ""));
      if (this.properties.urlProperties[index]) {
        this.properties.urlProperties[index].displayMode = newValue;
      }
    }
  }

  protected async onPropertyPaneConfigurationStart(): Promise<void> {
    Log.Write(`onPropertyPaneConfigurationStart`);
    await this.getUrlProperties();
    this.context.propertyPane.refresh();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    Log.Write(`getPropertyPaneConfiguration`);

    var propDrops: IPropertyPaneField<any>[] = [];

    // Title
    propDrops.push(PropertyPaneTextField('title', {
      label: strings.TitleFieldLabel
    }));

    // Tile Size
    propDrops.push(PropertyPaneDropdown('tileSize', {
      label: strings.TileSizeLabel,
      options: [
        { key: TileSize.ExtraSmall, text: strings.TileSizeExtraSmallLabel },
        { key: TileSize.Small, text: strings.TileSizeSmallLabel },
        { key: TileSize.Medium, text: strings.TileSizeMediumLabel },
        { key: TileSize.Large, text: strings.TileSizeLargeLabel },
        { key: TileSize.ExtraLarge, text: strings.TileSizeExtraLargeLabel }
      ],
      selectedKey: this.properties.tileSize || TileSize.Medium
    }));

    // Embed height (for URL properties displayed as embedded iframe)
    propDrops.push(PropertyPaneSlider('embedHeight', {
      label: strings.EmbedHeightLabel,
      min: 200,
      max: 1200,
      value: this.properties.embedHeight != null ? this.properties.embedHeight : 400,
      showValue: true
    }));

    // Minimal embed: no border, title, or "Open in new tab" link
    propDrops.push(PropertyPaneToggle('hideEmbedChrome', {
      label: strings.HideEmbedChromeLabel,
      onText: strings.HideEmbedChromeOnText,
      offText: strings.HideEmbedChromeOffText
    }));

    propDrops.push(PropertyPaneHorizontalRule());

    // URL Property configurations
    const configs = this.properties.urlProperties || [];
    configs.forEach((config, index) => {
      // URL Property field selection
      propDrops.push(PropertyPaneDropdown(`urlProperty${index.toString()}`,
        {
          label: strings.UrlPropertyFieldLabel,
          options: this.availableUrlProperties,
          selectedKey: config.fieldName,
        }));

      // Display name
      propDrops.push(PropertyPaneTextField(`displayName${index.toString()}`,
        {
          label: strings.DisplayNameLabel,
          value: config.displayName
        }));

      // Display as: Tile (link) or Embedded (iframe)
      propDrops.push(PropertyPaneDropdown(`displayMode${index.toString()}`, {
        label: strings.DisplayModeLabel,
        options: [
          { key: UrlDisplayMode.Tile, text: strings.DisplayModeTileLabel },
          { key: UrlDisplayMode.Embed, text: strings.DisplayModeEmbedLabel }
        ],
        selectedKey: config.displayMode != null ? config.displayMode : UrlDisplayMode.Tile
      }));

      // Icon picker (only relevant for tile mode; still show for consistency)
      propDrops.push(PropertyFieldIconPicker(`iconPicker${index.toString()}`, {
        buttonLabel: strings.IconPickerLabel,
        currentIcon: config.iconName || 'Link',
        key: `iconPicker${index.toString()}`,
        onSave: (icon: string) => {
          if (this.properties.urlProperties[index]) {
            this.properties.urlProperties[index].iconName = icon;
          }
        },
        onChanged: (icon: string) => {
          if (this.properties.urlProperties[index]) {
            this.properties.urlProperties[index].iconName = icon;
          }
        },
        renderOption: "panel",
        properties: this.properties,
        onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
        label: strings.IconPickerLabel
      }));

      // Delete button
      propDrops.push(PropertyPaneButton(`deleteButton${index.toString()}`,
      {
        text: strings.DeleteButtonText,
        buttonType: PropertyPaneButtonType.Command,
        icon: "RecycleBin",
        onClick: this.onDeleteButtonClick.bind(this, index)
      }));
      propDrops.push(PropertyPaneHorizontalRule());
    });

    // Add button
    propDrops.push(PropertyPaneButton('addButton',
    {
      text: strings.AddButtonText,
      buttonType: PropertyPaneButtonType.Command,
      icon: "CirclePlus",
      onClick: this.onAddButtonClick.bind(this)
    }));

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.PropertyPaneDescription,
              groupFields: propDrops
            }
          ]
        }
      ]
    };
  }
}
