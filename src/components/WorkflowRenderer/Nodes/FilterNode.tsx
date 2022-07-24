import { FunctionComponent } from 'react';
import { NodeProps } from 'react-flow-renderer';
import BaseNode from './BaseNode';

export type FilterNodeData = {
    operation: "filter";
    type: string;
    params?: {
    }
}

type FilterNodeProps = NodeProps<FilterNodeData>;

const FilterNode: FunctionComponent<FilterNodeProps> = (prop: FilterNodeProps) => {
    const { type } = prop.data;

    return (
        <BaseNode operation='filter' type={type} node={prop} data={JSON.stringify(prop.data)} target={true} source={true} />
    );
};

export default FilterNode;
