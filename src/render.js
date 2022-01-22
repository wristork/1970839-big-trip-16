import AbstractView from './view/abstract-view';

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const render = (parentComponent, childComponent, position = RenderPosition.BEFOREEND) => {
  const parent = (parentComponent instanceof AbstractView)
    ? parentComponent.element
    : parentComponent;

  const child = (childComponent instanceof AbstractView)
    ? childComponent.element
    : childComponent;

  switch(position) {
    case RenderPosition.BEFOREBEGIN:
      parent.before(child);
      break;
    case RenderPosition.AFTERBEGIN:
      parent.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      parent.append(child);
      break;
    case RenderPosition.AFTEREND:
      parent.after(child);
      break;
  }
};

export const createElement = (template) => {
  const temporaryElement = document.createElement('div');
  temporaryElement.innerHTML = template;

  return temporaryElement.firstElementChild;
};

export const replace = (container, newChild, oldChild) => {
  const _container = container instanceof AbstractView ? container.element : container;
  const _newChild = newChild instanceof AbstractView ? newChild.element : newChild;
  const _oldChild = oldChild instanceof AbstractView ? oldChild.element : oldChild;

  _container.replaceChild(_newChild, _oldChild);
};

export const remove = (component) => {
  if (component instanceof AbstractView) {
    component.element.remove();
    component.removeElement();
  } else {
    component.remove();
  }
};
