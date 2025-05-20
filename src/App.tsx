import { createServer } from "miragejs"
import EDataTable from "./payments/EDataTable"
import { mockUsers } from "./mockUsers"

createServer({
  routes() {
    this.get("/api/payments", (schema, request) => {
      console.log(schema)
      const page = Number(request.queryParams.page) || 1
      const limit = Number(request.queryParams.limit) || 10
      const start = (page - 1) * limit
      const end = start + limit

      const paginatedData = mockUsers.slice(start, end)

      return {
        data: paginatedData,
        total: mockUsers.length,
      }
    })
  },
})

export default function App() {
  type User = {
    id: number
    name: string
    email: string
    amount: number
    status: string
  }

  const data = mockUsers.map((user: User) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    amount: user.amount,
    status: user.status,
  }))
  return (
    <div className="m-2">
      <p>Welcome to mirage</p>

      <div className="container mx-auto p-10">
        {/* <DemoPage /> */}
        <EDataTable title="Future of tables" initialData={data} />
      </div>
    </div>
  )
}
