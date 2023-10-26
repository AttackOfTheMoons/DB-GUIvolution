import React from "react";
import "./ResultTable.css";

const ResultTable = ({ keys, data }) => (
	<aside id="outputWindow">
		<table id="scrollableTable">
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
