import { expect } from 'chai';

import { encodeByType, decodeByType } from '../src/utils';

describe('Reflect.getMetadata Date type is Object test', () => {
  it('should encode cursor correctly with object type and date value', () => {
    const date = new Date();
    const encoded = encodeByType('object', date);

    expect(encoded).to.be.a('string');
  });

  it('should decode cursor correctly with object type and date string value', () => {
    const value = new Date().getTime().toString();
    const decoded = decodeByType('object', value);

    expect(decoded).to.be.a('date');
  });
});
