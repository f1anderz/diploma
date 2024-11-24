import {formatDate} from './utils/formatDate.js';

getMethods()

let methods;

async function getMethods() {
  try {
    // const response = await fetch('http://localhost:3000/method');
    // methods = await response.json();
    methods = await templateMethods();

    fillTable();
    fillTable();
    fillTable();

  } catch (error) {
    console.error(error.message);
  }
}

function fillTable() {
  const methodsTable = document.querySelector('.methods tbody');
  // methodsTable.innerHTML = '';
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

function handleMethodSelect(method) {
  fillDetails(method);
}

function fillDetails(method) {
  const approveInfo = document.querySelector('.details .approved label .info');
  approveInfo.innerHTML = '';
  approveInfo.value = method.APPROVAL;
  const orderNumber = document.querySelector('.details .order-number label .info');
  orderNumber.innerHTML = '';
  orderNumber.value = method.ORDER_NO;
  const orderDate = document.querySelector('.details .order-date label .info');
  orderDate.innerHTML = '';
  orderDate.value = formatDate(new Date(method.ORDER_DT));
}

const tabs = {
  1: {
    1: "1 ФІЗИКО-ХІМІЧНІ ВЛАСТИВОСТІ",
    2: "2 РЕКОМЕНДОВАНІ ГІГІЄНІЧНІ НОРМАТИВИ"
  },
  2: {
    1: "1 ГАЛУЗЬ ВИКОРИСТАННЯ",
    2: "2 НОРМИ ПОХИБКИ ВИМІРЮВАНЬ",
    3: "3 ХАРАКТЕРИСТИКИ ПОХИБКИ ВИМІРЮВАНЬ І НОРМАТИВИ ОПЕРАТИВНОГО КОНТРОЛЮ",
    4: "4 ЗАСОБИ ВИМІРЮВАЛЬНОЇ ТЕХНІКИ, ДОПОМІЖНЕ ОБЛАДНАННЯ, ПОСУД, РЕАКТИВИ ТА МАТЕРІАЛИ",
    5: "5 МЕТОДИКА ВИМІРЮВАННЯ",
    6: "6 ВИМОГИ БЕЗПЕКИ",
    7: "7 ВИМОГИ ДО КВАЛІФІКАЦІЇ ОПЕРАТОРІВ",
    8: "8 УМОВИ ПРОВЕДЕННЯ ВИМІРЮВАНЬ",
    9: "9 ПІДГОТОВКА ДО ВИКОНАННЯ ВИМІРЮВАНЬ",
    10: "10 ВИМІРЮВАННЯ",
    11: "11 ОБРОБКА РЕЗУЛЬТАТІВ ВИМІРЮВАНЬ",
    12: "12КОНТРОЛЬ ПОХИБКИ РЕЗУЛЬТАТІВ ВИМІРЮВАНЬ",
    13: "13 ОФОРМЛЕННЯ РЕЗУЛЬТАТІВ ВИМІРЮВАНЬ",

  }
}
let selectedTab = 1;
const select = document.querySelector('#select_tabs');
select.addEventListener('change', changeSelectedTab);

function changeSelectedTab() {
  selectedTab = select.value;
  console.log(selectedTab)
}

async function templateMethods() {
  return [
    {
      "ID": 1,
      "MTHD_NUMBER": "№ 1282-214",
      "NAME": "МЕТОДИЧНІ ВКАЗІВКИ З ВИЗНАЧЕННЯ СУЛЬФОКСАФЛОРУ В ЧЕРЕШНІ, ПЕРСИКАХ, ТОМАТАХ, ЧЕРЕШНЕВОМУ, ПЕРСИКОВОМУ ТА ТОМАТНОМУ СОКАХ МЕТОДОМ ВИСОКОЕФЕКТИВНОЇ РІДИННОЇ ХРОМАТОГРАФІЇ",
      "APPROVAL": "Міністерство захисту довкілля та природних ресурсів України                                                                                                                            ",
      "ORDER_NO": 42,
      "ORDER_DT": "2024-10-11T21:00:00.000Z"
    },
    {
      "ID": 2,
      "MTHD_NUMBER": "№ 1283-215",
      "NAME": "МЕТОДИЧНІ ВКАЗІВКИ З ВИЗНАЧЕННЯ ФЛУОКСАПІПРОЛІНУ У ВИНОГРАДІ, ТОМАТАХ, ВИНОГРАДНОМУ ТА ТОМАТНОМУ СОКАХ МЕТОДОМ ВИСОКОЕФЕКТИВНОЇ РІДИННОЇ ХРОМАТОГРАФІЇ",
      "APPROVAL": "Міністерство захисту довкілля та природних ресурсів України                                                                                                                            ",
      "ORDER_NO": 43,
      "ORDER_DT": "2024-10-14T21:00:00.000Z"
    },
    {
      "ID": 3,
      "MTHD_NUMBER": "№ 1284-216",
      "NAME": "МЕТОДИЧНІ ВКАЗІВКИ З ВИЗНАЧЕННЯ ДЕЛЬТАМЕТРИНУ В ВИНОГРАДІ ТА  ВИНОГРАДНОМУ СОЦІ МЕТОДОМ ГАЗОРІДИННОЇ ХРОМАТОГРАФІЇ",
      "APPROVAL": "Міністерство захисту довкілля та природних ресурсів України                                                                                                                            ",
      "ORDER_NO": 44,
      "ORDER_DT": "2024-10-22T21:00:00.000Z"
    },
    {
      "ID": 4,
      "MTHD_NUMBER": "№ 1285-217",
      "NAME": "МЕТОДИЧНІ ВКАЗІВКИ З ВИЗНАЧЕННЯ МЕТОБРОМУРОНУ В ЗЕРНІ СОЇ ТА СОЄВІЙ ОЛІЇМЕТОДОМ ГАЗОРІДИННОЇ ХРОМАТОГРАФІЇ",
      "APPROVAL": "Міністерство захисту довкілля та природних ресурсів України                                                                                                                            ",
      "ORDER_NO": 45,
      "ORDER_DT": "2024-10-23T21:00:00.000Z"
    },
    {
      "ID": 5,
      "MTHD_NUMBER": "№ 1286-218",
      "NAME": "МЕТОДИЧНІ ВКАЗІВКИ З ВИЗНАЧЕННЯ НАПРОПАМІДУ В ТОМАТАХ ТА ТОМАТНОМУ СОКУ МЕТОДОМ ГАЗОРІДИННОЇ ХРОМАТОГРАФІЇ",
      "APPROVAL": "Міністерство захисту довкілля та природних ресурсів України                                                                                                                            ",
      "ORDER_NO": 46,
      "ORDER_DT": "2024-10-15T21:00:00.000Z"
    },
    {
      "ID": 6,
      "MTHD_NUMBER": "№ 1287-219",
      "NAME": "МЕТОДИЧНІ ВКАЗІВКИ З ВИЗНАЧЕННЯ ТРИАДИМЕФОНУ І ТЕБУКОНАЗОЛУ В РІПАКОВІЙ ОЛІЇ МЕТОДОМ ГАЗОРІДИННОЇ ХРОМАТОГРАФІЇ",
      "APPROVAL": "Міністерство захисту довкілля та природних ресурсів України                                                                                                                            ",
      "ORDER_NO": 47,
      "ORDER_DT": "2024-10-26T21:00:00.000Z"
    },
    {
      "ID": 7,
      "MTHD_NUMBER": "№ 1285-217",
      "NAME": "МЕТОДИЧНІ ВКАЗІВКИ З ВИЗНАЧЕННЯ ФЛУТРІАФОЛУ В ЯБЛУКАХ ТА ЯБЛУЧНОМУ СОКУ МЕТОДОМ ГАЗОРІДИННОЇ ХРОМАТОГРАФІЇ",
      "APPROVAL": "Міністерство захисту довкілля та природних ресурсів України                                                                                                                            ",
      "ORDER_NO": 48,
      "ORDER_DT": "2024-10-29T22:00:00.000Z"
    }
  ];
}