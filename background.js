var accessToken = 'ppp';

chrome.runtime.onInstalled.addListener(() => {
  // Set up an initial data fetch
  console.log('I started! Who am I??');
  fetchData();
});

// Function to fetch data
function fetchData() {
  console.log('Misho Started');
  const clientId = '3MVG9xOCXq4ID1uFGPnXSl_gHy_VF7FX5foXXcjMNA07z4YZoHg7dQYIVgjxe.R7RStTBr_0jEvTeADhRHu8Q';
  const clientSecret = 'F323573BC78E11D316BACF963FEC133F3D927297801A6F1627826B5EC9E1DAB9';
  const username = 'apiuser@kiwigroupinc.com';
  const password = 'Ph123456!uyE4biq8IBhR7CmeIMKsK4Vgh';

  fetch(`https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=${clientId}&client_secret=${clientSecret}&username=${username}&password=${password}`, {
    method: 'POST'
  }).then(response => {
    console.log('mmm res = ' + response.json);
    if (!response.ok) {
      console.log('Misho' + response);
      throw new Error('Failed to get access token');
    }
    return response.json();
  }).then(data => {
    console.log('mmm DATA: ' + data.access_token);
    accessToken = data.access_token;
    console.log(accessToken);
    querySF();
  }).catch(error => {
    console.error(error);
  });
}

// Set up a periodic data refresh (e.g., every hour)
setInterval(fetchData, 60 * 60 * 1000);

function querySF() {
  setTimeout(function() {
    console.log('MISHO 2 started' + accessToken);
    const apiUrl = "https://eekiwigroupinc.my.salesforce.com";
    const query = `select id, name, Account__c, user_name__c, Password__c, Login_Link__c, Login_Link_as_Text__c, domain__c from Login_Link__c where Sandbox__c = false AND Display_in_VF_Page__c = True order by account__r.name`;
    const fetchURL = `${apiUrl}/services/data/v55.0/query?q=${encodeURIComponent(query)}`;
    console.log('Fetch URL == ', fetchURL);

    fetch(fetchURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      if (!response.ok) {
        console.log('response is::: ', response);
        console.log('response body is::: ', response.body);
        throw new Error('Failed to get data', response);
      }
      return response.json();
    }).then(data => {
      console.log('mmm Q: ' + data.totalSize);
      chrome.storage.local.set({ myData: data }, function() {
        console.log('Data stored locally:', data);
      });
    }).catch(error => {
      console.error(error);
    });
  }, 2000);
}

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('Message received in background:', message);
  if (message.refreshData) {
    fetchData();
    sendResponse({ success: true });
  }
});
