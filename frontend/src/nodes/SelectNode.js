import { Multiselect } from "multiselect-react-dropdown";
import { useCallback, useState } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function SelectNode({ data, isConnectable }) {
	const onChange = useCallback((evt) => {
		console.log(evt.target.value);
	}, []);
	const [names, setNames] = useState([]);
	const options = [
		{ name: "John", value: "John" },
		{ name: "Mary", value: "Mary" },
		{ name: "Robert", value: "Robert" },
	];
	const onSelectNames = (name) => {
		const propertyValues = Object.entries(name);
		setNames(propertyValues);
	};

	const onRemoveNames = (name) => {
		const propertyValues = Object.entries(name);
		setNames(propertyValues);
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
