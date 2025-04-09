import { createServer } from "miragejs"
import DemoPage from "./payments/page"

const mockUsers = [
  {
    id: "1",
    name: "Luke",
    amount: 100,
    status: "pending",
    email: "luke@example.com",
  },
  {
    id: "2",
    name: "Leia",
    amount: 200,
    status: "success",
    email: "leia@example.com",
  },
  {
    id: "3",
    name: "Anakin",
    amount: 150,
    status: "failed",
    email: "anakin@example.com",
  },
  {
    id: "4",
    name: "Obi-Wan",
    amount: 300,
    status: "pending",
    email: "obi@example.com",
  },
  {
    id: "5",
    name: "Yoda",
    amount: 250,
    status: "success",
    email: "yoda@example.com",
  },
]

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
  return (
    <div className="m-2">
      <p>Welcome to mirage</p>

      <div className="container mx-auto p-10">
        <DemoPage />
      </div>
    </div>
  )
}
