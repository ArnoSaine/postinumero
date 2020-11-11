# @postinumero/use-pager-query-param

Hook for syncing a pager component with a URL query parameter.

`page = 0` maps to empty query parameter (or `?page=1`), `page = 1` maps to `?page=2` etc.

## API

### `usePagerQueryParam(name: string)`

```js
import usePagerQueryParam from '@postinumero/use-pager-query-param';

export default function QueryParamPager() {
  const [page, setPage] = usePagerQueryParam('page');
  return <Pager page={page} onChangePage={setPage} />;
}
```
