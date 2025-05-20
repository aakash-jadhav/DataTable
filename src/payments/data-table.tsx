import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface YourDataType {
  id: string // Assuming each row has a unique ID
  name: string
  amount: string
  status: string
  email: string
  // ... other properties
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  apiEndpoint: string
  onDataUpdate?: (updatedData: TData[]) => void // Optional callback for updated data
}

export function DataTable<TData extends YourDataType, TValue>({
  columns,
  apiEndpoint,
  onDataUpdate,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Fetch data from server
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${apiEndpoint}?page=${pagination.pageIndex + 1}&limit=${
          pagination.pageSize
        }`
      )
      const result = await response.json()

      // Assuming your API returns { data: TData[], total: number }
      setData(result.data)
      setTotalPages(Math.ceil(result.total / pagination.pageSize))
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex, pagination.pageSize, apiEndpoint]) // Include apiEndpoint in dependency array

  const updateData = (
    rowIndex: number,
    columnId: keyof TData,
    value: unknown
  ) => {
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate(data) // Call the callback whenever data changes
    }
  }, [data, onDataUpdate])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: totalPages,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: false,
    meta: {
      updateData, // Pass the updateData function to the table meta
    },
  })

  return (
    <div>
      <Button
        className="my-3 cursor-pointer"
        onClick={() => {
          const newRow: TData = {
            id: Math.random().toString(36).substring(7), // Generate a temporary ID
            name: "",
            amount: "",
            status: "",
            email: "",
          } as TData
          setData(prev => [newRow, ...prev])
        }}
      >
        Add new
      </Button>
      <div className="rounded-md border">
        <Table>
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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

      {/* Pagination controls */}
      <div className="flex items-center justify-end px-2 mt-2">
        <div className="flex items-center space-x-6 lg:space-x-8 ml-auto">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={value => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map(pageSize => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {pagination.pageIndex + 1} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(totalPages - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
