import type { ReactNode } from "react";

export type TableColumn<T> = {
    key: keyof T;
    header: ReactNode;
    render?: (row: T) => ReactNode;
};

type TableProps<T> = {
    columns: TableColumn<T>[];
    data: T[];
    emptyState?: ReactNode;
    getRowKey?: (row: T, index: number) => string | number;
};

export const Table = <T,>({ columns, data, emptyState, getRowKey }: TableProps<T>) => {
    if (data.length === 0) {
        return emptyState ? <>{emptyState}</> : null;
    }

    return (
        <table className="w-full border-collapse border border-gray-200">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={String(column.key)} className="border border-gray-200 px-3 py-2 text-left">
                            {column.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={getRowKey ? getRowKey(row, rowIndex) : rowIndex} className="odd:bg-gray-50">
                        {columns.map((column) => (
                            <td key={String(column.key)} className="border border-gray-200 px-3 py-2 align-top">
                                {column.render ? column.render(row) : (row[column.key] as ReactNode)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
