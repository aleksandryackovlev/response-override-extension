import React from 'react';

interface DatagridProps<T extends { id: string }> {
  items: T[];
}

export const Datagrid = ({ items }: DatagridProps) => {
  return <div className="text-sky-700">Datagrid</div>;
};
