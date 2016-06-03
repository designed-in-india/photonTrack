function showCalenderIfPermitted(){
  chrome.storage.local.get('cal', function(obj){
      if(obj && obj.cal && obj.cal.permitted){
        console.log('Calendar value is availble and will be visible');
        app.calenderShown = true;
        calendarDisplayLogic(app.calenderData);
        showContent('googleCal');
      }else{
        console.log('Calendar is not shown');
      }
  });
}

function checkWeeklyMonthlyData(){
  if(app.weekAndMonthData.month && app.weekAndMonthData.week && !app.settingsMode){
    document.getElementById("weeklyMonthlyBlock").className = "";
    renderStatus(app.weekAndMonthData.week[0].avg_hrs, 'weekly');
    renderStatus(app.weekAndMonthData.month[0].avg_hrs, 'monthly');
    toggleLoader(false);
    showCalenderIfPermitted();
  }
};

function main(eCode){
  getFactory('month', function(data){
    app.weekAndMonthData.month = data;
    checkWeeklyMonthlyData();
  }, function(){
    console.log('failure');
  });

  if(!app.weekAndMonthData.week){
    getFactory('week', function(data){
      app.weekAndMonthData.week = data;
      checkWeeklyMonthlyData();
    }, function(){
      console.log('failure');
    });
  }


  getFactory('today', function(response){
      parseData(response, function(totalTime, exitTime){
      //success callback
          renderStatus('Hi ' + user.name );
          renderStatus(myTime.inTime, 'inTime');
          renderStatus(totalTime, 'totalTime');
          if(myTime.crossedNineHours){
            renderStatus('Bye Bye', 'expectedExit');
          }else{
            renderStatus(exitTime, 'expectedExit');
          }
      }, function(text){
          renderStatus('Error : ' + text);
          return;
      });//end of parseData error callback
  }, function(errorMessage){
      renderStatus('Error : ' + errorMessage);
  });//end of today service error callback
}

function launchChecks(){
  chrome.storage.local.get('user', function(value){
    if(value && value.user && value.user.eCode){
      toggleLoader(true);
      stch(null, true);
    }else{
      stch(null, true);
    }
  });
}

function getDataAfterPulseAndAccesssControl(eCode){
      getFactory('week', function(data){
        app.weekAndMonthData.week = data;
        var fullName = data[0].displayName;
        user.name = fullName.split(' ')[0];
        user.eCode = data[0].employeeId;
        chrome.storage.local.set({'user':user}, function(){
          app.settingsMode = false;
          toggleLoader(true);
          hideContent(['walkThrough','settingsPage']);
          document.getElementById('topCornerIcon').classList.remove('home-logo');
          showContent(['homePage','header','topCornerIcon']);
          main(user.eCode);
        });
      }, function(){
        console.log('failure');
        toggleLoader(false);
      });
}


document.addEventListener('DOMContentLoaded', function() {
  attachOnMessageEventListener();
  addClickHandlers();
  document.getElementById("iFrame").onload = function(e) {
    getDataAfterPulseAndAccesssControl(user.tempECode);
  }
  renderStatus('version '+app.version, 'version-label');
  launchChecks();
});

