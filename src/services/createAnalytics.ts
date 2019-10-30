import { sp, Web, Item, ItemAddResult, ItemUpdateResult } from '@pnp/sp';


export function saveAnalytics (theProps,theState) {

    console.log('saveAnalytics');
    console.log(theProps); 
    console.log(theState);

    let analyticsList = "TilesCycleTesting";
    let startTime = theProps.startTime;
    let endTime = theState.endTime;
    let web = new Web('https://mcclickster.sharepoint.com/sites/Templates/SiteAudit/');

    /*


    */
    web.lists.getByTitle(analyticsList).items.add({
        'Title': 'Pivot-Tiles x1asdf',
        'zzzText1': startTime.now,      
        'zzzText2': startTime.theTime,
        'zzzNumber1': startTime.milliseconds,
        'zzzText3': endTime.now,      
        'zzzText4': endTime.theTime,
        'zzzNumber2': endTime.milliseconds,
        }).then((response) => {
        //Reload the page
            //location.reload();
        }).catch((e) => {
        //Throw Error
            alert(e);
    });


};


export function saveAnalyticsX (theTime) {

    let analyticsList = "TilesCycleTesting";
    let currentTime = theTime;
    let web = new Web('https://mcclickster.sharepoint.com/sites/Templates/SiteAudit/');

    web.lists.getByTitle(analyticsList).items.add({
        'Title': 'Pivot-Tiles x1asdf',
        'zzzText1': currentTime.now,      
        'zzzText2': currentTime.theTime,
        'zzzNumber1': currentTime.milliseconds,

        }).then((response) => {
        //Reload the page
            location.reload();
        }).catch((e) => {
        //Throw Error
            alert(e);
    });


};

export function saveTheTime () {
    let theTime = getTheCurrentTime();
    saveAnalyticsX(theTime);

    return theTime;

}

export function getTheCurrentTime () {

    const now = new Date();
    const theTime = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getMilliseconds();
    let result : any = {
        'now': now,
        'theTime' : theTime,
        'milliseconds' : now.getMilliseconds(),
    }
    console.log('getTheTime = ');
    console.log(result);   
    return result;

};
