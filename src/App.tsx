import { useState, useEffect } from "react"
import { createServer } from "miragejs"
import { Button } from "./components/ui/button"
import DemoPage from "./payments/page"

import { mockUsers } from "./mockUsers"

createServer({
  routes() {
    this.get("/api/payments", (schema, request) => {
      const page = parseInt(request.queryParams.page) || 1
      const limit = parseInt(request.queryParams.limit) || 10
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
