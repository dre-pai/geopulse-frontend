import { useMemo } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react'
import type { RelationshipGraph } from '@/types/geopolitics'

interface AllianceGraphProps {
  graph: RelationshipGraph
}

export function AllianceGraph({ graph }: AllianceGraphProps) {
  const nodes: Node[] = useMemo(
    () =>
      graph.nodes.map((node, index) => ({
        id: node.id,
        position: {
          x: 120 + (index % 4) * 180,
          y: 80 + Math.floor(index / 4) * 140,
        },
        data: { label: node.label },
        style: {
          background: '#132033',
          color: '#c8d6e8',
          border: '1px solid #243247',
          borderRadius: 8,
          fontSize: 12,
          padding: 8,
        },
      })),
    [graph.nodes],
  )

  const edges: Edge[] = useMemo(
    () =>
      graph.links.map((link, index) => ({
        id: `e-${index}`,
        source: link.source,
        target: link.target,
        label: link.relationship_type,
        animated: true,
        style: { stroke: '#3dd6c6' },
        labelStyle: { fill: '#8fa3bd', fontSize: 10 },
      })),
    [graph.links],
  )

  return (
    <div className="h-80 overflow-hidden rounded-lg border border-line bg-panel">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap pannable zoomable />
        <Controls />
        <Background gap={18} color="#243247" />
      </ReactFlow>
    </div>
  )
}
