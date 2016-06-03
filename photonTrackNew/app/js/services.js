var getFactory = function(typeOfService, successCallback, errorCallback){
	var url;
	switch (typeOfService){
		case 'month':
			var eCode = (user.eCode) ? user.eCode : user.tempECode;
			url = app.dataUrl + '?EmpId=' + eCode + '&startdate='+ myTime.wholeM +'&enddate='+myTime['dt/'];
			break;

		case 'week':
			var eCode = (user.eCode) ? user.eCode : user.tempECode;
			url = app.dataUrl + '?EmpId=' + eCode + '&startdate='+ myTime.wholeW +'&enddate='+myTime['dt/'];
			break;

		case 'today':
			url = app.swipeDataUrl + '?EmpId=' + user.eCode + '&date=' + myTime['dt-'];
			break;
	};
  	var serviceObject = function(){

  		var x = new XMLHttpRequest();
  		x.open('GET', url, true);
  		
  		x.onreadystatechange = function (oEvent) {  
		    if (x.readyState === 4) {  
		        if (x.status === 200) {  
		          //console.log(x)  
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
		   	successCallback(response);
		    
		};
		  
		x.onerror = function(error) {
		    errorCallback('Network error');
		};

		x.send();

  	};//end of serviceoject
  	
  	if(app.localServiceMode){
  		return localService(typeOfService);
  	}else{
  		return new serviceObject();
  	}
}


var localService = function(typeOfService){
	localData = {};
	localData['month'] = [{"employeeId":"104256","first_in_time":["14:25:18","12:01:56","13:46:09","12:33:48","12:58:57","13:39:19","13:14:25","12:50:56","11:00:43","12:05:34","11:07:48","10:58:09","12:18:53","12:16:09","14:43:49"],"last_out_time":["00:01:11","22:35:46","22:00:30","21:24:03","22:34:23","22:25:22","21:27:04","22:44:39","23:30:48","21:49:34","20:46:33","23:17:46","22:47:27","22:33:05","17:42:40"],"productiveHours":"131:30","eachDayprohrs":["08:20","09:58","07:26","07:58","08:44","08:15","07:51","09:14","11:15","09:09","09:26","11:28","09:26","10:01","02:59"],"eachDaytotalProdhrs":["09:36","10:34","08:14","08:51","09:36","08:46","08:13","09:54","12:30","09:44","09:39","12:19","10:29","10:17","02:59"],"eachDate":["2016-03-01","2016-03-02","2016-03-03","2016-03-04","2016-03-07","2016-03-08","2016-03-09","2016-03-10","2016-03-11","2016-03-14","2016-03-15","2016-03-16","2016-03-17","2016-03-18","2016-03-19"],"total_time_hrs":[],"timesheet_date":[],"total_timesht_hours":"undefined:00","avg_hrs":"09:23","workoutside":[],"displayName":"Vikram M Menon","location":"Bangalore - ITPL","shiftTime":"9AM - 7PM ","businessCategory":"ENGINEERING","mngDisplayName":"Venkata Bharaniraj U","managerDisplayName":"Venkata Bharaniraj U"}];
	localData['today'] = [{"data":["2016-03-11","11:00:43","Entry","Ground","Main Entrance","Successful"]},{"data":["2016-03-11","11:51:36","Exit","Ground","Main Entrance","Successful"]},{"data":["2016-03-11","12:05:57","Entry","Ground","Main Entrance","Successful"]},{"data":["2016-03-11","13:47:42","Exit","Ground","Main Entrance","Successful"]},{"data":["2016-03-11","13:47:58","Entry","Second","Main Entrance","Successful"]},{"data":["2016-03-11","14:08:48","Exit","Second","Main Entrance","Successful"]},{"data":["2016-03-11","14:12:13","Entry","Ground","Main Entrance","Successful"]},{"data":["2016-03-11","14:39:45","Exit","Ground","Main Entrance","Successful"]},{"data":["2016-03-11","14:53:30","Entry","Ground","Main Entrance","Successful"]},{"data":["2016-03-11","19:59:40","Exit","Ground","Main Entrance","Successful"]},{"data":["2016-03-11","20:06:55","Entry","Ground","Main Entrance","Successful"]},{"data":["2016-03-11","21:16:00","Exit","Ground","Main Entrance","Successful"]},{"data":["2016-03-11","21:52:40","Entry","Ground","Main Entrance","Successful"]},{"data":["2016-03-11","23:30:48","Exit","Ground","Main Entrance","Successful"]}];
	localData['previous'] = [{"data":["2016-03-10","12:50:56","Entry","Ground","Main Entrance","Successful"]},{"data":["2016-03-10","13:17:56","Entry","Second","Main Entrance","Successful"]},{"data":["2016-03-10","13:18:25","Exit","Ground","Main Entrance","Successful"]},{"data":["2016-03-10","13:45:57","Exit","Second","Main Entrance","Successful"]},{"data":["2016-03-10","13:49:17","Entry","Ground","Main Entrance","Successful"]},{"data":["2016-03-10","15:01:58","Exit","Ground","Main Entrance","Successful"]},{"data":["2016-03-10","15:14:28","Entry","Ground","Main Entrance","Successful"]},{"data":["2016-03-10","15:21:01","Exit","Ground","Main Entrance","Successful"]},{"data":["2016-03-10","15:21:44","Entry","Second","Main Entrance","Successful"]},{"data":["2016-03-10","16:47:24","Exit","Second","Main Entrance","Successful"]},{"data":["2016-03-10","16:51:53","Entry","Ground","Main Entrance","Successful"]},{"data":["2016-03-10","18:03:12","Exit","Ground","Main Entrance","Successful"]},{"data":["2016-03-10","18:23:17","Entry","Ground","Main Entrance","Successful"]},{"data":["2016-03-10","22:44:39","Exit","Ground","Main Entrance","Successful"]}];
	localData['week'] = [{"employeeId":"104256","first_in_time":["12:05:34","11:07:48","10:58:09","12:18:53","12:16:09","14:43:49"],"last_out_time":["21:49:34","20:46:33","23:17:46","22:47:27","22:33:05","17:42:40"],"productiveHours":"52:29","eachDayprohrs":["09:09","09:26","11:28","09:26","10:01","02:59"],"eachDaytotalProdhrs":["09:44","09:39","12:19","10:29","10:17","02:59"],"eachDate":["2016-03-14","2016-03-15","2016-03-16","2016-03-17","2016-03-18","2016-03-19"],"total_time_hrs":[],"timesheet_date":[],"total_timesht_hours":"undefined:00","avg_hrs":"10:29","workoutside":[],"displayName":"Vikram M Menon","location":"Bangalore - ITPL","shiftTime":"9AM - 7PM ","businessCategory":"ENGINEERING","mngDisplayName":"Venkata Bharaniraj U","managerDisplayName":"Venkata Bharaniraj U"}];
	return localData[typeOfService];
};