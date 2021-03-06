//Category may need to be defined optionally here
//https://www.logicbig.com/tutorials/misc/typescript/interface-to-describe-object-with-optional-properties.html


export interface tileTime {
  time?: Date;
  yr? : number;
  mo? : number;
  date? : number;
  day? : number;
  hr?: number;
  locDate?: string;
  locTime?: string;
  age?: number;
  ageCat?: string;
  yrMo?: string;
  moDay?: string;

}


export interface IPivotTileItemProps {

  //Main webpart properties
  description: string;

  //Hero tile properties
  heroType: string;
  heroCategory: string;

  //Image & main tile properties
  onHoverZoom: string;
  setSize: string;
  setRatio: string;
  setImgFit: string;
  setImgCover: string;
  target: string;

  //Custom image properties
  imageWidth: number;
  imageHeight: number;
  textPadding: number;

  //Pivot Tab properties
  setTab: string;
  
  //List primary settings
  listWebURL: string;
  listTitle: string;

  //Mostly come from column values
  imageUrl: string;
  title: string;
  href: string;
  category:string[];
  Id: string;
  
  options: string;
  color: string;
  imgSize: string;
  
  parentCat?:string;

  modifiedTime: tileTime;
  createdTime: tileTime;
  modified: string;
  created: string;
  editor: string;
  author: string;

  //These are only added to pass information back from building initial tile collection in the first tile
  bestCreatedFormat?: string;
  bestModifiedFormat?: string;
  bestCategoryFormat?: string;

}