import {  } from '@microsoft/sp-webpart-base';

import * as React from 'react';
import styles from './PivotTiles.module.scss';
import { Link } from 'office-ui-fabric-react/lib/Link';
import Utils from './utils';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import PivotTileItem from './../TileItems/PivotTileItem';


import { Carousel, CarouselButtonsLocation, CarouselButtonsDisplay } from "@pnp/spfx-controls-react/lib/Carousel";
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";

//From https://tahoeninjas.blog/2019/08/07/sharepoint-framework-design-series-layout-patterns-part-iii/
import { CarouselLayout, ICarouselItem } from '../../components/carouselLayout';

import Grid from './../../components/gridComponent/Grid';
import { IGridProps, IGridItem } from './../../components/gridComponent/Grid.types';

//export default class NoListFound extends React.Component<IPivotTilesProps, IPivotTilesState> {


/**
 * 
 * @param parentProps 
 * @param parentState 
 */

export function tileBuilder(parentProps,parentState){
  console.log('tileBuilder',parentProps,parentState);
  const tileBuild = parentState.filteredTiles.map(newTile => (
      oneTileBuilder(parentProps,parentState, 'normal', newTile )
  ));
    //      setImgFit={newTile.setRatio = '1x1'? 'portrait' : newTile.setImgFit}

  return tileBuild;
}

export function listViewBuilder(parentProps,parentState, theseAreItems, thisCategory){
  // Carousel option from https://github.com/hugoabernier/WebPartDesignSeries
  console.log('listViewBuilder',parentProps,parentState,theseAreItems);
  let items = [];

  for (let item of theseAreItems){
    const isArray = typeof(item.category);
    //console.log(isArray);

    if (isArray === 'string') {
      item.txtCategory = item.category;
    } else if (isArray === 'object' && item.category.length === 1) {
      item.txtCategory = item.category[0];
    } else if (isArray === 'object' && item.category.length > 1) {
      item.txtCategory = item.category.join(", ");
    }

    items.push(item);
  }

  //remap props to correct ones for HGcarouselLayout
  const viewFields: IViewField[]=[
    {
      name: "txtCategory",
      displayName: "Category",
      isResizable: true,
      sorting: true,
      minWidth: 30,
      maxWidth: 200
    },{    
      name: "title",
      displayName: "Title",
      linkPropertyName: "href",
      isResizable: true,
      sorting: true,
      minWidth: 50,
      maxWidth: 200
    },{
      name: "description",
      displayName: "Description",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 30,
      maxWidth: 200
    },
  ];
  

  /**
    name: string;
    displayName?: string;
    linkPropertyName?: string;
    sorting?: boolean;
    minWidth?: number;
    maxWidth?: number;
    isResizable?: boolean;
  */


  let listView = 
    <ListView
      items={items}
      viewFields={viewFields}
      iconFieldName="href"
      compact={false}
      selectionMode={SelectionMode.none}
      //selection={this._getSelection}
      showFilter={false}
      //defaultFilter="John"
      filterPlaceHolder="Search..."
      //groupByFields={groupByFields}
       />;

  return listView;

}

/**
 * 
 * @param parentProps 
 * @param parentState 
 */

export function carouselBuilder(parentProps,parentState){
  console.log('carouselBuilder',parentProps,parentState);
  let carouselFullLineBuild: any;

  if (parentState.heroTiles[0]) {

   const carouselElements = parentState.heroTiles.map(newTile => (
        oneTileBuilder(parentProps,parentState, 'hero', newTile )
    ));

    carouselFullLineBuild = 
    <Carousel
      buttonsLocation={CarouselButtonsLocation.top}
      buttonsDisplay={CarouselButtonsDisplay.block}
      isInfinite={true}
      element={carouselElements}
      onMoveNextClicked={(index: number) => { console.log(`Next button clicked: ${index}`); }}
      onMovePrevClicked={(index: number) => { console.log(`Prev button clicked: ${index}`); }}
    />
      ;
  } else { carouselFullLineBuild = ""; }

  return carouselFullLineBuild;
}

/**
 * 
 * @param parentProps 
 * @param parentState 
 */
export function heroBuilder(parentProps,parentState){
  console.log('heroBuilder',parentProps,parentState);
    let heroFullLineBuild : any;
    if (parentState.heroTiles) {
      heroFullLineBuild = parentState.heroTiles.map(newTile => (
        oneTileBuilder(parentProps,parentState, 'hero', newTile )
      ));
    } else { heroFullLineBuild = ""; }

    return heroFullLineBuild;
}


/**
 * 
 * @param parentProps 
 * @param parentState 
 * @param tType 
 */
export function oneTileBuilder(parentProps,parentState, tType, newTile ){
  console.log('oneTileBuilder',parentProps,parentState);

  const thisTile = 
    <PivotTileItem
      parentCat = {parentState.filteredCategory}
      imageUrl={newTile.imageUrl}
      title={newTile.title}
      description={newTile.description}
      href={newTile.href}
      category={newTile.category}
      setTab={newTile.setTab}
      Id={newTile.Id}
      options={newTile.options}
      color={newTile.color}
      imgSize={newTile.imgSize}
      listWebURL={newTile.listWebURL}
      listTitle={newTile.listTitle}
      setRatio={newTile.setRatio}
      setSize={newTile.setSize}

      setImgFit={ tType === 'normal' ? newTile.setImgFit : parentProps.setHeroFit }
      setImgCover={ tType === 'normal' ? newTile.setImgCover : parentProps.setHeroCover }

      target={newTile.target}
      onHoverZoom={parentProps.onHoverZoom}

      heroType={ tType === 'normal' ? 'none' : newTile.heroType }
      heroCategory={ tType === 'normal' ? 'none' : parentProps.heroCategory }

      imageWidth = {parentProps.imageWidth}
      imageHeight = {parentProps.imageHeight}
      textPadding = {parentProps.textPadding}

      created = {newTile.created}
      modified = {newTile.modified}
      modifiedTime = {newTile.modifiedTime}
      createdTime = {newTile.createdTime}
      editor = {newTile.editor}
      author = {newTile.Author}

      />;

    //      setImgFit={newTile.setRatio = '1x1'? 'portrait' : newTile.setImgFit}
  return thisTile;

}


export function carouselLayout(parentProps,parentState, theseAreItems, thisCategory){
  // Carousel option from https://github.com/hugoabernier/WebPartDesignSeries

  console.log('carouselLayout',parentProps,parentState, theseAreItems, thisCategory);

  //remap props to correct ones for HGcarouselLayout
  let items = theseAreItems.map(item => ({

    imageSrc: item.imageUrl,
    title: item.title,
    location: item.description,
    href: item.href,
    target: item.target,

  }));

  let carousel = 
    <CarouselLayout
      pagingTemplate={'{0} of {1} in ' + thisCategory}
      ariaLabel={'Use right and left arrow keys to navigate between images in the carousel. Use up and down arrow keys to access the edit and remove buttons for any image.'}
      items={items}
      onSlideClick={(currentSlide) => { alert(`You clicked on slide ${currentSlide+1}`); }}
      heroRatio={parentProps.heroRatio}
    >
    </CarouselLayout>;

  return carousel;

}

export function gridLayout(parentProps,parentState, theseAreItems, thisCategory){
  // Carousel option from https://github.com/hugoabernier/WebPartDesignSeries
  console.log('gridLayout',parentProps,parentState, theseAreItems, thisCategory);
  let items = theseAreItems.map(item => ({

    thumbnail: item.imageUrl,
    title: item.title,
    name: item.description,
    profileImageSrc: "",
    location: thisCategory,
    activity: "",
    href: item.href,
    target: item.target,
    listWebURL:item.listWebURL,

  }));


  let grid: React.ReactElement<IGridProps> = React.createElement(
    Grid,
    { items: items,
    }
  );

  return grid;

}
