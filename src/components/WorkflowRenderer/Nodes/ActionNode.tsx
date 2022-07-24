import { FunctionComponent } from 'react';
import { NodeProps } from 'react-flow-renderer';
import BaseNode from './BaseNode';

export type ActionNodeData = {
    operation: "action";
    type: string;
    label?: string;
    params?: {
    }
}

type ActionNodeProps = NodeProps<ActionNodeData>;

const ActionNode: FunctionComponent<ActionNodeProps> = (prop: ActionNodeProps) => {
    const { type, label } = prop.data;

    return (
        <BaseNode
            operation='action'
            type={type}
            label={label}
            node={prop}
            data={JSON.stringify(prop.data)}
            target={true}
            source={false}
        />
    );
};

export default ActionNode;
