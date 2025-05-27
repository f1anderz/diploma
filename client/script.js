if (!window.JSON || !window.JSON.parse || !window.JSON.stringify) {
  document.write(
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/json3/3.3.3/json3.min.js"><\/script>'
  );
}

var apiURL = 'http://34.227.205.75:3000/';

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

function setText(el, text) {
  if (el) {
    if (typeof el.textContent !== 'undefined') {
      el.textContent = text;
    } else {
      el.innerText = text;
    }
  }
}

function attachEventCompat(el, eventName, handler) {
  if (el.attachEvent) {
    el.attachEvent('on' + eventName, handler);
  } else {
    el.addEventListener(eventName, handler, false);
  }
}

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

function setupInfoTabs(view) {
  var tabsContainer = document.getElementById('tabs');
  var infoWrapper = getFirstElementByClassName(document, 'info-wrapper');

  if (!tabsContainer || !infoWrapper) {
    return;
  }

  tabsContainer.innerHTML = '';
  infoWrapper.innerHTML = '';

  var tabsData;
  var header = document.createElement('p');
  header.style.width = '100%';
  header.style.textAlign = 'center';
  if (Number(view) === 1) {
    tabsData = [
      {
        name: '1 ФІЗИКО-ХІМІЧНІ ВЛАСТИВОСТІ',
        id: 'physChem',
        renderer: function () {
          renderPhysChemPropertiesTab(selectedMethod.ID, function (contentElement) {
            setText(header, '1 ФІЗИКО-ХІМІЧНІ ВЛАСТИВОСТІ');
            infoWrapper.innerHTML = '';
            infoWrapper.appendChild(header);
            infoWrapper.appendChild(contentElement);
          });
        },
      },
      {
        name: '2 РЕКОМ. ГІГІЄНІЧНІ НОРМАТИВИ',
        id: 'hygStandards',
        renderer: function () {
          renderHygienicStandardsTab(selectedMethod.ID, function (contentElement) {
            setText(header, '2 РЕКОМ. ГІГІЄНІЧНІ НОРМАТИВИ');
            infoWrapper.innerHTML = '';
            infoWrapper.appendChild(header);
            infoWrapper.appendChild(contentElement);
          });
        },
      },
    ];
  } else if (Number(view) === 2) {
    tabsData = [
      {
        name: '1 ГАЛУЗЬ ВИКОРИСТАННЯ',
        id: '1',
        renderer: function () {
          renderUsingArea(selectedMethod.ID, function (contentElement) {
            setText(header, '1 ГАЛУЗЬ ВИКОРИСТАННЯ');
            infoWrapper.innerHTML = '';
            infoWrapper.appendChild(header);
            infoWrapper.appendChild(contentElement);
          });
        },
      },
      {
        name: '2 НОРМИ ПОХИБКИ ВИМІРЮВАНЬ',
        id: '2',
        renderer: function () {
          renderNorms(selectedMethod.ID, function (contentElement) {
            setText(header, '2 НОРМИ ПОХИБКИ ВИМІРЮВАНЬ');
            infoWrapper.innerHTML = '';
            infoWrapper.appendChild(header);
            infoWrapper.appendChild(contentElement);
          });
        },
      },
      {
        name: '3 ХАРАКТЕРИСТИКИ ПОХИБКИ ВИМІРЮВАНЬ І НОРМАТИВИ ОПЕРАТИВНОГО КОНТРОЛЮ',
        id: '3',
        renderer: function () {
          renderNormatyvy(selectedMethod.ID, function (contentElement) {
            setText(
              header,
              '3 ХАРАКТЕРИСТИКИ ПОХИБКИ ВИМІРЮВАНЬ І НОРМАТИВИ ОПЕРАТИВНОГО КОНТРОЛЮ'
            );
            infoWrapper.innerHTML = '';
            infoWrapper.appendChild(header);
            infoWrapper.appendChild(contentElement);
          });
        },
      },
      {
        name: '4 ЗАСОБИ ВИМІРЮВАЛЬНОЇ ТЕХНІКИ, ДОПОМІЖНЕ ОБЛАДНАННЯ, ПОСУД, РЕАКТИВИ ТА МАТЕРІАЛИ',
        id: '4',
        renderer: function () {
          renderEquipment(selectedMethod.ID, function (contentElement) {
            setText(
              header,
              '4 ЗАСОБИ ВИМІРЮВАЛЬНОЇ ТЕХНІКИ, ДОПОМІЖНЕ ОБЛАДНАННЯ, ПОСУД, РЕАКТИВИ ТА МАТЕРІАЛИ'
            );
            infoWrapper.innerHTML = '';
            infoWrapper.appendChild(header);
            infoWrapper.appendChild(contentElement);
          });
        },
      },
      {
        name: '5 МЕТОДИКА ВИМІРЮВАННЯ',
        id: '5',
        renderer: function () {
          renderMethod(selectedMethod.ID, function (contentElement) {
            setText(header, '5 МЕТОДИКА ВИМІРЮВАННЯ');
            infoWrapper.innerHTML = '';
            infoWrapper.appendChild(header);
            infoWrapper.appendChild(contentElement);
          });
        },
      },
      {
        name: '6 ВИМОГИ БЕЗПЕКИ',
        id: '6',
        renderer: function () {
          renderSafety(selectedMethod.ID, function (contentElement) {
            setText(header, '6 ВИМОГИ БЕЗПЕКИ');
            infoWrapper.innerHTML = '';
            infoWrapper.appendChild(header);
            infoWrapper.appendChild(contentElement);
          });
        },
      },
      {
        name: '7 ВИМОГИ ДО КВАЛІФІКАЦІЇ ОПЕРАТОРІВ',
        id: '7',
        renderer: function () {
          renderSkills(function (contentElement) {
            setText(header, '7 ВИМОГИ ДО КВАЛІФІКАЦІЇ ОПЕРАТОРІВ');
            infoWrapper.innerHTML = '';
            infoWrapper.appendChild(header);
            infoWrapper.appendChild(contentElement);
          });
        },
      },
      {
        name: '8 УМОВИ ПРОВЕДЕННЯ ВИМІРЮВАНЬ',
        id: '8',
        renderer: function () {
          renderConditions(selectedMethod.ID, function (contentElement) {
            setText(header, '8 УМОВИ ПРОВЕДЕННЯ ВИМІРЮВАНЬ');
            infoWrapper.innerHTML = '';
            infoWrapper.appendChild(header);
            infoWrapper.appendChild(contentElement);
          });
        },
      },
      {
        name: '9 ПІДГОТОВКА ДО ВИКОНАННЯ ВИМІРЮВАНЬ',
        id: '9',
        renderer: function () {},
      },
      {
        name: '10 ВИМІРЮВАННЯ',
        id: '10',
        renderer: function () {},
      },
      {
        name: '11 ОБРОБКА РЕЗУЛЬТАТІВ ВИМІРЮВАНЬ',
        id: '11',
        renderer: function () {},
      },
      {
        name: '12 КОНТРОЛЬ ПОХИБКИ РЕЗУЛЬТАТІВ ВИМІРЮВАНЬ',
        id: '12',
        renderer: function () {},
      },
      {
        name: '13 ОФОРМЛЕННЯ РЕЗУЛЬТАТІВ ВИМІРЮВАНЬ',
        id: '13',
        renderer: function () {},
      },
    ];
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

      var values = [
        standard.ID || '',
        standard.SUBSTANCE || '',
        standard.OBJECT || '',
        standard.MDR_VALUE || '',
        standard.MDK_VALUE || '',
      ];
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

        getJSON(
          apiURL + 'substance/' + select.value + '/preparates',
          function (err, preparateData) {
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

            getJSON(
              apiURL + 'substance/' + select.value + '/synonyms',
              function (err, synonymsData) {
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

                getJSON(
                  apiURL + 'substance/' + select.value + '/solubility',
                  function (err, solubilityData) {
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
                      var headerTitles = ['#', ' Розчинник', 'Розчинність', 'T \u00B0C', 'pH'];
                      var headerClasses = [
                        'id-cell',
                        'solvent-cell',
                        'solubility-cell',
                        'temp-cell',
                        'ph-cell',
                      ];

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

                      getJSON(
                        apiURL + 'substance/' + select.value + '/vapor_pressure',
                        function (err, pressureData) {
                          if (err) {
                            showCustomAlert(
                              'Error loading physical/chemical properties: ' + err.message
                            );
                            setText(container, 'Could not load data.');
                          } else {
                            var pressureTableWrap = document.createElement('div');
                            pressureTableWrap.className = 'pressure-table-wrap';
                            var pressureTable = document.createElement('table');
                            pressureTable.className = 'pressure-table';

                            var tableHead = document.createElement('thead');
                            var headerRow = document.createElement('tr');
                            var headerTitles = ['#', 'Тиск', 'T \u00B0C'];
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
                        }
                      );
                    }
                  }
                );
              }
            );
          }
        );
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
            getJSON(
              apiURL + 'substance/' + substanceSelect.value + '/object_area',
              function (err, objectData) {
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
                  var headerTitles = [
                    '#',
                    'Назва об`єкту аналізу',
                    'min',
                    'max',
                    'Одиниці вимірювання',
                  ];
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
              }
            );
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
      var inputLabel = document.createElement('p');
      setText(inputLabel, 'Затверджені:');
      var appruvInput = document.createElement('input');
      appruvInput.value = data[0].DOC_APPRUV;
      appruvInput.style.width = '100%';
      appruvInput.style.height = '40px';
      appruvInput.style.marginTop = '4px';

      var tableLabel = document.createElement('p');
      setText(tableLabel, 'Норми похибки вимірювань регламентовані:');
      var errorAreaTableWrap = document.createElement('div');
      errorAreaTableWrap.className = 'error-table-wrap';
      errorAreaTableWrap.id = 'error-table-wrap';
      errorAreaTableWrap.style.marginTop = '8px';
      errorAreaTableWrap.style.marginBottom = '8px';
      errorAreaTableWrap.style.width = '100%';
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

      container.appendChild(tableLabel);
      container.appendChild(errorAreaTableWrap);
      container.appendChild(inputLabel);
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
            getJSON(
              apiURL + 'substance/' + substanceSelect.value + '/error_control',
              function (err, errorData) {
                if (err) {
                  showCustomAlert('Error loading halusi: ' + err.message);
                  setText(container, 'Could not load data.');
                } else {
                  var errorTableWrap = document.createElement('div');
                  errorTableWrap.className = 'error-table-wrap';
                  errorTableWrap.id = 'error-table-wrap';
                  errorTableWrap.style.marginTop = '8px';
                  errorTableWrap.style.marginBottom = '8px';
                  errorTableWrap.style.width = '100%';
                  var errorTable = document.createElement('table');
                  errorTable.className = 'object-table';

                  var tableHead = document.createElement('thead');
                  var headerRow = document.createElement('tr');
                  var headerTitles = ['#', 'Об`єкту аналізу', 'З', 'По', 'Збіжність', 'Похибка'];
                  var headerClasses = [
                    'id-cell',
                    'name-cell',
                    'from-cell',
                    'to-cell',
                    'match-cell',
                    'fail-cell',
                  ];

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
              }
            );
          });
        }
      });
    }
  });
  if (displayCallback) displayCallback(container);
}

function renderEquipment(methodId, displayCallback) {
  var container = document.createElement('div');
  container.className = 'container';
  setText(container, 'Loading equipment properties...');

  getJSON(apiURL + 'method/' + methodId + '/support_equipping', function (err, equipData) {
    setText(container, '');
    if (err) {
      showCustomAlert('Error loading equipment: ' + err.message);
      setText(container, 'Could not load data.');
    } else {
      var equipLabel = document.createElement('p');
      setText(equipLabel, '4.1 Засоби вимірювальної техніки та допоміжнe обладнання');
      var equipTableContainer = document.createElement('div');
      equipTableContainer.style.height = '200px';
      equipTableContainer.style.overflow = 'auto';
      equipTableContainer.style.width = '70%';

      var equipTable = document.createElement('table');
      var tableHead = document.createElement('thead');
      var headerRow = document.createElement('tr');
      var headerTitles = ['#', 'Допоміжне обладнання', 'Док. #'];

      for (var i = 0; i < headerTitles.length; i++) {
        var th = document.createElement('th');
        setText(th, headerTitles[i]);
        headerRow.appendChild(th);
      }
      tableHead.appendChild(headerRow);
      equipTable.appendChild(tableHead);

      var tableBody = document.createElement('tbody');

      for (var i = 0; i < equipData.length; i++) {
        var row = document.createElement('tr');
        var idCell = document.createElement('td');
        var nameCell = document.createElement('td');
        var docCell = document.createElement('td');

        setText(idCell, i + 1);
        setText(nameCell, equipData[i].NAMING);
        setText(docCell, equipData[i].ACCORDING_TO);

        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(docCell);

        tableBody.appendChild(row);
      }

      equipTable.appendChild(tableBody);
      equipTableContainer.appendChild(equipTable);

      getJSON(apiURL + 'method/' + methodId + '/chemical_glassware', function (err, glassData) {
        setText(container, '');
        if (err) {
          showCustomAlert('Error loading glassware: ' + err.message);
          setText(container, 'Could not load data.');
        } else {
          var glassLabel = document.createElement('p');
          setText(glassLabel, '4.2 Посуд');
          var glassTableContainer = document.createElement('div');
          glassTableContainer.style.height = '200px';
          glassTableContainer.style.marginTop = '4px';
          glassTableContainer.style.overflow = 'auto';
          glassTableContainer.style.width = '70%';

          var glassTable = document.createElement('table');
          var tableHead = document.createElement('thead');
          var headerRow = document.createElement('tr');
          var headerTitles = ['#', 'Хімічний посуд', 'Док. #'];

          for (var i = 0; i < headerTitles.length; i++) {
            var th = document.createElement('th');
            setText(th, headerTitles[i]);
            headerRow.appendChild(th);
          }
          tableHead.appendChild(headerRow);
          glassTable.appendChild(tableHead);

          var tableBody = document.createElement('tbody');

          for (var i = 0; i < glassData.length; i++) {
            var row = document.createElement('tr');
            var idCell = document.createElement('td');
            var nameCell = document.createElement('td');
            var docCell = document.createElement('td');

            setText(idCell, i + 1);
            setText(nameCell, glassData[i].NAMING);
            setText(docCell, glassData[i].ACCORDING_TO);

            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(docCell);

            tableBody.appendChild(row);
          }

          glassTable.appendChild(tableBody);
          glassTableContainer.appendChild(glassTable);

          getJSON(apiURL + 'method/' + methodId + '/chemical_agents', function (err, agentsData) {
            setText(container, '');
            if (err) {
              showCustomAlert('Error loading agents: ' + err.message);
              setText(container, 'Could not load data.');
            } else {
              var agentsLabel = document.createElement('p');
              setText(agentsLabel, '4.3 Реактиви та матеріали');
              var agentsTableContainer = document.createElement('div');
              agentsTableContainer.style.height = '200px';
              agentsTableContainer.style.marginTop = '4px';
              agentsTableContainer.style.overflow = 'auto';
              agentsTableContainer.style.width = '70%';
              var agentsTable = document.createElement('table');
              var tableHead = document.createElement('thead');
              var headerRow = document.createElement('tr');
              var headerTitles = ['#', 'Реактивний матеріал', 'Док. #'];

              for (var i = 0; i < headerTitles.length; i++) {
                var th = document.createElement('th');
                setText(th, headerTitles[i]);
                headerRow.appendChild(th);
              }
              tableHead.appendChild(headerRow);
              agentsTable.appendChild(tableHead);

              var tableBody = document.createElement('tbody');

              for (var i = 0; i < agentsData.length; i++) {
                var row = document.createElement('tr');
                var idCell = document.createElement('td');
                var nameCell = document.createElement('td');
                var docCell = document.createElement('td');

                setText(idCell, i + 1);
                setText(nameCell, agentsData[i].NAMING);
                setText(docCell, agentsData[i].ACCORDING_TO);

                row.appendChild(idCell);
                row.appendChild(nameCell);
                row.appendChild(docCell);

                tableBody.appendChild(row);
              }

              agentsTable.appendChild(tableBody);
              agentsTableContainer.appendChild(agentsTable);

              getJSON(
                apiURL + 'method/' + methodId + '/support_extantion',
                function (err, extantionData) {
                  setText(container, '');
                  if (err) {
                    showCustomAlert('Error loading extantion: ' + err.message);
                    setText(container, 'Could not load data.');
                  } else {
                    var extantionArea = document.createElement('textarea');
                    extantionArea.style.width = '28%';
                    extantionArea.style.height = '608px';
                    extantionArea.style.position = 'absolute';
                    extantionArea.style.right = '0';
                    extantionArea.style.top = '0';
                    extantionArea.value = extantionData[0].ERMISSION;

                    container.appendChild(equipLabel);
                    container.appendChild(equipTableContainer);
                    container.appendChild(glassLabel);
                    container.appendChild(glassTableContainer);
                    container.appendChild(agentsLabel);
                    container.appendChild(agentsTableContainer);

                    container.style.position = 'relative';
                    container.appendChild(extantionArea);
                  }
                }
              );
            }
          });
        }
      });
    }
  });
  if (displayCallback) displayCallback(container);
}

function renderMethod(methodId, displayCallback) {
  var container = document.createElement('div');
  container.className = 'container';
  setText(container, 'Loading methodic...');

  getJSON(apiURL + 'method/' + methodId + '/principle', function (err, princData) {
    setText(container, '');
    if (err) {
      showCustomAlert('Error loading principle: ' + err.message);
      setText(container, 'Could not load data.');
    } else {
      var principleLabel = document.createElement('p');
      setText(principleLabel, '5.1 Принцип методу');
      var principleArea = document.createElement('textarea');
      principleArea.value = princData[0].PRINCIPLE;
      principleArea.style.width = '80%';
      principleArea.style.height = '100px';
      principleArea.style.display = 'block';

      var durationContainer = document.createElement('div');
      durationContainer.style.width = '18%';
      durationContainer.style.marginLeft = '2%';
      durationContainer.style.position = 'absolute';
      durationContainer.style.right = '0';
      durationContainer.style.top = '0';
      var durationLabel = document.createElement('label');
      setText(durationLabel, 'Тривалість одного визначення:');
      var durationInput = document.createElement('input');
      durationInput.value = princData[0].DURATION;
      durationContainer.appendChild(durationLabel);
      durationContainer.appendChild(durationInput);

      getJSON(apiURL + 'method/' + methodId + '/substance_area', function (err, substanceData) {
        setText(container, '');
        if (err) {
          showCustomAlert('Error loading substance area: ' + err.message);
          setText(container, 'Could not load data.');
        } else {
          var selectLabel = document.createElement('p');
          setText(selectLabel, '5.2 Вибірковість методу');
          var selectivityArea = document.createElement('textarea');
          selectivityArea.value = princData[0].SELECTIVITY;
          selectivityArea.style.width = '75%';
          selectivityArea.style.height = '100px';
          selectivityArea.style.display = 'block';
          selectivityArea.style.marginTop = '4px';

          var substanceContainer = document.createElement('div');
          substanceContainer.style.width = '23%';
          substanceContainer.style.height = '100px';
          substanceContainer.style.marginLeft = '2%';
          substanceContainer.style.position = 'absolute';
          substanceContainer.style.top = '124px';
          substanceContainer.style.right = '0';

          var substanceLabel = document.createElement('label');
          substanceLabel.className = 'substance-label';
          setText(substanceLabel, 'Цільова речовина');
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

          substanceContainer.appendChild(substanceLabel);
          substanceContainer.appendChild(substanceSelect);

          getJSON(
            apiURL + 'method/' + methodId + '/strange_substances',
            function (err, strangeData) {
              setText(container, '');
              if (err) {
                showCustomAlert('Error loading strange substances: ' + err.message);
                setText(container, 'Could not load data.');
              } else {
                var strangeSubsContainer = document.createElement('div');
                strangeSubsContainer.style.width = '100%';

                var strangeSubstances = document.createElement('div');
                setText(strangeSubstances, 'Сторонні речовини');
                strangeSubstances.style.width = '15%';

                var strangeSubstancesTableContainer = document.createElement('div');
                strangeSubstancesTableContainer.style.height = '200px';
                strangeSubstancesTableContainer.style.width = '83%';
                strangeSubstancesTableContainer.style.marginTop = '-28px';
                strangeSubstancesTableContainer.style.marginLeft = '15%';
                strangeSubstancesTableContainer.style.overflow = 'auto';
                var strangeSubstancesTable = document.createElement('table');
                var tableHead = document.createElement('thead');
                var headerRow = document.createElement('tr');
                var headerTitles = ['#', 'Стороння речовина', 'Джерело'];

                for (var i = 0; i < headerTitles.length; i++) {
                  var th = document.createElement('th');
                  setText(th, headerTitles[i]);
                  headerRow.appendChild(th);
                }
                tableHead.appendChild(headerRow);
                strangeSubstancesTable.appendChild(tableHead);

                var tableBody = document.createElement('tbody');

                for (var i = 0; i < strangeData.length; i++) {
                  var row = document.createElement('tr');
                  var idCell = document.createElement('td');
                  var nameCell = document.createElement('td');
                  var docCell = document.createElement('td');

                  setText(idCell, i + 1);
                  setText(nameCell, strangeData[i].SUBSTANCE);
                  setText(docCell, strangeData[i].SOURCE);

                  row.appendChild(idCell);
                  row.appendChild(nameCell);
                  row.appendChild(docCell);

                  tableBody.appendChild(row);
                }

                strangeSubstancesTable.appendChild(tableBody);
                strangeSubstancesTableContainer.appendChild(strangeSubstancesTable);

                strangeSubsContainer.appendChild(strangeSubstances);
                strangeSubsContainer.appendChild(strangeSubstancesTableContainer);

                container.style.position = 'relative';
                container.appendChild(principleLabel);
                container.appendChild(principleArea);
                container.appendChild(durationContainer);
                container.appendChild(document.createElement('br'));
                container.appendChild(selectLabel);
                container.appendChild(selectivityArea);
                container.appendChild(substanceContainer);
                container.appendChild(document.createElement('br'));
                container.appendChild(strangeSubsContainer);
              }
            }
          );
        }
      });
    }
  });
  if (displayCallback) displayCallback(container);
}

function renderSafety(methodId, displayCallback) {
  var container = document.createElement('div');
  container.className = 'container';
  setText(container, 'Loading safety requirements properties...');

  getJSON(apiURL + 'method/' + methodId + '/safety_requirements', function (err, safetyData) {
    setText(container, '');
    if (err) {
      showCustomAlert('Error loading safety requirements: ' + err.message);
      setText(container, 'Could not load data.');
    } else {
      var safetyTableContainer = document.createElement('div');
      safetyTableContainer.style.height = '150px';
      safetyTableContainer.style.overflow = 'auto';
      var safetyTable = document.createElement('table');
      var tableHead = document.createElement('thead');
      var headerRow = document.createElement('tr');
      var headerTitles = ['#', 'Вимога'];

      for (var i = 0; i < headerTitles.length; i++) {
        var th = document.createElement('th');
        setText(th, headerTitles[i]);
        headerRow.appendChild(th);
      }
      tableHead.appendChild(headerRow);
      safetyTable.appendChild(tableHead);

      var tableBody = document.createElement('tbody');

      for (var i = 0; i < safetyData.length; i++) {
        var row = document.createElement('tr');
        var idCell = document.createElement('td');
        var nameCell = document.createElement('td');

        setText(idCell, i + 1);
        setText(nameCell, safetyData[i].REQUIREMENT);

        row.appendChild(idCell);
        row.appendChild(nameCell);

        tableBody.appendChild(row);
      }

      safetyTable.appendChild(tableBody);
      safetyTableContainer.appendChild(safetyTable);

      getJSON(apiURL + 'others/required_reglament', function (err, reglamentData) {
        setText(container, '');
        if (err) {
          showCustomAlert('Error loading reglament: ' + err.message);
          setText(container, 'Could not load data.');
        } else {
          var reglamentTableContainer = document.createElement('div');
          reglamentTableContainer.style.height = '150px';
          reglamentTableContainer.style.overflow = 'auto';
          reglamentTableContainer.style.marginTop = '8px';
          var reglamentTable = document.createElement('table');
          var tableHead = document.createElement('thead');
          var headerRow = document.createElement('tr');
          var headerTitles = ['#', 'Нормативний документ', 'Реєстровий код'];

          for (var i = 0; i < headerTitles.length; i++) {
            var th = document.createElement('th');
            setText(th, headerTitles[i]);
            headerRow.appendChild(th);
          }
          tableHead.appendChild(headerRow);
          reglamentTable.appendChild(tableHead);

          var tableBody = document.createElement('tbody');

          for (var i = 0; i < reglamentData.length; i++) {
            var row = document.createElement('tr');
            var idCell = document.createElement('td');
            var nameCell = document.createElement('td');
            var codeCell = document.createElement('td');

            setText(idCell, i + 1);
            setText(nameCell, reglamentData[i].NORM_DOC);
            setText(codeCell, reglamentData[i].DOC_REG);

            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(codeCell);

            tableBody.appendChild(row);
          }

          reglamentTable.appendChild(tableBody);
          reglamentTableContainer.appendChild(reglamentTable);

          container.appendChild(safetyTableContainer);
          container.appendChild(reglamentTableContainer);
        }
      });
    }
  });
  if (displayCallback) displayCallback(container);
}

function renderSkills(displayCallback) {
  var container = document.createElement('div');
  container.className = 'container';
  setText(container, 'Loading operator skills...');

  getJSON(apiURL + 'others/operator_skills', function (err, skillsData) {
    setText(container, '');
    if (err) {
      showCustomAlert('Error loading operator skills: ' + err.message);
      setText(container, 'Could not load data.');
    } else {
      var measurementLabel = document.createElement('div');
      setText(measurementLabel, 'Хроматографічні вимірювання');

      var measurementText = '';
      for (var i = 0; i < skillsData.length; i++) {
        measurementText += skillsData[i].MEASUREMENT + '\n';
      }
      var measurementArea = document.createElement('textarea');
      measurementArea.style.width = '100%';
      measurementArea.style.height = '150px';
      measurementArea.value = measurementText;

      var preparationLabel = document.createElement('div');
      setText(preparationLabel, 'Підготовка проб');

      var preparationText = '';
      for (var i = 0; i < skillsData.length; i++) {
        preparationText += skillsData[i].PREPARATION + '\n';
      }
      var preparationArea = document.createElement('textarea');
      preparationArea.style.width = '100%';
      preparationArea.style.height = '150px';
      preparationArea.style.marginTop = '8px';
      preparationArea.value = preparationText;

      container.appendChild(measurementLabel);
      container.appendChild(measurementArea);
      container.appendChild(preparationLabel);
      container.appendChild(preparationArea);
    }
  });
  if (displayCallback) displayCallback(container);
}

function renderConditions(methodId, displayCallback) {
  var container = document.createElement('div');
  container.className = 'container';
  setText(container, 'Loading measurement conditions...');

  getJSON(apiURL + 'method/' + methodId + '/measurement_conditions', function (err, measureData) {
    setText(container, '');
    if (err) {
      showCustomAlert('Error loading measurement conditions: ' + err.message);
      setText(container, 'Could not load data.');
    } else {
      var prepLabel = document.createElement('span');
      prepLabel.style.verticalAlign = 'top';
      setText(prepLabel, 'Приготування розчинів: ');
      var prepArea = document.createElement('textarea');
      prepArea.style.width = '80%';
      prepArea.style.height = '100px';
      prepArea.value = measureData[0].PREPARATION;

      var measureLabel = document.createElement('span');
      measureLabel.style.verticalAlign = 'top';
      setText(measureLabel, 'Виконання вимірювань: ');
      var measureArea = document.createElement('textarea');
      measureArea.style.width = '80%';
      measureArea.style.height = '100px';
      measureArea.value = measureData[0].MEASUREMENT;

      getJSON(apiURL + 'method/' + methodId + '/room_conditions', function (err, roomData) {
        setText(container, '');
        if (err) {
          showCustomAlert('Error loading room conditions: ' + err.message);
          setText(container, 'Could not load data.');
        } else {
          var roomLabel = document.createElement('p');
          setText(roomLabel, 'Умови в лабораторному приміщенні:');
          var roomTableContainer = document.createElement('div');
          roomTableContainer.style.height = '150px';
          roomTableContainer.style.overflow = 'auto';
          roomTableContainer.style.marginTop = '8px';
          var roomTable = document.createElement('table');
          var tableHead = document.createElement('thead');
          var headerRow = document.createElement('tr');
          var headerTitles = ['#', 'Показник', 'Значення'];

          for (var i = 0; i < headerTitles.length; i++) {
            var th = document.createElement('th');
            setText(th, headerTitles[i]);
            headerRow.appendChild(th);
          }
          tableHead.appendChild(headerRow);
          roomTable.appendChild(tableHead);

          var tableBody = document.createElement('tbody');

          for (var i = 0; i < roomData.length; i++) {
            var row = document.createElement('tr');
            var idCell = document.createElement('td');
            var nameCell = document.createElement('td');
            var codeCell = document.createElement('td');

            setText(idCell, i + 1);
            setText(nameCell, roomData[i].CNDT_INDEX);
            setText(codeCell, roomData[i].CNDT_VALUE);

            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(codeCell);

            tableBody.appendChild(row);
          }

          roomTable.appendChild(tableBody);
          roomTableContainer.appendChild(roomTable);

          container.appendChild(prepLabel);
          container.appendChild(prepArea);
          container.appendChild(document.createElement('br'));
          container.appendChild(measureLabel);
          container.appendChild(measureArea);
          container.appendChild(document.createElement('br'));
          container.appendChild(roomLabel);
          container.appendChild(roomTableContainer);
        }
      });
    }
  });
  if (displayCallback) displayCallback(container);
}

function getMethods(callback) {
  getJSON(apiURL + 'method', callback);
}

var currentlySelectedRow = null;

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
        setupInfoTabs(select_tabs.value);
      });
    })(method, tr);

    methodsTableBody.appendChild(tr);
  }
}

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
