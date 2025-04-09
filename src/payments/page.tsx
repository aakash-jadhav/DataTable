import { columns } from "./columns"
import { DataTable } from "./data-table"

export default function DemoPage() {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} apiEndpoint="/api/payments" />
    </div>
  )
}
