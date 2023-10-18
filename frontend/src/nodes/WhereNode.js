import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function WhereNode({ data, isConnectable }) {
	const { nodeValue, handleNodeValueChange } = data;
	return (
		<div className="WhereNode">
			<Handle
				type="target"
				position={Position.Top}
				isConnectable={isConnectable}
			/>
			<div>
				<label htmlFor="text">WHERE:</label>
				<input
					id="text"
					name="text"
					onChange={(event) => handleNodeValueChange(event.target.value)}
					className="nodrag"
					value={nodeValue}
				/>
			</div>
			{/* <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      /> */}
			<Handle
				type="source"
				position={Position.Bottom}
				id="b"
				isConnectable={isConnectable}
			/>
		</div>
	);
}

export default WhereNode;
