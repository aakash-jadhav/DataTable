import { useState, useEffect } from "react"
import { createServer } from "miragejs"
import { Button } from "./components/ui/button"
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
      const pageParam = request.queryParams.page
      const limitParam = request.queryParams.limit

      const page = typeof pageParam === "string" ? parseInt(pageParam, 10) : 1
      const limit =
        typeof limitParam === "string" ? parseInt(limitParam, 10) : 10

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
  const [users, setUsers] = useState<{ id: string; name: string }[]>([])

  const fetchUsers = () => {
    fetch("/api/payments?page=1&limit=3")
      .then(response => response.json())
      .then(json => setUsers(json.data))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="m-2">
      <p>Welcome to mirage</p>
      <ul className="">
        {users.map(user => (
          <li key={user.id} className="border-b-2 p-3 border-gray-200 max-w-sm">
            {user.name}
          </li>
        ))}
      </ul>
      <br />
      <Button variant="default" className="cursor-pointer" onClick={fetchUsers}>
        Request Data
      </Button>
      <div className="container mx-auto py-10">
        <DemoPage />
      </div>
    </div>
  )
}
