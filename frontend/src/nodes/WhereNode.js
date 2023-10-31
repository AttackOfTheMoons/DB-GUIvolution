import axios from "axios";
import { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function WhereNode({ data, isConnectable }) {
	const { nodeValue, handleNodeValueChange, selectedTable } = data;
	const [operators, setOperators] = useState([]);
	const [columnData, setColumnData] = useState([]);

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
		const selectedColumnType =
			event.target.options[event.target.selectedIndex].getAttribute(
				"data-columntype",
			);
		const validOperators = getOperatorsForColumnType(selectedColumnType);
		setOperators(validOperators);
		handleNodeValueChange({
			...nodeValue,
			column: event.target.value,
			column_type: selectedColumnType,
			comparator: validOperators[0].toUpperCase(),
		});
	};

	const handleOperatorChange = (event) => {
		handleNodeValueChange({ ...nodeValue, comparator: event.target.value });
	};

	const handleValueChange = (event) => {
		handleNodeValueChange({ ...nodeValue, compared_value: event.target.value });
	};

	const getOperatorsForColumnType = (type) => {
		switch (type) {
			case "INTEGER":
			case "FLOAT":
				return ["=", "<", ">", "<=", ">=", "!="];
			case "DATE":
				return ["before", "after"];
			case "VARCHAR":
				return ["=", "prefix", "suffix", "regex"];
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
			{/* <img alt="" src="../icons/circle.png" style={imgStyle} /> */}
			<div className="inside-div">
				<label>WHERE:</label>
				<select
					onChange={handleColumnNameChange}
					value={nodeValue.column}
					className="nodrag"
				>
					<option value="">Select a column</option>
					{columnData.map((column) => (
						<option
							key={column.name}
							value={column.name}
							data-columntype={column.type}
						>
							{column.name}
						</option>
					))}
				</select>
			</div>
			<div className="inside-div">
				<label>Operator:</label>
				<select
					onChange={handleOperatorChange}
					value={nodeValue.comparator}
					className="nodrag"
				>
					{operators.map((operator) => (
						<option key={operator} value={operator.toUpperCase()}>
							{operator}
						</option>
					))}
				</select>
			</div>
			<div className="inside-div">
				<label>Value:</label>
				<input
					name="value"
					onChange={handleValueChange}
					className="nodrag"
					value={nodeValue.compared_value}
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
