import { Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import usePagerQueryParam from '@postinumero/use-pager-query-param';

export default (MUIDataTable) =>
  ({ options, pagingQueryParam = 'page', ...otherProps }) => {
    const [page, setPage] = usePagerQueryParam(pagingQueryParam);
    return (
      <QueryParamProvider ReactRouterRoute={Route}>
        <MUIDataTable
          {...otherProps}
          options={{
            ...options,
            onChangePage: setPage,
            page,
          }}
        />
      </QueryParamProvider>
    );
  };
