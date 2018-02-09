function rescueTimeToSheets() {  //Add where to place cells, add API key entry, add skipping permissions to write on sheet 
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
  for (var x =3; x< data.rows.length; x++) //I guess this runs O(x) where x is the number of items you have in rescueTime
  {
    if (data.rows[x-3][5]>0) //Productive Tasks
    {
      //Pick the cell
      var activeRange = spreadsheetObject.getRange("C"+(x-numberOfUnproductive-numberOfNeutral)+":C"+(x-numberOfUnproductive-numberOfNeutral));// CX:CX where x is the column row
      //Set the cell as the active cell
      spreadsheetObject.setActiveRange(activeRange);
      //Write to the active cell
      spreadsheetObject.getActiveRange().setValue(data.rows[x-3][3]);
      
      //For time (in seconds) of processes
      var activeRange = spreadsheetObject.getRange("D"+(x-numberOfUnproductive-numberOfNeutral)+":D"+(x-numberOfUnproductive-numberOfNeutral));
      spreadsheetObject.setActiveRange(activeRange);
      spreadsheetObject.getActiveRange().setValue((data.rows[x-3][1])/3600);
      
      numberOfProductive++;
    }
    else if (data.rows[x-3][5]==0) //Neutral tasks
    {
      numberOfNeutral++;
    }
    else //Unproductive tasks
    {
      var activeRange = spreadsheetObject.getRange("E"+(x-numberOfProductive-numberOfNeutral)+":E"+(x-numberOfProductive-numberOfNeutral));
      spreadsheetObject.setActiveRange(activeRange);
      spreadsheetObject.getActiveRange().setValue(data.rows[x-3][3]);
      var activeRange = spreadsheetObject.getRange("F"+(x-numberOfProductive-numberOfNeutral)+":F"+(x-numberOfProductive-numberOfNeutral));
      spreadsheetObject.setActiveRange(activeRange);
      spreadsheetObject.getActiveRange().setValue(data.rows[x-3][1]/3600);
      
      numberOfUnproductive++;
    }
  }
}
