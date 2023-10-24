import axios from "axios";
import { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { useTableSelection } from "./TableSelectionContext";

const handleStyle = { left: 10 };

function WhereNode({ data, isConnectable }) {
	const { nodeValue, handleNodeValueChange } = data;
	const [columnName, setColumnName] = useState("VARCHAR");
	const [operators, setOperators] = useState([]);
	const [value, setValue] = useState("");
	const { selectedTable } = useTableSelection(); // TODO: this is only a compromise to have communication bwn the nodes, need change
	const [columnData, setColumnData] = useState([]);
	const [columnType, setColumnType] = useState([]);

	// Fetch column names when selected table changes
	// TODO: show error to user
	useEffect(() => {
		if (selectedTable) {
			axios
				.get(`/tables/${selectedTable}/columns`)
				.then((response) => {
					const fetchedColumnData = response.data;
					setColumnData(fetchedColumnData);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [selectedTable]);

	// Update operators when columnType changes
	//   useEffect(() => {
	//     setOperators(getOperatorsForColumnType(columnType));
	//   }, [columnType]);

	const imgStyle = {
		position: "absolute",
		left: "-8px",
		top: "-100px",
		width: "250px",
		objectFit: "cover",
		zIndex: -1,
		opacity: 1,
	};

	const handleColumnNameChange = (event) => {
		const selectedColumnName = event.target.value;
		setColumnName(selectedColumnName);
		handleNodeValueChange("");
		const thisColumnData = columnData.find(
			(column) => column.name === event.target.value,
		);
		setOperators(getOperatorsForColumnType(thisColumnData.type));
	};

	const handleOperatorChange = (event) => {
		handleNodeValueChange(`${event.target.value} ${value}`);
	};

	const handleValueChange = (event) => {
		setValue(event.target.value);
		handleNodeValueChange(`${operators[0]} ${event.target.value}`);
	};

	const getOperatorsForColumnType = (type) => {
		switch (type) {
			case "INTEGER":
			case "FLOAT":
				return ["<", ">", "<=", ">=", "=", "!="];
			case "DATE":
				return ["before", "after"];
			case "VARCHAR":
				return ["prefix", "suffix", "regex", "equals"];
			case "BOOL":
				return ["="];
			default:
				return ["N/A"];
		}
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
				<label>WHERE:</label>
				<select
					onChange={handleColumnNameChange}
					value={columnName}
					className="nodrag"
				>
					<option value="">Select a column</option>
					{columnData.map((column) => (
						<option key={column.name} value={column.name}>
							{column.name}
						</option>
					))}
				</select>
			</div>
			<div>
				<label>Operator:</label>
				<select
					onChange={handleOperatorChange}
					value={operators[0]}
					className="nodrag"
				>
					{operators.map((operator) => (
						<option key={operator} value={operator}>
							{operator}
						</option>
					))}
				</select>
			</div>
			<div>
				<label>Value:</label>
				<input
					name="value"
					onChange={handleValueChange}
					className="nodrag"
					value={value}
				/>
			</div>
			<Handle
				type="source"
				position={Position.Bottom}
				isConnectable={isConnectable}
			/>
		</div>
	);
}

export default WhereNode;
