import { createElement } from '../render';

const createDestinationSectionTemplate = ({description, images}) => {
  const imagesTemplate = (images && images.length)
    ? Array.from(images, (imageSrc) => (`<img class="event__photo" src="${imageSrc}" alt="Event photo">`)).join('')
    : '';

  const photosContainerTemplate = (images && images.length)
    ? `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${imagesTemplate}
      </div>
    </div>`
    : '';

  const isHaveDescription = Boolean(description);
  const isHavePhotos = Boolean(photosContainerTemplate);

  return (isHaveDescription || isHavePhotos)
    ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${photosContainerTemplate}
    </section>`
    : '';
};

export default class DestinationComponent {
  #element = null;
  #destination = null;

  constructor(event) {
    this.#destination = event;
  }

  get element() {
    if (this.#element === null) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createDestinationSectionTemplate(this.#destination);
  }

  removeElement() {
    this.#element = null;
  }
}
