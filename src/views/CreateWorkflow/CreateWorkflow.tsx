import { FormEvent, FunctionComponent, useCallback, useRef, useState } from 'react';
import { Button, Col, Row } from "react-bootstrap";
import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, DefaultEdgeOptions, Edge, EdgeChange, Node, NodeChange, updateEdge } from 'react-flow-renderer';
import AddOperationModal from '../../components/AddOperationModal/AddOperationModal';
import OperationForm from '../../components/OperationForm/OperationForm';
import Toolbar from '../../components/Toolbar/Toolbar';
import WorkflowRenderer from '../../components/WorkflowRenderer/WorkflowRenderer';

type CreateWorkflowProps = {
    edit?: boolean;
}

const initialNodes = [
    {
        id: '1',
        type: 'source',
        data: { type: 'playlist', label: "Release Radar", params: { id: "", name: "", limit: undefined } },
        position: { x: 0, y: 0 },
    },
    {
        id: '2',
        type: 'selector',
        data: { type: 'alternate', label: "", params: {} },
        position: { x: 0, y: 150 },
    },
    {
        id: '3',
        type: 'filter',
        data: { type: 'dedupe', label: "any", params: { filter: "any" } },
        position: { x: 0, y: 300 },
    },
    {
        id: '4',
        type: 'sorter',
        data: { type: 'sortBy', label: "artists", params: { property: "artists", order: "asc" } },
        position: { x: 0, y: 450 },
    },
    {
        id: '5',
        type: 'action',
        data: { type: 'save', label: "Release Radar Archive", params: { name: "Release Radar Archive", description: "", isPublic: false } },
        position: { x: 0, y: 600 },
    },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
    { id: 'e4-5', source: '4', target: '5', animated: true },
];

const initialDefaultEdgeOptions: DefaultEdgeOptions = {
    animated: true,
    style: { strokeWidth: 3 }

}

const CreateWorkflow: FunctionComponent<CreateWorkflowProps> = (props: CreateWorkflowProps) => {
    const edit = props.edit;
    const [showAddOperationModal, setShowAddOperationModal] = useState(false);

    const edgeUpdateSuccessful = useRef(true);
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [defaultEdgeOptions] = useState<DefaultEdgeOptions>(initialDefaultEdgeOptions);

    const [formData] = useState({});

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes((nds) => applyNodeChanges(changes, nds));
        },
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((oldEdge: Edge, newConnection: Connection) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, []);

    const onEdgeUpdateEnd = useCallback((update: any, edge: Edge) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeUpdateSuccessful.current = true;
    }, []);

    const addNode = useCallback((operation: string, data: any) => setNodes((nodes) => {
        let xPos = 0;
        let yPos = 50;

        if (nodes.length > 0) {
            xPos = nodes[nodes.length - 1].position.x;
            yPos = nodes[nodes.length - 1].position.y + 100;
        }

        return [
            ...nodes,
            {
                id: `${nodes.length + 1}`,
                type: operation,
                data,
                position: {
                    x: xPos,
                    y: yPos
                },
            }
        ]
    }), [])

    const onModalSubmit = (event: FormEvent<HTMLButtonElement>, operation: string, type: string, label: string, data: any) => {
        event.preventDefault();
        console.log(event, operation, { type, label, params: data });
        addNode(operation, { type, label, params: data });
        setShowAddOperationModal(false)
    }

    const onResetWorkflow = useCallback(() => {
        const confirm = window.confirm("Are you sure you want to start over?");
        if (confirm) {
            setNodes([]);
            setEdges([]);
        }
    }, [])

    const onRunNow = useCallback(() => {
        const confirm = window.confirm("Are you sure you want to run this workflow now?");
        if (confirm) {
            console.log("Coming soon...")
            setNodes([]);
            setEdges([]);
        }
    }, [])

    return (
        <Row>
            <Col>
                <Toolbar>
                    <Button className="toolbar-btn btn-dark ms-3" onClick={() => setShowAddOperationModal(true)}>Add operation</Button>
                    <Button className="toolbar-btn btn-dark ms-3" onClick={onResetWorkflow}>Reset</Button>
                    <Button className="toolbar-btn btn-dark ms-3" disabled onClick={() => { }}>Schedule</Button>
                    <Button className="toolbar-btn btn-dark ms-3" disabled onClick={onRunNow}>Run now</Button>
                </Toolbar>
            </Col>
            <Row id="profile-playlists">
                <Col>
                    <div id="section-title" className="text-left">{edit ? "Update Workflow" : "Create Workflow"}</div>
                    <div style={{ "height": "70vh" }}>
                        <WorkflowRenderer
                            nodes={nodes}
                            edges={edges}
                            defaultEdgeOptions={defaultEdgeOptions}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onEdgeUpdate={onEdgeUpdate}
                            onEdgeUpdateStart={onEdgeUpdateStart}
                            onEdgeUpdateEnd={onEdgeUpdateEnd}
                        />
                    </div>
                </Col>
            </Row>

            <AddOperationModal
                show={showAddOperationModal}
                onHide={() => setShowAddOperationModal(false)}
            >
                <OperationForm data={formData} onSubmit={onModalSubmit} />
            </AddOperationModal>
        </Row>
    );

};

export default CreateWorkflow;
