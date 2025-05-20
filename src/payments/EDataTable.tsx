// EDataTable.tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState, useEffect } from "react"
import { columns, Payment, MyTableMeta } from "@/payments/columns" // Import MyTableMeta

interface EDataTableProps {
  title: string
  initialData: Payment[]
  onDataUpdate?: (updatedData: Payment[]) => void
}

export default function EDataTable({
  title,
  initialData,
  onDataUpdate,
}: EDataTableProps) {
  const [data, setData] = useState<Payment[]>(initialData)

  const updateData = (rowIndex: number, columnId: string, value: any) => {
    setData(old =>
      old.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    )
  }

  const table = useReactTable<Payment>({
    // Specify the data type for useReactTable
    data,
    columns: columns as ColumnDef<Payment>[], // Cast to ensure correct type
    getCoreRowModel: getCoreRowModel(),
    // Assign the meta property with your custom type
    meta: {
      updateData,
    } as MyTableMeta, // Cast the meta object to your custom type
  })

  useEffect(() => {
    onDataUpdate?.(data)
  }, [data, onDataUpdate])

  const handleAddNewRow = () => {
    const newRow: Payment = {
      id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: "",
      email: "",
      amount: 0,
      status: "pending",
    }
    setData(prev => [newRow, ...prev])
  }

  console.log("data", data)

  return (
    <div>
      <Button onClick={handleAddNewRow} className="mb-4">
        Add new
      </Button>
      <div className="rounded-md border">
        <Table>
          <TableCaption>{title}</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
