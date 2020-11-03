import ListItem from '@material-ui/core/ListItem';
import { Link } from 'react-router-dom';

export default function ListItemLink(props) {
  return <ListItem button component={Link} {...props} />;
}
