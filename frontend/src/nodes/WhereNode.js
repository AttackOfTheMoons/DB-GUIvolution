import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function WhereNode({ data, isConnectable }) {
	const { nodeValue, handleNodeValueChange } = data;

	const imgStyle = {
		position: "absolute",
		left: "-8px",
		top: "-100px",
		width: "250px",
		objectFit: "cover", // Maintain aspect ratio and cover the container
		zIndex: -1, // Set a negative z-index to send the image to the back
		opacity: 1,
	};

	return (
		<div className="WhereNode">
			<Handle
				type="target"
				position={Position.Top}
				isConnectable={isConnectable}
			/>
			<img alt="" src="../icons/circle.png" style={imgStyle} />
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
