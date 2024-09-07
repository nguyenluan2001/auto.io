/* eslint-disable import/no-cycle */
import { merge } from 'lodash';
import Autocomplete from './Autocomplete';
import Backdrop from './Backdrop';
import Button from './Button';
import Card from './Card';
import IconButton from './IconButton';
import Input from './Input';
import Link from './Link';
import Lists from './Lists';
import Paper from './Paper';
import Table from './Table';
import Tabs from './Tabs';
import Tooltip from './Tooltip';
import Typography from './Typography';
import Menu from './Menu';
import TextField from './TextField';
import Global from './Global';

// ----------------------------------------------------------------------

const ComponentsOverrides = merge(
  Global,
  Menu,
  TextField,
  Button,
  Autocomplete
);
export default ComponentsOverrides;
