/**

     Filters Data by extension and returns all
        available data with an specific extension in array
        @param {String} path - sets the path for the folder, needs to be  like 'C:/aFolder'
        @param {String} ext - filetype with sets the data to filter like jpg or tiff var ext="sql"
        @return {String} return Returns a array of Strings holding the paths for the files
*/

function getDataFilteredByType(absolutePath, fileExt){
importPackage(Packages.org.apache.commons.io);
importPackage(java.io);
importClass(java.io.File);

        var tempPath=absolutePath;
        var fileTyoeToGet=fileExt;
        var fileTyoeToGetWithPoint ="."+fileTyoeToGet;
        var tz=tempPath.replace('\\', '/');
         var dir = new java.io.File(tz);
         var names = dir.listFiles();
         logger.info(tz);
     var sqlFileNames = new Array();
         for (var i = 0 ; i < names.length; i++) {
                var namest = names[i].getName();
                var ext = namest.substring(namest.length()-4, namest.length());
                         var extShort = namest.substring(namest.length()-3, namest.length());
                   if (ext == fileTyoeToGet||ext==fileTyoeToGetWithPoint||extShort== fileTyoeToGet| extShort==fileTyoeToGetWithPoint ) {
                        var path = names[i].getPath();
                                    sqlFileNames.push(path);
                  }
      }
        for (var a in sqlFileNames ){ 
                //logger.info(sqlFileNames[a]);
        }
        return sqlFileNames ;
}


/**
        Renames a file, given full old path and new path

        @param {String} arg1 - Absolute FilePath of originalfile NEEDS to have this format: "C:/pathTofile/fileWithExtension.ext"
        @param {String} arg2 - Absolute FilePath of new filename NEEDS to have this format: "C:/pathToNewfileName/fileWithExtension.ext"
        @return {boolean} return - True if renaming was successful, old File gets substitued
*/
function renameFile(pathOldFile, pathNewFile){
        try {
                var oldFile=Packages.java.io.File(pathOldFile);
                var nuFile= Packages.java.io.File(pathNewFile);
                //Rename file
                oldFile.renameTo(nuFile);
                return true;
        }
        catch(e){
                logger.info ("Error: Renaming failed: "+e);
                return false;
        }
}


/**
        Checks for file being in location, using absolute Path as input argument

        @param {String}  absolutePathOfFile - filename "c:/pathTofile/file.ext" needs to be like
        @return {Boolean} return true if file was found, else false
*/
function checkIfFileIsThere(absolutePathOfFile) {
        try{
                var randomFaggsWontMakeMeSick=FileUtil.read(absolutePathOfFile);
                logger.info("File was found at: "+absolutePathOfFile);
                return true;
        }
        catch (e){
                        logger.info("NO file in:"+absolutePathOfFile+ " "+e);return false;
        } 
}


/**
   Readsout the folder structure and returns an array holdiung the Strings for the absolute path of our Testcases
   Path needs to be like path='C://test'
   In this path there need to be folders like  "warumKannstDuKeinDeutsch_Test1" , meaning first part of string is the channelname,
   2nd is the testcase name

        @param {String} path - Path holding the Pathadresse to read out and list folders
        @return {Array} storageOfPaths - Array holding our folderpaths we wanted to read out
*/
function getFolders(path){
         var storageOfPaths=[];
        var listOfFiles=FileUtils.listFilesAndDirs(new File(path), new NotFileFilter(TrueFileFilter.INSTANCE), DirectoryFileFilter.DIRECTORY);
        var listOfFilesAsString=listOfFiles.toString();
        var listOfFiles=listOfFilesAsString.replace(']','');
        listOfFilesAsString=listOfFiles.replace('\\', '/');
        //listOfFiles=listOfFiles3.replace('/', '//');
        var namesOfFOlder=listOfFilesAsString.toString().split(',');
        // Convert the Java array to a JavaScript array
        for (var k in namesOfFOlder){
                var temp=namesOfFOlder[k].toString();
                var tempLength=namesOfFOlder[k].toString().length();
                if ((path.length+3<tempLength)){
                        storageOfPaths.push(temp);
                }
        }
        return storageOfPaths;
}


/**
        Function to insert data into a table of a database location.
        @param {String} connectionString- needs to be like "com.mysql.jdbc.Driver, jdbc:mysql://127.0.0.1:3307/comdata, root, derpate"
        @param {String} table - Insert-tablename to witch we transfer our data to. Is used to execute our Insert-statements
        @param {Object} dataAsTupel - Data which holds the tupel data like var dataAsTupel={"Colom": "value",
                          "Colom2": "this is a test"}, First argument specifies the colomn and 2nd the value
*/

function insertValuesIntoDatabase(connectionString,table,dataAsTupel){

        function connection(connectionString) {
                // connection string needs to be set like this
                // "com.mysql.jdbc.Driver, jdbc:mysql://127.0.0.1:3307/comdata, root, derpate"  
                var driver=connectionString.split(",")[0].trim();
                var dbnameandport=connectionString.split(",")[1].trim();
                var dbuser=connectionString.split(",")[2].trim();
                var dbpassword=connectionString.split(",")[3].trim();
                //Establishing a DB-Connection 
                var dbConn = DatabaseConnectionFactory.createDatabaseConnection(driver, dbnameandport, dbuser, dbpassword);
                return dbConn;
        }

        try{
                var dbConn=connection(connectionString);
                var tableTo=table;
                var rows="(";
                var values="(";
                var counter=0;
                var insertLength=0;
                 for each (variable in dataAsTupel) {
              insertLength++;
                }
                for (variable in dataAsTupel) {
                        if (counter+1<insertLength ){
                                //logger.info(variable);
                                rows=rows+""+variable+", ";
                                counter++;
                        }
                                else{
                                         rows=rows+""+variable+")";
                         }
                 }
                 counter=0;
                 for each (variable in dataAsTupel) {
                          if(counter+1<insertLength ){
                                        values=values+"'"+variable+"', ";
                                         counter++;
                                 }
                          else{
                                         values=values+"'"+variable+"')";
                                 }
                 }
                 counter=0;
                var statement ="INSERT INTO "+ tableTo+" "+ rows+" VALUES"+ values;
         logger.info("SQL: " +statement);
                dbConn.executeUpdate(statement);
        }
        catch (e){
                         logger.info("Error: "+e);
                  };
}   



/**
        Reads in Files from a list and returns them as an array

        @param {String} arrayOfDataPaths - data holding Strings to the paths as array like array[0]='C:/test/test/'
        @return {String} return Array which holds the readin files
*/
function readFileDataToArray(arrayOfDataPaths){
         var readOutScripts=[];
        for each (variable in arrayOfDataPaths){
                 var setupscriptString= FileUtil.read(variable);
                readOutScripts.push(setupscriptString);
        }
         return readOutScripts;
}

/**
         Function to read in Files from a Array holding file-paths
        @param {String} data - Array holding the paths of our SQL-Files
        @return {Array} return - Array of Objects holding our read in SQL-Files
*/

function readInData(data){
         var readInData=[];
        for each (variable in data){
                var setupscriptString= FileUtil.read(variable);
                readOutScripts.push(setupscriptString);
                }
          return  readInData;
        }



/**
        Running script for our testcase suite.

        @param {String} absolutePath - Path holding our testcase structure, whereas our testcases are stored. Within this folder we need a folder structure
                                                         like testchannel_tescasename
        @return {Object} return - ResultObject, holding the Testvalues
*/

function runTest(path){
importPackage(Packages.org.apache.commons.io);
importPackage(java.io);
importPackage(java);
importPackage(Packages.org.apache.commons.io.filefilter);
importClass(Packages.org.apache.commons.io.filefilter.NotFileFilter);
importClass(Packages.org.apache.commons.io.filefilter.DirectoryFileFilter);
importClass(Packages.org.apache.commons.io.FileUtils);
importClass(java.io.File);


function getSQLData(path){
        var tempPath=path;
        var pathStandardized=tempPath.replace('\\', '/');
          var dir = new java.io.File(pathStandardized);
          var names = dir.listFiles();
      var sqlFileNames = new Array();
      for (var i = 0 ; i < names.length; i++) {
                var namest = names[i].getName();
                var ext = namest.substring(namest.length()-4, namest.length());
                if (ext == ".sql" || ext == "sql") {
                        var path = names[i].getPath();
                   //     logger.info(pathStandardized);
                      sqlFileNames.push(path);
                  }
       }
      
        for (var a in sqlFileNames ){ 
                //logger.info(sqlFileNames[a]);
        }
                 return sqlFileNames ;
        }


        function readSQLData(data){
                 var readOutScripts=[];
                for each (variable in data){
                         var setupscriptString= FileUtil.read(variable);
                        readOutScripts.push(setupscriptString);
                 }
           return readOutScripts;
        }

       
        var testcase =[];
        var listOfFiles=getFolders(path);
        // Returns the amount of Testcases
        var amountOfCases=listOfFiles.length;
        var readOutScripts="";
        // Loop der jeden Ordner abläuft
        for (var t=0; t< amountOfCases;t++){
                try{
                        var run={};
                        // Gets dynamically the length of our Testcases and cuts the String, accordiung to the length of the name
                        var pathLength= path.toString().length;
                        var filePath=listOfFiles[t].toString().trim();
                        var folderLength=filePath.toString().length();
                //      logger.info("upused :"+filePath);
                  try{
                                var pathToSqlFiles=getSQLData(filePath);
                                var sqlToString=readSQLData(pathToSqlFiles);
                                }catch(e)
                                    {logger.info(e);};
                         //Depending on the structure of the folders
                         var toCut=parseInt(folderLength)-parseInt(pathLength)-1;
                        // Reads in our setrupscript from file
                        setupscript = filePath+"/setupscript.js";
                        setupscriptString= FileUtil.read(setupscript.trim());
                         /// Reads in our postconditionscript from file
                        var postconditionscript =  filePath+"/postconditionscript.js";
                        //logger.info("postconditionscript: "+postconditionscript);
                        var postconditionscriptString = FileUtil.read(postconditionscript.trim());
                         // Reads in our testmsg from file
                        var testMSG = filePath+"/testmsg.xml";
                        var testMSGString=FileUtil.read(testMSG.trim());
                        var channel= filePath.slice(-toCut);
                        var testCase= channel.split("_")[1];
                        channel=channel.split("_")[0];

                        // Festhalten der Ergebnisse in einem run-Object, dieses wird dann in unser Array gepushed
                          run = {
                                        "channel": channel,
                                        "casename":  testCase,
                                        "folder": filePath,
                                        "setup-script": setupscriptString,
                                         "postconditions-script": postconditionscriptString,
                                         "sql-scripts" : sqlToString,
                                        "testmessage" : testMSGString,
                                         "passed":"true"
                        }
                 } catch(e) {
                                // logger.info(e);  
                                 run["passed"]="false";
                        }            
        testcase.push(run);
         for(var a in run){
                logger.info(a+ " ---> "+run[a]);
                          }
                                        }
                return testcase;
}


/**
        Writes a file to disc using File file and String path as input-arguments

        @param {String}  savingPathOfFileIncludingName - Holds the absolute Path including the filename "c:/pathTofile/file.ext"
        @param {String}  file - File to write
        @return {Boolean} return True if writing was successfull, false if failed
*/
function writeFileToDisc(file, savingPathOfFileIncludingName){
        try{
                FileUtil.write(savingPathOfFileIncludingName, true, file);
                logger.info("File was written to : "+savingPathOfFileIncludingName);
                return true;
        }
        catch (e){
                logger.info("Error: "+e);
                return false;
        } 
}