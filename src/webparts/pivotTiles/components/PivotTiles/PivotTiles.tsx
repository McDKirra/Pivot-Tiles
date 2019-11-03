import * as React from 'react';
import styles from './PivotTiles.module.scss';
import tileStyles from './../TileItems/PivotTileItem.module.scss';

import { IPivotTilesProps } from './IPivotTilesProps';
import { IPivotTilesState } from './IPivotTilesState';
import { IPivotTileItemProps } from './../TileItems/IPivotTileItemProps';
import PivotTileItem from './../TileItems/PivotTileItem';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { escape } from '@microsoft/sp-lodash-subset';
import Utils from './utils';
import tUtils from './../TileItems/utilTiles';

import { Pivot, PivotItem, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
import { DefaultButton, autobind } from 'office-ui-fabric-react';
//https://pnp.github.io/pnpjs/documentation/polyfill/ -- Needed to select/extend pnpJs in IE11
import "@pnp/polyfill-ie11";
import { sp, Web } from '@pnp/sp';
import * as strings from 'PivotTilesWebPartStrings';

import * as ErrorMessages from './ErrorMessages';
import MyCommandBar from '../CommandBar/CommandBar';

import { pivotOptionsGroup, } from '../../../../services/propPane';

import * as myErrors from './ErrorMessages';
import * as tileBuilders from './TileBuilder';

import { saveTheTime, getTheCurrentTime, saveAnalytics } from '../../../../services/createAnalytics';



export default class PivotTiles extends React.Component<IPivotTilesProps, IPivotTilesState> {

  //https://www.youtube.com/watch?v=4nsGhYjfRsw 9:01-ish talks about setting constructor
//  public constructor(props:IPivotTilesProps){
  public constructor(props:IPivotTilesProps){
    super(props);
    this.state = { 
      allTiles:[],
      filteredTiles:[],
      heroTiles:[],
      pivtTitles:[],
      showAllTiles: false,
      filteredCategory: this.props.setTab,
      pivotDefSelKey:"",
      loadStatus:"Loading",
      showTips: "none",
      loadError: "",
      lookupColumns: [],

    };

    // because our event handler needs access to the component, bind 
    //  the component to the function so it can get access to the
    //  components properties (this.props)... otherwise "this" is undefined
    this.onLinkClick = this.onLinkClick.bind(this);
    this.toggleTips = this.toggleTips.bind(this);
    this.minimizeTiles = this.minimizeTiles.bind(this);
    
    
  }

  public componentDidMount() {
    //Not using this function because it just did not want to work.
    //this._loadListItems();
    this._getListItems();
    //alert('this.props.heroCategory.length');
    //alert(this.props);
  }
  
  public componentDidUpdate(prevProps){

    //alert('componentDidUpdate 1');

    let rebuildTiles = false;
    if (this.props.setTab !== prevProps.setTab) {  rebuildTiles = true ; }
    if (this.props.setSize !== prevProps.setSize) {  rebuildTiles = true ; }
    if (this.props.showHero !== prevProps.showHero) {  rebuildTiles = true ; }
    if (this.props.heroType !== prevProps.heroType) {  rebuildTiles = true ; }
    if (this.props.setRatio !== prevProps.setRatio) {  rebuildTiles = true ; }
    if (this.props.setImgFit !== prevProps.setImgFit) {  rebuildTiles = true ; }
    if (this.props.setImgCover !== prevProps.setImgCover) {  rebuildTiles = true ; }
    if (this.props.heroCategory !== prevProps.heroCategory) {  rebuildTiles = true ; }

    if (rebuildTiles === true) {
      this._updateStateOnPropsChange();
    }
  }


  public createCarousels(thisState){
    let elemnts = [];
    if (thisState.heroTiles[0]){
      elemnts = thisState.heroTiles.map(newTile => (
        <div>
          {newTile.title}
        </div>
        ));
    }

    return (
      elemnts
    );
  }

  public render(): React.ReactElement<IPivotTilesProps> {
    let heroFullLineBuild : any = "";

    if (this.props.showHero === true && this.props.heroCategory) {
      if (this.state.loadStatus === "Ready" &&  this.state.heroStatus === "Ready") {
        heroFullLineBuild = tileBuilders.heroBuilder(this.props,this.state);
      }
    }

    // This will just put title text per createCarousels.
    //let carouselElements: JSX.Element[] = this.createCarousels(this.state) ;
    // This will put formatted tiles in place.  When width = 1 it looks great.
    
    let carouselBuilder = (this.state.heroTiles[0]) ? tileBuilders.carouselBuilder(this.props,this.state) : "";

    let buildTips = myErrors.buildTips(this.props,this.state);
    
    let tileBuild = tileBuilders.tileBuilder(this.props,this.state);

    let noListFound = myErrors.NoListFound(this.props,this.state);

    let noItemsFound = myErrors.NoItemsFound(this.props,this.state);

    let loadingSpinner = myErrors.LoadingSpinner(this.state);

    const defIndex = Utils.convertCategoryToIndex(this.props.setTab);

    let slider = (this.state.heroTiles[0]) ? tileBuilders.sliderBuilder(this.props,this.state) : "";

    return (
      <div>

        { ( (this.props.showHero === true && this.props.heroType === "header" &&  this.state.heroStatus === "Ready") ? ( heroFullLineBuild ) : ""  ) }

      <div className={styles.pivotTiles}>

        <div className={styles.container}>

          {/*//https://developer.microsoft.com/en-us/fabric#/controls/web/pivot*/}

            <div className={styles.floatLeft}>
              <Pivot 
                style={{ flexGrow: 1, paddingLeft: '10px' }}
                linkSize= { pivotOptionsGroup.getPivSize(this.props.setPivSize) }
                linkFormat= { pivotOptionsGroup.getPivFormat(this.props.setPivFormat) }
                onLinkClick= { this.onLinkClick }
                defaultSelectedKey={ defIndex }
                headersOnly={true}>
                  {this.createPivots(this.state)}
              </Pivot>
              <MyCommandBar
                toggleTips= { this.toggleTips }
                minimizeTiles= { this.minimizeTiles }
              />
            </div>

          <div>
          </div>
          <br/>
          
          { ( this.state.showTips === "yes" ? ( buildTips ) : "" ) }
          

          { ( this.props.showHero === true && this.props.heroType === "left" ? ( heroFullLineBuild ) : ""  ) }
          { ( this.props.showHero === true && this.props.heroType === "right" ? ( heroFullLineBuild ) : ""  ) }
          { ( (this.props.showHero === true && this.props.heroType === "carousel" &&  this.state.heroStatus === "Ready") ? ( carouselBuilder ) : ""  ) }
          { ( this.props.showHero === true && this.props.heroType === "slider" ? ( slider ) : ""  ) }
          { ( ( this.props.showHero === true && this.props.heroType === "inLine"  &&  this.state.heroStatus === "Ready") ? ( heroFullLineBuild ) : ""  ) }

            { ( tileBuild ) }
            { /* Originally instead of this:  ( tileBuild ) */ }           

            <div className={styles.tableRow}>
            { ( loadingSpinner ) }
            { ( noListFound )}
            { ( noItemsFound )}

            </div>


        </div>
        { ( (this.props.showHero === true && this.props.heroType === "footer"  &&  this.state.heroStatus === "Ready") ? ( heroFullLineBuild ) :""  ) }
      </div>
      </div>
    );
  }

  private _handleSettingsIconClick = (item: PivotItem): void => {
    alert('Hi!');
  }


  private onLinkClick = (item: PivotItem): void => {
    //This sends back the correct pivot category which matches the category on the tile.

    console.log('this.state.allTiles: ', this.state);
    let newFilteredTiles = [];
      for (let thisTile of this.state.allTiles) {
        if(thisTile.category && thisTile.category.indexOf(item.props.headerText) > -1) {

          let showThisTile = true;
          if (this.props.heroType !== 'none') {
            showThisTile = this.state.heroIds.indexOf(thisTile.Id.toString()) > -1 ? false : true;
          }
          if (showThisTile === true) {newFilteredTiles.push(thisTile) ; }
        }
    }

    this.setState({
      filteredCategory: item.props.headerText,
      filteredTiles: newFilteredTiles,
    });

  } //End onClick

  private minimizeTiles = (item: PivotItem): void => {
    //This sends back the correct pivot category which matches the category on the tile.

    let newFilteredTiles = [];

    this.setState({
      filteredTiles: newFilteredTiles,
      pivotDefSelKey: "-100",
    });

  } //End onClick
  public toggleTips = (item: any): void => {
    //This sends back the correct pivot category which matches the category on the tile.

    let newshowTips = this.state.showTips === 'none' ? 'yes' : 'none';

    this.setState({
      showTips: newshowTips,
    });

  } //End toggleTips  

  //http://react.tips/how-to-create-reactjs-components-dynamically/ - based on createImage
  public createPivot(pivT) {
    const thisItemKey :string = Utils.convertCategoryToIndex(pivT);
      return (
        <PivotItem headerText={pivT} itemKey={thisItemKey}/>
      );
  }

  public createPivots(thisState){
    console.log('thisState.pivTitles: ', thisState.pivtTitles);
    let piv = thisState.pivtTitles.map(this.createPivot,thisState.filteredCategory);

    return (
      piv
    );
  }



  //Added for Get List Data:  https://www.youtube.com/watch?v=b9Ymnicb1kc
  @autobind 
  private async _loadListItems(): Promise<void> {
    //This invokes the loadListItems function on the parent webpart.ts
    const listItems: IPivotTileItemProps[] = await this.props.loadListItems();

    //https://www.youtube.com/watch?v=4nsGhYjfRsw 9:01-ish talks about this line to update props
    this.setState({allTiles:listItems});

  }

  private _updateStateOnPropsChange(): void {

    let newCollection = this.state.allTiles;
    let pivotProps = this.props;
    let newHeros = this.getHeroTiles(pivotProps, newCollection);
    let heroIds = this.getHeroIds(newHeros);
    let newFiltered = this.getNewFilteredTiles(pivotProps, newCollection, heroIds, newHeros);

    let tileCategories = Utils.buildTileCategoriesFromResponse(pivotProps, newCollection);

    const defaultSelectedIndex = tileCategories.indexOf(this.props.setTab);
    const defaultSelectedKey = defaultSelectedIndex.toString();

    for (let thisTile of newCollection) {
      thisTile.setTab = this.props.setTab;
      thisTile.setSize = this.props.setSize;
      thisTile.heroType = this.props.heroType;
      thisTile.setRatio = this.props.setRatio;
      thisTile.setImgFit = this.props.setImgFit;
      thisTile.setImgCover = this.props.setImgCover;
    }

    for (let thisTile of newFiltered) {
      thisTile.setTab = this.props.setTab;
      thisTile.setSize = this.props.setSize;
      thisTile.heroType = this.props.heroType;
      thisTile.setRatio = this.props.setRatio;
      thisTile.setImgFit = this.props.setImgFit;
      thisTile.setImgCover = this.props.setImgCover;
    }

    let heroSize = this.props.setSize;
    let heroFit = this.props.setImgFit;
    let heroRatio = this.props.setRatio;
    let heroCover =  this.props.setImgCover;

    if (this.props.heroType === "header" || this.props.heroType === "footer") {
        heroSize = "100";
        heroRatio = "1x1";
        heroFit = heroFit;
        heroCover = "portrait";

    } else if (this.props.heroType === "inLine") {
        heroSize = "300";
        heroRatio = "1x1";
        heroFit = heroFit;
        heroCover = "portrait";

    } else if (this.props.heroType === "left" || this.props.heroType === "right") {
        heroSize = "300"; // Force 300 high for left and right
        heroRatio = heroRatio; //Keep the same for left and right
        heroFit = heroFit;  //Cover, centerCover etc.
        heroCover = "portrait";

    } else {

    }

    if (newHeros[0]) {
      for (let thisTile of newHeros) {
        thisTile.setTab = this.props.setTab;
        thisTile.setSize = heroSize;
        thisTile.heroType = this.props.heroType;
        thisTile.setRatio = heroRatio;
        thisTile.setImgFit = heroFit;
        thisTile.setImgCover = heroCover;
      }
    }

    this.setState({
      allTiles:newCollection,
      pivtTitles: tileCategories,
      pivotDefSelKey: defaultSelectedKey,
      filteredTiles: newFiltered,
      loadStatus:"Ready",
      heroTiles : newHeros,
      heroIds: heroIds,
      heroStatus: newHeros[0] ? "Ready" : "none",
    });
  }

  //    private async loadListItems(): Promise<IPivotTileItemProps[]> {
    private _getListItems(): void {

      let useTileList: string = strings.DefaultTileList;
      
      if ( this.props.listTitle ) {
          useTileList = this.props.listTitle;
      }
  
      let restFilter: string = "";
      if ( this.props.setFilter ) {
        restFilter = this.props.setFilter;
      }
  
      let restSort: string = "Title";
      if ( this.props.colSort ) {
        restSort = this.props.colSort;
      }
  
      let selectCols: string = "*";
      let expandThese = "";
  
      let allColumns = this.getKeysLike(this.props,"col","Begins");
      let expColumns = this.getExpandColumns(allColumns);
      let selColumns = this.getSelectColumns(allColumns);
  
  
      selColumns.length > 0 ? selectCols += "," + selColumns.join(",") : selectCols = selectCols;
      if (expColumns.length > 0) { expandThese = expColumns.join(","); }
  
      if ( this.props.listWebURL.length > 0 ){
        let web = new Web(this.props.listWebURL);
  
        const fixedURL = Utils.fixURLs(this.props.listWebURL, this.props.pageContext);
  
        web.lists.getByTitle(useTileList).items
          .select(selectCols).expand(expandThese).filter(restFilter).orderBy(restSort,true).get()
          .then((response) => {
              this.processResponse(response);
            }).catch((e) => {
              this.processCatch(e);
            });
  
      } else {
        
        console.log('useTileList',useTileList);
        console.log('selectCols',selectCols);
        console.log('expandThese',expandThese);
        console.log('restFilter',restFilter);
        console.log('restSort',restSort);        

        sp.web.lists.getByTitle(useTileList).items
          .select(selectCols).expand(expandThese).filter(restFilter).orderBy(restSort,true).get()
          .then((response) => {
            console.log('response',response);      
            this.processResponse(response);
          }).catch((e) => {
            this.processCatch(e);
          });
  
      }
  
    }  
    private processCatch(e) {
      console.log("Can't load data");
      //var m = e.status === 404 ? "Tile List not found: " + useTileList : "Other message";
      //alert(m);
      console.log(e);
      console.log(e.status);
      console.log(e.message);
      let sendMessage = e.status + " - " + e.message;
      this.setState({  loadStatus: "ListNotFound", loadError: e.message });
  
    }
  
    private processResponse(response){
  
      if (response.length === 0){
        this.setState({  loadStatus: "NoItemsFound"  });
        return ;
      }
  
      console.log('this.props.listWebURL',this.props.listWebURL);
      console.log('this.props.pageContext',this.props.pageContext);
      const fixedURL = Utils.fixURLs(this.props.listWebURL, this.props.pageContext);

      console.log('fixedURL',fixedURL);
      console.log('this.props.listTitle',this.props.listTitle);
      const listURL = fixedURL + "lists/" + this.props.listTitle;
      console.log('listURL',listURL);

      console.log('this.props.pageContext.web.absoluteUrl',this.props.pageContext.web.absoluteUrl);
      console.log('this.props.pageContext.site.serverRequestPath',this.props.pageContext.site.serverRequestPath);      
      const currentPageUrl = this.props.pageContext.web.absoluteUrl + this.props.pageContext.site.serverRequestPath;
      console.log('currentPageUrl',currentPageUrl);


      console.log('this.props.listWebURL',this.props.listWebURL);
      const editItemURL = listURL + "/DispForm.aspx?ID=" + "ReplaceID" + "&Source=" + currentPageUrl;
      console.log('editItemURL',editItemURL);

      let pivotProps = this.props;
      let tileCollection = Utils.buildTileCollectionFromResponse(response, pivotProps, editItemURL);
  
      let tileCategories = Utils.buildTileCategoriesFromResponse(pivotProps, tileCollection);
      
      const defaultSelectedIndex = tileCategories.indexOf(this.props.setTab);
      const defaultSelectedKey = defaultSelectedIndex.toString();
  
      let heroTiles = this.getHeroTiles(pivotProps, tileCollection);
  
      let heroIds = this.getHeroIds(heroTiles);
  
      let newFilteredTiles = this.getNewFilteredTiles(pivotProps, tileCollection, heroIds, heroTiles);

      this.setState({
        allTiles:tileCollection,
        pivtTitles: tileCategories,
        filteredTiles: newFilteredTiles,
        pivotDefSelKey: defaultSelectedKey,
        loadStatus:"Ready",
        heroStatus: heroTiles[0] ? "Ready" : "none",
        heroTiles : heroTiles,
        heroIds: heroIds,
        loadError: "",
        endTime: this.state.endTime ? this.state.endTime : getTheCurrentTime(),
      });
      
      saveAnalytics(this.props,this.state);
      
      return true;
  
    }

  private getNewFilteredTiles(thisProps, tileCollection, heroIds, heroTiles) {

    let newFilteredTiles = [];
    for (let thisTile of tileCollection) {

      //Added this to stop errors when columns are lookups
      let colType = (thisProps.colCategory.indexOf('/') > 0) ? 'lookup' : 'normal';
      let countMe : boolean;
      if (colType === 'normal') {
        countMe = (thisTile.category && thisTile.category.indexOf(thisProps.setTab) > -1) ? true : false;
      } else {
        countMe = (thisTile.category == thisProps.heroCategory) ? true : false
      }

      if(countMe) {
        let showThisTile = true;
        if (heroIds.length > 0 && thisProps.heroType !== 'none' && heroTiles[0]) {
          showThisTile = heroIds.indexOf(thisTile.Id.toString()) > -1 ? false : true;
        }
        if (showThisTile === true) {newFilteredTiles.push(thisTile);}
      }
    }

    return newFilteredTiles;
  }


  private getHeroTiles(thisProps, tileCollection) {

    let heroTiles = [];
            
    if (thisProps.showHero === true && thisProps.heroCategory) {
      for (let thisTile of tileCollection) {
        if (thisProps.colCategory.indexOf('/') > 0) {
          //This is a lookup column and can only contain 1 value
          if(thisTile.category == thisProps.heroCategory) {
            heroTiles.push(thisTile);
          }     
        } else {
          //This is not a lookup column, added thisTile.category to check if it is not null (empty)
          if( thisTile.category && thisTile.category.indexOf(thisProps.heroCategory) > -1) {
            heroTiles.push(thisTile);
          }
        }

      }
    }

    if (this.props.heroType !== 'slider' && this.props.heroType !== 'carousel') {
      //If it's not a slider, then only show one random tile.  Else show all
      var randomItem = heroTiles[Math.floor(Math.random()*heroTiles.length)];
      heroTiles = [randomItem];
    }
    return heroTiles;

  }

  private getHeroIds(heroTiles){
    let heroIds = [];
    if (heroTiles.length > 0){
      if (heroTiles[0]) {
        for (let thisTile of heroTiles) {
          heroIds.push(thisTile.Id.toString());
        }     
      }  
    }
    return heroIds;
  }

  private getKeysLike(thisProps,findMe,findOp){
    //Sample call:  getKeysLike(this.props,"col","begins")
    //console.log('FoundProps that ' + findOp + ' with ' + findMe);
    //console.log(thisProps);
    const allKeys = Object.keys(thisProps);
    let foundKeys = [];
    const lFind = findMe.length;

    findMe = findMe.toLowerCase();
    findOp = findOp.toLowerCase();

    if (findOp==="begins") {
      foundKeys = allKeys.filter(k => k.toLowerCase().indexOf(findMe) === 0);
    } else if (findOp === "ends") {
      foundKeys = allKeys.filter(k => k.toLowerCase().indexOf(findMe) === ( k.length - lFind));
    } else {
      foundKeys = allKeys.filter(k => k.toLowerCase().indexOf(findMe) > -1);
    }

    let foundProps = [];
    for (let thisProp of foundKeys) {
      if (thisProp && thisProp !== "" ) { foundProps.push(thisProps[thisProp]) ; }
    }

    return foundProps;
  }

  private getSelectColumns(lookupColumns){

    let baseSelectColumns = [];

    for (let thisColumn of lookupColumns) {
      // Only look at columns with / in the name
      if (thisColumn && thisColumn.indexOf("/") > -1 ) {
        let isLookup = thisColumn.indexOf("/");
        if(isLookup) {
          baseSelectColumns.push(thisColumn);
        }
      }
    }
    return baseSelectColumns;
  }

  private getExpandColumns(lookupColumns){

    let baseExpandColumns = [];

    for (let thisColumn of lookupColumns) {
      // Only look at columns with / in the name
      if (thisColumn && thisColumn.indexOf("/") > -1 ) {
        let splitCol = thisColumn.split("/");
        let leftSide = splitCol[0];
        if(baseExpandColumns.indexOf(leftSide) < 0) {
          baseExpandColumns.push(leftSide);
        }
      }
    }
    return baseExpandColumns;
  }

}

