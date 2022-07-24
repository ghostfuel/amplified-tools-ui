import { FunctionComponent } from 'react';
import { NodeProps } from 'react-flow-renderer';
import BaseNode from './BaseNode';

export type ActionNodeData = {
    operation: "action";
    type: string;
    params?: {
    }
}

type ActionNodeProps = NodeProps<ActionNodeData>;

const ActionNode: FunctionComponent<ActionNodeProps> = (prop: ActionNodeProps) => {
    const { type } = prop.data;

    return (
        <BaseNode operation='action' type={type} node={prop} data={JSON.stringify(prop.data)} target={true} source={false} />
    );
};

export default ActionNode;
