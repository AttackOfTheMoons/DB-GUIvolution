import React from "react";
import "./ResultTable.css";

const outputTextStyle = {
	color: "#5D12D2",
	fontFamily: "Helvetica Neue, sans-serif",
	fontWeight: "bold",
	letterSpacing: "-1px",
	lineHeight: "1",
	textAlign: "center",
	fontSize: "40px", // Corrected to camelCase
};

const ResultTable = ({ keys, data }) => (
	<aside id="outputWindow">
		<div style={outputTextStyle}>↓OUTPUT↓</div>
		<table>
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
);

export default ResultTable;
