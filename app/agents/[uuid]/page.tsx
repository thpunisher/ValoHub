import { getAgent, getAgents } from "@/lib/valorant-api"
import { AgentDetail } from "@/components/agents/agent-detail"
import { Metadata } from "next"
import { notFound } from "next/navigation"

interface AgentPageProps {
  params: Promise<{ uuid: string }>
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { uuid } = await params
  try {
    const agent = await getAgent(uuid)
    return {
      title: `${agent.displayName} | Agents | VALOBASE`,
      description: agent.description
    }
  } catch {
    return {
      title: "Agent Not Found | VALOBASE"
    }
  }
}

export async function generateStaticParams() {
  const agents = await getAgents()
  return agents.map((agent) => ({
    uuid: agent.uuid,
  }))
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { uuid } = await params
  
  try {
    const [agent, allAgents] = await Promise.all([
      getAgent(uuid),
      getAgents()
    ])
    
    // Get other agents for navigation
    const otherAgents = allAgents.filter(a => a.uuid !== uuid).slice(0, 6)
    
    return <AgentDetail agent={agent} otherAgents={otherAgents} />
  } catch {
    notFound()
  }
}
