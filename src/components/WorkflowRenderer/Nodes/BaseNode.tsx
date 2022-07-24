import { FunctionComponent, useCallback } from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { Pencil, Trash } from 'react-bootstrap-icons';
import { Handle, NodeProps, Position, useReactFlow } from 'react-flow-renderer';

type BaseNodeProps = {
    operation: "source" | "selector" | "filter" | "sorter" | "action";
    type: string;
    label?: string;
    onEdit?: () => {};
    onDelete?: () => {};
    target: boolean;
    source: boolean;
    node: NodeProps;
    data?: string;
}

const BaseNode: FunctionComponent<BaseNodeProps> = (prop: BaseNodeProps) => {
    const { operation, type, label, target, source, node } = prop;

    const reactFlowInstance = useReactFlow();

    let style = "primary";
    if (operation === "selector") style = "info"
    if (operation === "filter") style = "danger"
    if (operation === "sorter") style = "warning"
    if (operation === "action") style = "success"


    const deleteNode = useCallback((node: NodeProps) => {
        const nodes = reactFlowInstance.getNodes();
        const edges = reactFlowInstance.getEdges();
        const edgesToKeep = edges.filter(edge => edge.source !== node.id && edge.target !== node.id);

        reactFlowInstance.setEdges(edgesToKeep)
        reactFlowInstance.setNodes(nodes.filter(n => n.id !== node.id));
    }, [reactFlowInstance]);

    return (
        <>
            {target && <Handle type="target" position={Position.Top} style={{ height: 10, width: 10 }} />}
            <Card
                border={style}
                className="text-center text-dark"
                style={{ width: '12rem' }}
            >
                <Card.Header className={`d-flex justify-content-between bg-${style} p-1`}>
                    <div className='ms-1 text-capitalize'>{operation}</div>
                    <ButtonGroup>
                        <Button className="text-dark" size="sm" variant={style} onClick={() => { }}>
                            <Pencil />
                        </Button>
                        <Button className="text-dark" size="sm" variant={style} onClick={() => deleteNode(node)}>
                            <Trash />
                        </Button>
                    </ButtonGroup>
                </Card.Header>
                <Card.Body className="ps-2 pt-0 p-1 text-start" style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", display: "inline-block" }}>
                    <sub className='text-capitalize'>{type}</sub>
                    <br />
                    {label}
                </Card.Body>
            </Card>
            {source && <Handle id="a" type="source" position={Position.Bottom} style={{ height: 10, width: 10 }} />}
        </>
    );
};

export default BaseNode;
