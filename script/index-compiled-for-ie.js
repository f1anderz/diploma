'use strict';

if (!window.JSON || !window.JSON.parse || !window.JSON.stringify) {
  document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/json3/3.3.3/json3.min.js"><\/script>');
}

var apiURL = 'http://34.227.205.75:3000/';

/**
 * Shows a custom modal alert.
 * @param {string} message - The message to display.
 */
function showCustomAlert(message) {
  var modal = document.getElementById('customAlertModal');
  var messageEl = document.getElementById('customAlertMessage');
  var okButton = document.getElementById('customAlertOkButton');

  if (!modal || !messageEl || !okButton) {
    return;
  }

  setText(messageEl, message);
  modal.style.display = 'block';

  function onOkClick() {
    modal.style.display = 'none';
  }
  okButton.onclick = onOkClick;
}

/**
 * Formats a Date object into DD.MM.YYYY string.
 * @param {Date} dateObj - The Date object to format.
 * @returns {string} Formatted date string or an empty string if invalid.
 */
function formatDateObject(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }
  var day = dateObj.getDate();
  var month = dateObj.getMonth() + 1;
  var year = dateObj.getFullYear();

  var dayStr = day < 10 ? '0' + day : day.toString();
  var monthStr = month < 10 ? '0' + month : month.toString();

  return dayStr + '.' + monthStr + '.' + year;
}

/**
 * Makes an AJAX GET request. Handles IE8 XDomainRequest.
 * @param {string} url - The URL to fetch.
 * @param {function} callback - Callback function (err, data).
 */
function getJSON(url, callback) {
  if (window.XDomainRequest) {
    var xdr = new XDomainRequest();
    xdr.open('GET', url);
    xdr.onload = function () {
      try {
        if (xdr.responseText) {
          var data = JSON.parse(xdr.responseText);
          callback(null, data);
        } else {
          callback(new Error('XDomainRequest responseText is empty'));
        }
      } catch (e) {
        callback(e);
      }
    };
    xdr.onerror = function () {
      callback(new Error('XDomainRequest failed. Check CORS policy on the server.'));
    };
    xdr.onprogress = function () {};
    xdr.ontimeout = function () {
      callback(new Error('XDomainRequest timed out.'));
    };
    setTimeout(function () {
      xdr.send();
    }, 0);
  } else {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            var data = JSON.parse(xhr.responseText);
            callback(null, data);
          } catch (e) {
            callback(e);
          }
        } else {
          callback(new Error('Request failed with status: ' + xhr.status + ' ' + xhr.statusText));
        }
      }
    };
    xhr.onerror = function () {
      callback(new Error('Network request failed.'));
    };
    xhr.send();
  }
}

/**
 * Sets the text content of an element, compatible with older IE.
 * @param {HTMLElement} el - The element.
 * @param {string} text - The text to set.
 */
function setText(el, text) {
  if (el) {
    if (typeof el.textContent !== 'undefined') {
      el.textContent = text;
    } else {
      el.innerText = text;
    }
  }
}

/**
 * Attaches an event listener compatibly for IE8 and modern browsers.
 * @param {HTMLElement} el - The element.
 * @param {string} eventName - The name of the event (e.g., 'click').
 * @param {function} handler - The event handler function.
 */
function attachEventCompat(el, eventName, handler) {
  if (el.attachEvent) {
    el.attachEvent('on' + eventName, handler);
  } else {
    el.addEventListener(eventName, handler, false);
  }
}

/**
 * Gets the first element with a given class name (IE8 compatible).
 * @param {HTMLElement|Document} root - The root element to search within.
 * @param {string} className - The class name to find.
 * @returns {HTMLElement|null} The first matching element or null.
 */
function getFirstElementByClassName(root, className) {
  if (root.getElementsByClassName) {
    var elements = root.getElementsByClassName(className);
    return elements.length > 0 ? elements[0] : null;
  } else {
    var allElements = root.getElementsByTagName('*');
    for (var i = 0; i < allElements.length; i++) {
      var el = allElements[i];
      if (el.className) {
        var classes = el.className.split(' ');
        for (var j = 0; j < classes.length; j++) {
          if (classes[j] === className) {
            return el;
          }
        }
      }
    }
  }
  return null;
}

var selectedMethod;

var select_tabs = document.getElementById('select_tabs');
select_tabs.value = '1';
attachEventCompat(select_tabs, 'change', function () {
  setupInfoTabs(select_tabs.value);
});

/**
 * Creates and manages tabs for displaying detailed information.
 * @param {object} method - The method object containing data.
 */
function setupInfoTabs(view) {
  var tabsContainer = document.getElementById('tabs');
  var infoWrapper = getFirstElementByClassName(document, 'info-wrapper');

  if (!tabsContainer || !infoWrapper) {
    return;
  }

  tabsContainer.innerHTML = '';
  infoWrapper.innerHTML = '';

  var tabsData;
  if (Number(view) === 1) {
    tabsData = [{
      name: '1 ФІЗИКО-ХІМІЧНІ ВЛАСТИВОСТІ',
      id: 'physChem',
      renderer: function renderer() {
        renderPhysChemPropertiesTab(selectedMethod.ID, function (contentElement) {
          infoWrapper.innerHTML = '';
          infoWrapper.appendChild(contentElement);
        });
      }
    }, {
      name: '2 РЕКОМ. ГІГІЄНІЧНІ НОРМАТИВИ',
      id: 'hygStandards',
      renderer: function renderer() {
        renderHygienicStandardsTab(selectedMethod.ID, function (contentElement) {
          infoWrapper.innerHTML = '';
          infoWrapper.appendChild(contentElement);
        });
      }
    }];
  } else if (Number(view) === 2) {
    tabsData = [{
      name: '1 ГАЛУЗЬ ВИКОРИСТАННЯ',
      id: '1',
      renderer: function renderer() {
        renderUsingArea(selectedMethod.ID, function (contentElement) {
          infoWrapper.innerHTML = '';
          infoWrapper.appendChild(contentElement);
        });
      }
    }, {
      name: '2 НОРМИ ПОХИБКИ ВИМІРЮВАНЬ',
      id: '2',
      renderer: function renderer() {
        renderNorms(selectedMethod.ID, function (contentElement) {
          infoWrapper.innerHTML = '';
          infoWrapper.appendChild(contentElement);
        });
      }
    }, {
      name: '3 ХАРАКТЕРИСТИКИ ПОХИБКИ ВИМІРЮВАНЬ І НОРМАТИВИ ОПЕРАТИВНОГО КОНТРОЛЮ',
      id: '3',
      renderer: function renderer() {
        renderNormatyvy(selectedMethod.ID, function (contentElement) {
          infoWrapper.innerHTML = '';
          infoWrapper.appendChild(contentElement);
        });
      }
    }, {
      name: '4 ЗАСОБИ ВИМІРЮВАЛЬНОЇ ТЕХНІКИ, ДОПОМІЖНЕ ОБЛАДНАННЯ, ПОСУД, РЕАКТИВИ ТА МАТЕРІАЛИ',
      id: '4',
      renderer: function renderer() {}
    }, {
      name: '5 МЕТОДИКА ВИМІРЮВАННЯ',
      id: '5',
      renderer: function renderer() {}
    }, {
      name: '6 ВИМОГИ БЕЗПЕКИ',
      id: '6',
      renderer: function renderer() {}
    }, {
      name: '7 ВИМОГИ ДО КВАЛІФІКАЦІЇ ОПЕРАТОРІВ',
      id: '7',
      renderer: function renderer() {}
    }, {
      name: '8 УМОВИ ПРОВЕДЕННЯ ВИМІРЮВАНЬ',
      id: '8',
      renderer: function renderer() {}
    }, {
      name: '9 ПІДГОТОВКА ДО ВИКОНАННЯ ВИМІРЮВАНЬ',
      id: '9',
      renderer: function renderer() {}
    }, {
      name: '10 ВИМІРЮВАННЯ',
      id: '10',
      renderer: function renderer() {}
    }, {
      name: '11 ОБРОБКА РЕЗУЛЬТАТІВ ВИМІРЮВАНЬ',
      id: '11',
      renderer: function renderer() {}
    }, {
      name: '12 КОНТРОЛЬ ПОХИБКИ РЕЗУЛЬТАТІВ ВИМІРЮВАНЬ',
      id: '12',
      renderer: function renderer() {}
    }, {
      name: '13 ОФОРМЛЕННЯ РЕЗУЛЬТАТІВ ВИМІРЮВАНЬ',
      id: '13',
      renderer: function renderer() {}
    }];
  }

  for (var i = 0; i < tabsData.length; i++) {
    (function (tabInfo) {
      var tabElement = document.createElement('div');
      tabElement.className = 'tab';
      setText(tabElement, tabInfo.name);

      attachEventCompat(tabElement, 'click', function () {
        var allTabs = tabsContainer.getElementsByTagName('div');
        for (var j = 0; j < allTabs.length; j++) {
          allTabs[j].className = allTabs[j].className.replace(' active', '');
        }
        tabElement.className += ' active';
        infoWrapper.innerHTML = '';
        setText(infoWrapper, 'Loading ' + tabInfo.name + '...');
        tabInfo.renderer();
      });
      tabsContainer.appendChild(tabElement);
    })(tabsData[i]);
  }

  if (tabsData.length > 0 && tabsContainer.firstChild) {
    if (typeof tabsContainer.firstChild.click === 'function') {
      tabsContainer.firstChild.click();
    } else if (tabsContainer.firstChild.fireEvent) {
      tabsContainer.firstChild.fireEvent('onclick');
    }
  } else {
    setText(infoWrapper, 'No information tabs to display for this method.');
  }
}

/**
 * Renders the Hygienic Standards tab content.
 * @param {string} selectedMethodId - The ID of the selected method.
 * @param {function} callback - Callback function with the rendered container.
 */
function renderHygienicStandardsTab(selectedMethodId, displayCallback) {
  var container = document.createElement('div');
  container.className = 'container';

  setText(container, 'Loading hygienic standards...');

  var apiUrl = apiURL + 'method/' + selectedMethodId + '/hygienic_standards';

  getJSON(apiUrl, function (err, standards) {
    setText(container, '');

    if (err) {
      showCustomAlert('Error loading hygienic standards: ' + err.message);
      setText(container, 'Could not load data.');
      if (displayCallback) displayCallback(container);
      return;
    }

    if (!standards || standards.length === 0) {
      setText(container, 'No hygienic standards found for this method.');
      if (displayCallback) displayCallback(container);
      return;
    }

    var propertiesTable = document.createElement('table');
    propertiesTable.className = 'hyg-stand-table';

    var tableHead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    var headerTitles = ['#', 'Цільова речовина', "Об'єкт аналізу", 'МДР', 'МКВ'];
    var headerClasses = ['id-cell', 'target-cell', 'object-cell', 'mdr-cell', 'mdk-cell'];

    for (var i = 0; i < headerTitles.length; i++) {
      var th = document.createElement('th');
      setText(th, headerTitles[i]);
      if (headerClasses[i]) th.className = headerClasses[i];
      headerRow.appendChild(th);
    }
    tableHead.appendChild(headerRow);
    propertiesTable.appendChild(tableHead);

    var tableBody = document.createElement('tbody');
    var currentMethodDescription = '';

    for (var j = 0; j < standards.length; j++) {
      var standard = standards[j];
      var row = document.createElement('tr');

      var values = [standard.ID || '', standard.SUBSTANCE || '', standard.OBJECT || '', standard.MDR_VALUE || '', standard.MDK_VALUE || ''];
      for (var k = 0; k < values.length; k++) {
        var td = document.createElement('td');
        setText(td, values[k]);
        row.appendChild(td);
      }
      tableBody.appendChild(row);

      if (j === 0 && standard.CHRM_DESCR) {
        currentMethodDescription = standard.CHRM_DESCR;
      }
    }

    propertiesTable.appendChild(tableBody);
    container.appendChild(propertiesTable);

    if (currentMethodDescription) {
      var methodField = document.createElement('div');
      setText(methodField, currentMethodDescription);
      methodField.className = 'method-name';
      container.appendChild(methodField);
    }

    if (displayCallback) displayCallback(container);
  });
}

/**
 * Renders the PhysChem Properties tab content (placeholder).
 * @param {string} methodId - The ID of the selected method.
 * @param {function} displayCallback - Callback function with the rendered container.
 */
function renderPhysChemPropertiesTab(methodId, displayCallback) {
  var container = document.createElement('div');
  container.className = 'container';
  setText(container, 'Loading physical and chemical properties...');

  getJSON(apiURL + 'substance/' + methodId, function (err, data) {
    setText(container, '');
    if (err) {
      showCustomAlert('Error loading physical/chemical properties: ' + err.message);
      setText(container, 'Could not load data.');
    } else {
      var substanceSelect = document.createElement('select');
      substanceSelect.name = 'substance';
      substanceSelect.className = 'phys-chem-select';
      var emptyOption = document.createElement('option');
      emptyOption.value = '';
      setText(emptyOption, '--Оберіть значення--');
      substanceSelect.appendChild(emptyOption);

      for (var i = 0; i < data.length; i++) {
        var substanceOption = document.createElement('option');
        substanceOption.value = data[i].ID;
        setText(substanceOption, data[i].E_NAME);
        substanceSelect.appendChild(substanceOption);
      }

      container.appendChild(substanceSelect);

      attachEventCompat(substanceSelect, 'change', function () {
        var select = document.getElementsByName('substance')[0];
        if (select.value === '') {
          return;
        }
        var selectedSubstance;
        for (var i = 0; i < data.length; i++) {
          if (data[i].ID === Number(select.value)) {
            selectedSubstance = data[i];
          }
        }

        getJSON(apiURL + 'substance/' + select.value + '/preparates', function (err, preparateData) {
          if (err) {
            showCustomAlert('Error loading physical/chemical properties: ' + err.message);
            setText(container, 'Could not load data.');
          } else {
            var preparateSelect = document.createElement('select');
            preparateSelect.name = 'preparate';
            preparateSelect.className = 'phys-chem-select';
            preparateSelect.appendChild(emptyOption);

            for (var i = 0; i < preparateData.length; i++) {
              var preparateOption = document.createElement('option');
              preparateOption.value = preparateData[i].PREPARATE_ID;
              setText(preparateOption, preparateData[i].PREPARATE);
              preparateSelect.appendChild(preparateOption);
            }
          }
          container.appendChild(preparateSelect);

          var substanceInfoBlock = document.createElement('div');
          substanceInfoBlock.className = 'substance-info';

          var casLabel = document.createElement('label');
          setText(casLabel, 'CAS #');
          casLabel.className = 'cas-label';
          casLabel.htmlFor = 'cas-input';
          var casInput = document.createElement('input');
          casInput.className = 'cas-input';
          casInput.id = 'cas-input';
          casInput.value = selectedSubstance.CAS;
          var bruttoFormula = document.createElement('input');
          bruttoFormula.value = selectedSubstance.BRUTTO;
          bruttoFormula.id = 'brutto';

          var molMass = document.createElement('input');
          molMass.value = selectedSubstance.MOL_MASS;
          molMass.id = 'mol-mass';

          substanceInfoBlock.appendChild(casLabel);
          substanceInfoBlock.appendChild(casInput);
          substanceInfoBlock.appendChild(document.createElement('br'));
          substanceInfoBlock.appendChild(bruttoFormula);
          substanceInfoBlock.appendChild(molMass);

          container.appendChild(substanceInfoBlock);

          getJSON(apiURL + 'substance/' + select.value + '/synonyms', function (err, synonymsData) {
            if (err) {
              showCustomAlert('Error loading physical/chemical properties: ' + err.message);
              setText(container, 'Could not load data.');
            } else {
              var synonyms = synonymsData;

              var tableWrapper = document.createElement('div');
              tableWrapper.className = 'synonyms-table-wrapper';
              var synonymsTable = document.createElement('table');
              synonymsTable.className = 'synonyms-table';

              var tableHead = document.createElement('thead');
              var headerRow = document.createElement('tr');
              var headerTitles = ['#', 'Синонім УКР', 'Синонім АНГЛ'];
              var headerClasses = ['id-cell', 'ukr-name-cell', 'eng-name-cell'];

              for (var i = 0; i < headerTitles.length; i++) {
                var th = document.createElement('th');
                setText(th, headerTitles[i]);
                if (headerClasses[i]) th.className = headerClasses[i];
                headerRow.appendChild(th);
              }
              tableHead.appendChild(headerRow);
              synonymsTable.appendChild(tableHead);

              var tableBody = document.createElement('tbody');

              for (var j = 0; j < synonyms.length; j++) {
                var row = document.createElement('tr');
                var idCell = document.createElement('td');
                var uSynonym = document.createElement('td');
                var enSynonym = document.createElement('td');

                setText(idCell, j + 1);
                idCell.className = 'id-cell';
                setText(uSynonym, synonyms[j].U_NAME);
                setText(enSynonym, synonyms[j].E_NAME);

                row.appendChild(idCell);
                row.appendChild(uSynonym);
                row.appendChild(enSynonym);
                tableBody.appendChild(row);
              }

              synonymsTable.appendChild(tableBody);
              tableWrapper.appendChild(synonymsTable);
              container.appendChild(tableWrapper);
            }

            var imageContainer = document.createElement('div');
            imageContainer.className = 'image';
            var image = document.createElement('img');
            image.src = '/assets/deltamethrin.jpg';
            imageContainer.appendChild(image);
            container.appendChild(imageContainer);

            var agrStateInput = document.createElement('input');
            agrStateInput.className = 'agr-state-input';
            agrStateInput.value = selectedSubstance.AGR_STATE;
            container.appendChild(agrStateInput);

            getJSON(apiURL + 'substance/' + select.value + '/solubility', function (err, solubilityData) {
              if (err) {
                showCustomAlert('Error loading physical/chemical properties: ' + err.message);
                setText(container, 'Could not load data.');
              } else {
                var solubilityTableWrap = document.createElement('div');
                solubilityTableWrap.className = 'solubility-table-wrap';
                var solubilityTable = document.createElement('table');
                solubilityTable.className = 'solubility-table';

                var tableHead = document.createElement('thead');
                var headerRow = document.createElement('tr');
                var headerTitles = ['#', ' Розчинник', 'Розчинність', 'T \xB0C', 'pH'];
                var headerClasses = ['id-cell', 'solvent-cell', 'solubility-cell', 'temp-cell', 'ph-cell'];

                for (var i = 0; i < headerTitles.length; i++) {
                  var th = document.createElement('th');
                  setText(th, headerTitles[i]);
                  if (headerClasses[i]) th.className = headerClasses[i];
                  headerRow.appendChild(th);
                }
                tableHead.appendChild(headerRow);
                solubilityTable.appendChild(tableHead);

                var tableBody = document.createElement('tbody');

                for (var i = 0; i < solubilityData.length; i++) {
                  var row = document.createElement('tr');
                  var idCell = document.createElement('td');
                  var nameCell = document.createElement('td');
                  nameCell.className = 'solubility-name-cell';
                  var solubilityValue = document.createElement('td');
                  solubilityValue.className = 'solubility-cell';
                  var temp = document.createElement('td');
                  temp.className = 'temp-cell';
                  var ph = document.createElement('td');
                  ph.className = 'ph-cell';

                  setText(idCell, i + 1);
                  setText(nameCell, solubilityData[i].SOLVENT);
                  setText(solubilityValue, solubilityData[i].SOLUBILITY);
                  setText(temp, solubilityData[i].TEMPERATURE);
                  setText(ph, solubilityData[i].PH);

                  row.appendChild(idCell);
                  row.appendChild(nameCell);
                  row.appendChild(solubilityValue);
                  row.appendChild(temp);
                  row.appendChild(ph);

                  tableBody.appendChild(row);
                }

                solubilityTable.appendChild(tableBody);
                solubilityTableWrap.appendChild(solubilityTable);
                container.appendChild(solubilityTableWrap);

                getJSON(apiURL + 'substance/' + select.value + '/vapor_pressure', function (err, pressureData) {
                  if (err) {
                    showCustomAlert('Error loading physical/chemical properties: ' + err.message);
                    setText(container, 'Could not load data.');
                  } else {
                    var pressureTableWrap = document.createElement('div');
                    pressureTableWrap.className = 'pressure-table-wrap';
                    var pressureTable = document.createElement('table');
                    pressureTable.className = 'pressure-table';

                    var tableHead = document.createElement('thead');
                    var headerRow = document.createElement('tr');
                    var headerTitles = ['#', 'Тиск', 'T \xB0C'];
                    var headerClasses = ['id-cell', 'pressure-cell', 'temp-cell'];

                    for (var i = 0; i < headerTitles.length; i++) {
                      var th = document.createElement('th');
                      setText(th, headerTitles[i]);
                      if (headerClasses[i]) th.className = headerClasses[i];
                      headerRow.appendChild(th);
                    }
                    tableHead.appendChild(headerRow);
                    pressureTable.appendChild(tableHead);

                    var tableBody = document.createElement('tbody');

                    for (var i = 0; i < pressureData.length; i++) {
                      var row = document.createElement('tr');
                      var idCell = document.createElement('td');
                      var pressureCell = document.createElement('td');
                      var temperatureCell = document.createElement('td');

                      setText(idCell, i + 1);
                      setText(pressureCell, pressureData[i].PRESSURE);
                      setText(temperatureCell, pressureData[i].TEMPERATURE);

                      row.appendChild(idCell);
                      row.appendChild(pressureCell);
                      row.appendChild(temperatureCell);

                      tableBody.appendChild(row);
                    }

                    pressureTable.appendChild(tableBody);
                    pressureTableWrap.appendChild(pressureTable);
                    container.appendChild(pressureTableWrap);
                  }

                  var info = document.createElement('div');
                  info.className = 'substance-info';

                  var tempLabel = document.createElement('label');
                  var tempInput = document.createElement('input');
                  var rozkladLabel = document.createElement('label');
                  var rozkladInput = document.createElement('input');
                  var logpLabel = document.createElement('label');
                  var logpInput = document.createElement('input');

                  setText(tempLabel, 'T плавлення');
                  tempLabel.className = 'info-label';
                  tempInput.value = selectedSubstance.MELTING_T;
                  tempInput.type = 'text';
                  tempInput.className = 'info-input';
                  setText(rozkladLabel, 'T розкладу');
                  rozkladLabel.className = 'info-label';
                  rozkladInput.value = selectedSubstance.DECOMPOSIT_T;
                  rozkladInput.type = 'text';
                  rozkladInput.className = 'info-input';
                  setText(logpLabel, 'log P');
                  logpLabel.className = 'info-label';
                  logpInput.value = selectedSubstance.LOG_P;
                  logpInput.type = 'text';
                  logpInput.className = 'info-input';

                  info.appendChild(tempLabel);
                  info.appendChild(tempInput);
                  info.appendChild(document.createElement('br'));
                  info.appendChild(rozkladLabel);
                  info.appendChild(rozkladInput);
                  info.appendChild(document.createElement('br'));
                  info.appendChild(logpLabel);
                  info.appendChild(logpInput);
                  info.appendChild(document.createElement('br'));
                  container.appendChild(info);
                });
              }
            });
          });
        });
      });
    }
    if (displayCallback) displayCallback(container);
  });
}

function renderUsingArea(methodId, displayCallback) {
  var container = document.createElement('div');
  container.className = 'container';
  setText(container, 'Loading physical and chemical properties...');

  getJSON(apiURL + 'method/' + methodId + '/using_area', function (err, data) {
    setText(container, '');
    if (err) {
      showCustomAlert('Error loading halusi: ' + err.message);
      setText(container, 'Could not load data.');
    } else {
      var methodInput = document.createElement('input');
      methodInput.value = data[0].CHR_METHOD;
      methodInput.style.width = '100%';
      methodInput.style.height = '40px';
      methodInput.style.marginTop = '4px';
      var areaText = document.createElement('textarea');
      areaText.value = data[0].USING_AREA;
      areaText.style.width = '100%';
      areaText.style.height = '100px';
      areaText.style.marginTop = '4px';

      getJSON(apiURL + 'method/' + methodId + '/substance_area', function (err, substanceData) {
        if (err) {
          showCustomAlert('Error loading halusi: ' + err.message);
          setText(container, 'Could not load data.');
        } else {
          var substanceLabel = document.createElement('label');
          substanceLabel.className = 'substance-label';
          setText(substanceLabel, 'Цей документ встановлює методику вимірювання масової частки');
          var substanceSelect = document.createElement('select');
          substanceSelect.name = 'substance';
          var emptyOption = document.createElement('option');
          emptyOption.value = '';
          setText(emptyOption, '--Оберіть значення--');
          substanceSelect.appendChild(emptyOption);

          for (var i = 0; i < substanceData.length; i++) {
            var substanceOption = document.createElement('option');
            substanceOption.value = substanceData[i].SUBSTANCE_ID;
            setText(substanceOption, substanceData[i].SUBSTANCE);
            substanceSelect.appendChild(substanceOption);
          }

          container.appendChild(substanceLabel);
          container.appendChild(substanceSelect);
          container.appendChild(document.createElement('br'));
          container.appendChild(methodInput);

          container.appendChild(document.createElement('br'));
          container.appendChild(areaText);

          attachEventCompat(substanceSelect, 'change', function () {
            getJSON(apiURL + 'substance/' + substanceSelect.value + '/object_area', function (err, objectData) {
              if (err) {
                showCustomAlert('Error loading halusi: ' + err.message);
                setText(container, 'Could not load data.');
              } else {
                var objectTableWrap = document.createElement('div');
                objectTableWrap.className = 'object-table-wrap';
                objectTableWrap.id = 'object-table-wrap';
                objectTableWrap.style.float = 'right';
                objectTableWrap.style.marginTop = '8px';
                objectTableWrap.style.marginBottom = '8px';
                var objectTable = document.createElement('table');
                objectTable.className = 'object-table';

                var tableHead = document.createElement('thead');
                var headerRow = document.createElement('tr');
                var headerTitles = ['#', 'Назва об`єкту аналізу', 'min', 'max', 'Одиниці вимірювання'];
                var headerClasses = ['id-cell', 'name-cell', 'min-cell', 'max-cell', 'mdr-cell'];

                for (var i = 0; i < headerTitles.length; i++) {
                  var th = document.createElement('th');
                  setText(th, headerTitles[i]);
                  if (headerClasses[i]) th.className = headerClasses[i];
                  headerRow.appendChild(th);
                }
                tableHead.appendChild(headerRow);
                objectTable.appendChild(tableHead);

                var tableBody = document.createElement('tbody');

                for (var i = 0; i < objectData.length; i++) {
                  var row = document.createElement('tr');
                  var idCell = document.createElement('td');
                  var nameCell = document.createElement('td');
                  var minCell = document.createElement('td');
                  var maxCell = document.createElement('td');
                  var mdrCell = document.createElement('td');

                  setText(idCell, i + 1);
                  setText(nameCell, objectData[i].OBJECT);
                  setText(minCell, objectData[i].MIN_VALUE);
                  setText(maxCell, objectData[i].MAX_VALUE);
                  setText(mdrCell, objectData[i].UNIT);

                  row.appendChild(idCell);
                  row.appendChild(nameCell);
                  row.appendChild(minCell);
                  row.appendChild(maxCell);
                  row.appendChild(mdrCell);

                  tableBody.appendChild(row);
                }

                objectTable.appendChild(tableBody);
                objectTableWrap.appendChild(objectTable);

                var oldWrap = document.getElementById('object-table-wrap');
                if (oldWrap) {
                  container.removeChild(oldWrap);
                }
                container.insertBefore(objectTableWrap, areaText);
              }
            });
          });
        }
      });
    }
  });
  if (displayCallback) displayCallback(container);
}

function renderNorms(methodId, displayCallback) {
  var container = document.createElement('div');
  container.className = 'container';
  setText(container, 'Loading physical and chemical properties...');

  getJSON(apiURL + 'method/' + methodId + '/error_area', function (err, data) {
    setText(container, '');
    if (err) {
      showCustomAlert('Error loading halusi: ' + err.message);
      setText(container, 'Could not load data.');
    } else {
      var appruvInput = document.createElement('input');
      appruvInput.value = data[0].DOC_APPRUV;
      appruvInput.style.width = '100%';
      appruvInput.style.height = '40px';
      appruvInput.style.marginTop = '4px';

      var errorAreaTableWrap = document.createElement('div');
      errorAreaTableWrap.className = 'error-table-wrap';
      errorAreaTableWrap.id = 'error-table-wrap';
      errorAreaTableWrap.style.marginTop = '8px';
      errorAreaTableWrap.style.marginBottom = '8px';
      var errorAreaTable = document.createElement('table');
      errorAreaTable.className = 'object-table';

      var tableHead = document.createElement('thead');
      var headerRow = document.createElement('tr');
      var headerTitles = ['#', 'Нормативний документ', 'Док. #', 'Дата', 'Місто'];
      var headerClasses = ['id-cell', 'name-cell', 'doc-cell', 'date-cell', 'city-cell'];

      for (var i = 0; i < headerTitles.length; i++) {
        var th = document.createElement('th');
        setText(th, headerTitles[i]);
        if (headerClasses[i]) th.className = headerClasses[i];
        headerRow.appendChild(th);
      }
      tableHead.appendChild(headerRow);
      errorAreaTable.appendChild(tableHead);

      var tableBody = document.createElement('tbody');

      for (var i = 0; i < data.length; i++) {
        var row = document.createElement('tr');
        var idCell = document.createElement('td');
        var nameCell = document.createElement('td');
        var docCell = document.createElement('td');
        var dateCell = document.createElement('td');
        var cityCell = document.createElement('td');

        setText(idCell, i + 1);
        setText(nameCell, data[i].DOCUMENT);
        setText(docCell, data[i].DOC_NUMBER);
        setText(dateCell, formatDateObject(new Date(data[i].DOC_DATE)));
        console.log(data[i].DOC_DATE);
        setText(cityCell, data[i].DOC_CITY);

        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(docCell);
        row.appendChild(dateCell);
        row.appendChild(cityCell);

        tableBody.appendChild(row);
      }

      errorAreaTable.appendChild(tableBody);
      errorAreaTableWrap.appendChild(errorAreaTable);

      container.appendChild(errorAreaTableWrap);
      container.appendChild(document.createElement('br'));
      container.appendChild(appruvInput);
    }
  });
  if (displayCallback) displayCallback(container);
}

function renderNormatyvy(methodId, displayCallback) {
  var container = document.createElement('div');
  container.className = 'container';
  setText(container, 'Loading physical and chemical properties...');

  getJSON(apiURL + 'method/' + methodId + '/substance_area', function (err, substanceData) {
    if (err) {
      showCustomAlert('Error loading halusi: ' + err.message);
      setText(container, 'Could not load data.');
    } else {
      setText(container, '');

      var substanceLabel = document.createElement('label');
      substanceLabel.className = 'substance-label';
      setText(substanceLabel, '3.1 Методика забезпечує вимірювання масової частки');
      var substanceSelect = document.createElement('select');
      substanceSelect.name = 'substance';
      var emptyOption = document.createElement('option');
      emptyOption.value = '';
      setText(emptyOption, '--Оберіть значення--');
      substanceSelect.appendChild(emptyOption);

      for (var i = 0; i < substanceData.length; i++) {
        var substanceOption = document.createElement('option');
        substanceOption.value = substanceData[i].SUBSTANCE_ID;
        setText(substanceOption, substanceData[i].SUBSTANCE);
        substanceSelect.appendChild(substanceOption);
      }

      container.appendChild(substanceLabel);
      container.appendChild(substanceSelect);
      container.appendChild(document.createElement('br'));

      getJSON(apiURL + 'method/' + selectedMethod.ID + '/error_limits', function (err, limitsData) {
        if (err) {
          showCustomAlert('Error loading halusi: ' + err.message);
          setText(container, 'Could not load data.');
        } else {
          var limitsInput = document.createElement('input');
          limitsInput.value = limitsData[0].ERR_LIMITS;
          limitsInput.style.width = '100%';
          limitsInput.style.height = '40px';
          limitsInput.style.marginTop = '4px';

          container.appendChild(limitsInput);

          attachEventCompat(substanceSelect, 'change', function () {
            getJSON(apiURL + 'substance/' + substanceSelect.value + '/error_control', function (err, errorData) {
              if (err) {
                showCustomAlert('Error loading halusi: ' + err.message);
                setText(container, 'Could not load data.');
              } else {
                var errorTableWrap = document.createElement('div');
                errorTableWrap.className = 'error-table-wrap';
                errorTableWrap.id = 'error-table-wrap';
                errorTableWrap.style.float = 'right';
                errorTableWrap.style.marginTop = '8px';
                errorTableWrap.style.marginBottom = '8px';
                var errorTable = document.createElement('table');
                errorTable.className = 'object-table';

                var tableHead = document.createElement('thead');
                var headerRow = document.createElement('tr');
                var headerTitles = ['#', 'Об`єкту аналізу', 'З', 'По', 'Збіжність', 'Похибка'];
                var headerClasses = ['id-cell', 'name-cell', 'from-cell', 'to-cell', 'match-cell', 'fail-cell'];

                for (var i = 0; i < headerTitles.length; i++) {
                  var th = document.createElement('th');
                  setText(th, headerTitles[i]);
                  if (headerClasses[i]) th.className = headerClasses[i];
                  headerRow.appendChild(th);
                }
                tableHead.appendChild(headerRow);
                errorTable.appendChild(tableHead);

                var tableBody = document.createElement('tbody');

                for (var i = 0; i < errorData.length; i++) {
                  var row = document.createElement('tr');
                  var idCell = document.createElement('td');
                  var nameCell = document.createElement('td');
                  var fromCell = document.createElement('td');
                  var toCell = document.createElement('td');
                  var matchCell = document.createElement('td');
                  var failCell = document.createElement('td');

                  setText(idCell, i + 1);
                  setText(nameCell, errorData[i].OBJECT);
                  setText(fromCell, errorData[i].MIN_VALUE);
                  setText(toCell, errorData[i].MAX_VALUE);
                  setText(matchCell, errorData[i].ACCURACY);
                  setText(failCell, errorData[i].ERROR);

                  row.appendChild(idCell);
                  row.appendChild(nameCell);
                  row.appendChild(fromCell);
                  row.appendChild(toCell);
                  row.appendChild(matchCell);
                  row.appendChild(failCell);

                  tableBody.appendChild(row);
                }

                errorTable.appendChild(tableBody);
                errorTableWrap.appendChild(errorTable);

                var oldWrap = document.getElementById('error-table-wrap');
                if (oldWrap) {
                  container.removeChild(oldWrap);
                }
                container.appendChild(errorTableWrap);
              }
            });
          });
        }
      });
    }
  });
  if (displayCallback) displayCallback(container);
}

function render(methodId, displayCallback) {
  var container = document.createElement('div');
  container.className = 'container';
  setText(container, 'Loading physical and chemical properties...');

  getJSON(apiURL + 'method/' + methodId + '/', function (err, data) {
    setText(container, '');
    if (err) {
      showCustomAlert('Error loading halusi: ' + err.message);
      setText(container, 'Could not load data.');
    } else {}
  });
  if (displayCallback) displayCallback(container);
}

/**
 * Fetches all methods from the API.
 * @param {function} callback - Callback function (err, methods).
 */
function getMethods(callback) {
  getJSON(apiURL + 'method', callback);
}

var currentlySelectedRow = null;

/**
 * Fills the methods table with data.
 * @param {Array<object>} methods - Array of method objects.
 */
function fillTable(methods) {
  var methodsTableParent = getFirstElementByClassName(document, 'methods-table-wrapper');
  if (!methodsTableParent) {
    showCustomAlert('Methods table wrapper not found.');
    return;
  }
  var methodsTable = methodsTableParent.getElementsByTagName('table')[0];
  if (!methodsTable) {
    showCustomAlert('Methods table not found within wrapper.');
    return;
  }
  var methodsTableBody = methodsTable.getElementsByTagName('tbody')[0];

  if (!methodsTableBody) {
    showCustomAlert('Methods table body not found!');
    return;
  }

  while (methodsTableBody.firstChild) {
    methodsTableBody.removeChild(methodsTableBody.firstChild);
  }

  if (!methods || methods.length === 0) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    setText(td, 'No methods found.');
    tr.appendChild(td);
    var emptyTd = document.createElement('td');
    tr.appendChild(emptyTd);
    methodsTableBody.appendChild(tr);
    return;
  }

  for (var i = 0; i < methods.length; i++) {
    var method = methods[i];
    var tr = document.createElement('tr');

    var idCell = document.createElement('td');
    idCell.className = 'id-cell';
    setText(idCell, method.MTHD_NUMBER || 'N/A');
    tr.appendChild(idCell);

    var nameCell = document.createElement('td');
    nameCell.className = 'name-cell';
    setText(nameCell, method.NAME || 'Unnamed Method');
    tr.appendChild(nameCell);

    (function (methodCopy, rowElement) {
      attachEventCompat(rowElement, 'click', function () {
        if (currentlySelectedRow) {
          currentlySelectedRow.className = currentlySelectedRow.className.replace(' active', '');
        }
        rowElement.className += ' active';
        currentlySelectedRow = rowElement;
        selectedMethod = methodCopy;
        fillDetails(methodCopy);
        setupInfoTabs(1);
      });
    })(method, tr);

    methodsTableBody.appendChild(tr);
  }
}

/**
 * Fills the details section with data from the selected method.
 * @param {object} method - The selected method object.
 */
function fillDetails(method) {
  var approveInfo = document.getElementById('approved-info');
  var orderNumberInput = document.getElementById('order-number-info');
  var orderDateInput = document.getElementById('order-date-info');

  if (approveInfo) approveInfo.value = method.APPROVAL || '';
  if (orderNumberInput) orderNumberInput.value = method.ORDER_NO || '';

  if (orderDateInput) {
    var orderDtString = method.ORDER_DT;
    if (orderDtString) {
      var parsedDate = new Date(orderDtString);
      if (!isNaN(parsedDate.getTime())) {
        orderDateInput.value = formatDateObject(parsedDate);
      } else {
        var match = orderDtString.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) {
          orderDateInput.value = match[3] + '.' + match[2] + '.' + match[1];
        } else {
          orderDateInput.value = orderDtString;
        }
      }
    } else {
      orderDateInput.value = '';
    }
  }
}

getMethods(function (err, methods) {
  if (err) {
    showCustomAlert('Error fetching methods: ' + err.message);
    var methodsTableBody = getFirstElementByClassName(document, 'methods');
    if (methodsTableBody) methodsTableBody = methodsTableBody.getElementsByTagName('tbody')[0];
    if (methodsTableBody) {
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      setText(td, 'Could not load methods.');
      tr.appendChild(td);
      var emptyTd = document.createElement('td');
      tr.appendChild(emptyTd);
      methodsTableBody.appendChild(tr);
    }
  } else {
    fillTable(methods);
  }
});
