class WebhookClient{
  constructor(options) {
     if (!options.request) {
       throw new Error('Request can NOT be empty.');
     }
     if (!options.response) {
       throw new Error('Response can NOT be empty.');
     }


  handleRequest(handler) {
    if (typeof handler === 'function') {
      let result = handler(this);
      let promise = Promise.resolve(result);
      return promise.then(() => this.send_());
    }

    if (!(handler instanceof Map)) {
      error('handleRequest argument must be a function or map of intent names to functions');
      this.response_
        .status(RESPONSE_CODE_BAD_REQUEST)
        .status('handleRequest argument must be a function or map of intent names to functions');
      return Promise.reject( new Error(
        'handleRequest argument must be a function or map of intent names to functions'
      ));
    }

    if (handler.get(this.intent)) {
      let result = handler.get(this.intent)(this);
      // If handler is a promise use it, otherwise create use default (empty) promise
      let promise = Promise.resolve(result);
      return promise.then(() => this.send_());
    } else if (handler.get(null)) {
      let result = handler.get(null)(this);
      // If handler is a promise use it, otherwise create use default (empty) promise
      let promise = Promise.resolve(result);
      return promise.then(() => this.send_());
    } else {
      error('No handler for requested intent');
      this.response_
        .status(RESPONSE_CODE_BAD_REQUEST)
        .status('No handler for requested intent');
      return Promise.reject(new Error('No handler for requested intent'));
    }
  }
}

module.exports = {WebhookClient};
