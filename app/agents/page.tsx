import { getAgents } from "@/lib/valorant-api"
import { AgentsGrid } from "@/components/agents/agents-grid"
import { AgentsHeader } from "@/components/agents/agents-header"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agents | VALOBASE",
  description: "Explore all Valorant agents, their abilities, roles, and strategies. Find your perfect agent to dominate the battlefield."
}

export default async function AgentsPage() {
  const agents = await getAgents()

  // Get unique roles
  const roles = Array.from(new Set(agents.filter(a => a.role).map(a => a.role!.displayName)))

  return (
    <div className="pt-24 pb-16">
      <AgentsHeader agentCount={agents.length} roles={roles} />
      <AgentsGrid agents={agents} />
    </div>
  )
}
