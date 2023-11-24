// popup.js
document.getElementById('refreshButton').addEventListener('click', function() {
    // Trigger a manual refresh by sending a message to the background script
    console.log('Button Clicked!');
    chrome.runtime.sendMessage({ refreshData: true }, function(response) {
        console.log('Response from background:', response);
      });
  });

  // Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message) {
    console.log('Listener fired!');
    if (message.data) {
      // If the message contains data, display it
      displayData(message.data);
    }
  });
  
// Retrieve the stored data on extension popup open
chrome.storage.local.get(['myData'], function (result) {
    const storedData = result.myData || [];
    displayData(storedData);
  });
  
  function displayData(datax) {
    // console.log('datax is ==', datax);
    const data = datax.records;
    // console.log('data is == ', data);
    const table = document.getElementById('dataTable');
    table.innerHTML = ''; // Clear previous data
  
    // Create table headers
    const headerRow = table.insertRow(0);
    for (var key in data[0]) {
        const th = document.createElement('th');
    if(key == 'Account__c'){
        key = 'QLogin';
        th.textContent = key;
        headerRow.appendChild(th);
      }
      else if(key == 'Domain__c'){
        key = 'SLogin';
        th.textContent = key;
        headerRow.appendChild(th);
      }
      else if(key == 'Id'){
        key = 'Kiwi';
        th.textContent = key;
        headerRow.appendChild(th);
      }
      else if(key == 'Login_Link__c'){
        key = 'Edit';
        th.textContent = key;
        headerRow.appendChild(th);
      }
    }
  
    // Populate the table with data
    data.forEach((item, index) => {
      const row = table.insertRow(index + 1);
      for (const key in item) {
        // const cell = row.insertCell();
        const Id = item['Id'];
        const accountId = item['Account__c'];
        const Name = item['Name'];
        const domain = item['Domain__c'];
        const UN = item['User_Name__c'];
        const PWD = item['Password__c'];
        // console.log('item',item);
        // console.log('key',key);
        // console.log(item[0].indexOf(key));
        if(key == 'Account__c'){
            const cell = row.insertCell();
            cell.className = 'first-column';
            cell.innerHTML = `<a href="https://${domain}.lightning.force.com/lightning/page/home" target="_blank" style="display: block;">${Name}</a>`;
        }
        else if (key == 'Domain__c'){
            const cell = row.insertCell();
            cell.innerHTML = `<a href="https://login.salesforce.com/?un=${UN}&pw=${PWD}" target="_blank" style="display: block;">${Name}</a>`;
        }
        else if (key == 'Id'){
            const cell = row.insertCell();
            cell.innerHTML = `<a href="https://eekiwigroupinc--c.vf.force.com/lightning/r/Account/${accountId}/view" target="_blank" style="display: block;">${Name}</a>`;
        }
        else if (key == 'Login_Link__c'){
            const cell = row.insertCell();
            cell.innerHTML = `<a href="https://eekiwigroupinc--c.vf.force.com/lightning/r/Login_Link__c/${Id}/edit?" target="_blank" style="display: block;">${Name}</a>`;
        }
        else{
            // cell.innerHTML = `${item[key]}`;
        }
      }
    });
  }
  
