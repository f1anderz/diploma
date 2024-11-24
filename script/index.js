import {formatDate} from './utils/formatDate.js';

getMethods();

let methods;

async function getMethods() {
  try {
    const response = await fetch('http://localhost:3000/method');
    methods = await response.json();

    fillTable();

  } catch (error) {
    console.error(error.message);
  }
}

function fillTable() {
  const methodsTable = document.querySelector('.methods tbody');
  methodsTable.innerHTML = '';
  for (const method of methods) {
    const tr = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = method.MTHD_NUMBER;
    idCell.className = 'id-cell';
    tr.appendChild(idCell);

    const nameCell = document.createElement('td');
    nameCell.textContent = method.NAME;
    nameCell.className = 'name-cell';
    tr.appendChild(nameCell);

    tr.addEventListener('click', () => handleMethodSelect(method));

    methodsTable.appendChild(tr);

  }
}

let selectedMethod = 1;

function handleMethodSelect(method) {
  fillDetails(method);
}

function fillDetails(method) {
  selectedMethod = method.ID;
  const approveInfo = document.querySelector('.details .approved label .info');
  approveInfo.innerHTML = '';
  approveInfo.value = method.APPROVAL;
  const orderNumber = document.querySelector('.details .order-number label .info');
  orderNumber.innerHTML = '';
  orderNumber.value = method.ORDER_NO;
  const orderDate = document.querySelector('.details .order-date label .info');
  orderDate.innerHTML = '';
  orderDate.value = formatDate(new Date(method.ORDER_DT));
  changeSelectedSubTab(2); // TODO change to 1
}

const tabOptions = {
  1: [
    {id: 1, label: "1 ФІЗИКО-ХІМІЧНІ ВЛАСТИВОСТІ", handler: renderPhysChemPropertiesTab},
    {id: 2, label: "2 РЕКОМЕНДОВАНІ ГІГІЄНІЧНІ НОРМАТИВИ", handler: renderHygienicStandardsTab},
  ],
  2: [
    {id: 1, label: "1 ГАЛУЗЬ ВИКОРИСТАННЯ"},
    {id: 2, label: "2 НОРМИ ПОХИБКИ ВИМІРЮВАНЬ"},
    {id: 3, label: "3 ХАРАКТЕРИСТИКИ ПОХИБКИ ВИМІРЮВАНЬ І НОРМАТИВИ ОПЕРАТИВНОГО КОНТРОЛЮ"},
    {id: 4, label: "4 ЗАСОБИ ВИМІРЮВАЛЬНОЇ ТЕХНІКИ, ДОПОМІЖНЕ ОБЛАДНАННЯ, ПОСУД, РЕАКТИВИ ТА МАТЕРІАЛИ"},
    {id: 5, label: "5 МЕТОДИКА ВИМІРЮВАННЯ"},
    {id: 6, label: "6 ВИМОГИ БЕЗПЕКИ"},
    {id: 7, label: "7 ВИМОГИ ДО КВАЛІФІКАЦІЇ ОПЕРАТОРІВ"},
    {id: 8, label: "8 УМОВИ ПРОВЕДЕННЯ ВИМІРЮВАНЬ"},
    {id: 9, label: "9 ПІДГОТОВКА ДО ВИКОНАННЯ ВИМІРЮВАНЬ"},
    {id: 10, label: "10 ВИМІРЮВАННЯ"},
    {id: 11, label: "11 ОБРОБКА РЕЗУЛЬТАТІВ ВИМІРЮВАНЬ"},
    {id: 12, label: "12 КОНТРОЛЬ ПОХИБКИ РЕЗУЛЬТАТІВ ВИМІРЮВАНЬ"},
    {id: 13, label: "13 ОФОРМЛЕННЯ РЕЗУЛЬТАТІВ ВИМІРЮВАНЬ"},
  ]
}

let selectedTab = 1;
let selectedSubTab = 1;
const select = document.querySelector('#select_tabs');
const tabs = document.querySelector('#tabs');
select.addEventListener('change', changeSelectedTab);

changeSelectedTab();

function changeSelectedTab() {
  selectedTab = select.value;
  tabs.innerHTML = '';
  const displayTabs = tabOptions[selectedTab];
  for (const displayTab of displayTabs) {
    const tab = document.createElement('div');
    tab.textContent = displayTab.label;
    tab.addEventListener('click', () => {
      changeSelectedSubTab(displayTab.id)
    });
    tab.className = 'tab';
    tabs.appendChild(tab);
  }
}


async function changeSelectedSubTab(subTabId) {
  const infoTab = document.querySelector('.info-wrapper');
  selectedSubTab = subTabId;
  infoTab.innerHTML = '';
  const currentTab = tabOptions[selectedTab].find(subTab => subTab.id === selectedSubTab);

  const header = document.createElement('div');
  header.textContent = currentTab.label;
  infoTab.appendChild(header);
  infoTab.appendChild(await currentTab.handler());
}

changeSelectedSubTab(1);

function renderPhysChemPropertiesTab() {
  return document.createElement('div')
}

async function renderHygienicStandardsTab() {
  const container = document.createElement('div');
  container.className = 'container';

  const propertiesTable = document.createElement('table');
  propertiesTable.className = 'hyg-stand-table'

  const tableHead = document.createElement('thead');
  const idTh = document.createElement('th');
  idTh.textContent = '#';
  idTh.className = 'id-cell';

  const targetTh = document.createElement('th');
  targetTh.textContent = 'Цільова речовина';
  targetTh.className = 'target-cell';

  const objectTh = document.createElement('th');
  objectTh.textContent = 'Об\'єкт аналізу';
  objectTh.className = 'object-cell';

  const mdrTh = document.createElement('th');
  mdrTh.textContent = 'МДР';
  mdrTh.className = 'mdr-cell';

  const mdkTh = document.createElement('th');
  mdkTh.textContent = 'МКВ';
  mdkTh.className = 'mdk-cell';

  tableHead.appendChild(idTh);
  tableHead.appendChild(targetTh);
  tableHead.appendChild(objectTh);
  tableHead.appendChild(mdrTh);
  tableHead.appendChild(mdkTh);

  propertiesTable.appendChild(tableHead);

  const tableBody = document.createElement('tbody');

  const standards = await getHygienicStandards();
  const currentMethod = standards[0].CHRM_DESCR;

  for (const standard of standards) {
    const tableRow = document.createElement('tr');
    const idTd = document.createElement('td');
    idTd.textContent = standard.ID;

    const targetTd = document.createElement('td');
    targetTd.textContent = standard.SUBSTANCE;

    const objectTd = document.createElement('td');
    objectTd.textContent = standard.OBJECT;

    const mdrTd = document.createElement('td');
    mdrTd.textContent = standard.MDR_VALUE;

    const mdkTd = document.createElement('td');
    mdkTd.textContent = standard.MDK_VALUE;

    tableRow.appendChild(idTd);
    tableRow.appendChild(targetTd);
    tableRow.appendChild(objectTd);
    tableRow.appendChild(mdrTd);
    tableRow.appendChild(mdkTd);

    tableBody.appendChild(tableRow);
  }

  propertiesTable.appendChild(tableBody);
  container.appendChild(propertiesTable);

  const methodField = document.createElement('div');
  methodField.textContent = currentMethod;
  methodField.className = 'method-name';
  container.appendChild(methodField);

  return container;
}

async function getHygienicStandards() {
  const response = await fetch(`http://localhost:3000/method/${selectedMethod}/hygienic_standards`);
  return await response.json();
}
