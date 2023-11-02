import React, { useState } from "react";
import "./ResultTable.css";

const ResultTable = ({ keys, data, sql }) => {
	const [isOutputOpen, setIsOutputOpen] = useState(false);

	const toggleSidebar = () => {
		setIsOutputOpen(!isOutputOpen);
	};
	return (
		<>
			{/* <button type="button" className="output-button" onClick={toggleSidebar}>
        {isOutputOpen ? "💻: ✅" : "💻: ❌"}
      </button> */}
			<aside
				id="outputWindow"
				className={`${isOutputOpen ? "open" : ""}`}
				onClick={toggleSidebar}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						toggleSidebar();
					}
				}}
			>
				<div className="sql-output">{sql}</div>
				<table id="scrollableTable" className={`${isOutputOpen ? "open" : ""}`}>
					<thead>
						<tr>
							{keys.map((key, index) => (
								<th key={index.toString()}>{key}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((row, rowIndex) => (
							<tr key={rowIndex.toString()}>
								{row.map((cell, cellIndex) => (
									<td key={cellIndex.toString()}>{cell}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</aside>
		</>
	);
};

export default ResultTable;
