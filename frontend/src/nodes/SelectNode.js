import axios from "axios";
import { Multiselect } from "multiselect-react-dropdown";
import { useCallback, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { useTableSelection } from "./TableSelectionContext";

const handleStyle = { left: 10 };

function SelectNode({ data, isConnectable }) {
	const { nodeValue, handleNodeValueChange } = data;
	const [options, setOptions] = useState([]);
	const { selectedTable } = useTableSelection();

	useEffect(() => {
		if (selectedTable) {
			axios
				.get(`/tables/${selectedTable}/columns`)
				.then((response) => {
					const columnNames = response.data;
					setOptions(columnNames);
				})
				.catch((error) => {
					console.error("Error fetching column names:", error);
				});
		}
	}, [selectedTable]);

	// const options = [{ name: "John" }, { name: "Mary" }, { name: "Robert" }];
	const onSelectNames = (selectedList) => {
		const selectedNamesList = selectedList.map((item) => item.name);
		handleNodeValueChange(selectedNamesList);
	};

	const onRemoveNames = (selectedList) => {
		const selectedNamesList = selectedList.map((item) => item.name);
		handleNodeValueChange(selectedNamesList);
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
			<div style={{ position: "relative" }}>
				<label>SELECT:</label>
				<Multiselect
					placeholder="Select Column Name"
					options={options}
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
