// payments/columns.ts

import { ColumnDef, TableMeta } from "@tanstack/react-table" // Import TableMeta
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

export interface Payment {
  id: string
  name: string
  email: string
  amount: number
  status: string
}

// Define your custom TableMeta interface
export interface MyTableMeta {
  updateData: (rowIndex: number, columnId: string, value: any) => void
}

// ... (rest of your columns array remains the same)
export const columns: ColumnDef<Payment, any>[] = [
  // Note: 'any' for value type
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => String(getValue()),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, getValue, table }) => {
      // Correctly type table.options.meta
      const meta = table.options.meta as MyTableMeta
      const initialValue = getValue() as string
      const [value, setValue] = useState(initialValue)

      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])

      const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
        meta?.updateData(row.index, "name", event.target.value) // Use meta here
      }
      return <Input value={value} onChange={onChange} />
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row, getValue, table }) => {
      const meta = table.options.meta as MyTableMeta
      const initialValue = getValue() as string
      const [value, setValue] = useState(initialValue)
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])
      const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
        meta?.updateData(row.index, "email", event.target.value)
      }
      return <Input value={value} onChange={onChange} />
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row, getValue, table }) => {
      const meta = table.options.meta as MyTableMeta
      const initialValue = getValue() as number
      const [value, setValue] = useState(initialValue)
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])
      const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value, 10)
        setValue(isNaN(newValue) ? 0 : newValue)
        meta?.updateData(row.index, "amount", isNaN(newValue) ? 0 : newValue)
      }
      return <Input type="number" value={value} onChange={onChange} />
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row, getValue, table }) => {
      const meta = table.options.meta as MyTableMeta
      const initialValue = getValue() as string
      const [value, setValue] = useState(initialValue)
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])
      const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
        meta?.updateData(row.index, "status", event.target.value)
      }
      return <Input value={value} onChange={onChange} />
    },
  },
]
