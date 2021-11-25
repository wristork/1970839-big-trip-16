export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend' 
};

export const renderTemplate = (container, template, position = RenderPosition.BEFOREEND) => {
  return container.insertAdjacentHTML(position, template);
}