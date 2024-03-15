chrome.action.onClicked.addListener(function (tab) {
  if (tab && tab.url.startsWith('http')) {
    chrome.debugger.attach({ tabId: tab.id }, '1.2', function () {
      chrome.debugger.sendCommand(
        { tabId: tab.id },
        'Fetch.enable',
        {},
        function () {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          }
        }
      );
    });
  } else {
    console.log('Debugger can only be attached to HTTP/HTTPS pages.');
  }
});

function getHeaderString(headers) {
  let responseHeader = [];

  headers.forEach((header, key) => {
    responseHeader.push({
      name: key,
      value: header,
    });
  });

  responseHeader.push({
    name: 'access-control-allow-origin',
    value: '*',
  });

  return responseHeader;
}

async function initialFetch(url, headers, method, postData, success, error) {
  let finalResponse = {};

  let response = await fetch(url, {
    method,
    mode: 'cors',
    headers,
    redirect: 'follow',
    body: postData,
  });

  finalResponse.response = await response.text();
  finalResponse.headers = getHeaderString(response.headers);

  if (response.ok) {
    success(finalResponse);
  } else {
    error(finalResponse);
  }
}

// function submitResponse(filteredData, continueParams) {
//   let responseLines = [];
//   if (filteredData.contentType) {
//     responseLines.push(`Content-Type: ${filteredData.contentType}`);
//   }
//   continueParams.responseCode = 200;
//   continueParams.binaryResponseHeaders = btoa(
//     `Content-Type: ${filteredData.contentType}`
//   );
//   continueParams.body = btoa(
//     unescape(encodeURIComponent(filteredData.replace))
//   );
//   chrome.debugger.sendCommand(debugee, 'Fetch.fulfillRequest', continueParams);
// }

chrome.debugger.onEvent.addListener(function (source, method, params) {
  if (method === 'Fetch.requestPaused') {
    const continueParams = {
      requestId: params.requestId,
    };

    const request = params.request;

    if (request.url.includes('localhost:8004')) {
      chrome.runtime.sendMessage({ url: request });
      if (request.url === 'http://localhost:8004/event/list') {
        console.log('here I am');

        initialFetch(
          request.url,
          request.headers,
          request.method,
          request.postData,
          (data) => {
            continueParams.responseCode = 200;
            continueParams.responseHeaders = data.headers;
            continueParams.body = btoa(
              unescape(
                encodeURIComponent(
                  JSON.stringify({
                    events: [],
                    total_count: 0,
                    finished_count: 0,
                  })
                )
              )
            );
            console.log(continueParams);
            chrome.debugger.sendCommand(
              source,
              'Fetch.fulfillRequest',
              continueParams
            );
          },
          (status) => {
            chrome.debugger.sendCommand(
              source,
              'Fetch.continueRequest',
              continueParams
            );
          }
        );

        return;
      }
    }

    chrome.debugger.sendCommand(
      source,
      'Fetch.continueRequest',
      continueParams
    );
    // Perform your desired action with the response data
  }
});
