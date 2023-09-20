import { injectIntl } from 'react-intl';
import messages from './intl/messages.properties';

export default (MUIDataTable) =>
  injectIntl(({ intl: { locale, formatMessage }, ...props }) => (
    <MUIDataTable
      {...props}
      options={{
        ...props?.options,
        textLabels: ['fi'].includes(locale.split('-')[0])
          ? {
              body: {
                noMatch: formatMessage({ id: messages.bodyNoMatch }),
                toolTip: formatMessage({ id: messages.bodyToolTip }),
              },
              pagination: {
                next: formatMessage({ id: messages.paginationNext }),
                previous: formatMessage({ id: messages.paginationPrevious }),
                rowsPerPage: formatMessage({
                  id: messages.paginationRowsPerPage,
                }),
                displayRows: formatMessage({
                  id: messages.paginationDisplayRows,
                }),
              },
              toolbar: {
                search: formatMessage({ id: messages.toolbarSearch }),
                downloadCsv: formatMessage({ id: messages.toolbarDownloadCsv }),
                print: formatMessage({ id: messages.toolbarPrint }),
                viewColumns: formatMessage({ id: messages.toolbarViewColumns }),
                filterTable: formatMessage({ id: messages.toolbarFilterTable }),
              },
              filter: {
                all: formatMessage({ id: messages.filterAll }),
                title: formatMessage({ id: messages.filterTitle }),
                reset: formatMessage({ id: messages.filterReset }),
              },
              viewColumns: {
                title: formatMessage({ id: messages.viewColumnsTitle }),
                titleAria: formatMessage({ id: messages.viewColumnsTitleAria }),
              },
              selectedRows: {
                text: formatMessage({ id: messages.selectedRowsText }),
                delete: formatMessage({ id: messages.selectedRowsDelete }),
                deleteAria: formatMessage({
                  id: messages.selectedRowsDeleteAria,
                }),
              },
            }
          : undefined,
      }}
    />
  ));
