import Layer from 'express/lib/router/layer';
import { runAsyncWrapper } from './run-async-wrapper';

const handle_request = Layer.prototype.handle_request;

Layer.prototype.handle_request = function () {
  if (!this.isWrapped && this.method) {
    this.handle = runAsyncWrapper(this.handle);

    this.isWrapped = true;
  }

  // eslint-disable-next-line prefer-rest-params
  return handle_request.apply(this, arguments);
};
