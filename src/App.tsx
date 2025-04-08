import { useState, useEffect } from "react"

import { createServer } from "miragejs"
import { Button } from "./components/ui/button"
import DemoPage from "./payments/page"

createServer({
  routes() {
    this.get("/api/users", () => [
      { id: "1", name: "Luke" },
      { id: "2", name: "Leia" },
      { id: "3", name: "Anakin" },
    ])
  },
})

export default function App() {
  let [users, setUsers] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    fetch("/api/users")
      .then(response => response.json())
      .then(json => setUsers(json))
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
      <Button variant="default" className="cursor-pointer">
        Request Data
      </Button>

      <div className="container mx-auto py-10">
        <DemoPage />
      </div>
    </div>
  )
}
