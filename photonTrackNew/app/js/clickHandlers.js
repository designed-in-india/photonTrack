function addClickHandlers(){
  document.getElementById("startButton").addEventListener("click", stch);
  document.getElementById("mailToIcon").addEventListener("click", mtch);
  document.getElementById("topCornerIcon").addEventListener("click", sech);
  document.getElementById("clearPhotonButton").addEventListener("click", function(){ cbch('photon') });
  document.getElementById("clearCalButton").addEventListener("click", function(){ cbch('cal') });
  document.getElementById("clearAllButton").addEventListener("click", function(){ cbch('all') });
  document.getElementById("infoIcon").addEventListener("click", function(){
    otch(app.reviewUrl)
  });
}

function otch(url){
  chrome.tabs.create( {url: url} );
}

function cbch(type){
  switch (type){
    case 'photon':
      chrome.storage.local.remove('user', function(){
        user = {
          tempECode : null,
          eCode : null,
          name : null,
          weekData: null,
          monthData: null,
        };
        hideContent(['homePage', 'settingsPage', 'header']);
        showContent(['walkThrough', 'googleCal']);
      });
      break;

    case 'cal':
      chrome.storage.local.remove('googlePopUp');
      chrome.storage.local.remove('cal', function(){
        hideContent(['settingsPage', 'walkThrough']);
        showContent(['homePage', 'header']);
        otch(app.resetGCalUrl);
      });
      break;

    case 'all':
      chrome.storage.local.clear(function(){
        otch(app.resetGCalUrl);
        user = {
          tempECode : null,
          eCode : null,
          name : null,
          weekData: null,
          monthData: null,
        };
        hideContent(['homePage', 'settingsPage', 'header']);
        showContent(['walkThrough']);
      });
      break;
  }
}

function sech(){
  toggleLogo();
  app.settingsMode = true;
};

function mtch(){
  chrome.tabs.create({url:app.feedbackUrl}, function(){
    console.log('success')
  });
}

function callback() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    } else {
        // Tab exists
    }
}

function searchTabs(programmatic){
  chrome.tabs.query({},function(tabs){
        for(var tab in tabs){
          if(app.urlRegex.test(tabs[tab].url)){
            //console.log(tabs[tab]);
            app.pulseTabId = tabs[tab].id;
            app.pulseActive = tabs[tab].active;
            if(tabs[tab].status === 'loading'){
              toggleLoader(true);
              var loadingCheckCount = 0;
              var a = setInterval(function(){
                loadingCheckCount++;
                if(tabs[tab].status === 'complete'){
                  chrome.tabs.executeScript(tabs[tab].id, {file: "app/js/injector.js"}, callback);
                  clearInterval(a);
                }else if(loadingCheckCount > 5){
                  clearInterval(a);
                }
              },1000);
            }else{
              chrome.tabs.executeScript(tabs[tab].id, {file: "app/js/injector.js"}, callback);
            }
            break;
          }else{
            //console.log('This is not a pulse page');
          }
        }//end of for
    
        if(!app.pulseTabId){
          handleNotLoggedIn('You are not authenticated yet. Opening Pulse in', 5, 'openTab');
        }

  });//end of chrome tabs
}

function stch(e, programmatic){
  console.log('stch');
  var user_action = {started:true};
  
  chrome.storage.local.get('user_action', function(value){
    if(isEmpty(value) && !programmatic){
      console.log('setted user action')
      chrome.storage.local.set({'user_action':user_action});
      searchTabs();
    }else if(value && value.user_action && value.user_action.started){
      console.log('programmatic searching tabs');
      searchTabs(programmatic);
    }else{
      console.log('just opened app');
    }//end of else
  });
};
