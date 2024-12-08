export async function renderHygienicStandardsTab(selectedMethod) {
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

  const standards = await getHygienicStandards(selectedMethod);
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

async function getHygienicStandards(selectedMethod) {
  const response = await fetch(`http://localhost:3000/method/${selectedMethod}/hygienic_standards`);
  return await response.json();
}