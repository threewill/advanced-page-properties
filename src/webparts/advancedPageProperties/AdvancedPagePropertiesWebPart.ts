import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration, IPropertyPaneDropdownOption, IPropertyPaneField, PropertyPaneButton, PropertyPaneButtonType, PropertyPaneDropdown, PropertyPaneHorizontalRule, PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AdvancedPagePropertiesWebPartStrings';
import AdvancedPageProperties from './components/AdvancedPageProperties';
import { IAdvancedPagePropertiesProps } from './components/IAdvancedPagePropertiesProps';
//import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
import "@pnp/sp/fields";
import "@pnp/sp/fields/list";
import { FieldTypes, sp } from "@pnp/sp/presets/all";
import { Log } from './utilities/Log';
import * as _ from 'lodash';
import {
  ThemeProvider,
  ThemeChangedEventArgs,
  IReadonlyTheme
} from '@microsoft/sp-component-base';
import { PropertyConfiguration, DisplayMode, TextStyle, BooleanDisplayFormat } from './models';

export interface IAdvancedPagePropertiesWebPartProps {
  capsuleLinkUrl: string;
  title: string;
  selectedProperties: string[]; // Legacy - kept for backward compatibility
  propertyConfigurations: PropertyConfiguration[]; // New structure
  useFieldNameForCapsuleLinkQSFieldName: boolean;
  capsuleLinkQSFieldNameVal: string;
}

export default class AdvancedPagePropertiesWebPart extends BaseClientSideWebPart<IAdvancedPagePropertiesWebPartProps> {

  private availableProperties: IPropertyPaneDropdownOption[] = [];
  private fieldTypeMap: Map<string, string> = new Map(); // Maps field internal name to TypeAsString
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }

  protected async onInit(): Promise<void> {
    sp.setup({ spfxContext: this.context });

      // Consume the new ThemeProvider service
    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

    // If it exists, get the theme variant
    this._themeVariant = this._themeProvider.tryGetTheme();

    // Register a handler to be notified if the theme variant changes
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);

    super.onInit();
  }

  public render(): void {
    // Validate and assign the default value to capsuleLinkUrl if not provided
    const capsuleLinkUrl = this.properties.capsuleLinkUrl || "/_layouts/15/search.aspx/siteall"; //?q=";

    // Migrate legacy selectedProperties to new propertyConfigurations if needed
    let propertyConfigurations = this.properties.propertyConfigurations;
    if (!propertyConfigurations || propertyConfigurations.length === 0) {
      if (this.properties.selectedProperties && this.properties.selectedProperties.length > 0) {
        // Migrate legacy data
        // Note: fieldTypeMap may not be populated yet during initial render, so we default to Capsule
        // The property pane will correct this when opened
        propertyConfigurations = this.properties.selectedProperties.map(fieldName => ({
          fieldName: fieldName,
          displayMode: DisplayMode.Capsule,
          textStyle: TextStyle.Body,
          hideLabel: false
        }));
        this.properties.propertyConfigurations = propertyConfigurations;
      } else {
        propertyConfigurations = [];
      }
    }

    const element: React.ReactElement<IAdvancedPagePropertiesProps> = React.createElement(
      AdvancedPageProperties,
      {
        context: this.context,
        title: this.properties.title,
        propertyConfigurations: propertyConfigurations,
        themeVariant: this._themeVariant,
        capsuleLinkUrl: capsuleLinkUrl,
        useFieldNameForCapsuleLinkQSName: this.properties.useFieldNameForCapsuleLinkQSFieldName,
        capsuleLinkQSFieldName: this.properties.capsuleLinkQSFieldNameVal
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async getPageProperties(): Promise<void> {
    Log.Write("Getting Site Page fields...");
    const list = sp.web.lists.getByTitle("Site Pages");
    const fi = await list.fields();

    this.availableProperties = [];
    this.fieldTypeMap.clear();
    Log.Write(`${fi.length.toString()} fields retrieved!`);
    fi.forEach((f) => {
      // Store field type mapping for all fields
      this.fieldTypeMap.set(f.InternalName, f.TypeAsString);

      // Allow Note and Boolean fields now, but still exclude User
      if (!f.FromBaseType && !f.Hidden && !f.Sealed && f.SchemaXml.indexOf("ShowInListSettings=\"FALSE\"") === -1
          && f.TypeAsString !== "User") {
        this.availableProperties.push({ key: f.InternalName, text: f.Title });
        Log.Write(f.TypeAsString);
      }
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected onAddButtonClick (value: any) {
    if (!this.properties.propertyConfigurations) {
      this.properties.propertyConfigurations = [];
    }
    const selectedFieldName = this.availableProperties[0].key.toString();
    const fieldType = this.fieldTypeMap.get(selectedFieldName);
    // Note and Boolean fields default to Text mode, all others default to Capsule
    const defaultDisplayMode = (fieldType === "Note" || fieldType === "Boolean") ? DisplayMode.Text : DisplayMode.Capsule;

    const newConfig: PropertyConfiguration = {
      fieldName: selectedFieldName,
      displayMode: defaultDisplayMode,
      textStyle: TextStyle.Body,
      hideLabel: false
    };

    // Set default Boolean display format if it's a Boolean field
    if (fieldType === "Boolean") {
      newConfig.booleanDisplayFormat = BooleanDisplayFormat.YesNo;
    }

    this.properties.propertyConfigurations.push(newConfig);
    this.context.propertyPane.refresh();
  }

  protected onDeleteButtonClick (value: any) {
    Log.Write(value.toString());
    if (this.properties.propertyConfigurations && this.properties.propertyConfigurations.length > value) {
      var removed = this.properties.propertyConfigurations.splice(value, 1);
      Log.Write(`${removed[0].fieldName} removed.`);
      this.context.propertyPane.refresh();
    }
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (!this.properties.propertyConfigurations) {
      this.properties.propertyConfigurations = [];
    }

    if (propertyPath.indexOf("selectedProperty") >= 0) {
      Log.Write('Selected Property identified');
      let index: number = _.toInteger(propertyPath.replace("selectedProperty", ""));
      if (this.properties.propertyConfigurations[index]) {
        this.properties.propertyConfigurations[index].fieldName = newValue;
        // If the new field is a Note or Boolean type, automatically set to Text mode
        const fieldType = this.fieldTypeMap.get(newValue);
        if (fieldType === "Note" || fieldType === "Boolean") {
          this.properties.propertyConfigurations[index].displayMode = DisplayMode.Text;
          // Set default Boolean display format if it's a Boolean field
          if (fieldType === "Boolean" && !this.properties.propertyConfigurations[index].booleanDisplayFormat) {
            this.properties.propertyConfigurations[index].booleanDisplayFormat = BooleanDisplayFormat.YesNo;
          }
        }
        // Refresh property pane to update display mode options
        this.context.propertyPane.refresh();
      }
    } else if (propertyPath.indexOf("displayMode") >= 0) {
      let index: number = _.toInteger(propertyPath.replace("displayMode", ""));
      if (this.properties.propertyConfigurations[index]) {
        this.properties.propertyConfigurations[index].displayMode = newValue;
        // Refresh property pane to show/hide text style dropdown
        this.context.propertyPane.refresh();
      }
    } else if (propertyPath.indexOf("textStyle") >= 0) {
      let index: number = _.toInteger(propertyPath.replace("textStyle", ""));
      if (this.properties.propertyConfigurations[index]) {
        this.properties.propertyConfigurations[index].textStyle = newValue;
      }
    } else if (propertyPath.indexOf("hideLabel") >= 0) {
      let index: number = _.toInteger(propertyPath.replace("hideLabel", ""));
      if (this.properties.propertyConfigurations[index]) {
        this.properties.propertyConfigurations[index].hideLabel = newValue;
      }
    } else if (propertyPath.indexOf("booleanDisplayFormat") >= 0) {
      let index: number = _.toInteger(propertyPath.replace("booleanDisplayFormat", ""));
      if (this.properties.propertyConfigurations[index]) {
        this.properties.propertyConfigurations[index].booleanDisplayFormat = newValue;
      }
    }
  }

  protected async onPropertyPaneConfigurationStart(): Promise<void> {
    Log.Write(`onPropertyPaneConfigurationStart`);
    await this.getPageProperties();
    this.context.propertyPane.refresh();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    Log.Write(`getPropertyPaneConfiguration`);

    // Initialize with the Title entry
    var propDrops: IPropertyPaneField<any>[] = [];
    propDrops.push(PropertyPaneTextField('title', {
      label: strings.TitleFieldLabel
    }));
    //Initialize Capsule Link URL
    propDrops.push(PropertyPaneTextField('capsuleLinkUrl',{
      label:strings.CapsuleLinkUrlLabel,
      value: this.properties.capsuleLinkUrl || "/_layouts/15/search.aspx/siteall"
    }));
    //Check if the Capsule Link will use the field name as the query string name for links
    propDrops.push(PropertyPaneToggle('useFieldNameForCapsuleLinkQSFieldName', {
      label: strings.CapsuleLinkUseFieldNameForQSLabel,
      onText: strings.CapsuleLinkUseFieldNameForQSOnLabel,
      offText: strings.CapsuleLinkUseFieldNameForQSOffLabel
    }));
    //Determine the value if the above answer is no
    propDrops.push(PropertyPaneTextField('capsuleLinkQSFieldNameVal', {
      label: strings.CapsuleLinkQSValLabel,
      value: this.properties.capsuleLinkQSFieldNameVal || "q"
    }));
    propDrops.push(PropertyPaneHorizontalRule());
    // Determine how many page property configurations we currently have
    const configs = this.properties.propertyConfigurations || [];
    configs.forEach((config, index) => {
      // Property field selection
      propDrops.push(PropertyPaneDropdown(`selectedProperty${index.toString()}`,
        {
          label: strings.SelectedPropertiesFieldLabel,
          options: this.availableProperties,
          selectedKey: config.fieldName,
        }));

      // Display mode selection
      // Note: Note and Boolean fields can only use Text mode, not Capsule
      const fieldType = this.fieldTypeMap.get(config.fieldName);
      const isNoteField = fieldType === "Note";
      const isBooleanField = fieldType === "Boolean";
      const isTextOnlyField = isNoteField || isBooleanField;
      const displayModeOptions = isTextOnlyField
        ? [{ key: DisplayMode.Text, text: strings.DisplayModeTextLabel }]
        : [
            { key: DisplayMode.Capsule, text: strings.DisplayModeCapsuleLabel },
            { key: DisplayMode.Text, text: strings.DisplayModeTextLabel }
          ];

      // If it's a Note or Boolean field and currently set to Capsule, change it to Text
      if (isTextOnlyField && config.displayMode === DisplayMode.Capsule) {
        config.displayMode = DisplayMode.Text;
      }

      propDrops.push(PropertyPaneDropdown(`displayMode${index.toString()}`,
        {
          label: strings.DisplayModeLabel,
          options: displayModeOptions,
          selectedKey: config.displayMode,
          disabled: isTextOnlyField, // Disable dropdown for Note/Boolean fields since only one option
        }));

      // Text style selection (only show when display mode is Text)
      if (config.displayMode === DisplayMode.Text) {
        propDrops.push(PropertyPaneDropdown(`textStyle${index.toString()}`,
          {
            label: strings.TextStyleLabel,
            options: [
              { key: TextStyle.H2, text: strings.TextStyleH2Label },
              { key: TextStyle.H3, text: strings.TextStyleH3Label },
              { key: TextStyle.H4, text: strings.TextStyleH4Label },
              { key: TextStyle.Body, text: strings.TextStyleBodyLabel }
            ],
            selectedKey: config.textStyle,
          }));
      }

      // Boolean display format selection (only show for Boolean fields)
      if (isBooleanField) {
        propDrops.push(PropertyPaneDropdown(`booleanDisplayFormat${index.toString()}`,
          {
            label: strings.BooleanDisplayFormatLabel,
            options: [
              { key: BooleanDisplayFormat.YesNo, text: strings.BooleanDisplayFormatYesNoLabel },
              { key: BooleanDisplayFormat.TrueFalse, text: strings.BooleanDisplayFormatTrueFalseLabel },
              { key: BooleanDisplayFormat.Checkmark, text: strings.BooleanDisplayFormatCheckmarkLabel }
            ],
            selectedKey: config.booleanDisplayFormat || BooleanDisplayFormat.YesNo,
          }));
      }

      // Hide label toggle
      propDrops.push(PropertyPaneToggle(`hideLabel${index.toString()}`,
        {
          label: strings.HideLabelLabel,
          checked: config.hideLabel
        }));

      // Every property gets its own delete button
      propDrops.push(PropertyPaneButton(`deleteButton${index.toString()}`,
      {
        text: strings.PropPaneDeleteButtonText,
        buttonType: PropertyPaneButtonType.Command,
        icon: "RecycleBin",
        onClick: this.onDeleteButtonClick.bind(this, index)
      }));
      propDrops.push(PropertyPaneHorizontalRule());
    });
    // Always have the Add button
    propDrops.push(PropertyPaneButton('addButton',
    {
      text: strings.PropPaneAddButtonText,
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
              groupName: strings.SelectionGroupName,
              groupFields: propDrops
            }
          ]
        }
      ]
    };
  }
}
