
function timeFormatter(time){
  time = String(time)
  if(time.length < 2){
    return '0'+time;
  }else{
    return time;
  }
}

function inTimeFormatter(time){
  var temp = time.split(':');
  if(temp[0] > 12){
    temp[0] = temp[0] - 12;
    return temp[0] +':'+ temp[1] + ' pm';
  }else if(temp[0] == 12){
    return time + ' pm';
  }else{
    return time + ' am';
  }
}

function howLongToCompleteNineHours(timeDiff_hours, timeDiff_mins){
  var remainingMins;
  var remainingHours;
  var returnValue = null;;
  if(timeDiff_mins > 0 && timeDiff_hours < 9){
    remainingHours = 8 - timeDiff_hours;
    remainingMins = 60 - timeDiff_mins;
  }else if(timeDiff_mins == 0 && timeDiff_hours < 9){
    remainingHours = 9 - timeDiff_hours;
    remainingMins = 60;
  }else if(timeDiff_hours >= 9){
    //get out of office
    myTime.crossedNineHours = true;
  }
  //console.log(remainingHours +','+remainingMins)
  if(remainingHours !== null && remainingHours !== undefined && remainingMins !== null && remainingMins !== undefined){
    var a = new Date();
    var amPm;
    var newHours = a.getHours() + remainingHours;
    var newMins = a.getMinutes() + remainingMins;
    if(newMins > 60){
      newMins = newMins - 60;
      newHours++;
    }
    //bug fix for next day
    if(newHours >= 24){
      newHours = newHours - 24;
    }//end of bug fix

    if(newHours > 12){
      amPm = 'pm';
      newHours = newHours - 12;
    }else{
      amPm = 'am';
    }

    returnValue =  newHours +':'+ timeFormatter(newMins) +' '+amPm; 
  }
  return returnValue; 
}

function changeJsTimeToHumanTime(timeDiff, needHoursAndMins){
          
          //take out milli
          var timeDiff_ms = timeDiff / 1000;

          var timeDiff_secs = Math.floor(timeDiff_ms%60);
          timeDiff_ms = timeDiff_ms/60;

          var timeDiff_mins = Math.floor(timeDiff_ms%60);
          timeDiff_ms = timeDiff_ms/60;

          var timeDiff_hours = Math.floor(timeDiff_ms%24);

          if(needHoursAndMins){
            return [timeDiff_hours, timeDiff_mins];
          }

          var humanReadableTime = timeFormatter(timeDiff_hours) + ':' + timeFormatter(timeDiff_mins) + ':' + timeFormatter(timeDiff_secs);
          //console.log('humanReadableTime : '+ humanReadableTime);
          return humanReadableTime;

          if(show) {
            expectedExitTime = howLongToCompleteNineHours(timeDiff_hours, timeDiff_mins);
          }
}

function floorLevelHoursCalculator(floorData){
  //console.log(floorData)
  if(floorData.length > 0){
    var timeDiff_ms = 0;
    for(var key in floorData){

        //even key
        key = Number(key);

        if(floorData[key].swipeType.toLowerCase() === 'entry' && floorData[key+1] && floorData[key + 1].swipeType.toLowerCase() === 'exit'){
          //console.log(floorData[key].time +','+ floorData[key+1].time);
          tempVal = floorData[key+1].jsDate - floorData[key].jsDate;
          timeDiff_ms = timeDiff_ms + tempVal;
        }else if(key+1 === floorData.length && floorData.length%2 === 1 && floorData[key].swipeType.toLowerCase() === 'entry'){
          //console.log(new Date() +','+floorData[key].time)
          tempVal = new Date() - floorData[key].jsDate;
          timeDiff_ms = timeDiff_ms + tempVal;
        }

    }//end of for loop
    return timeDiff_ms;
  }
}

function parseData(data, callback, errorCallback){
  var groundData = [];
  var secondData = [];

  var arrayOfData = [];

  if(!data || data.length == 0){
    errorCallback('Presently, no swipe in data');
    return;
  }
  //setting in time
  var tempInTime = data[0].data[1].split(':');
  tempInTime = tempInTime[0] + ':' + tempInTime[1];
  myTime.inTime = inTimeFormatter(tempInTime);

  for(var key in data){
    if (!data.hasOwnProperty(key)) continue;

    var val = data[key];
    var tempDate = new Date(val.data[0].replace(/-/g, "/") + ' ' + val.data[1]);

    var tempObj = {};
    tempObj.time = val.data[1];
    tempObj.jsDate = tempDate;
    tempObj.swipeType = val.data[2];
    tempObj.status = val.data[5];

    var location = val.data[3];
    if(!arrayOfData[location]){
      arrayOfData[location] = [];
    }
    arrayOfData[location].push(tempObj);

    if(val.data[3].toLowerCase() === 'ground'){
      groundData.push(tempObj);
    }else if(val.data[3].toLowerCase() === 'second'){
      secondData.push(tempObj);
    }
  }
  
  var totalTime_ms = 0;
  for(var location in  arrayOfData){
    if(arrayOfData[location].length > 0){
      totalTime_ms = totalTime_ms + floorLevelHoursCalculator(arrayOfData[location]);
    }
  }
  myTime.calculatedTotalMs = totalTime_ms;
  myTime.convertedTotalTime = changeJsTimeToHumanTime(totalTime_ms);
  var needHoursAndMins = true;
  var hoursAndMins = changeJsTimeToHumanTime(totalTime_ms, needHoursAndMins);
  myTime.expectedExitTime = howLongToCompleteNineHours(hoursAndMins[0], hoursAndMins[1]);
  callback(myTime.convertedTotalTime, myTime.expectedExitTime);
}

function renderStatus(statusText, where) {
  var defaultBlock = 'headerText';
  if(where)defaultBlock = where;
  document.getElementById(defaultBlock).innerHTML = statusText;
}

function renderCalender(calItem, id) {
  document.getElementById('card'+id).addEventListener("click", function(){
    otch(calItem.htmlLink);
  }); 
  document.getElementById('timeCard'+id).innerHTML = calItem.time;
  document.getElementById('timeLeftCard'+id).innerHTML = calItem.timeLeft;
  document.getElementById('summaryCard'+id).innerHTML = calItem.summary;
  if(!window.navigator.online){
    showContent(['googleCal']);
  }
}

function toggleLoader(value){
  if(value === true){
    document.getElementById("overlay").className = "visible";
  }else{
    document.getElementById("overlay").className = "hidden";
  }
}

function toggleLogo(){
  var topCornerIcon = document.getElementById('topCornerIcon');
  if(!topCornerIcon.classList.contains('home-logo')){
    topCornerIcon.classList.add('home-logo');
    if(user.eCode){
      hideContent(['homePage','googleCal']);
      app.calenderShown = false;
      showContent(['settingsPage']);
    }
  }else if(topCornerIcon.classList.contains('home-logo')){
    topCornerIcon.classList.remove('home-logo');
    hideContent(['settingsPage']);
    chrome.storage.local.get('cal', function(obj){
      if(obj && obj.cal && obj.cal.permitted){
        showContent(['homePage','googleCal']);
      }else{
        showContent(['homePage']);
      }
    });
  }
}

function hideContent(param){
  if(typeof param == 'string'){
    document.getElementById(param).classList.add('hidden');
  }else{
    for (var id in param){
      document.getElementById(param[id]).classList.add('hidden');
    }
  }
}

function showContent(param){
  if(typeof param == 'string'){
    document.getElementById(param).classList.remove('hidden');
  }else{
    for (var id in param){
      document.getElementById(param[id]).classList.remove('hidden');
    }
  }
}


function handleNotLoggedIn(text, secondDuration, action){
  var second = secondDuration;
  hideContent(['walkThrough', 'topCornerIcon', 'settingsPage']);
  showContent(['infoPage', 'header']);
  renderStatus('Photon Track status');
  renderStatus( text +' '+second+' seconds','content');
  second --;
  var a = setInterval(function(){
    var grammarSeconds;
    (second > 1) ? grammarSeconds = ' seconds': grammarSeconds = ' second';
    renderStatus(text +' '+ second + '' + grammarSeconds,'content');
    second--;
    if(second === 0){
      clearInterval(a);
    }
  },1000);
  switch (action){
    case 'focusTab':
      setTimeout(function(){
        chrome.tabs.update(app.pulseTabId, {active: true});
      },secondDuration * 1000);
      break;

    case 'openTab':
      setTimeout(function(){
        chrome.tabs.create( {url: app.pulseUrl} );
      },secondDuration * 1000);
      break;

    case 'activeTab':
      setTimeout(function(){
        window.close();
      },secondDuration * 1000);
      break;

    case 'googleCal':
      setTimeout(function(){
        gCalInit();
      },secondDuration * 1000);
      break;
  }  
}

function attachOnMessageEventListener(){
  chrome.runtime.onMessage.addListener( function (response, sender) {
        if(app.urlRegex.test(sender.url)){
          //check for security case 1
          if(response && response.eCode){
            user.eCode = response.eCode;
            chrome.storage.local.set({'user': user}, function(){
                user.eCode = response.eCode;
                console.log('user.eCode is received and set as : '+user.eCode);

                chrome.storage.local.get('googlePopUp', function(obj){
                  if(obj && obj.googlePopUp && obj.googlePopUp.opened){
                    console.log('calendar was opened once');
                    setTimeout(function(){
                      document.getElementById("iFrame").src = "https://accessreporting.photoninfotech.com/accessreportDetails";
                    },500);
                  }else{
                    console.log('calendar local value is not set. Calling pop up');
                    handleNotLoggedIn('Please provide calender permission and close the popup thereafter. \n'+
                                      'Opening Google calendar permission popup in', 5, 'googleCal');
                  }
                });
            });
          }else if(response && response.notLoggedIn && !app.pulseActive){
            handleNotLoggedIn('Pulse is open but you are not logged in. \n\n'+
                              'Redirecting to the tab in', 5, 'focusTab');
          }else if(response && response.notLoggedIn && app.pulseActive){
            handleNotLoggedIn('Please log in to Pulse. \n\n'+
                              'Pop up will disappear in', 5, 'activeTab');
          }
        }
  });
}

function isEmpty(obj){
  for(var x in obj) return false;
  return true;
}

