import axios from "axios";
import { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";

function FromNode({ data, isConnectable }) {
	const [tables, setTables] = useState([]);
	const { nodeValue, handleNodeValueChange } = data;

	useEffect(() => {
		axios.get("/tables").then((response) => {
			setTables(response.data);
		});
	}, []);

	return (
		<div className="FromNode" style={{ position: "relative" }}>
			<Handle
				type="target"
				position={Position.Top}
				isConnectable={isConnectable}
			/>
			<div style={{ position: "relative" }}>
				<label>FROM:</label>
				<select
					onChange={(event) => handleNodeValueChange(event.target.value)}
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
