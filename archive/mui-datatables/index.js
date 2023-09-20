import MUIDataTable from 'mui-datatables';
import routerPagination from './routerPagination';
import textLabels from './textLabels';

export default routerPagination(textLabels(MUIDataTable));
