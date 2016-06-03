function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+ minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

var localCalData = [{"summary":"ME Internal Syncup","when":"2016-03-28T12:45:00.000Z","creator":"Javed Ansari"},
					{"summary":"MarketEDGE Daily Defect Review","when":"2016-03-28T13:00:00.000Z","creator":"Vikram Menon"},
					{"summary":"ME Defect Review Meeting","when":"2016-03-28T13:00:00.000Z","creator":"Javed Ansari"}]

function calendarDisplayLogic(userCal){
  var today = new Date();
	//removeIf(production) 
	/*today = new Date("March 27, 2016 12:30:00");
	if(!userCal && !window.navigator.online){
		userCal = localCalData;
    for (var item in userCal){
      userCal[item].when = new Date(userCal[item].when);
    }
	}*/
  //endRemoveIf(production) 
	var _MS_PER_DAY = 1000 * 60 * 60 * 24;
	var dateDiffInDays = function(a, b) {
  	var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  	var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
	for(var item in userCal){
		var tempDiff = changeJsTimeToHumanTime((userCal[item].when - today), true);
		var conditionalMins = tempDiff[1] ? (tempDiff[1] + ' mins') : '';

    var dayDiff = dateDiffInDays(today, userCal[item].when);
    var conditionalDays = ( dayDiff > 0 ) ? ( (dayDiff > 1) ? (dayDiff + ' days ') : (dayDiff + ' day ') ) : '';
		userCal[item].timeLeft = conditionalDays + tempDiff[0] + ' hrs ' + conditionalMins + ' left';
    userCal[item].time = formatAMPM(userCal[item].when);

		var incrementedId = Number(item) + 1;
		renderCalender(userCal[item], incrementedId);
	}
}

function gCalInit(){
  var gCal = {
    CLIENT_ID : '183365371926-3c8jqt5rn0h0acnpf3782vb8mi86v6u4.apps.googleusercontent.com',
    SCOPES : ["https://www.googleapis.com/auth/calendar.readonly"],
    userCal: [],

    handleAuthClick: function(event){
      gapi.auth.authorize(
          {client_id: gCal.CLIENT_ID, scope: gCal.SCOPES, immediate: false},
          gCal.handleAuthResult);
      return false;
    },

    listUpcomingEvents: function() {
        var request = gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 3,
          'orderBy': 'startTime'
        });
        request.execute(function(resp) {
          var events = resp.items;
          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var calItem = {};
              var event = events[i];
              var when = new Date(event.start.dateTime);
              if (!when) {
                new Date(when = event.start.date);
              }
              var calItem = {
                summary : event.summary,
                when : when,
                creator : event.creator.displayName,
                htmlLink : event.htmlLink,
              };

              gCal.userCal.push(calItem);
            }
            app.calenderData = gCal.userCal;
            var cal = {
              permitted: true
            }
            chrome.storage.local.set({'cal':cal}, function(){
              console.log('Calender condition is set to true');
              showCalenderIfPermitted();
            });
          } else {
            //keep the divs hidden
            console.log('No calender events');
          }
          
        });
    },

    loadCalendarApi: function() {
        gapi.client.load('calendar', 'v3', gCal.listUpcomingEvents);
    },

    handleAuthResult: function (authResult) {
      if (authResult && !authResult.error) {
        gCal.loadCalendarApi();
      } else {
        gCal.handleAuthClick();
      }
    },

    checkAuth: function(){
      console.log('checkAuth entered')
      chrome.storage.local.get('user', function(value){
        if(value && value.user && value.user.eCode){
          console.log('checkAuth gonna run as eCode is availablw')
          var googlePopUp = {opened:true};
          chrome.storage.local.set({'googlePopUp':googlePopUp});
          gapi.auth.authorize(
            {
              'client_id': gCal.CLIENT_ID,
              'scope': gCal.SCOPES.join(' '),
              'immediate': true
            }, gCal.handleAuthResult);
        }else{
          //cleared pulse mode
          chrome.storage.local.get('cal', function(obj){
              if(obj && obj.cal && obj.cal.permitted){
                console.log('Calendar value is availble and will be visible');
                gapi.auth.authorize(
                {
                  'client_id': gCal.CLIENT_ID,
                  'scope': gCal.SCOPES.join(' '),
                  'immediate': true
                }, gCal.handleAuthResult);
              }
          });
        }
      });
    },
  };
  gCal.checkAuth();
};