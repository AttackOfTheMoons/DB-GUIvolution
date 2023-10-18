import { Multiselect } from "multiselect-react-dropdown";
import { useCallback, useState } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function SelectNode({ data, isConnectable }) {
	const { nodeValue, handleNodeValueChange } = data;

	const options = [{ name: "John" }, { name: "Mary" }, { name: "Robert" }];
	const onSelectNames = (selectedList) => {
		const selectedNamesList = selectedList.map((item) => item.name);
		handleNodeValueChange(selectedNamesList);
	};

	const onRemoveNames = (selectedList) => {
		const selectedNamesList = selectedList.map((item) => item.name);
		handleNodeValueChange(selectedNamesList);
	};

	return (
		<div className="SelectNode">
			<Handle
				type="target"
				position={Position.Top}
				isConnectable={isConnectable}
			/>
			<div>
				<label>SELECT:</label>
				<Multiselect
					placeholder="Select Any"
					options={options}
					onSelect={onSelectNames} // Function will trigger on select event
					onRemove={onRemoveNames} // Function will trigger on remove event
					showCheckbox={true}
					displayValue="name" // Property name to display in the dropdown options
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

export default SelectNode;
