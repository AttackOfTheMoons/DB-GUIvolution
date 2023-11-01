import axios from "axios";
import { Multiselect } from "multiselect-react-dropdown";
import { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";

function SelectNode({ data, isConnectable }) {
	const { nodeValue, handleNodeValueChange, selectedTable } = data;
	const [options, setOptions] = useState([]);

	useEffect(() => {
		if (selectedTable) {
			axios
				.get(`/tables/${selectedTable}/columns`)
				.then((response) => {
					const columnNames = response.data; // .map((column) => column.name);
					setOptions(columnNames);
				})
				.catch((error) => {
					console.error("Error fetching column names:", error);
				});
		} else {
			handleNodeValueChange([]);
			setOptions([]);
		}
	}, [selectedTable, handleNodeValueChange]);

	// const options = [{ name: "John" }, { name: "Mary" }, { name: "Robert" }];
	const onSelectNames = (selectedList) => {
		handleNodeValueChange(selectedList);
	};

	const onRemoveNames = (selectedList) => {
		handleNodeValueChange(selectedList);
	};

	return (
		<div className="SelectNode" style={{ position: "relative" }}>
			<Handle
				type="target"
				position={Position.Top}
				isConnectable={isConnectable}
			/>
			{/* <img alt="" src="../icons/triangle.png" style={imgStyle} /> */}
			<div className="select-box" style={{ position: "relative" }}>
				<label>SELECT:</label>
				<Multiselect
					placeholder="Select Column Name"
					options={options}
					selectedValues={nodeValue}
					onSelect={onSelectNames} // Function will trigger on select event
					onRemove={onRemoveNames} // Function will trigger on remove event
					showCheckbox={true}
					displayValue="name" // Property name to display in the dropdown options
				/>
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

export default SelectNode;
