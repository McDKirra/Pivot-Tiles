declare interface IPivotTilesWebPartStrings {
  PropertyPaneDescription: string;
  PropertyPaneMainDescription: string,
  PropertyPaneColumnsDescription: string,
  PropertyPaneAbout: string,
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  description: string;
  listDefinition: string;
  listWebURL: string;
  listTitle: string;
  defaultTab: string;
  colTitleText: string;
  colHoverText: string;
  colCategory: string;
  colColor: string;
  colSize: string;
  colGoToLink: string;
  colOpenBehaviour: string;
  colImageLink: string;
  colSort: string;
  colTileStyle: string;
}

declare module 'PivotTilesWebPartStrings' {
  const strings: IPivotTilesWebPartStrings;
  export = strings;
}

declare module 'ControlStrings' {
  const strings: IControlStrings;
  export = strings;
}