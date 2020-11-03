import get from '@postinumero/map-get-with-default';

const listeners = new Map();

export default (key) => get.call(listeners, key, () => new Map());
