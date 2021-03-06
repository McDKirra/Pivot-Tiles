import {
  IPropertyPanePage,
  PropertyPaneLabel,
  IPropertyPaneLabelProps,
  PropertyPaneHorizontalRule,
  PropertyPaneTextField, IPropertyPaneTextFieldProps,
  PropertyPaneLink, IPropertyPaneLinkProps,
  PropertyPaneDropdown, IPropertyPaneDropdownProps,
  IPropertyPaneDropdownOption,PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'PivotTilesWebPartStrings';
import { imageOptionsGroup } from './index';
import { pivotOptionsGroup} from './index';

export class IntroPage {
  public getPropertyPanePage(webPartProps): IPropertyPanePage {
    return <IPropertyPanePage>
    { // <page1>
      header: {
        description: strings.PropertyPaneAbout
      },
      groups: [
        {
          groupFields: [
            PropertyPaneLabel('About Text', {
              text: 'This webpart gets tile defintion from a list in SharePoint :).'
            }),

            PropertyPaneLink('About Link' , {
              text: 'Github Repo:  Pivot-Tiles',
              href: 'https://github.com/mikezimm/Pivot-Tiles',
            }),
          ]
        },
        { groupName: 'Basic webpart info',
        groupFields: [
          PropertyPaneTextField('listWebURL', {
              label: strings.listWebURL
          }),
          PropertyPaneTextField('setTab', {
            label: strings.setTab
          }),
          PropertyPaneTextField('otherTab', {
            label: strings.otherTab
          }),
        ]}, // this group
        { groupName: 'Filtering',
        groupFields: [
          PropertyPaneTextField('setFilter', {
              label: strings.setFilter
          }),
          PropertyPaneTextField('propURLQuery', {
              label: strings.propURLQuery
          }),
        ]}, // this group
        { groupName: 'Behavior',
          groupFields: [
            PropertyPaneDropdown('target', <IPropertyPaneDropdownProps>{
              label: 'Open Behavior',
              options: imageOptionsGroup.imgTargetChoices,
            }),
          ]}, // this group

          { groupName: 'Pivot Styles',
            groupFields: [
              PropertyPaneToggle('advancedPivotStyles', {
                label: '',
                offText: strings.Property_ShowHero_OffText,
                onText: strings.Property_ShowHero_OnText
              }),
            ]}, // this group

            { isCollapsed: !webPartProps.advancedPivotStyles,
            groupFields: [
              PropertyPaneDropdown('setPivSize', <IPropertyPaneDropdownProps>{
                label: strings.setPivSize,
                options: pivotOptionsGroup.pivSizeChoices,
              }),
              PropertyPaneDropdown('setPivFormat', <IPropertyPaneDropdownProps>{
                label: strings.setPivFormat,
                options: pivotOptionsGroup.pivFormatChoices,
              }),
              PropertyPaneDropdown('setPivOptions', <IPropertyPaneDropdownProps>{
                label: strings.setPivOptions,
                options: pivotOptionsGroup.pivOptionsChoices,
                disabled: true,
              }),
            ]}, // this group

          ]}; // Groups
  } // getPropertyPanePage()
}

export let introPage = new IntroPage();