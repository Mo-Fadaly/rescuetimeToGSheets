function rescueTimeToSheets() { 
  //Grab spreadsheet name / date
  var spreadsheetObject = SpreadsheetApp.getActiveSpreadsheet();  
  var nameOfDate = spreadsheetObject.getSheetName()+"";
  
  //Turn date into format for rescueTime API
  var dateToString = nameOfDate.slice(0,4) +"-"+nameOfDate.slice(4,6)+"-"+nameOfDate.slice(6,8);
    
  //Grab JSON data from RescueTime + API
  var request = UrlFetchApp.fetch("https://www.rescuetime.com/anapi/data?key=API_KEY&restrict_begin=" +dateToString +"&restrict_end="+dateToString+"&format=json");
  var data = JSON.parse(request.getContentText());
  
  //Counting how many productive, neutral, and unproductive tasks there are
  var numberOfProductive=0, numberOfNeutral=0, numberOfUnproductive=0;
  
  //Format each of the rows that are in the data
  for (var x =0; x< data.rows.length; x++)
  {
    if (data.rows[x][5]>0) //Productive Tasks
    {
      //Pick the cell
      var activeRange = spreadsheetObject.getRange("C"+(3+x-numberOfUnproductive-numberOfNeutral)+":C"+(3+x-numberOfUnproductive-numberOfNeutral));// CX:CX where x is the column row
      //Set the cell as the active cell
      spreadsheetObject.setActiveRange(activeRange);
      //Write to the active cell
      spreadsheetObject.getActiveRange().setValue(data.rows[x][3]);
      
      //For time (in seconds) of processes
      var activeRange = spreadsheetObject.getRange("D"+(3+x-numberOfUnproductive-numberOfNeutral)+":D"+(3+x-numberOfUnproductive-numberOfNeutral));
      spreadsheetObject.setActiveRange(activeRange);
      spreadsheetObject.getActiveRange().setValue((data.rows[x][1])/3600);
      
      numberOfProductive++;
    }
    else if (data.rows[x][5]==0) //Neutral tasks
    {
      numberOfNeutral++;
    }
    else //Unproductive tasks
    {
      var activeRange = spreadsheetObject.getRange("E"+(3+x-numberOfProductive-numberOfNeutral)+":E"+(3+x-numberOfProductive-numberOfNeutral));
      spreadsheetObject.setActiveRange(activeRange);
      spreadsheetObject.getActiveRange().setValue(data.rows[x][3]);
      var activeRange = spreadsheetObject.getRange("F"+(3+x-numberOfProductive-numberOfNeutral)+":F"+(3+x-numberOfProductive-numberOfNeutral));
      spreadsheetObject.setActiveRange(activeRange);
      spreadsheetObject.getActiveRange().setValue(data.rows[x][1]/3600);
      
      numberOfUnproductive++;
    }
  }
}
