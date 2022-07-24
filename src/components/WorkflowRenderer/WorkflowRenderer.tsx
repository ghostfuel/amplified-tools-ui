import { CSSProperties, FunctionComponent, useMemo } from 'react';
import ReactFlow, { Controls, Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, Background, DefaultEdgeOptions, Connection } from 'react-flow-renderer';
import ActionNode from './Nodes/ActionNode';
import FilterNode from './Nodes/FilterNode';
import SelectorNode from './Nodes/SelectorNode';
import SorterNode from './Nodes/SorterNode';
import SourceNode from './Nodes/SourceNode';

const reactFlowStyle: CSSProperties = {};

type WorkflowRendererProps = {
    nodes: Node[],
    edges: Edge[],
    defaultEdgeOptions: DefaultEdgeOptions,
    onNodesChange: OnNodesChange,
    onEdgesChange: OnEdgesChange,
    onConnect: OnConnect,
    onEdgeUpdate: (oldEdge: Edge, newConnection: Connection) => void
    onEdgeUpdateStart: () => void
    onEdgeUpdateEnd: (update: any, edge: Edge) => void
}

const WorkflowRenderer: FunctionComponent<WorkflowRendererProps> = (props: WorkflowRendererProps) => {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, defaultEdgeOptions, onEdgeUpdate, onEdgeUpdateEnd, onEdgeUpdateStart } = props;
    const nodeTypes = useMemo(() => ({ source: SourceNode, action: ActionNode, filter: FilterNode, sorter: SorterNode, selector: SelectorNode }), []);

    return (
        <ReactFlow
            style={reactFlowStyle}
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            defaultEdgeOptions={defaultEdgeOptions}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            maxZoom={1.3}
            fitView
        >
            <Controls />
            <Background />
        </ReactFlow>
    );
}

export default WorkflowRenderer;