import { Link } from 'react-router-dom';
import { ICellRendererParams } from '@ag-grid-community/core';

export const LinkCellRenderer = (props: ICellRendererParams) => {
  return <Link to={`/all-drivers/${props.value}/page/1`}>{props.value}</Link>;
};
