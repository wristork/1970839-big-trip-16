const Method = {
  GET: 'GET',
  PUT: 'PUT'
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get events() {
    return this.#load({ url: 'points' }).then(ApiService.parseResponse);
  }

  get destinations() {
    return this.#load({ url: 'destinations' }).then(ApiService.parseResponse);
  }

  get offers() {
    return this.#load({ url: 'offers' }).then(ApiService.parseResponse);
  }

  updateEvent = async (event) => {
    const response = await this.#load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      { method, body, headers }
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch(err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (event) => {
    const adaptedEvent = {...event,
      'base_price': event.price,
      'date_from': event.date.start,
      'date_to': event.date.end,
      'destination': {
        'description': event.destination.description,
        'name': event.destination.place,
        'pictures': event.destination.images
      },
      'is_favorite': event.isFavorite,
      'type': event.routeType,
    };

    delete adaptedEvent['price'];
    delete adaptedEvent['date'];
    delete adaptedEvent['isFavorite'];
    delete adaptedEvent['routeType'];

    return adaptedEvent;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  };

  static catchError = (err) => {
    throw err;
  };
}
