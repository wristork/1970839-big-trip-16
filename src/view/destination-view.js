import AbstractView from './abstract-view';

const createDestinationSectionTemplate = ({description, images}) => {
  const imagesTemplate = (images && images.length)
    ? Array.from(images, (image) => (`<img class="event__photo" src="${image.src}" alt="${image.description}">`)).join('')
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

export default class DestinationComponent extends AbstractView {
  #destination = null;

  constructor(event) {
    super();

    this.#destination = event;
  }

  get template() {
    return createDestinationSectionTemplate(this.#destination);
  }
}
