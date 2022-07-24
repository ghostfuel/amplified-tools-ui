import { FunctionComponent } from 'react';
import { NodeProps } from 'react-flow-renderer';
import BaseNode from './BaseNode';

export type SorterNodeData = {
    operation: "sorter";
    type: string;
    params?: {
    }
}

type SorterNodeProps = NodeProps<SorterNodeData>;

const SorterNode: FunctionComponent<SorterNodeProps> = (prop: SorterNodeProps) => {
    const { type } = prop.data;

    return (
        <BaseNode operation='sorter' type={type} node={prop} data={JSON.stringify(prop.data)} target={true} source={true} />
    );
};

export default SorterNode;
