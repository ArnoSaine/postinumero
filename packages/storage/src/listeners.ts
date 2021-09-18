import get from '@postinumero/map-get-with-default';

const listeners = new Map();

export default (key: Storage) => get(listeners, key, () => new Map());
