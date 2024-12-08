export async function renderPhysChemPropertiesTab(selectedSubstance) {
  const container = document.createElement('div');
  container.className = 'container';


  const properties = getPhysChemProperties(selectedSubstance);

  return container;
}

async function getPhysChemProperties(selectedSubstance) {
  const response = await fetch(`http://localhost:3000/method/substance/${selectedSubstance}`);
  return await response.json();
}