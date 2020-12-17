var AJAX = function (RequestedURL = "", RequestTimeout = 5000, activeLoging = false, recievedDataFunction) {
    const SUCCESSED = 200;
    var getRequestXHR = null;
    var url = RequestedURL;
    var loging = activeLoging;
    getRequestXHR = new XMLHttpRequest();
    getRequestXHR.timeout = RequestTimeout;


    // tested
    this.sendGetRequest = function () {
        getRequestXHR.onload = success; // transaction completed successfully.
        getRequestXHR.onerror = failed; // for any reason the communication with the server had any problem
        getRequestXHR.onreadystatechange = stateChange; // monitors the state of the transaction
        getRequestXHR.open('GET', url, true); // initializes the request
        getRequestXHR.send(null); // sends the request
    }
    this.abortGetRequest = function () {
        getRequestXHR.abort();
    }


    /*********************************************************
     * Success function get executed when there is a response.
     * and the response may contain an error or the requested data.
     * So, a promise object separests the error from the data
     *********************************************************/
    // an async function always expect to return a promise
    var success = async function (progressEvent) {
        // await keword waits until the promise is fullfiled then unpacks the promise and returns the value
        var result = await new Promise((done, rejected) => {

            if (progressEvent.target.status === SUCCESSED) {
                //data = JSON.parse(progressEvent.target.responseText);
                data = progressEvent.target.responseText;
                done(data);
            } else {
                let doc = new DOMParser();
                let result = doc.parseFromString(progressEvent.target.responseText, "text/html");
                let errorObject = { Status: progressEvent.target.status, Title: result.title, Message: result.body.children[1].innerHTML };
                rejected(errorObject);
            }
        });
        // callBack function
        recievedDataFunction(result);

    }

    var failed = function () {
        console.error('the communication with the server got problem(s).');
    }
    /****************************************
     * reprts the state of the XMLHttpRequest
     ****************************************/
    var stateChange = function (log) {
        if (loging)
            switch (log.target.readyState) {
                case 0: {
                    // Status is UNSENT means that open() has not been called yet.
                    console.log("AJAX syas: ", "Waiting to stablish a channel");
                }
                    break;
                case 1: {
                    // status is OPENED means that open() has been called.
                    console.log("AJAX syas: ", "A communication channel opened");
                };
                    break;
                case 2: {
                    // send() called, headers and status are available.
                    console.log("AJAX syas: ", "The request sent");
                }
                    break;
                case 3: {
                    // status is LOADING (downloading); responseText property holds partial data.
                    console.log("AJAX syas: ", "Downloading the response...");
                }
                case 4: {
                    console.log("AJAX says: ", "The operation completed and the response received.");
                }
                    break;
            }

    }
};