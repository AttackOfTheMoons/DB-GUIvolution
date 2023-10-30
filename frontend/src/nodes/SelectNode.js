import axios from "axios";
import { Multiselect } from "multiselect-react-dropdown";
import { useCallback, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

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
	}, [selectedTable]);

	// const options = [{ name: "John" }, { name: "Mary" }, { name: "Robert" }];
	const onSelectNames = (selectedList) => {
		handleNodeValueChange(selectedList);
	};

	const onRemoveNames = (selectedList) => {
		handleNodeValueChange(selectedList);
	};

	const imgStyle = {
		position: "absolute",
		left: "-30px",
		top: "-220px",
		width: "300px",
		objectFit: "cover", // Maintain aspect ratio and cover the container
		zIndex: -1, // Set a negative z-index to send the image to the back
		opacity: 1,
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
