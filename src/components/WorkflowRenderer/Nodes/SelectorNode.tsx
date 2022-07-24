import { FunctionComponent } from 'react';
import { NodeProps } from 'react-flow-renderer';
import BaseNode from './BaseNode';

export type SelectorNodeData = {
    operation: "selector";
    type: string;
    label?: string;
    params?: {
    }
}

type SelectorNodeProps = NodeProps<SelectorNodeData>;

const SelectorNode: FunctionComponent<SelectorNodeProps> = (prop: SelectorNodeProps) => {
    const { type, label } = prop.data;

    return (
        <BaseNode
            operation='selector'
            type={type}
            label={label}
            node={prop}
            data={JSON.stringify(prop.data)}
            target={true}
            source={true}
        />
    );
};

export default SelectorNode;
