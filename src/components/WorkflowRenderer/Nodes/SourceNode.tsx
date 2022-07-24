import { FunctionComponent } from 'react';
import { NodeProps } from 'react-flow-renderer';
import BaseNode from './BaseNode';

export type SourceNodeData = {
    operation: "source";
    type: string;
    label?: string;
    params?: {
        id?: string;
        name?: string;
        limit?: number;
        handleLocalTracks?: "replace" | "remove" | "skip";
        orderByDateAdded?: "asc" | "desc";
    }
}

type SourceNodeProps = NodeProps<SourceNodeData>;

const SourceNode: FunctionComponent<SourceNodeProps> = (prop: SourceNodeProps) => {
    const { type, label } = prop.data;

    return (
        <BaseNode
            operation='source'
            type={type}
            label={label}
            node={prop}
            data={JSON.stringify(prop.data)}
            target={false}
            source={true}
        />
    );
};

export default SourceNode;
