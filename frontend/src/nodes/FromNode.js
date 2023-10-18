import axios from "axios";
import { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function FromNode({ data, isConnectable }) {
	const [tables, setTables] = useState([]);

	const { nodeValue, handleNodeValueChange } = data;

	useEffect(() => {
		axios.get("/tables").then((response) => {
			setTables(response.data);
		});
	}, []);

	return (
		<div className="FromNode">
			<Handle
				type="target"
				position={Position.Top}
				isConnectable={isConnectable}
			/>
			<div>
				<label>FROM:</label>
				<select
					onChange={(event) => {
						handleNodeValueChange(event.target.value);
					}}
					value={nodeValue}
					className="fromInput"
				>
					<option value="">Select a table</option>
					{tables.map((table) => (
						<option key={table} value={table}>
							{table}
						</option>
					))}
				</select>
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

export default FromNode;
