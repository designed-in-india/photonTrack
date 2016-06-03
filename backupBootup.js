
var totalTime = 0;
var finalTime;
var savedECode = null;
var inTime = null;
var expectedExitTime = null;
var crossedNineHours = false;

function getLoginData(userId, callback, errorCallback) {

  var getUrl = app.swipeDataUrl + '?EmpId=' + userId + '&date=' + myTime['dt-'];
  var x = new XMLHttpRequest();
  x.open('GET', getUrl, true);

  x.onreadystatechange = function (oEvent) {  
    if (x.readyState === 4) {  
        if (x.status === 200) {  
          console.log(x.responseText)  
        } else {  
          errorCallback(x.statusText);
        }  
    }  
  }; 
  x.onload = function() {
    var response = x.response;
    if (!response) {
      errorCallback('No response');
      return;
    }
    response = JSON.parse(response);
    parseData(response, function(groundData, secondData){
      //success callback
      floorLevelHoursCalculator(groundData);
      floorLevelHoursCalculator(secondData);
      timeFunction(totalTime, true);
      callback(finalTime);
    }, function(text){
      errorCallback(text);
      return;
    });

    
  };
  x.onerror = function(error) {
    errorCallback('Network error');
  };
  x.send();
} 

function main(eCode){
  var getAllData = app.dataUrl + '?EmpId=' + user.eCode + '&startdate=03/14/2016&enddate='+myTime['dt/'];
  var getSwipeData = app.swipeDataUrl + '?EmpId=' + user.eCode + '&date=' + myTime['dt-'];

  getFactory(getAllData, function(){
    console.log('success');
  }, function(){
    console.log('failure');
  });


  getFactory(getSwipeData, function(successMessage){
      floorLevelHoursCalculator(groundData);
      floorLevelHoursCalculator(secondData);
      timeFunction(totalTime, true);

      renderStatus('Data available for ' + user.eCode);
      renderStatus('You swiped in at ' + inTime, 'inTime');
      renderStatus('Your productive time is ' + successMessage, 'totalTime');
      if(crossedNineHours){
        renderStatus(expectedExitTime, 'expectedExit');
      }else{
        renderStatus('You can leave by ' + expectedExitTime, 'expectedExit');
      }
  }, function(errorMessage){
      renderStatus('Error : ' + errorMessage);
  });

  /*getLoginData(eCode, function(successMessage){
    //success callback
    renderStatus('Data available for ' + eCode);
    renderStatus('You swiped in at ' + inTime, 'inTime');
    renderStatus('Your productive time is ' + successMessage, 'totalTime');
    if(crossedNineHours){
      renderStatus(expectedExitTime, 'expectedExit');
    }else{
      renderStatus('You can leave by ' + expectedExitTime, 'expectedExit');
    }
    
  }, function(errorMessage){
    //chrome.storage.local.
    renderStatus('Error : ' + errorMessage);
  });*/
}

function launchChecks(){
  chrome.storage.local.get('eCode', function(value){
    if(value && value.eCode){  
      user.eCode = Number(value.eCode);
      console.log('Emp code available : '+user.eCode);
      //show statusBlock, clearButton
      document.getElementById("statusBlock").className = "";

      //hide firstLaunch, settingsSection
      document.getElementById("firstLaunch").className = "hidden";
      document.getElementById("settingsBlock").className = "hidden";

      renderStatus('Fetching today\'s login data for '+savedECode);
      main(user.eCode);
    }else{
      //no employee code:
      //show firstLaunch, settingsBlock, saveButton
      document.getElementById("firstLaunch").className = "";
      document.getElementById("settingsBlock").className = "";
      document.getElementById("saveButton").className = "";
      document.getElementById("clearButton").className = "";
      //its fine, show hide statusBlock
      document.getElementById("statusBlock").className = "hidden";
    }

  });
}



document.addEventListener('DOMContentLoaded', function() {

  document.getElementById("settingsIcon").addEventListener("click", changeSettingsClickHandler);
  document.getElementById("saveButton").addEventListener("click", saveButtonClickHandler);
  document.getElementById("clearButton").addEventListener("click", clearButtonClickHandler);
  document.getElementById("infoIcon").addEventListener("click", reviewAppClickHandler);
  launchChecks();
});

